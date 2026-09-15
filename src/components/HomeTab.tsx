import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  MessageCircle,
  MapPin,
  Sparkles,
  BookOpen,
  Coffee,
  Check,
  UserPlus,
  Users,
  Grid,
  List,
  Smile,
  GraduationCap,
} from "lucide-react";
import { FilterOptions, PeerProfile, UserProfile } from "../types";
import { PlanMeetupModal } from "./PlanMeetupModal";
import { Logo } from "./Logo";

interface HomeTabProps {
  currentUser: UserProfile;
  profiles: PeerProfile[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onStartChat: (peer: PeerProfile) => void;
  onProposePlan: (peer: PeerProfile, plan: any) => void;
}

const MAJOR_CHIPS = [
  { label: "All", icon: "✨" },
  { label: "Computer Science", icon: "💻" },
  { label: "Biology", icon: "🌿" },
  { label: "Business", icon: "📈" },
  { label: "Art & Design", icon: "🎨" },
  { label: "Psychology", icon: "🧠" },
  { label: "History", icon: "🏛️" },
];

export const HomeTab: React.FC<HomeTabProps> = ({
  currentUser,
  profiles,
  filters,
  onFilterChange,
  onStartChat,
  onProposePlan,
}) => {
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showConnectCelebration, setShowConnectCelebration] = useState<PeerProfile | null>(null);
  const [selectedPeerForPlan, setSelectedPeerForPlan] = useState<PeerProfile | null>(null);
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  const [connectedPeerIds, setConnectedPeerIds] = useState<Record<string, boolean>>({});

  // Filter draft state
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const activeFilterCount =
    (filters.selectedMajor !== "All" ? 1 : 0) +
    (filters.selectedYear !== "All" ? 1 : 0) +
    (filters.minCompatibility > 0 ? 1 : 0);

  const handleConnect = (peer: PeerProfile) => {
    setConnectedPeerIds((prev) => ({ ...prev, [peer.id]: true }));
    setShowConnectCelebration(peer);
  };

