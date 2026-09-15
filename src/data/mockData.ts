import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  CompatibilityResult,
} from "../types";

export const seedUsers: UserProfile[] = [
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

export const defaultCurrentUser: UserProfile = {
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

export const seedBuddies: BuddyAnnouncement[] = [
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

export const seedChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "user-1",
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

export function calculateCompatibility(
  userA: UserProfile,
  peer: UserProfile
): CompatibilityResult {
  let score = 30;
  const reasons: string[] = [];

  const majorMatch =
    userA.major.toLowerCase() === peer.major.toLowerCase() ||
    (userA.major.toLowerCase().includes("comp") && peer.major.toLowerCase().includes("comp"));

  if (majorMatch) {
    score += 25;
    reasons.push(`Both in ${peer.major}`);
  }

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
