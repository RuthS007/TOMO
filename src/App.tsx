/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  PeerProfile,
  BuddyAnnouncement,
  ChatMessage,
  FilterOptions,
  TabType,
  BuddyCategory,
} from "./types";
import { AuthScreen } from "./components/AuthScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { Navigation } from "./components/Navigation";
import { HomeTab } from "./components/HomeTab";
import { ChatTab } from "./components/ChatTab";
import { BuddyTab } from "./components/BuddyTab";
import { ProfileTab } from "./components/ProfileTab";
import { useRealtime } from "./hooks/useRealtime";
import { DataService } from "./services/dataService";
import {
  DEFAULT_CURRENT_USER,
  INITIAL_PEERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MESSAGES,
} from "./data/initialData";

type AppScreen = "auth" | "onboarding" | "app";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("app");
  const [registeredEmail, setRegisteredEmail] = useState("student@campus.edu");
  const [currentTab, setCurrentTab] = useState<TabType>("home");

  // User and peers state initialized with rich defaults for instant loading (0ms blank screen)
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_CURRENT_USER);
  const [peerProfiles, setPeerProfiles] = useState<PeerProfile[]>(INITIAL_PEERS);
  const [buddyAnnouncements, setBuddyAnnouncements] = useState<BuddyAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeChatPeer, setActiveChatPeer] = useState<PeerProfile | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    selectedMajor: "All",
    selectedYear: "All",
    minCompatibility: 0,
    selectedInterests: [],
    searchQuery: "",
  });

  // Badge notification counts
  const [unreadCount, setUnreadCount] = useState(1);
  const [newBuddyBadge, setNewBuddyBadge] = useState(0);

  // Fetch current user and peers via DataService (works both on server and static Vercel)
  const loadData = useCallback(async () => {
    try {
      const [user, peers, announcements] = await Promise.all([
        DataService.getUserProfile(),
        DataService.getProfiles(filters),
        DataService.getBuddyAnnouncements(),
      ]);

      if (user) setCurrentUser(user);
      if (peers && peers.length > 0) setPeerProfiles(peers);
      if (announcements) setBuddyAnnouncements(announcements);
    } catch (err) {
      console.warn("App data loaded from offline fallback store:", err);
    }
  }, [filters]);

  // Load chat messages when an active peer is selected
  const loadMessages = useCallback(async (peerId: string) => {
    try {
      const messages = await DataService.getMessages(peerId);
      if (messages) setChatMessages(messages);
    } catch (e) {
      console.warn("Chat messages fallback loaded:", e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeChatPeer) {
      loadMessages(activeChatPeer.id);
    }
  }, [activeChatPeer, loadMessages]);

  // Real-time event listener via WebSocket (when running in server environment)
  const handleRealtimeEvent = useCallback(
    (event: string, payload: any) => {
      if (event === "chat:message") {
        const newMsg: ChatMessage = payload;
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });

        if (currentTab !== "chat") {
          setUnreadCount((c) => c + 1);
        }
      } else if (event === "buddy:new") {
        const newAnn: BuddyAnnouncement = payload;
        setBuddyAnnouncements((prev) => {
          if (prev.some((b) => b.id === newAnn.id)) return prev;
          return [newAnn, ...prev];
        });
        if (currentTab !== "buddies") {
          setNewBuddyBadge((c) => c + 1);
        }
      } else if (event === "buddy:joined") {
        const { announcementId, participant } = payload;
        setBuddyAnnouncements((prev) =>
          prev.map((b) => {
            if (b.id === announcementId) {
              const already = b.participants.some((p) => p.id === participant.id);
              if (already) return b;
              return {
                ...b,
                participants: [...b.participants, participant],
              };
            }
            return b;
          })
        );
      } else if (event === "buddy:left") {
        const { announcementId, userId } = payload;
        setBuddyAnnouncements((prev) =>
          prev.map((b) => {
            if (b.id === announcementId) {
              return {
                ...b,
                participants: b.participants.filter((p) => p.id !== userId),
              };
            }
            return b;
          })
        );
      } else if (event === "plan:status_updated") {
        const { planId, status } = payload;
        setChatMessages((prev) =>
          prev.map((m) => {
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
          })
        );
      } else if (event === "user:profile_updated") {
        loadData();
      }
    },
    [currentTab, loadData]
  );

  useRealtime(handleRealtimeEvent);

  // Authentication & Onboarding actions
  const handleAuthSuccess = (email: string) => {
    setRegisteredEmail(email);
    setScreen("onboarding");
  };

  const handleQuickDemo = () => {
    setScreen("app");
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    try {
      const updated = await DataService.updateUserProfile(profile);
      setCurrentUser(updated);
    } catch (e) {
      console.warn("Using local profile:", e);
      setCurrentUser(profile);
    }
    setScreen("app");
    setCurrentTab("home");
    loadData();
  };

  // Chat Actions
  const handleStartChat = (peer: PeerProfile) => {
    setActiveChatPeer(peer);
    setCurrentTab("chat");
    setUnreadCount(0);
  };

  const handleSendMessage = async (receiverId: string, text: string) => {
    try {
      const newMsg = await DataService.sendMessage(receiverId, text, currentUser);
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const handleProposePlan = async (peer: PeerProfile, plan: any) => {
    try {
      const newMsg = await DataService.sendMessage(
        peer.id,
        `Proposed a ${plan.category} meetup: "${plan.title}" at ${plan.location} on ${plan.dateTime}`,
        currentUser,
        plan
      );
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setActiveChatPeer(peer);
      setCurrentTab("chat");
    } catch (e) {
      console.error("Error proposing meetup plan:", e);
    }
  };

  const handleRespondPlan = async (planId: string, status: "accepted" | "declined") => {
    try {
      await DataService.updatePlanStatus(planId, status);
      setChatMessages((prev) =>
        prev.map((m) => {
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
        })
      );
    } catch (e) {
      console.error("Error responding to meetup plan:", e);
    }
  };

  // Buddy Announcements Actions
  const handleJoinBuddy = async (announcementId: string) => {
    try {
      const updated = await DataService.joinAnnouncement(announcementId, currentUser);
      setBuddyAnnouncements(updated);
    } catch (e) {
      console.error("Error joining buddy group:", e);
    }
  };

  const handleLeaveBuddy = async (announcementId: string) => {
    try {
      const updated = await DataService.leaveAnnouncement(announcementId, currentUser.id);
      setBuddyAnnouncements(updated);
    } catch (e) {
      console.error("Error leaving buddy group:", e);
    }
  };

  const handleCreateAnnouncement = async (data: {
    category: BuddyCategory;
    title: string;
    description: string;
    targetCount: number;
    location: string;
    meetingTime: string;
    tags: string[];
  }) => {
    try {
      const newAnn = await DataService.createAnnouncement(data, currentUser);
      setBuddyAnnouncements((prev) => [newAnn, ...prev]);
    } catch (e) {
      console.error("Error creating buddy announcement:", e);
    }
  };

  const handleContactHost = (hostId: string) => {
    const peer = peerProfiles.find((p) => p.id === hostId);
    if (peer) {
      handleStartChat(peer);
    } else {
      setCurrentTab("chat");
    }
  };

  // Profile Update & Multi-User Switcher
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await DataService.updateUserProfile(updates);
      setCurrentUser(updated);
      loadData();
    } catch (e) {
      console.error("Error updating profile:", e);
    }
  };

  const handleSwitchPersona = async (userId: string) => {
    const peer = peerProfiles.find((p) => p.id === userId);
    if (peer) {
      const updated = await DataService.updateUserProfile({
        id: peer.id,
        email: peer.email,
        name: peer.name,
        nickname: peer.nickname,
        age: peer.age,
        year: peer.year,
        major: peer.major,
        interests: peer.interests,
        bio: peer.bio,
        avatar: peer.avatar,
        campus: peer.campus,
        classes: peer.classes,
        lookingFor: peer.lookingFor,
      });
      setCurrentUser(updated);
      loadData();
    }
  };

  const handleTabSelect = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === "chat") setUnreadCount(0);
    if (tab === "buddies") setNewBuddyBadge(0);
  };

  // Render Screen Flow
  if (screen === "auth") {
    return (
      <AuthScreen
        onSuccess={handleAuthSuccess}
        onQuickDemo={handleQuickDemo}
      />
    );
  }

  if (screen === "onboarding") {
    return (
      <OnboardingFlow
        initialEmail={registeredEmail}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#bce3fa] text-slate-800 font-sans relative selection:bg-sky-200 selection:text-slate-900">
      {/* Active Tab View */}
      <main className="w-full">
        {currentUser && (
          <>
            {currentTab === "home" && (
              <HomeTab
                currentUser={currentUser}
                profiles={peerProfiles}
                filters={filters}
                onFilterChange={setFilters}
                onStartChat={handleStartChat}
                onProposePlan={handleProposePlan}
              />
            )}

            {currentTab === "chat" && (
              <ChatTab
                currentUser={currentUser}
                peerProfiles={peerProfiles}
                activePeer={activeChatPeer}
                onSelectPeer={setActiveChatPeer}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onProposePlan={handleProposePlan}
                onRespondPlan={handleRespondPlan}
              />
            )}

            {currentTab === "buddies" && (
              <BuddyTab
                currentUser={currentUser}
                announcements={buddyAnnouncements}
                onJoin={handleJoinBuddy}
                onLeave={handleLeaveBuddy}
                onCreateAnnouncement={handleCreateAnnouncement}
                onContactHost={handleContactHost}
              />
            )}

            {currentTab === "profile" && (
              <ProfileTab
                currentUser={currentUser}
                peerProfiles={peerProfiles}
                onUpdateProfile={handleUpdateProfile}
                onSwitchPersona={handleSwitchPersona}
                onLogout={() => setScreen("auth")}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation Bar matching Figma */}
      <Navigation
        currentTab={currentTab}
        onTabChange={handleTabSelect}
        unreadChatCount={unreadCount}
        newBuddyCount={newBuddyBadge}
      />
    </div>
  );
}
