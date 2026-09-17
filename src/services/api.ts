import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  MeetupPlan,
  FilterOptions,
} from "../types";
import {
  seedUsers,
  defaultCurrentUser,
  seedBuddies,
  seedChatMessages,
  calculateCompatibility,
} from "../data/mockData";

// Local storage keys
const LS_USER_KEY = "tomo_current_user";
const LS_PEERS_KEY = "tomo_peer_users";
const LS_BUDDIES_KEY = "tomo_buddies";
const LS_MESSAGES_KEY = "tomo_chat_messages";

// Local state helpers for offline / static fallback
function getStoredUser(): UserProfile {
  try {
    const item = localStorage.getItem(LS_USER_KEY);
    if (item) return JSON.parse(item);
  } catch (e) {
    // ignore
  }
  return defaultCurrentUser;
}

function setStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore
  }
}

function getStoredPeers(): UserProfile[] {
  try {
    const item = localStorage.getItem(LS_PEERS_KEY);
    if (item) return JSON.parse(item);
  } catch (e) {
    // ignore
  }
  return seedUsers;
}

function getStoredBuddies(): BuddyAnnouncement[] {
  try {
    const item = localStorage.getItem(LS_BUDDIES_KEY);
    if (item) return JSON.parse(item);
  } catch (e) {
    // ignore
  }
  return seedBuddies;
}

function setStoredBuddies(buddies: BuddyAnnouncement[]) {
  try {
    localStorage.setItem(LS_BUDDIES_KEY, JSON.stringify(buddies));
  } catch (e) {
    // ignore
  }
}

function getStoredMessages(): ChatMessage[] {
  try {
    const item = localStorage.getItem(LS_MESSAGES_KEY);
    if (item) return JSON.parse(item);
  } catch (e) {
    // ignore
  }
  return seedChatMessages;
}

function setStoredMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    // ignore
  }
}

// Check if response is JSON
async function safeJsonFetch(url: string, options?: RequestInit): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options?.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      return await res.json();
    }
  } catch (e) {
    // network failure, abort, or not json
  }
  return null;
}

