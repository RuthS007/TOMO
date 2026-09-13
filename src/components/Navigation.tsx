import React from "react";
import { Home, MessageCircle, Users, User } from "lucide-react";
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
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      badge: unreadChatCount,
    },
    {
      id: "buddies",
      label: "Buddies",
      icon: <Users className="w-5 h-5" />,
      badge: newBuddyCount,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      {/* Floating navigation pill styled after Figma attachment */}
      <div className="pointer-events-auto bg-[#16142e]/95 backdrop-blur-2xl border border-white/15 px-3 py-2 rounded-full shadow-2xl shadow-black/60 flex items-center gap-1 sm:gap-2 max-w-md w-full justify-between">
        {tabs.map((t) => {
          const isActive = currentTab === t.id;

          return (
            <button
              key={t.id}
              id={`nav-tab-${t.id}`}
              onClick={() => onTabChange(t.id)}
              className={`relative flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-full transition-all duration-300 font-medium text-xs sm:text-sm cursor-pointer ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 scale-102"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <div className="relative flex items-center justify-center">
                {t.icon}
                {Boolean(t.badge && t.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#16142e] animate-pulse">
                    {t.badge}
                  </span>
                )}
              </div>

              {/* Show label for active item (like Figma pill) or subtle label on mobile */}
              <span className={`tracking-wide ${isActive ? "block font-bold" : "hidden sm:inline"}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
