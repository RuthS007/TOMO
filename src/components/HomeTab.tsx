import React, { useState } from "react";
import {
  SlidersHorizontal,
  Search,
  MessageCircle,
  Calendar,
  Sparkles,
  GraduationCap,
  MapPin,
  Check,
  X,
  ChevronRight,
  BookOpen,
  Coffee,
} from "lucide-react";
import { FilterOptions, PeerProfile, UserProfile } from "../types";
import { Logo } from "./Logo";
import { PlanMeetupModal } from "./PlanMeetupModal";

interface HomeTabProps {
  currentUser: UserProfile;
  profiles: PeerProfile[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onStartChat: (peer: PeerProfile) => void;
  onProposePlan: (peer: PeerProfile, plan: any) => void;
}

const MAJORS_LIST = [
  "All",
  "Computer Science",
  "Biology",
  "Business",
  "History",
  "Art & Design",
  "Mechanical Engineering",
  "Psychology",
];

const YEARS_LIST = ["All", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

const POPULAR_INTERESTS = [
  "All",
  "Coding",
  "Coffee",
  "Gaming",
  "History",
  "Boba",
  "Pre-Med",
  "Gym & Fitness",
  "Basketball",
  "Photography",
];

export const HomeTab: React.FC<HomeTabProps> = ({
  currentUser,
  profiles,
  filters,
  onFilterChange,
  onStartChat,
  onProposePlan,
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPeerForProfile, setSelectedPeerForProfile] = useState<PeerProfile | null>(
    null
  );
  const [selectedPeerForPlan, setSelectedPeerForPlan] = useState<PeerProfile | null>(null);

  // Local filter draft
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const activeFilterCount =
    (filters.selectedMajor !== "All" ? 1 : 0) +
    (filters.selectedYear !== "All" ? 1 : 0) +
    (filters.minCompatibility > 0 ? 1 : 0) +
    (filters.selectedInterests.length > 0 ? 1 : 0);

  const applyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    const clean: FilterOptions = {
      selectedMajor: "All",
      selectedYear: "All",
      minCompatibility: 0,
      selectedInterests: [],
      searchQuery: "",
    };
    setTempFilters(clean);
    onFilterChange(clean);
  };

  return (
    <div className="min-h-screen bg-[#110f2e] text-slate-100 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <Logo size="md" showText={true} />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Button at top right corner as requested */}
          <button
            id="home-filter-btn"
            onClick={() => {
              setTempFilters(filters);
              setShowFilterModal(true);
            }}
            className={`relative p-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              activeFilterCount > 0
                ? "bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md shadow-teal-500/20"
                : "bg-white/10 hover:bg-white/15 border-white/15 text-slate-200"
            }`}
            aria-label="Filter campus matches"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-950 text-teal-300 text-[11px] font-bold flex items-center justify-center ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Greeting & Compatibility banner */}
      <div className="relative mb-5 p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-teal-900/20 border border-white/10 backdrop-blur-md overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="text-xs text-teal-300 font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Match Engine Active</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display">
              Welcome, {currentUser.nickname || currentUser.name.split(" ")[0]}!
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Peers automatically ranked by compatibility with your {currentUser.major} major & interests.
            </p>
          </div>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-teal-400 shrink-0"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id="home-search-input"
          type="text"
          value={filters.searchQuery}
          onChange={(e) =>
            onFilterChange({ ...filters, searchQuery: e.target.value })
          }
          placeholder="Search by peer name, major, class or interest..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Match Results Count & Filter summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span>
          Showing <strong className="text-white">{profiles.length}</strong> compatible peers
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-teal-400 hover:text-teal-300 font-semibold cursor-pointer"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Peer Cards Feed */}
      <div className="space-y-3.5">
        {profiles.length === 0 ? (
          <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl p-6">
            <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-white text-sm">No student peers matched your filters</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Try adjusting your minimum compatibility score or selecting all majors.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          profiles.map((peer) => {
            const compScore = peer.compatibility?.score ?? 75;
            // Color grade for compatibility
            const isVeryHigh = compScore >= 85;
            const isHigh = compScore >= 70;

            return (
              <div
                key={peer.id}
                className="group relative bg-[#18153d]/90 hover:bg-[#1f1b4c] border border-white/10 hover:border-teal-400/40 rounded-3xl p-4 sm:p-5 transition-all duration-200 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Avatar & Basic Info */}
                  <div
                    className="flex items-start gap-3.5 cursor-pointer flex-1"
                    onClick={() => setSelectedPeerForProfile(peer)}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-teal-400 transition"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#18153d]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-base text-white truncate group-hover:text-teal-300 transition">
                          {peer.name}
                        </h3>
                        <span className="text-xs text-slate-400 shrink-0">
                          {peer.age} yrs
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5 flex-wrap">
                        <span className="font-semibold text-teal-300">{peer.major}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-medium text-slate-200">
                          {peer.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{peer.campus || "Main Campus"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Level Display */}
                  <div className="shrink-0 text-right">
                    <div
                      className={`inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl border ${
                        isVeryHigh
                          ? "bg-gradient-to-br from-teal-500/25 to-emerald-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/10"
                          : isHigh
                          ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300"
                          : "bg-white/5 border-white/10 text-slate-300"
                      }`}
                    >
                      <div className="text-base font-extrabold font-display leading-none">
                        {compScore}%
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5 text-slate-400">
                        Match
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compatibility Breakdown statement */}
                {peer.compatibility?.summary && (
                  <div className="mt-3 py-1.5 px-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-teal-400 shrink-0" />
                    <span className="truncate">{peer.compatibility.summary}</span>
                  </div>
                )}

                {/* Bio teaser */}
                <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                  {peer.bio}
                </p>

                {/* Interests chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {peer.interests.slice(0, 4).map((interest) => {
                    const isShared = currentUser.interests.some(
                      (ci) => ci.toLowerCase() === interest.toLowerCase()
                    );
                    return (
                      <span
                        key={interest}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                          isShared
                            ? "bg-teal-400/20 text-teal-300 border border-teal-400/30 font-semibold"
                            : "bg-white/5 text-slate-300"
                        }`}
                      >
                        {isShared && "★ "}
                        {interest}
                      </span>
                    );
                  })}
                  {peer.interests.length > 4 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-slate-400">
                      +{peer.interests.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons: View Profile, Chat, Plan Meetup */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPeerForProfile(peer)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPeerForPlan(peer)}
                      className="px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Plan Meetup</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartChat(peer)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-400/20 transition cursor-pointer active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FILTER MODAL (triggered by top right filter button) */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#18153d] border border-white/15 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-teal-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Filter Campus Peers
                </h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Filter by Major */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Academic Major
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MAJORS_LIST.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTempFilters({ ...tempFilters, selectedMajor: m })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition cursor-pointer ${
                        tempFilters.selectedMajor === m
                          ? "bg-teal-400 text-slate-950 border-teal-300 font-bold"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter by Academic Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Academic Standing / Year
                </label>
                <div className="flex flex-wrap gap-2">
                  {YEARS_LIST.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setTempFilters({ ...tempFilters, selectedYear: y })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        tempFilters.selectedYear === y
                          ? "bg-teal-400 text-slate-950 border-teal-300 font-bold"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Compatibility Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Minimum Compatibility Score
                  </label>
                  <span className="text-xs font-bold text-teal-300 px-2 py-0.5 rounded-md bg-teal-400/20">
                    {tempFilters.minCompatibility > 0
                      ? `${tempFilters.minCompatibility}%+`
                      : "Any Score"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={tempFilters.minCompatibility}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      minCompatibility: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>90%</span>
                </div>
              </div>

              {/* Filter by specific interest tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Filter by Specific Interest
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_INTERESTS.map((interest) => {
                    const isSelected =
                      interest === "All"
                        ? tempFilters.selectedInterests.length === 0
                        : tempFilters.selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          if (interest === "All") {
                            setTempFilters({ ...tempFilters, selectedInterests: [] });
                          } else {
                            const exists = tempFilters.selectedInterests.includes(interest);
                            const next = exists
                              ? tempFilters.selectedInterests.filter((i) => i !== interest)
                              : [...tempFilters.selectedInterests, interest];
                            setTempFilters({ ...tempFilters, selectedInterests: next });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-400 font-bold"
                            : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={applyFilters}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-teal-400/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PROFILE DETAIL MODAL */}
      {selectedPeerForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#18153d] border border-white/15 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPeerForProfile(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-white/10">
              <img
                src={selectedPeerForProfile.avatar}
                alt={selectedPeerForProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-teal-400/50 shadow-xl shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-display font-bold text-xl text-white">
                    {selectedPeerForProfile.name}
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-semibold">
                    {selectedPeerForProfile.age} yrs
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {selectedPeerForProfile.major} • {selectedPeerForProfile.year}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedPeerForProfile.campus || "Main Campus"}</span>
                </div>
              </div>
            </div>

            {/* Compatibility Level Score Box */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-teal-900/30 border border-teal-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Compatibility Level
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    {selectedPeerForProfile.compatibility?.summary}
                  </div>
                </div>
                <div className="text-2xl font-extrabold font-display text-teal-300 px-3 py-1 bg-teal-400/10 rounded-xl border border-teal-400/20">
                  {selectedPeerForProfile.compatibility?.score ?? 80}%
                </div>
              </div>
            </div>

            {/* About Me / Bio */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                About Me
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                {selectedPeerForProfile.bio}
              </p>
            </div>

            {/* Enrolled Courses */}
            {selectedPeerForProfile.classes && selectedPeerForProfile.classes.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>Classes This Term</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPeerForProfile.classes.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold font-mono"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Personal Interests
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPeerForProfile.interests.map((interest) => {
                  const isShared = currentUser.interests.some(
                    (ci) => ci.toLowerCase() === interest.toLowerCase()
                  );
                  return (
                    <span
                      key={interest}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isShared
                          ? "bg-teal-400 text-slate-950 font-bold shadow-sm"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {isShared && "✓ Mutual: "}
                      {interest}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Looking for */}
            {selectedPeerForProfile.lookingFor && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Looking For
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPeerForProfile.lookingFor.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Primary Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const p = selectedPeerForProfile;
                  setSelectedPeerForProfile(null);
                  setSelectedPeerForPlan(p);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Plan Meetup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = selectedPeerForProfile;
                  setSelectedPeerForProfile(null);
                  onStartChat(p);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-400/25 transition cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Chatting</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEETUP PLAN MODAL */}
      {selectedPeerForPlan && (
        <PlanMeetupModal
          peer={selectedPeerForPlan}
          isOpen={Boolean(selectedPeerForPlan)}
          onClose={() => setSelectedPeerForPlan(null)}
          onSubmitPlan={(plan) => {
            onProposePlan(selectedPeerForPlan, plan);
          }}
        />
      )}
    </div>
  );
};
