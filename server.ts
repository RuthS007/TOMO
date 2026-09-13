import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  MeetupPlan,
  CompatibilityResult,
} from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database
const seedUsers: UserProfile[] = [
  {
    id: "user-1",
    email: "alex.chen@campus.edu",
    name: "Alex Chen",
    nickname: "Alex",
    age: 20,
    year: "Junior",
    major: "Computer Science",
    interests: ["Coding", "Coffee", "Gaming", "Hackathons", "Boba"],
    bio: "CS junior obsessed with distributed systems and late-night boba runs. Always looking for leetcode and project study partners!",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    campus: "North Campus",
    classes: ["CS 301", "CS 374", "MATH 257"],
    lookingFor: ["Study partners", "Lunch buddy", "Hackathon team"],
  },
  {
    id: "user-2",
    email: "maya.patel@campus.edu",
    name: "Maya Patel",
    nickname: "Maya",
    age: 19,
    year: "Sophomore",
    major: "Biology",
    interests: ["Pre-Med", "Coffee", "Hiking", "Volunteering", "Reading"],
    bio: "Pre-med sophomore surviving organic chemistry. Love weekend trail hikes, black coffee, and quizlet study sprints.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    campus: "Central Campus",
    classes: ["BIO 202", "CHEM 232", "STAT 212"],
    lookingFor: ["Bio study group", "Coffee breaks", "Gym buddy"],
  },
  {
    id: "user-3",
    email: "ethan.brooks@campus.edu",
    name: "Ethan Brooks",
    nickname: "Ethan",
    age: 21,
    year: "Junior",
    major: "History",
    interests: ["History", "Reading", "Debate", "Coffee", "Board Games"],
    bio: "History major specializing in 20th century diplomatic history. Currently prepping for midterms in class B4!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    campus: "Central Campus",
    classes: ["HIST 320", "HIST 240", "POLS 100"],
    lookingFor: ["History study group", "Lunch buddies"],
  },
  {
    id: "user-4",
    email: "sophia.nguyen@campus.edu",
    name: "Sophia Nguyen",
    nickname: "Soph",
    age: 18,
    year: "Freshman",
    major: "Art & Design",
    interests: ["UI/UX", "Photography", "Anime", "Boba", "Art"],
    bio: "Design freshman loving digital illustration, typography, and cafe hopping. Let's explore local exhibitions and grab matcha!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    campus: "South Campus",
    classes: ["ART 101", "DSGN 150", "ENGL 105"],
    lookingFor: ["Art buddies", "Activities", "Photography walk"],
  },
  {
    id: "user-5",
    email: "jordan.taylor@campus.edu",
    name: "Jordan Taylor",
    nickname: "JT",
    age: 21,
    year: "Junior",
    major: "Business",
    interests: ["Finance", "Gym & Fitness", "Basketball", "Startups", "Gaming"],
    bio: "Finance junior, intramural basketball captain, and avid podcast listener. Up for early workouts or case competition prep.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    campus: "East Quad",
    classes: ["FIN 300", "ECON 202", "BADM 310"],
    lookingFor: ["Gym partners", "Basketball pickup", "Lunch"],
  },
  {
    id: "user-6",
    email: "chloe.kim@campus.edu",
    name: "Chloe Kim",
    nickname: "Chloe",
    age: 20,
    year: "Sophomore",
    major: "Psychology",
    interests: ["Psychology", "Music", "Coffee", "Yoga", "Cooking"],
    bio: "Psych student passionate about behavioral neuroscience and acoustic playlists. Always down for library study jams or tea breaks.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
    campus: "North Campus",
    classes: ["PSYC 210", "PSYC 235", "NEUR 101"],
    lookingFor: ["Study buddy", "Yoga", "Campus lunch"],
  },
  {
    id: "user-7",
    email: "liam.rodriguez@campus.edu",
    name: "Liam Rodriguez",
    nickname: "Liam",
    age: 22,
    year: "Senior",
    major: "Mechanical Engineering",
    interests: ["Robotics", "3D Printing", "Hiking", "Cycling", "Coffee"],
    bio: "MechE senior working on formula SAE electric car. When not in makerspace, you can find me road cycling or brewing pour-overs.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    campus: "Engineering Hall",
    classes: ["ME 470", "TAM 212", "PHYS 214"],
    lookingFor: ["Senior design collab", "Weekend cycling", "Study session"],
  },
];