  const handleMajorSelect = (major: string) => {
    onFilterChange({
      ...filters,
      selectedMajor: major,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-28 pt-3 px-4 max-w-md mx-auto relative select-none">
      {/* Top Header - Clean, modern, authentic native mobile feel */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <Logo size="md" showText={true} subtitle="Campus peers & study buddies" />

        <div className="flex items-center gap-2">
          {/* Quick Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-9 h-9 rounded-full shadow-xs flex items-center justify-center transition cursor-pointer border ${
              showSearch || filters.searchQuery
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
            }`}
            title="Search campus peers"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* View Mode Toggle: Vertical Feed vs Compact Grid */}
          <button
            onClick={() => setViewMode(viewMode === "feed" ? "grid" : "feed")}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-xs flex items-center justify-center transition cursor-pointer border border-slate-200/80"
            title={viewMode === "feed" ? "Switch to 2-column grid" : "Switch to vertical feed"}
          >
            {viewMode === "feed" ? (
              <Grid className="w-4 h-4 text-slate-700" />
            ) : (
              <List className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Filter Sheet Button */}
          <button
            id="home-filter-btn"
            onClick={() => {
              setTempFilters(filters);
              setShowFilterSheet(true);
            }}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shadow-xs border ${
              activeFilterCount > 0
                ? "bg-teal-700 text-white border-teal-700"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80"
            }`}
            title="Filter by major, year, or compatibility"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Current User Avatar */}
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-600/20 shadow-xs"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearch && (
        <div className="my-2 animate-fadeIn">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by name, class, or interest..."
              className="w-full pl-10 pr-9 py-2 bg-white rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs border border-slate-200/80"
              autoFocus
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Major Filter Chips (Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
        {MAJOR_CHIPS.map((chip) => {
          const isSelected = filters.selectedMajor === chip.label;
          return (
            <button
              key={chip.label}
              onClick={() => handleMajorSelect(chip.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer shrink-0 shadow-xs border ${
                isSelected
                  ? "bg-teal-700 text-white border-teal-700 shadow-teal-900/10"
                  : "bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200/80"
              }`}
            >
              <span className="text-xs">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Peer Count Indicator - Reassuring & Friendly */}
      <div className="flex items-center justify-between px-1 py-1.5 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-700">
          {profiles.length} campus {profiles.length === 1 ? "buddy" : "buddies"} active nearby
        </span>
        <span className="text-violet-600 font-medium">✨ Real-time campus feed</span>
      </div>

      {/* Main Content Area */}
      {profiles.length === 0 ? (
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-[32px] p-8 text-center shadow-lg border border-white/60">
          <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            🎓
          </div>
          <h3 className="font-display font-bold text-base text-slate-900">
            No peers found with current filters
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try choosing "All" majors or clearing your search to see more campus peers.
          </p>
          <button
            onClick={() =>
              onFilterChange({
                selectedMajor: "All",
                selectedYear: "All",
                minCompatibility: 0,
                selectedInterests: [],
                searchQuery: "",
              })
            }
            className="mt-4 px-5 py-2.5 rounded-full bg-[#182635] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-black transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "feed" ? (
        /* =========================================================================
           VERTICAL SCROLLING FEED (Smooth up & down scrolling - No sense of rejection)
           ========================================================================= */
        <div className="flex flex-col space-y-5 pb-6">
          {profiles.map((peer) => {
            const isConnected = Boolean(connectedPeerIds[peer.id]);

            return (
              <div
                key={peer.id}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(15,23,42,0.07)] border border-slate-200/80 transition duration-200 hover:shadow-xl hover:border-slate-300"
              >
                {/* Visual Edge-to-Edge Photo Section */}
                <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Subtle Gradient Scrim for crystal clear readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

                  {/* Top Badges: Compatibility in Violet/Purple + Academic Year */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                    <div className="px-3 py-1 rounded-full bg-violet-950/75 backdrop-blur-md border border-violet-400/40 text-violet-100 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{peer.compatibility?.score ?? 85}% Compatible</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-slate-900/65 backdrop-blur-md text-slate-200 text-[11px] font-semibold border border-white/10">
                      {peer.year}
                    </div>
                  </div>

                  {/* Bottom Text in Photo Overlay: Name & Major */}
                  <div className="absolute bottom-3.5 left-4 right-4 z-10 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/75 backdrop-blur-md text-teal-200 text-[11px] font-medium mb-1 border border-teal-500/30">
                      <MapPin className="w-3 h-3 text-teal-300" />
                      <span>{peer.campus || "Main Quad"}</span>
                      <span className="opacity-60">•</span>
                      <span>{peer.major}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h2 className="font-display font-extrabold text-2xl tracking-tight drop-shadow-sm">
                        {peer.name}
                      </h2>
                      <span className="text-lg font-light text-white/90">
                        {peer.age}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 space-y-3">
                  {/* Bio */}
                  {peer.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      "{peer.bio}"
                    </p>
                  )}

                  {/* Shared Classes or Campus Activities */}
                  {peer.classes && peer.classes.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-semibold text-slate-700">Classes:</span>
                      <span className="truncate">{peer.classes.join(", ")}</span>
                    </div>
                  )}

                  {/* Interest Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {peer.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-[11px] font-medium transition"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Clean Action Buttons (Teal primary + Purple accent) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Say Hi / Wave Button */}
                    <button
                      onClick={() => handleConnect(peer)}
                      className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-[0.98] ${
                        isConnected
                          ? "bg-emerald-600 text-white"
                          : "bg-teal-700 hover:bg-teal-800 text-white shadow-teal-900/10"
                      }`}
                    >
                      <span className="text-sm">👋</span>
                      <span>{isConnected ? "Connected" : "Say Hi"}</span>
                    </button>

                    {/* Plan Meetup with Purple Hue */}
                    <button
                      onClick={() => setSelectedPeerForPlan(peer)}
                      className="py-2.5 px-3.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-violet-200/70 active:scale-[0.98]"
                      title="Invite for study session or coffee"
                    >
                      <Calendar className="w-3.5 h-3.5 text-violet-600" />
                      <span>Meetup</span>
                    </button>

                    {/* Chat Direct */}
                    <button
                      onClick={() => onStartChat(peer)}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0 active:scale-[0.95]"
                      title="Open message chat"
                    >
                      <MessageCircle className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================================
           COMPACT GRID VIEW (2-Column Visual Browsing)
           ========================================================================= */
        <div className="grid grid-cols-2 gap-3 pb-8">
          {profiles.map((peer) => (
            <div
              key={peer.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative aspect-[4/4.5] bg-slate-900 overflow-hidden">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-violet-950/75 backdrop-blur-md text-violet-100 text-[10px] font-bold border border-violet-400/30">
                  {peer.compatibility?.score ?? 80}%
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="font-display font-bold text-sm truncate">
                    {peer.name}, {peer.age}
                  </div>
                  <div className="text-[10px] text-teal-200 truncate">
                    {peer.major}
                  </div>
                </div>
              </div>

              {/* Clean compact action buttons */}
              <div className="p-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => handleConnect(peer)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <span>👋</span>
                  <span>Hi</span>
                </button>
                <button
                  onClick={() => onStartChat(peer)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Chat"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "CONNECTED!" FRIENDSHIP CELEBRATION MODAL */}
      {showConnectCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          {/* Close button at top left */}
          <button
            onClick={() => setShowConnectCelebration(null)}
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center">
            {/* Dual Tilted Polaroid Cards with Friendship Badge */}
            <div className="relative w-64 h-48 flex items-center justify-center mb-5">
              {/* Left card: Current User */}
              <div className="absolute left-6 top-0 w-28 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform -rotate-8 bg-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right card: Peer */}
              <div className="absolute right-6 top-2 w-28 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-8 bg-slate-200">
                <img
                  src={showConnectCelebration.avatar}
                  alt={showConnectCelebration.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Friendship Floating Badge */}
              <div className="relative z-20 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center ring-4 ring-teal-100 text-xl">
                <span>👋</span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              You're Connected!
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-[260px] leading-relaxed">
              You and {showConnectCelebration.name.split(" ")[0]} are campus peers with {showConnectCelebration.compatibility?.score ?? 88}% shared vibes!
            </p>

            {/* Action Options: Say Hi in Chat or Schedule Meetup */}
            <div className="mt-6 flex flex-col w-full gap-2">
              <button
                onClick={() => {
                  const p = showConnectCelebration;
                  setShowConnectCelebration(null);
                  onStartChat(p);
                }}
                className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Say Hello to {showConnectCelebration.name.split(" ")[0]}</span>
              </button>

              <button
                onClick={() => {
                  const p = showConnectCelebration;
                  setShowConnectCelebration(null);
                  setSelectedPeerForPlan(p);
                }}
                className="w-full py-3 rounded-2xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>Plan Study / Lunch Hangout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER BOTTOM SHEET - Clean & Minimal */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-[36px] p-6 shadow-2xl text-slate-800 animate-slideUp">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Filter Campus Buddies
                </h3>
                <p className="text-[11px] text-slate-500">
                  Find peers by academic focus & standing
                </p>
              </div>
              <button
                onClick={() => setShowFilterSheet(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Major Filter */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Major
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {MAJOR_CHIPS.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setTempFilters({ ...tempFilters, selectedMajor: m.label })}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                      tempFilters.selectedMajor === m.label
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standing / Academic Year */}
            <div className="mb-5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Academic Year
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTempFilters({ ...tempFilters, selectedYear: yr })}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                      tempFilters.selectedYear === yr
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply / Reset Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const reset: FilterOptions = {
                    selectedMajor: "All",
                    selectedYear: "All",
                    minCompatibility: 0,
                    selectedInterests: [],
                    searchQuery: "",
                  };
                  setTempFilters(reset);
                  onFilterChange(reset);
                  setShowFilterSheet(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => {
                  onFilterChange(tempFilters);
                  setShowFilterSheet(false);
                }}
                className="flex-2 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md cursor-pointer transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN MEETUP MODAL */}
      {selectedPeerForPlan && (
        <PlanMeetupModal
          peer={selectedPeerForPlan}
          isOpen={Boolean(selectedPeerForPlan)}
          onClose={() => setSelectedPeerForPlan(null)}
          onSubmitPlan={(plan) => {
            onProposePlan(selectedPeerForPlan, plan);
            setSelectedPeerForPlan(null);
          }}
        />
      )}
    </div>
  );
};
