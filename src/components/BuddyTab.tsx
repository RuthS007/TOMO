import React, { useState } from "react";
import {
  Plus,
  Users,
  MapPin,
  Clock,
  Check,
  Search,
  X,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { BuddyAnnouncement, BuddyCategory, UserProfile } from "../types";

interface BuddyTabProps {
  currentUser: UserProfile;
  announcements: BuddyAnnouncement[];
  onJoin: (announcementId: string) => void;
  onLeave: (announcementId: string) => void;
  onCreateAnnouncement: (data: {
    category: BuddyCategory;
    title: string;
    description: string;
    targetCount: number;
    location: string;
    meetingTime: string;
    tags: string[];
  }) => void;
  onContactHost: (hostId: string) => void;
}

export const BuddyTab: React.FC<BuddyTabProps> = ({
  currentUser,
  announcements,
  onJoin,
  onLeave,
  onCreateAnnouncement,
  onContactHost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BuddyCategory | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create form state
  const [newCategory, setNewCategory] = useState<BuddyCategory>("study");
  const [newTitle, setNewTitle] = useState("Need 4 people to study history in class b4");
  const [newTargetCount, setNewTargetCount] = useState<number>(4);
  const [newLocation, setNewLocation] = useState("Hall of Letters, Class B4");
  const [newMeetingTime, setNewMeetingTime] = useState("Today at 3:30 PM");

  const categories = [
    {
      id: "all" as const,
      label: "All",
      icon: "✨",
      bg: "bg-white/80 text-slate-800",
      activeBg: "bg-[#182635] text-white",
    },
    {
      id: "lunch" as const,
      label: "Lunch",
      icon: "🥪",
      bg: "bg-amber-100 text-amber-900",
      activeBg: "bg-amber-500 text-white",
    },
    {
      id: "study" as const,
      label: "Study",
      icon: "📚",
      bg: "bg-sky-100 text-sky-900",
      activeBg: "bg-sky-500 text-white",
    },
    {
      id: "activity" as const,
      label: "Activity",
      icon: "🏀",
      bg: "bg-emerald-100 text-emerald-900",
      activeBg: "bg-emerald-500 text-white",
    },
  ];

  const filtered = announcements.filter((b) => {
    const matchCat = selectedCategory === "all" || b.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    onCreateAnnouncement({
      category: newCategory,
      title: newTitle.trim(),
      description: "",
      targetCount: Number(newTargetCount),
      location: newLocation.trim(),
      meetingTime: newMeetingTime.trim() || "Today",
      tags: [newCategory],
    });

    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bce3fa] via-[#d6f2fb] to-[#e4f9f0] text-slate-800 pb-24 pt-3 px-4 max-w-md mx-auto relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <h1 className="font-display font-extrabold text-2xl text-[#17253b] tracking-tight">
          Buddies
        </h1>

        {/* Plus invite button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#182635] hover:bg-black text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Invite</span>
        </button>
      </div>

      {/* 3 Illustrated Category Pills (Lunch, Study, Activity) */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 ${
                isActive ? cat.activeBg : `${cat.bg} hover:opacity-90`
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Announcements List in Clean White Rounded Cards */}
      <div className="space-y-3 pb-8">
        {filtered.length === 0 ? (
          <div className="bg-white/80 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-3xl">🎈</span>
            <h3 className="font-bold text-sm text-slate-800 mt-2">
              No plans yet
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Make the first invite for lunch or study!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 px-4 py-2 rounded-full bg-sky-500 text-white text-xs font-bold"
            >
              Create Invitation
            </button>
          </div>
        ) : (
          filtered.map((ann) => {
            const hasJoined = ann.participants.some((p) => p.id === currentUser.id);
            const isFull = ann.participants.length >= ann.targetCount;
            const icon =
              ann.category === "lunch" ? "🥪" : ann.category === "study" ? "📚" : "🏀";

            return (
              <div
                key={ann.id}
                className="bg-white rounded-[28px] p-4 shadow-md border border-white/80 hover:shadow-lg transition group"
              >
                {/* Host and Category */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={ann.creatorAvatar}
                        alt={ann.creatorName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">
                        {ann.creatorName}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {ann.creatorMajor}
                      </span>
                    </div>
                  </div>

                  <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-base">
                    {icon}
                  </span>
                </div>

                {/* Announcement Headline (e.g. "Need 4 people to study history in class b4") */}
                <h3 className="font-display font-extrabold text-sm text-[#182635] mb-2 leading-snug">
                  {ann.title}
                </h3>

                {/* Pills for Location & Time */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    <span>{ann.location}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>{ann.meetingTime}</span>
                  </span>
                </div>

                {/* Participants Avatars + Join Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center -space-x-2">
                    {ann.participants.map((p) => (
                      <img
                        key={p.id}
                        src={p.avatar}
                        alt={p.name}
                        title={p.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-500 pl-3">
                      {ann.participants.length}/{ann.targetCount}
                    </span>
                  </div>

                  {/* Join / Leave toggle */}
                  {hasJoined ? (
                    <button
                      onClick={() => onLeave(ann.id)}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-100 hover:text-rose-700 transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </button>
                  ) : (
                    <button
                      disabled={isFull}
                      onClick={() => onJoin(ann.id)}
                      className={`px-4 py-1.5 rounded-full font-bold text-xs transition cursor-pointer ${
                        isFull
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                      }`}
                    >
                      {isFull ? "Full" : "+ Join"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE INVITATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-[36px] p-6 shadow-2xl text-slate-800 animate-slideUp">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-4" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">
                New Buddy Invitation
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              {/* Category picker */}
              <div className="flex gap-2">
                {[
                  { id: "study" as const, label: "📚 Study", preset: "Need 4 people to study history in class b4", loc: "Class B4" },
                  { id: "lunch" as const, label: "🥪 Lunch", preset: "Tacos & Boba at Student Center", loc: "Student Center Plaza" },
                  { id: "activity" as const, label: "🏀 Activity", preset: "Pickup Basketball 3v3", loc: "Campus Gym Court 2" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setNewCategory(c.id);
                      setNewTitle(c.preset);
                      setNewLocation(c.loc);
                    }}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                      newCategory === c.id
                        ? "bg-[#182635] text-white border-[#182635]"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Invitation Headline
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Need 4 people to study history in class b4"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Class B4"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newMeetingTime}
                    onChange={(e) => setNewMeetingTime(e.target.value)}
                    placeholder="e.g. Today at 3:30 PM"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Spots Needed
                </label>
                <div className="flex gap-2">
                  {[2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewTargetCount(num)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        newTargetCount === num
                          ? "bg-sky-500 text-white border-sky-500"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#182635] hover:bg-black text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
