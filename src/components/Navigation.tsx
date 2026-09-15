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
          <circle cx="12" cy="12" r="1.5" fill={active ? "#ccfbf1" : "currentColor"} />
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
      {/* Native frosted dock with Teal & Purple Hue accenting */}
      <div className="pointer-events-auto bg-white/92 backdrop-blur-xl border border-slate-200/80 px-3 py-1.5 rounded-full shadow-[0_10px_32px_-4px_rgba(15,23,42,0.12)] flex items-center justify-around max-w-xs w-full gap-1.5">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;

          return (
            <button
              key={t.id}
              id={`nav-tab-${t.id}`}
              onClick={() => onTabChange(t.id)}
              aria-label={t.label}
              className={`relative px-3.5 py-2 rounded-full transition-all duration-200 flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-teal-700 text-white shadow-sm shadow-teal-900/20 font-bold"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {t.icon(isActive)}
                {Boolean(t.badge && t.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-violet-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
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
