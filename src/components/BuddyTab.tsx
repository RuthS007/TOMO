import React, { useState } from "react";
import {
  Utensils,
  BookOpen,
  Trophy,
  Plus,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Search,
  Filter,
  X,
} from "lucide-react";
import { BuddyAnnouncement, BuddyCategory, PeerProfile, UserProfile } from "../types";

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
  // Category filter state: 'all' | 'lunch' | 'study' | 'activity'
  const [selectedCategory, setSelectedCategory] = useState<BuddyCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Announcement Form State
  const [newCategory, setNewCategory] = useState<BuddyCategory>("study");
  const [newTitle, setNewTitle] = useState("Need 4 people to study history in class b4");
  const [newDescription, setNewDescription] = useState(
    "Reviewing midterm practice exams and lecture slides together in class B4."
  );
  const [newTargetCount, setNewTargetCount] = useState<number>(4);
  const [newLocation, setNewLocation] = useState("Hall of Letters, Class B4");
  const [newMeetingTime, setNewMeetingTime] = useState("Today at 3:30 PM");
  const [newTagsInput, setNewTagsInput] = useState("History, Midterms, Class B4");

  const categoriesConfig = [
    {
      id: "all" as const,
      label: "All Buddies",
      icon: <Users className="w-4 h-4" />,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "lunch" as const,
      label: "Lunch Buddies",
      icon: <Utensils className="w-4 h-4" />,
      color: "from-amber-500 to-orange-500",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "study" as const,
      label: "Study Buddies",
      icon: <BookOpen className="w-4 h-4" />,
      color: "from-teal-500 to-cyan-500",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    {
      id: "activity" as const,
      label: "Activities Buddies",
      icon: <Trophy className="w-4 h-4" />,
      color: "from-indigo-500 to-purple-500",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
  ];

  // Filter announcements
  const filtered = announcements.filter((b) => {
    const matchesCat = selectedCategory === "all" || b.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    const tags = newTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onCreateAnnouncement({
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      targetCount: Number(newTargetCount),
      location: newLocation.trim(),
      meetingTime: newMeetingTime.trim() || "Today soon",
      tags: tags.length > 0 ? tags : ["Campus"],
    });

    setShowCreateModal(false);
  };

  const setCategoryQuickPreset = (cat: BuddyCategory) => {
    setNewCategory(cat);
    if (cat === "study") {
      setNewTitle("Need 4 people to study history in class b4");
      setNewLocation("Hall of Letters, Class B4");
      setNewMeetingTime("Today at 3:30 PM");
      setNewTagsInput("History, Midterms, Class B4");
    } else if (cat === "lunch") {
      setNewTitle("Tacos & Boba at Student Center Plaza");
      setNewLocation("Student Union Courtyard Tables");
      setNewMeetingTime("Today at 12:45 PM");
      setNewTagsInput("Tacos, Boba, Food");
    } else if (cat === "activity") {
      setNewTitle("Need 2 more for 3v3 Basketball Pickup");
      setNewLocation("Campus Rec Center Court 2");
      setNewMeetingTime("Tomorrow at 5:00 PM");
      setNewTagsInput("Basketball, Rec, Fitness");
    }
  };

  return (
    <div className="min-h-screen bg-[#110f2e] text-slate-100 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-400/20 text-teal-300 border border-teal-400/30">
              Campus Spotlight
            </span>
          </div>
          <h2 className="font-display font-bold text-xl text-white mt-1">
            Buddy Hub
          </h2>
          <p className="text-xs text-slate-300">
            Join or set up invitations for lunch, study, and campus activities
          </p>
        </div>

        {/* Floating / Prominent Invitation Creation Button */}
        <button
          id="buddy-make-announcement-btn"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-teal-400/20 active:scale-98 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Set Up Invitation</span>
        </button>
      </div>

      {/* 3 Main Function Tabs (Lunch, Study, Activities) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {categoriesConfig.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                isSelected
                  ? "bg-teal-400 text-slate-950 border-teal-300 font-bold shadow-md shadow-teal-400/20 scale-[1.02]"
                  : "bg-[#18153d] hover:bg-[#201c4e] border-white/10 text-slate-300"
              }`}
            >
              {cat.icon}
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and summary bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search announcements (e.g. class b4, tacos, basketball)..."
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl p-6">
            <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-white text-sm">No invitations found in this category</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Be the first to make an announcement and invite others to join!
            </p>
            <button
              onClick={() => {
                if (selectedCategory !== "all") {
                  setCategoryQuickPreset(selectedCategory);
                }
                setShowCreateModal(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold"
            >
              + Create Announcement
            </button>
          </div>
        ) : (
          filtered.map((ann) => {
            const hasJoined = ann.participants.some((p) => p.id === currentUser.id);
            const isFull = ann.participants.length >= ann.targetCount;
            const spotsRemaining = Math.max(0, ann.targetCount - ann.participants.length);

            // Category configuration
            const catBadge =
              ann.category === "lunch"
                ? { label: "🥪 Lunch Buddies", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" }
                : ann.category === "study"
                ? { label: "📚 Study Buddies", color: "bg-teal-500/20 text-teal-300 border-teal-500/30" }
                : { label: "🎯 Activities Buddies", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };

            return (
              <div
                key={ann.id}
                className="bg-[#18153d] border border-white/10 hover:border-teal-400/40 rounded-3xl p-5 shadow-lg transition-all duration-200"
              >
                {/* Host Info & Category Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ann.creatorAvatar}
                      alt={ann.creatorName}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-white">
                          {ann.creatorName}
                        </span>
                        {ann.creatorId === currentUser.id && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-bold">
                            Host
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {ann.creatorMajor} • {ann.creatorYear}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${catBadge.color}`}
                  >
                    {catBadge.label}
                  </span>
                </div>

                {/* Announcement Headline (e.g. "Need 4 people to study history in class b4") */}
                <h3 className="font-display font-bold text-base text-white mb-1.5 leading-snug">
                  {ann.title}
                </h3>

                {ann.description && (
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    {ann.description}
                  </p>
                )}

                {/* Time & Location Pill Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{ann.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{ann.meetingTime}</span>
                  </span>
                </div>

                {/* Tags */}
                {ann.tags && ann.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ann.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 text-slate-400 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Spot Capacity & Joined Participants Stack */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>
                        {ann.participants.length} / {ann.targetCount} Joined
                      </span>
                      {isFull ? (
                        <span className="text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded-md bg-rose-500/20">
                          Group Full
                        </span>
                      ) : (
                        <span className="text-[10px] text-teal-300 font-bold px-2 py-0.5 rounded-md bg-teal-400/20">
                          {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"} left
                        </span>
                      )}
                    </div>

                    {/* Participant Avatars */}
                    <div className="flex items-center -space-x-2 mt-2">
                      {ann.participants.map((p) => (
                        <img
                          key={p.id}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-[#18153d]"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {spotsRemaining > 0 && (
                        <div className="w-7 h-7 rounded-full border border-dashed border-white/30 text-slate-400 text-[10px] font-bold flex items-center justify-center bg-slate-900">
                          +{spotsRemaining}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress meter visual */}
                  <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden shrink-0">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (ann.participants.length / ann.targetCount) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onContactHost(ann.creatorId)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Message Host</span>
                  </button>

                  {/* Join / Leave interactive button */}
                  {hasJoined ? (
                    <button
                      type="button"
                      onClick={() => onLeave(ann.id)}
                      className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-rose-500/20 text-teal-300 hover:text-rose-300 border border-teal-400/40 hover:border-rose-400/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer group"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 group-hover:hidden" />
                      <span className="group-hover:hidden">Joined</span>
                      <span className="hidden group-hover:inline">Leave Group</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => onJoin(ann.id)}
                      className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                        isFull
                          ? "bg-white/10 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 shadow-teal-400/20 active:scale-98"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isFull ? "Full" : "Join Buddy Group"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE ANNOUNCEMENT / INVITATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#18153d] border border-white/15 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Set Up a Buddy Invitation
                </h3>
                <p className="text-xs text-slate-400">
                  Make an announcement for your campus peers to join
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Category Selector with the 3 main functions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Buddy Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "study" as const, label: "📚 Study Buddies" },
                    { id: "lunch" as const, label: "🥪 Lunch Buddies" },
                    { id: "activity" as const, label: "🎯 Activities" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryQuickPreset(cat.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                        newCategory === cat.id
                          ? "bg-teal-400 text-slate-950 border-teal-300 font-bold shadow-md shadow-teal-400/20"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Announcement Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Announcement / Invitation Headline
                </label>
                <input
                  id="announcement-title-input"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Need 4 people to study history in class b4"
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
                  required
                />
              </div>

              {/* Target People Count */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    People Needed (Capacity)
                  </label>
                  <span className="text-xs font-bold text-teal-300">
                    {newTargetCount} people
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewTargetCount(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        newTargetCount === num
                          ? "bg-teal-400 text-slate-950 border-teal-300"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Campus Location / Classroom
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Hall of Letters, Class B4 or Student Union"
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
                  required
                />
              </div>

              {/* Meeting Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Meeting Time
                </label>
                <input
                  type="text"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                  placeholder="e.g. Today at 3:30 PM"
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
                  required
                />
              </div>

              {/* Details & Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Additional Details / Subject (optional)
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What topics are you focusing on? What should people bring?"
                  className="w-full px-4 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="e.g. History, Midterms, Class B4"
                  className="w-full px-4 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* Submit button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-teal-400/25 active:scale-98"
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