// Current logged in user profile (can be updated by client during onboarding or edit profile)
let currentUserProfile: UserProfile = {
  id: "current-user",
  email: "student@campus.edu",
  name: "Riley Davis",
  nickname: "Riley",
  age: 20,
  year: "Junior",
  major: "Computer Science",
  interests: ["Coding", "Coffee", "Gaming", "History", "Boba"],
  bio: "Passionate about building helpful student tools. Excited to meet new friends for lunch breaks, study sessions, and weekend gaming!",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  campus: "North Quad",
  classes: ["CS 225", "HIST 100", "STAT 200"],
  lookingFor: ["Study groups", "Lunch partners", "Activities"],
  createdAt: new Date().toISOString(),
};

// Seed Buddy Announcements
let buddyAnnouncements: BuddyAnnouncement[] = [
  {
    id: "buddy-1",
    creatorId: "user-3",
    creatorName: "Ethan Brooks",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "History",
    creatorYear: "Junior",
    category: "study",
    title: "Need 4 people to study history in class b4",
    description: "Reviewing European diplomatic treaties and midterm primary sources. Class B4 is reserved with whiteboards and snacks!",
    targetCount: 4,
    participants: [
      {
        id: "user-3",
        name: "Ethan Brooks",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        major: "History",
        joinedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "user-6",
        name: "Chloe Kim",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
        major: "Psychology",
        joinedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    location: "Hall of Letters, Class B4",
    meetingTime: "Today at 3:30 PM",
    tags: ["History", "Midterms", "Quiet Study"],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "buddy-2",
    creatorId: "user-1",
    creatorName: "Alex Chen",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "Computer Science",
    creatorYear: "Junior",
    category: "lunch",
    title: "Taco Tuesday & Boba at Student Center Plaza",
    description: "Taking an hour break after morning algorithms lecture. Craving carnitas tacos and roasted brown sugar boba!",
    targetCount: 3,
    participants: [
      {
        id: "user-1",
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
        major: "Computer Science",
        joinedAt: new Date(Date.now() - 5400000).toISOString(),
      },
    ],
    location: "Student Union Courtyard Tables",
    meetingTime: "Today at 12:45 PM",
    tags: ["Tacos", "Boba", "Casual Chat"],
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "buddy-3",
    creatorId: "user-5",
    creatorName: "Jordan Taylor",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "Business",
    creatorYear: "Junior",
    category: "activity",
    title: "Need 2 more for 3v3 Half-Court Basketball pickup",
    description: "Fun, casual run at the recreation center. All skill levels welcome, just want a great sweat before evening classes.",
    targetCount: 3,
    participants: [
      {
        id: "user-5",
        name: "Jordan Taylor",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        major: "Business",
        joinedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "user-7",
        name: "Liam Rodriguez",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
        major: "Mechanical Engineering",
        joinedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
    location: "Campus Rec Center, Court 2",
    meetingTime: "Tomorrow at 5:00 PM",
    tags: ["Basketball", "Fitness", "Casual Sports"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "buddy-4",
    creatorId: "user-2",
    creatorName: "Maya Patel",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "Biology",
    creatorYear: "Sophomore",
    category: "lunch",
    title: "Healthy Grain Bowl & Coffee break at Green Table",
    description: "Looking for friendly lunch companions to decompress after lab sessions. Vegan and gluten-free friendly spot!",
    targetCount: 2,
    participants: [
      {
        id: "user-2",
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        major: "Biology",
        joinedAt: new Date(Date.now() - 10000000).toISOString(),
      },
    ],
    location: "Green Table Cafe, North Hall",
    meetingTime: "Thursday at 1:15 PM",
    tags: ["Healthy Food", "Coffee", "Freshers Welcome"],
    createdAt: new Date(Date.now() - 10000000).toISOString(),
  },
  {
    id: "buddy-5",
    creatorId: "user-4",
    creatorName: "Sophia Nguyen",
    creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "Art & Design",
    creatorYear: "Freshman",
    category: "activity",
    title: "Campus Sunset Photography Walk & Golden Hour",
    description: "Bringing my Fuji camera for architectural portraits and sunset reflections around the bell tower. Beginners welcome!",
    targetCount: 4,
    participants: [
      {
        id: "user-4",
        name: "Sophia Nguyen",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
        major: "Art & Design",
        joinedAt: new Date(Date.now() - 12000000).toISOString(),
      },
    ],
    location: "Bell Tower Plaza (meet by fountain)",
    meetingTime: "Friday at 6:15 PM",
    tags: ["Photography", "Outdoor", "Creative"],
    createdAt: new Date(Date.now() - 12000000).toISOString(),
  },
  {
    id: "buddy-6",
    creatorId: "user-7",
    creatorName: "Liam Rodriguez",
    creatorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    creatorMajor: "Mechanical Engineering",
    creatorYear: "Senior",
    category: "study",
    title: "Quiet Focus Sprint & CAD / Coding Session",
    description: "Silent Pomodoro study session. 50 mins focus, 10 min break. Good power outlets and monitor setups.",
    targetCount: 3,
    participants: [
      {
        id: "user-7",
        name: "Liam Rodriguez",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
        major: "Mechanical Engineering",
        joinedAt: new Date(Date.now() - 15000000).toISOString(),
      },
    ],
    location: "Grainger Library, 4th Floor Silent Zone",
    meetingTime: "Wednesday at 4:00 PM",
    tags: ["Pomodoro", "Engineering", "Silent Study"],
    createdAt: new Date(Date.now() - 15000000).toISOString(),
  },
];

// Seed Chat Messages & Meetup Plans
let chatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "user-1", // conversation between current-user and user-1
    senderId: "user-1",
    senderName: "Alex Chen",
    senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    receiverId: "current-user",
    text: "Hey Riley! Saw you're also a CS Junior. We have super high compatibility!",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "msg-2",
    conversationId: "user-1",
    senderId: "current-user",
    senderName: "Riley Davis",
    senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
    receiverId: "user-1",
    text: "Hey Alex! Yes! Are you taking any distributed systems or leetcode prep this term?",
    timestamp: new Date(Date.now() - 17000000).toISOString(),
  },
  {
    id: "msg-3",
    conversationId: "user-1",
    senderId: "user-1",
    senderName: "Alex Chen",
    senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    receiverId: "current-user",
    text: "Yeah definitely! Let's set up a study session or grab coffee to compare schedules.",
    timestamp: new Date(Date.now() - 16000000).toISOString(),
    planMeetup: {
      id: "plan-1",
      conversationId: "user-1",
      title: "CS Study & Coffee Catchup",
      category: "study",
      location: "Main Library Cafe, Table 6",
      dateTime: "Tomorrow at 2:00 PM",
      status: "proposed",
      proposerId: "user-1",
      proposerName: "Alex Chen",
      notes: "I'll bring my laptop and review notes for chapter 4.",
      createdAt: new Date(Date.now() - 16000000).toISOString(),
    },
  },
  {
    id: "msg-4",
    conversationId: "user-3",
    senderId: "user-3",
    senderName: "Ethan Brooks",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    receiverId: "current-user",
    text: "Hi Riley! I noticed you are interested in History! Feel free to drop by class B4 today if you want to study with our group.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

// Compatibility Calculator
function calculateCompatibility(
  userA: UserProfile,
  peer: UserProfile
): CompatibilityResult {
  let score = 30; // base compatibility
  const reasons: string[] = [];

  // Major match
  const majorMatch =
    userA.major.toLowerCase() === peer.major.toLowerCase() ||
    (userA.major.toLowerCase().includes("comp") && peer.major.toLowerCase().includes("comp"));

  if (majorMatch) {
    score += 25;
    reasons.push(`Both in ${peer.major}`);
  }

  // Academic Year proximity
  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
  const yearIdxA = years.indexOf(userA.year);
  const yearIdxB = years.indexOf(peer.year);
  const yearDiff = Math.abs(yearIdxA - yearIdxB);

  let yearMatch = false;
  if (yearDiff === 0) {
    score += 20;
    yearMatch = true;
    reasons.push(`Both in ${peer.year} year`);
  } else if (yearDiff === 1) {
    score += 10;
    reasons.push(`${userA.year} & ${peer.year}`);
  }

  // Shared Interests
  const setA = new Set(userA.interests.map((i) => i.toLowerCase().trim()));
  const shared = peer.interests.filter((i) =>
    setA.has(i.toLowerCase().trim())
  );

  const interestScore = Math.min(30, shared.length * 8);
  score += interestScore;

  if (shared.length > 0) {
    reasons.push(`Shared interests: ${shared.slice(0, 3).join(", ")}`);
  }

  const finalScore = Math.min(99, Math.max(45, score));

  return {
    score: finalScore,
    breakdown: {
      majorMatch,
      yearMatch,
      sharedInterests: shared,
      interestScore,
    },
    summary: reasons.join(" • ") || "Great campus peer match",
  };
}

// WebSocket broadcast
let wss: WebSocketServer | null = null;
const activeSockets = new Set<WebSocket>();

function broadcast(event: string, payload: unknown) {
  const data = JSON.stringify({ event, payload });
  activeSockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

// API Routes

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

  // Filter
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

  // Sort by compatibility score descending
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

  // Most recent first
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

  const newAnnouncement: BuddyAnnouncement = {
    id: `buddy-${Date.now()}`,
    creatorId: currentUserProfile.id,
    creatorName: currentUserProfile.name,
    creatorAvatar: currentUserProfile.avatar,
    creatorMajor: currentUserProfile.major,
    creatorYear: currentUserProfile.year,
    category: category,
    title: title.trim(),
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
    location: location.trim(),
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
  // Collect all peer users who have conversations with current user
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

  // Also include peers that don't have messages yet so user can start chatting immediately
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

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    conversationId: receiverId,
    senderId: currentUserProfile.id,
    senderName: currentUserProfile.name,
    senderAvatar: currentUserProfile.avatar,
    receiverId,
    text: text ? text.trim() : "Proposed a meetup plan!",
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

  // If receiver is a peer, generate an automated context-aware friendly reply after 1.5s if not a plan update
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

// Update Meetup Plan Status (Accept / Decline)
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

// Switch persona for demo/testing multi-user functionality
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

// Start Server with Vite Middleware & WebSocket
async function startServer() {
  const server = http.createServer(app);

  // Initialize WebSocket Server on the same HTTP server
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    activeSockets.add(ws);

    // Send initial greeting state
    ws.send(
      JSON.stringify({
        event: "connected",
        payload: {
          currentUser: currentUserProfile,
          announcementsCount: buddyAnnouncements.length,
        },
      })
    );

    ws.on("message", (raw) => {
      try {
        const parsed = JSON.parse(raw.toString());
        if (parsed.type === "ping") {
          ws.send(JSON.stringify({ event: "pong" }));
        }
      } catch (e) {
        // ignore malformed
      }
    });

    ws.on("close", () => {
      activeSockets.delete(ws);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[CampusBuddy] Server running with WebSocket on http://0.0.0.0:${PORT}`);
  });
}

startServer();
