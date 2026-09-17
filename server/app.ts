import express from "express";
import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  MeetupPlan,
} from "../src/types";
import {
  seedUsers,
  defaultCurrentUser,
  seedBuddies,
  seedChatMessages,
  calculateCompatibility,
} from "../src/data/mockData";

export const app = express();

app.use(express.json());

// In-Memory Database for backend
let currentUserProfile: UserProfile = { ...defaultCurrentUser };
let buddyAnnouncements: BuddyAnnouncement[] = [...seedBuddies];
let chatMessages: ChatMessage[] = [...seedChatMessages];

// Listeners for real-time broadcasts
type BroadcastHandler = (event: string, payload: unknown) => void;
let broadcastHandler: BroadcastHandler | null = null;

export function setBroadcastHandler(handler: BroadcastHandler) {
  broadcastHandler = handler;
}

function broadcast(event: string, payload: unknown) {
  if (broadcastHandler) {
    broadcastHandler(event, payload);
  }
}

// API Routes

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "TOMO" });
});

// Get current user profile
app.get("/api/user/profile", (_req, res) => {
  res.json({ success: true, user: currentUserProfile });
});

// Update current user profile
app.post("/api/user/profile", (req, res) => {
  const updates = req.body;
  currentUserProfile = {
    ...currentUserProfile,
    ...updates,
    id: currentUserProfile.id,
  };
  broadcast("user:profile_updated", currentUserProfile);
  res.json({ success: true, user: currentUserProfile });
});

// Get matched peer profiles with compatibility scores
app.get("/api/profiles", (req, res) => {
  const major = req.query.major as string | undefined;
  const year = req.query.year as string | undefined;
  const minScore = req.query.minScore ? parseInt(req.query.minScore as string, 10) : 0;
  const interest = req.query.interest as string | undefined;
  const search = (req.query.search as string | undefined)?.toLowerCase();

  let results: PeerProfile[] = seedUsers.map((peer) => {
    const comp = calculateCompatibility(currentUserProfile, peer);
    return {
      ...peer,
      compatibility: comp,
    };
  });

  if (major && major !== "All") {
    results = results.filter((p) => p.major.toLowerCase() === major.toLowerCase());
  }
  if (year && year !== "All") {
    results = results.filter((p) => p.year === year);
  }
  if (minScore > 0) {
    results = results.filter((p) => (p.compatibility?.score ?? 0) >= minScore);
  }
  if (interest && interest !== "All") {
    results = results.filter((p) =>
      p.interests.some((i) => i.toLowerCase() === interest.toLowerCase())
    );
  }
  if (search) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.major.toLowerCase().includes(search) ||
        p.bio.toLowerCase().includes(search) ||
        p.interests.some((i) => i.toLowerCase().includes(search))
    );
  }

  results.sort((a, b) => (b.compatibility?.score ?? 0) - (a.compatibility?.score ?? 0));
  res.json({ success: true, profiles: results });
});

// Get specific profile by ID
app.get("/api/profiles/:id", (req, res) => {
  const { id } = req.params;
  const peer = seedUsers.find((u) => u.id === id);
  if (!peer) {
    return res.status(404).json({ error: "Profile not found" });
  }
  const compatibility = calculateCompatibility(currentUserProfile, peer);
  res.json({ success: true, profile: { ...peer, compatibility } });
});

// Get Buddy Announcements
app.get("/api/buddies", (req, res) => {
  const category = req.query.category as string | undefined;
  const search = (req.query.search as string | undefined)?.toLowerCase();

  let filtered = [...buddyAnnouncements];

  if (category && category !== "all") {
    filtered = filtered.filter((b) => b.category === category);
  }
  if (search) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.description.toLowerCase().includes(search) ||
        b.location.toLowerCase().includes(search) ||
        b.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({ success: true, announcements: filtered });
});

