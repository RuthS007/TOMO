import React from "react";
import { Sparkles, MessageCircle, Users, User, Compass } from "lucide-react";
import { TabType } from "../types";

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadChatCount?: number;
  newBuddyCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  unreadChatCount = 0,
  newBuddyCount = 0,
}) => {
  const tabs: { id: TabType; label: string; icon: (active: boolean) => React.ReactNode; badge?: number }[] = [
    {
      id: "home",
      label: "Discover",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22v-6a3 3 0 0 1 6 0v6" />
        </svg>
      ),
    },
    {
      id: "buddies",
      label: "Buddies",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      badge: newBuddyCount,
    },
    {
      id: "chat",
      label: "Chats",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <circle cx="12" cy="12" r="1.5" fill={active ? "#bce3fa" : "currentColor"} />
        </svg>
      ),
      badge: unreadChatCount,
    },
    {
      id: "profile",
      label: "Me",
      icon: (active) => (
        <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      {/* Soft mint pill navigation bar styled after the reference screenshot */}
      <div className="pointer-events-auto bg-[#e8f7f1]/92 backdrop-blur-2xl border border-white/80 px-4 py-2 rounded-full shadow-xl shadow-emerald-950/5 flex items-center justify-around max-w-xs w-full gap-2">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;

          return (
            <button
              key={t.id}
              id={`nav-tab-${t.id}`}
              onClick={() => onTabChange(t.id)}
              aria-label={t.label}
              className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isActive
                  ? "bg-[#182635] text-white shadow-md scale-105"
                  : "text-[#62857b] hover:text-[#182635] hover:bg-white/60"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {t.icon(isActive)}
                {Boolean(t.badge && t.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-sky-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#e8f7f1]">
                    {t.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
