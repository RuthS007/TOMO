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
import { api } from "./services/api";

type AppScreen = "auth" | "onboarding" | "app";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("app"); // Default to main app or auth
  const [registeredEmail, setRegisteredEmail] = useState("student@campus.edu");
  const [currentTab, setCurrentTab] = useState<TabType>("home");

  // User and peers state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [peerProfiles, setPeerProfiles] = useState<PeerProfile[]>([]);
  const [buddyAnnouncements, setBuddyAnnouncements] = useState<BuddyAnnouncement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
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

  // Fetch current user and peers
  const loadData = useCallback(async () => {
    try {
      // 1. Current user
      const user = await api.getUserProfile();
      setCurrentUser(user);

      // 2. Peer profiles with compatibility
      const peers = await api.getProfiles(filters);
      setPeerProfiles(peers);

      // 3. Buddy announcements
      const buddies = await api.getBuddies();
      setBuddyAnnouncements(buddies);
    } catch (err) {
      console.error("Error loading app data:", err);
    }
  }, [filters]);

  // Load chat messages when an active peer is selected
  const loadMessages = useCallback(async (peerId: string) => {
    try {
      const messages = await api.getMessages(peerId);
      setChatMessages(messages);
    } catch (e) {
      console.error("Error loading chat messages:", e);
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

  // Real-time event listener via WebSocket
  const handleRealtimeEvent = useCallback(
    (event: string, payload: any) => {
      if (event === "chat:message") {
        const newMsg: ChatMessage = payload;
        setChatMessages((prev) => {
          // Idempotency check: don't add if already in list
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
        const { planId, status, updatedPlan } = payload;
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
    // Move to step-by-step onboarding questions as requested
    setScreen("onboarding");
  };

  const handleQuickDemo = () => {
    setScreen("app");
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    try {
      const updated = await api.updateUserProfile(profile);
      setCurrentUser(updated);
    } catch (e) {
      console.error("Error saving profile:", e);
    }
    // Main home page will pop up after filling all those info in
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
      const newMsg = await api.sendMessage({ receiverId, text });
      setChatMessages((prev) => [...prev, newMsg]);
    } catch (e) {
      console.error("Error sending message:", e);
    }
  };

  const handleProposePlan = async (peer: PeerProfile, plan: any) => {
    try {
      const newMsg = await api.sendMessage({
        receiverId: peer.id,
        text: `Proposed a ${plan.category} meetup: "${plan.title}" at ${plan.location} on ${plan.dateTime}`,
        planMeetup: plan,
      });
      setChatMessages((prev) => [...prev, newMsg]);
      setActiveChatPeer(peer);
      setCurrentTab("chat");
    } catch (e) {
      console.error("Error proposing meetup plan:", e);
    }
  };

  const handleRespondPlan = async (planId: string, status: "accepted" | "declined") => {
    try {
      const updatedPlan = await api.updatePlanStatus(planId, status);
      if (updatedPlan) {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.planMeetup && m.planMeetup.id === planId
              ? { ...m, planMeetup: updatedPlan }
              : m
          )
        );
      }
    } catch (e) {
      console.error("Error responding to meetup plan:", e);
    }
  };

  // Buddy Announcements Actions
  const handleJoinBuddy = async (announcementId: string) => {
    try {
      const updated = await api.joinBuddy(announcementId);
      if (updated) {
        setBuddyAnnouncements((prev) =>
          prev.map((b) => (b.id === announcementId ? updated : b))
        );
      }
    } catch (e) {
      console.error("Error joining buddy group:", e);
    }
  };

  const handleLeaveBuddy = async (announcementId: string) => {
    try {
      const updated = await api.leaveBuddy(announcementId);
      if (updated) {
        setBuddyAnnouncements((prev) =>
          prev.map((b) => (b.id === announcementId ? updated : b))
        );
      }
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
      const newAnn = await api.createBuddy(data);
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
      const updated = await api.updateUserProfile(updates);
      setCurrentUser(updated);
      loadData();
    } catch (e) {
      console.error("Error updating profile:", e);
    }
  };

  const handleSwitchPersona = async (userId: string) => {
    try {
      const target = await api.switchUser(userId);
      if (target) {
        setCurrentUser(target);
        loadData();
      }
    } catch (e) {
      console.error("Error switching persona:", e);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative selection:bg-teal-100 selection:text-teal-900">
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
