import React, { useState } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Plus,
  Check,
  Sparkles,
  BookOpen,
  MapPin,
  Calendar,
  LogOut,
  Repeat,
  Heart,
} from "lucide-react";
import { AcademicYear, PeerProfile, UserProfile } from "../types";

interface ProfileTabProps {
  currentUser: UserProfile;
  peerProfiles: PeerProfile[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSwitchPersona: (userId: string) => void;
  onLogout: () => void;
}

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
];

const AVAILABLE_YEARS: AcademicYear[] = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  peerProfiles,
  onUpdateProfile,
  onSwitchPersona,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit draft state
  const [name, setName] = useState(currentUser.name);
  const [nickname, setNickname] = useState(currentUser.nickname || "");
  const [age, setAge] = useState<number>(currentUser.age);
  const [year, setYear] = useState<AcademicYear>(currentUser.year);
  const [major, setMajor] = useState(currentUser.major);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [interests, setInterests] = useState<string[]>([...currentUser.interests]);
  const [newInterestInput, setNewInterestInput] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || currentUser.name,
      nickname: nickname.trim() || undefined,
      age: Number(age) || currentUser.age,
      year,
      major: major.trim() || currentUser.major,
      bio: bio.trim(),
      avatar,
      interests: interests.length > 0 ? interests : currentUser.interests,
    });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const addInterest = () => {
    if (newInterestInput.trim() && !interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
      setNewInterestInput("");
    }
  };

  return (
    <div className="min-h-screen bg-[#110f2e] text-slate-100 pb-28 pt-4 px-4 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Profile</h2>
          <p className="text-xs text-slate-400">
            Manage your personal info, campus bio, and matchmaking preferences
          </p>
        </div>

        {!isEditing ? (
          <button
            id="profile-edit-btn"
            onClick={() => {
              setName(currentUser.name);
              setNickname(currentUser.nickname || "");
              setAge(currentUser.age);
              setYear(currentUser.year);
              setMajor(currentUser.major);
              setBio(currentUser.bio);
              setAvatar(currentUser.avatar);
              setInterests([...currentUser.interests]);
              setIsEditing(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="mb-4 p-3 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>Profile updated! Matches recalculating in real time.</span>
        </div>
      )}

      {isEditing ? (
        /* EDIT PROFILE MODE */
        <form
          onSubmit={handleSave}
          className="bg-[#18153d] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
        >
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Profile Avatar
            </label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    avatar === url
                      ? "border-teal-400 ring-4 ring-teal-400/20 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt="Preset"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                id="edit-profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nickname
              </label>
              <input
                id="edit-profile-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Age & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                id="edit-profile-age"
                type="number"
                min="16"
                max="45"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {AVAILABLE_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-slate-900 text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Major */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Major
            </label>
            <input
              id="edit-profile-major"
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Personal Bio / About You
            </label>
            <textarea
              id="edit-profile-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              required
            />
          </div>

          {/* Personal Interests Management */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Personal Interests
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {interests.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(item)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                placeholder="Add new interest tag..."
                className="flex-1 px-3 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="profile-save-changes-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-teal-400/20 transition cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* VIEW PROFILE MODE */
        <div className="space-y-4">
          {/* Main Profile Card */}
          <div className="bg-[#18153d] border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-teal-400/60 shadow-xl shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-display font-bold text-xl text-white">
                    {currentUser.name}
                  </h3>
                  {currentUser.nickname && (
                    <span className="text-xs text-slate-400">
                      ("{currentUser.nickname}")
                    </span>
                  )}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-semibold">
                    {currentUser.age} yrs
                  </span>
                </div>

                <div className="text-sm font-semibold text-teal-300 mt-1">
                  {currentUser.major} • {currentUser.year}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.campus || "North Quad"}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Campus Bio
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                {currentUser.bio}
              </p>
            </div>

            {/* Interests */}
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Personal Interests ({currentUser.interests.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                  >
                    ★ {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-User Persona Switcher for Testing */}
          <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
              <Repeat className="w-3.5 h-3.5" />
              <span>Test Live Multi-User Experience</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Switch perspective to another campus student to test real-time chat and buddy invitations from both sides:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {peerProfiles.slice(0, 6).map((peer) => (
                <button
                  key={peer.id}
                  onClick={() => onSwitchPersona(peer.id)}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-teal-400/40 text-left transition cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {peer.nickname || peer.name.split(" ")[0]}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {peer.major}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Log Out */}
          <div className="pt-2">
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
