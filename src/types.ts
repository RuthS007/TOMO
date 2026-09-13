export type AcademicYear = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';

export type BuddyCategory = 'lunch' | 'study' | 'activity';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname?: string;
  age: number;
  year: AcademicYear;
  major: string;
  interests: string[];
  bio: string;
  avatar: string;
  campus?: string;
  classes?: string[];
  lookingFor?: string[];
  createdAt?: string;
}

export interface CompatibilityResult {
  score: number; // 0 - 100%
  breakdown: {
    majorMatch: boolean;
    yearMatch: boolean;
    sharedInterests: string[];
    interestScore: number;
  };
  summary: string;
}

export interface PeerProfile extends UserProfile {
  compatibility?: CompatibilityResult;
}

export interface MeetupPlan {
  id: string;
  conversationId: string;
  title: string;
  category: BuddyCategory | 'general';
  location: string;
  dateTime: string;
  status: 'proposed' | 'accepted' | 'declined' | 'completed';
  proposerId: string;
  proposerName: string;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  timestamp: string;
  planMeetup?: MeetupPlan;
}

export interface BuddyParticipant {
  id: string;
  name: string;
  avatar: string;
  major?: string;
  joinedAt: string;
}

export interface BuddyAnnouncement {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorMajor: string;
  creatorYear: AcademicYear;
  category: BuddyCategory;
  title: string;
  description: string;
  targetCount: number;
  participants: BuddyParticipant[];
  location: string;
  meetingTime: string;
  tags: string[];
  createdAt: string;
}

export interface FilterOptions {
  selectedMajor: string;
  selectedYear: string;
  minCompatibility: number;
  selectedInterests: string[];
  searchQuery: string;
}

export type TabType = 'home' | 'chat' | 'buddies' | 'profile';