// Create new Buddy Announcement
app.post("/api/buddies", (req, res) => {
  const { category, title, description, targetCount, location, meetingTime, tags } = req.body;

  if (!title || !category || !location) {
    return res.status(400).json({ error: "Title, category, and location are required." });
  }

  const trimmedTitle = title.trim();
  const trimmedLocation = location.trim();
  const now = Date.now();

  // Deduplication check: if identical announcement posted within 3 seconds, return existing
  const existingRecent = buddyAnnouncements.find(
    (b) =>
      b.creatorId === currentUserProfile.id &&
      b.title.toLowerCase() === trimmedTitle.toLowerCase() &&
      b.location.toLowerCase() === trimmedLocation.toLowerCase() &&
      Math.abs(now - new Date(b.createdAt).getTime()) < 3000
  );

  if (existingRecent) {
    return res.json({ success: true, announcement: existingRecent });
  }

  const newAnnouncement: BuddyAnnouncement = {
    id: `buddy-${Date.now()}`,
    creatorId: currentUserProfile.id,
    creatorName: currentUserProfile.name,
    creatorAvatar: currentUserProfile.avatar,
    creatorMajor: currentUserProfile.major,
    creatorYear: currentUserProfile.year,
    category,
    title: trimmedTitle,
    description: description ? description.trim() : "",
    targetCount: Math.max(1, parseInt(targetCount || "4", 10)),
    participants: [
      {
        id: currentUserProfile.id,
        name: currentUserProfile.name,
        avatar: currentUserProfile.avatar,
        major: currentUserProfile.major,
        joinedAt: new Date().toISOString(),
      },
    ],
    location: trimmedLocation,
    meetingTime: meetingTime || "Today soon",
    tags: Array.isArray(tags) ? tags : ["Campus"],
    createdAt: new Date().toISOString(),
  };

  buddyAnnouncements.unshift(newAnnouncement);
  broadcast("buddy:new", newAnnouncement);

  res.json({ success: true, announcement: newAnnouncement });
});

// Join a Buddy Group
app.post("/api/buddies/:id/join", (req, res) => {
  const { id } = req.params;
  const announcement = buddyAnnouncements.find((b) => b.id === id);

  if (!announcement) {
    return res.status(404).json({ error: "Announcement not found" });
  }

  const existingIdx = announcement.participants.findIndex(
    (p) => p.id === currentUserProfile.id
  );

  if (existingIdx >= 0) {
    return res.json({ success: true, announcement, message: "Already joined" });
  }

  if (announcement.participants.length >= announcement.targetCount) {
    return res.status(400).json({ error: "This group is already full." });
  }

  const participant = {
    id: currentUserProfile.id,
    name: currentUserProfile.name,
    avatar: currentUserProfile.avatar,
    major: currentUserProfile.major,
    joinedAt: new Date().toISOString(),
  };

  announcement.participants.push(participant);
  broadcast("buddy:joined", { announcementId: id, participant, announcement });

  res.json({ success: true, announcement });
});

// Leave a Buddy Group
app.post("/api/buddies/:id/leave", (req, res) => {
  const { id } = req.params;
  const announcement = buddyAnnouncements.find((b) => b.id === id);

  if (!announcement) {
    return res.status(404).json({ error: "Announcement not found" });
  }

  announcement.participants = announcement.participants.filter(
    (p) => p.id !== currentUserProfile.id
  );

  broadcast("buddy:left", {
    announcementId: id,
    userId: currentUserProfile.id,
    announcement,
  });

  res.json({ success: true, announcement });
});

// Get Chat Conversations / Messages
app.get("/api/conversations", (_req, res) => {
  const conversationMap = new Map<string, { peer: UserProfile; lastMessage: ChatMessage; unread: number }>();

  seedUsers.forEach((peer) => {
    const msgs = chatMessages.filter(
      (m) =>
        (m.senderId === peer.id && m.receiverId === currentUserProfile.id) ||
        (m.senderId === currentUserProfile.id && m.receiverId === peer.id)
    );
    if (msgs.length > 0) {
      const last = msgs[msgs.length - 1];
      conversationMap.set(peer.id, {
        peer,
        lastMessage: last,
        unread: last.senderId === peer.id ? 1 : 0,
      });
    }
  });

  const convos = Array.from(conversationMap.values());
  res.json({ success: true, conversations: convos });
});

