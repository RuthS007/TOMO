import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  FilterOptions,
  MeetupPlan,
} from "../types";
import {
  DEFAULT_CURRENT_USER,
  INITIAL_PEERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MESSAGES,
} from "../data/initialData";

const STORAGE_KEYS = {
  USER: "tomo_current_user",
  PEERS: "tomo_peer_profiles",
  ANNOUNCEMENTS: "tomo_buddy_announcements",
  MESSAGES: "tomo_chat_messages",
};

// Helper to safely fetch JSON without throwing when server responds with 404 or HTML
async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null; // Received HTML (e.g. from static host SPA catch-all)
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// LocalStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode
  }
}

export const DataService = {
  // 1. Current User
  async getUserProfile(): Promise<UserProfile> {
    const serverData = await safeFetchJson<{ success: boolean; user: UserProfile }>(
      "/api/user/profile"
    );
    if (serverData?.success && serverData.user) {
      setLocal(STORAGE_KEYS.USER, serverData.user);
      return serverData.user;
    }
    return getLocal<UserProfile>(STORAGE_KEYS.USER, DEFAULT_CURRENT_USER);
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Try server
    const serverData = await safeFetchJson<{ success: boolean; user: UserProfile }>(
      "/api/user/profile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }
    );
    if (serverData?.success && serverData.user) {
      setLocal(STORAGE_KEYS.USER, serverData.user);
      return serverData.user;
    }

    // Local fallback
    const current = getLocal<UserProfile>(STORAGE_KEYS.USER, DEFAULT_CURRENT_USER);
    const updated = { ...current, ...profile };
    setLocal(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // 2. Peer Profiles
  async getProfiles(filters?: FilterOptions): Promise<PeerProfile[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.selectedMajor && filters.selectedMajor !== "All") params.append("major", filters.selectedMajor);
      if (filters.selectedYear && filters.selectedYear !== "All") params.append("year", filters.selectedYear);
      if (filters.minCompatibility > 0) params.append("minScore", filters.minCompatibility.toString());
      if (filters.selectedInterests?.length > 0) params.append("interest", filters.selectedInterests[0]);
      if (filters.searchQuery) params.append("search", filters.searchQuery);
    }

    const serverData = await safeFetchJson<{ success: boolean; profiles: PeerProfile[] }>(
      `/api/profiles?${params.toString()}`
    );
    if (serverData?.success && serverData.profiles && serverData.profiles.length > 0) {
      setLocal(STORAGE_KEYS.PEERS, serverData.profiles);
      return serverData.profiles;
    }

    // Local filter fallback
    let peers = getLocal<PeerProfile[]>(STORAGE_KEYS.PEERS, INITIAL_PEERS);
    if (filters) {
      if (filters.selectedMajor && filters.selectedMajor !== "All") {
        peers = peers.filter((p) => p.major.toLowerCase() === filters.selectedMajor.toLowerCase());
      }
      if (filters.selectedYear && filters.selectedYear !== "All") {
        peers = peers.filter((p) => p.year.toLowerCase() === filters.selectedYear.toLowerCase());
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        peers = peers.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.major.toLowerCase().includes(q) ||
            p.interests.some((i) => i.toLowerCase().includes(q)) ||
            (p.classes && p.classes.some((c) => c.toLowerCase().includes(q)))
        );
      }
    }
    return peers;
  },

  // 3. Buddy Announcements
  async getBuddyAnnouncements(): Promise<BuddyAnnouncement[]> {
    const serverData = await safeFetchJson<{ success: boolean; announcements: BuddyAnnouncement[] }>(
      "/api/buddies"
    );
    if (serverData?.success && serverData.announcements) {
      setLocal(STORAGE_KEYS.ANNOUNCEMENTS, serverData.announcements);
      return serverData.announcements;
    }
    return getLocal<BuddyAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  async joinAnnouncement(announcementId: string, currentUser: UserProfile): Promise<BuddyAnnouncement[]> {
    safeFetchJson(`/api/buddies/${announcementId}/join`, { method: "POST" }).catch(() => {});

    const announcements = getLocal<BuddyAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = announcements.map((a) => {
      if (a.id === announcementId) {
        const already = a.participants.some((p) => p.id === currentUser.id);
        if (already) return a;
        return {
          ...a,
          participants: [
            ...a.participants,
            {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              major: currentUser.major,
              joinedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return a;
    });
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  },

  async leaveAnnouncement(announcementId: string, currentUserId: string): Promise<BuddyAnnouncement[]> {
    safeFetchJson(`/api/buddies/${announcementId}/leave`, { method: "POST" }).catch(() => {});

    const announcements = getLocal<BuddyAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = announcements.map((a) => {
      if (a.id === announcementId) {
        return {
          ...a,
          participants: a.participants.filter((p) => p.id !== currentUserId),
        };
      }
      return a;
    });
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  },

  async createAnnouncement(data: any, currentUser: UserProfile): Promise<BuddyAnnouncement> {
    const newAnn: BuddyAnnouncement = {
      id: `ann-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorMajor: currentUser.major,
      creatorYear: currentUser.year,
      category: data.category,
      title: data.title,
      description: data.description || "",
      targetCount: data.targetCount || 3,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          major: currentUser.major,
          joinedAt: new Date().toISOString(),
        },
      ],
      location: data.location || "Campus Quad",
      meetingTime: data.meetingTime || "Today",
      tags: data.tags || [data.category],
      createdAt: new Date().toISOString(),
    };

    safeFetchJson("/api/buddies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});

    const existing = getLocal<BuddyAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const updated = [newAnn, ...existing];
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return newAnn;
  },

  // 4. Chat Messages
  async getMessages(peerId: string): Promise<ChatMessage[]> {
    const serverData = await safeFetchJson<{ success: boolean; messages: ChatMessage[] }>(
      `/api/conversations/${peerId}/messages`
    );
    if (serverData?.success && serverData.messages) {
      return serverData.messages;
    }
    const allMessages = getLocal<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    return allMessages.filter(
      (m) =>
        m.conversationId === `conv-${peerId}` ||
        m.senderId === peerId ||
        m.receiverId === peerId
    );
  },

  async sendMessage(
    receiverId: string,
    text: string,
    currentUser: UserProfile,
    planMeetup?: MeetupPlan
  ): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${receiverId}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
      planMeetup,
    };

    safeFetchJson("/api/conversations/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId, text, planMeetup }),
    }).catch(() => {});

    const existing = getLocal<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const updated = [...existing, newMsg];
    setLocal(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  },

  async updatePlanStatus(planId: string, status: "accepted" | "declined"): Promise<void> {
    safeFetchJson(`/api/conversations/plans/${planId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});

    const existing = getLocal<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const updated = existing.map((m) => {
      if (m.planMeetup && m.planMeetup.id === planId) {
        return {
          ...m,
          planMeetup: {
            ...m.planMeetup,
            status,
          },
        };
      }
      return m;
    });
    setLocal(STORAGE_KEYS.MESSAGES, updated);
  },
};