export const api = {
  // 1. Get Current User Profile
  async getUserProfile(): Promise<UserProfile> {
    const data = await safeJsonFetch("/api/user/profile");
    if (data && data.success && data.user) {
      setStoredUser(data.user);
      return data.user;
    }
    return getStoredUser();
  },

  // 2. Update Current User Profile
  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const data = await safeJsonFetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (data && data.success && data.user) {
      setStoredUser(data.user);
      return data.user;
    }
    const current = getStoredUser();
    const updated = { ...current, ...updates, id: current.id };
    setStoredUser(updated);
    return updated;
  },

  // 3. Get Peer Profiles with Compatibility
  async getProfiles(filters?: Partial<FilterOptions>): Promise<PeerProfile[]> {
    const params = new URLSearchParams();
    if (filters?.selectedMajor && filters.selectedMajor !== "All") params.append("major", filters.selectedMajor);
    if (filters?.selectedYear && filters.selectedYear !== "All") params.append("year", filters.selectedYear);
    if (filters?.minCompatibility && filters.minCompatibility > 0) params.append("minScore", filters.minCompatibility.toString());
    if (filters?.selectedInterests && filters.selectedInterests.length > 0) params.append("interest", filters.selectedInterests[0]);
    if (filters?.searchQuery) params.append("search", filters.searchQuery);

    const data = await safeJsonFetch(`/api/profiles?${params.toString()}`);
    if (data && data.success && Array.isArray(data.profiles)) {
      return data.profiles;
    }

    // Client fallback computation
    const currentUser = getStoredUser();
    const peers = getStoredPeers();
    let results: PeerProfile[] = peers.map((p) => ({
      ...p,
      compatibility: calculateCompatibility(currentUser, p),
    }));

    if (filters?.selectedMajor && filters.selectedMajor !== "All") {
      results = results.filter((p) => p.major.toLowerCase() === filters.selectedMajor?.toLowerCase());
    }
    if (filters?.selectedYear && filters.selectedYear !== "All") {
      results = results.filter((p) => p.year === filters.selectedYear);
    }
    if (filters?.minCompatibility && filters.minCompatibility > 0) {
      results = results.filter((p) => (p.compatibility?.score ?? 0) >= filters.minCompatibility!);
    }
    if (filters?.selectedInterests && filters.selectedInterests.length > 0) {
      const target = filters.selectedInterests[0].toLowerCase();
      results = results.filter((p) => p.interests.some((i) => i.toLowerCase() === target));
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.major.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.interests.some((i) => i.toLowerCase().includes(q))
      );
    }

    results.sort((a, b) => (b.compatibility?.score ?? 0) - (a.compatibility?.score ?? 0));
    return results;
  },

  // 4. Get Buddy Announcements
  async getBuddies(category?: string, search?: string): Promise<BuddyAnnouncement[]> {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    const data = await safeJsonFetch(`/api/buddies?${params.toString()}`);
    if (data && data.success && Array.isArray(data.announcements)) {
      setStoredBuddies(data.announcements);
      return data.announcements;
    }

    let list = getStoredBuddies();
    if (category && category !== "all") {
      list = list.filter((b) => b.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  // 5. Create Buddy Announcement
  async createBuddy(payload: {
    category: any;
    title: string;
    description: string;
    targetCount: number;
    location: string;
    meetingTime: string;
    tags: string[];
  }): Promise<BuddyAnnouncement> {
    const data = await safeJsonFetch("/api/buddies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (data && data.success && data.announcement) {
      return data.announcement;
    }

    const currentUser = getStoredUser();
    const newAnnouncement: BuddyAnnouncement = {
      id: `buddy-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorMajor: currentUser.major,
      creatorYear: currentUser.year,
      category: payload.category,
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : "",
      targetCount: payload.targetCount,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          major: currentUser.major,
          joinedAt: new Date().toISOString(),
        },
      ],
      location: payload.location.trim(),
      meetingTime: payload.meetingTime || "Today soon",
      tags: payload.tags || ["Campus"],
      createdAt: new Date().toISOString(),
    };

    const currentBuddies = getStoredBuddies();
    if (!currentBuddies.some((b) => b.id === newAnnouncement.id)) {
      const updated = [newAnnouncement, ...currentBuddies];
      setStoredBuddies(updated);
    }
    return newAnnouncement;
  },

  // 6. Join Buddy Group
  async joinBuddy(announcementId: string): Promise<BuddyAnnouncement | null> {
    const data = await safeJsonFetch(`/api/buddies/${announcementId}/join`, {
      method: "POST",
    });
    if (data && data.success && data.announcement) {
      return data.announcement;
    }

    const currentUser = getStoredUser();
    const currentBuddies = getStoredBuddies();
    let updatedAnnouncement: BuddyAnnouncement | null = null;

    const nextBuddies = currentBuddies.map((b) => {
      if (b.id === announcementId) {
        const already = b.participants.some((p) => p.id === currentUser.id);
        if (!already && b.participants.length < b.targetCount) {
          const participant = {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            major: currentUser.major,
            joinedAt: new Date().toISOString(),
          };
          updatedAnnouncement = {
            ...b,
            participants: [...b.participants, participant],
          };
          return updatedAnnouncement;
        }
      }
      return b;
    });

    setStoredBuddies(nextBuddies);
    return updatedAnnouncement;
  },

  // 7. Leave Buddy Group
  async leaveBuddy(announcementId: string): Promise<BuddyAnnouncement | null> {
    const data = await safeJsonFetch(`/api/buddies/${announcementId}/leave`, {
      method: "POST",
    });
    if (data && data.success && data.announcement) {
      return data.announcement;
    }

    const currentUser = getStoredUser();
    const currentBuddies = getStoredBuddies();
    let updatedAnnouncement: BuddyAnnouncement | null = null;

    const nextBuddies = currentBuddies.map((b) => {
      if (b.id === announcementId) {
        updatedAnnouncement = {
          ...b,
          participants: b.participants.filter((p) => p.id !== currentUser.id),
        };
        return updatedAnnouncement;
      }
      return b;
    });

    setStoredBuddies(nextBuddies);
    return updatedAnnouncement;
  },

  // 8. Get Chat Messages
  async getMessages(peerId: string): Promise<ChatMessage[]> {
    const data = await safeJsonFetch(`/api/conversations/${peerId}/messages`);
    if (data && data.success && Array.isArray(data.messages)) {
      return data.messages;
    }

    const currentUser = getStoredUser();
    const allMessages = getStoredMessages();
    return allMessages.filter(
      (m) =>
        (m.senderId === peerId && m.receiverId === currentUser.id) ||
        (m.senderId === currentUser.id && m.receiverId === peerId)
    );
  },

  // 9. Send Chat Message
  async sendMessage(payload: {
    receiverId: string;
    text?: string;
    planMeetup?: any;
  }): Promise<ChatMessage> {
    const data = await safeJsonFetch("/api/conversations/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (data && data.success && data.message) {
      const msgs = getStoredMessages();
      if (!msgs.some((m) => m.id === data.message.id)) {
        setStoredMessages([...msgs, data.message]);
      }
      return data.message;
    }

    const currentUser = getStoredUser();
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      conversationId: payload.receiverId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: payload.receiverId,
      text: payload.text || "Proposed a meetup plan!",
      timestamp: new Date().toISOString(),
      planMeetup: payload.planMeetup
        ? {
            ...payload.planMeetup,
            id: `plan-${Date.now()}`,
            conversationId: payload.receiverId,
            proposerId: currentUser.id,
            proposerName: currentUser.name,
            status: "proposed",
            createdAt: new Date().toISOString(),
          }
        : undefined,
    };

    const msgs = getStoredMessages();
    if (!msgs.some((m) => m.id === newMessage.id)) {
      setStoredMessages([...msgs, newMessage]);
    }
    return newMessage;
  },

  // 10. Update Plan Status
  async updatePlanStatus(planId: string, status: "accepted" | "declined"): Promise<MeetupPlan | null> {
    const data = await safeJsonFetch(`/api/conversations/plans/${planId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (data && data.success && data.plan) {
      return data.plan;
    }

    const msgs = getStoredMessages();
    let updatedPlan: MeetupPlan | null = null;
    const nextMsgs = msgs.map((m) => {
      if (m.planMeetup && m.planMeetup.id === planId) {
        updatedPlan = {
          ...m.planMeetup,
          status,
        };
        return {
          ...m,
          planMeetup: updatedPlan,
        };
      }
      return m;
    });

    setStoredMessages(nextMsgs);
    return updatedPlan;
  },

  // 11. Switch Persona (Demo / Multi-user)
  async switchUser(userId: string): Promise<UserProfile | null> {
    const data = await safeJsonFetch("/api/demo/switch-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (data && data.success && data.user) {
      setStoredUser(data.user);
      return data.user;
    }

    const target = seedUsers.find((u) => u.id === userId);
    if (target) {
      setStoredUser(target);
      return target;
    }
    return null;
  },
};