// Get messages with specific user
app.get("/api/conversations/:peerId/messages", (req, res) => {
  const { peerId } = req.params;
  const messages = chatMessages.filter(
    (m) =>
      (m.senderId === peerId && m.receiverId === currentUserProfile.id) ||
      (m.senderId === currentUserProfile.id && m.receiverId === peerId)
  );

  res.json({ success: true, messages });
});

// Send Chat Message
app.post("/api/conversations/messages", (req, res) => {
  const { receiverId, text, planMeetup } = req.body;

  if (!receiverId || (!text && !planMeetup)) {
    return res.status(400).json({ error: "Receiver ID and text or plan required." });
  }

  const messageText = text ? text.trim() : "Proposed a meetup plan!";
  const now = Date.now();

  // Deduplication check: if identical message/plan was sent within 3 seconds, return existing
  const recentDuplicate = chatMessages.find(
    (m) =>
      m.senderId === currentUserProfile.id &&
      m.receiverId === receiverId &&
      m.text === messageText &&
      Boolean(m.planMeetup) === Boolean(planMeetup) &&
      Math.abs(now - new Date(m.timestamp).getTime()) < 3000
  );

  if (recentDuplicate) {
    return res.json({ success: true, message: recentDuplicate });
  }

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    conversationId: receiverId,
    senderId: currentUserProfile.id,
    senderName: currentUserProfile.name,
    senderAvatar: currentUserProfile.avatar,
    receiverId,
    text: messageText,
    timestamp: new Date().toISOString(),
    planMeetup: planMeetup
      ? {
          ...planMeetup,
          id: `plan-${Date.now()}`,
          conversationId: receiverId,
          proposerId: currentUserProfile.id,
          proposerName: currentUserProfile.name,
          status: "proposed",
          createdAt: new Date().toISOString(),
        }
      : undefined,
  };

  chatMessages.push(newMessage);
  broadcast("chat:message", newMessage);

  // Automated friendly contextual reply for demo
  if (receiverId.startsWith("user-") && !planMeetup) {
    const peer = seedUsers.find((u) => u.id === receiverId);
    if (peer) {
      setTimeout(() => {
        let replyText = `Awesome! I'd love to connect. Are you free around ${peer.campus} this week?`;
        const lower = (text || "").toLowerCase();
        if (lower.includes("lunch") || lower.includes("eat") || lower.includes("food")) {
          replyText = `Sounds great! The student union food court or the cafe near ${peer.campus} works perfectly for me!`;
        } else if (lower.includes("study") || lower.includes("exam") || lower.includes("history") || lower.includes("class")) {
          replyText = `Yes! I was just preparing notes for that. Let's meet at the library 2nd floor study rooms.`;
        } else if (lower.includes("hi") || lower.includes("hey") || lower.includes("hello")) {
          replyText = `Hey ${currentUserProfile.name}! Great to meet you! What classes are you taking this term?`;
        }

        const autoReply: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          conversationId: peer.id,
          senderId: peer.id,
          senderName: peer.name,
          senderAvatar: peer.avatar,
          receiverId: currentUserProfile.id,
          text: replyText,
          timestamp: new Date().toISOString(),
        };

        chatMessages.push(autoReply);
        broadcast("chat:message", autoReply);
      }, 1200);
    }
  }

  res.json({ success: true, message: newMessage });
});

// Update Meetup Plan Status
app.post("/api/conversations/plans/:planId/status", (req, res) => {
  const { planId } = req.params;
  const { status } = req.body;

  let updatedPlan: MeetupPlan | null = null;
  chatMessages.forEach((msg) => {
    if (msg.planMeetup && msg.planMeetup.id === planId) {
      msg.planMeetup.status = status;
      updatedPlan = msg.planMeetup;
    }
  });

  if (!updatedPlan) {
    return res.status(404).json({ error: "Meetup plan not found" });
  }

  broadcast("plan:status_updated", { planId, status, updatedPlan });
  res.json({ success: true, plan: updatedPlan });
});

// Switch persona
app.post("/api/demo/switch-user", (req, res) => {
  const { userId } = req.body;
  const target = seedUsers.find((u) => u.id === userId);
  if (target) {
    currentUserProfile = { ...target };
    broadcast("user:profile_updated", currentUserProfile);
    res.json({ success: true, user: currentUserProfile });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export default app;
