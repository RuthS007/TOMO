import React, { useState } from "react";
import {
  Edit3,
  Save,
  X,
  Plus,
  Check,
  MapPin,
  LogOut,
  Repeat,
} from "lucide-react";
import { AcademicYear, PeerProfile, UserProfile } from "../types";
import { Logo } from "./Logo";

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-28 pt-3 px-4 max-w-md mx-auto relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pt-1 pb-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Your public campus profile & preferences
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => {
              setName(currentUser.name);
              setAge(currentUser.age);
              setYear(currentUser.year);
              setMajor(currentUser.major);
              setBio(currentUser.bio);
              setAvatar(currentUser.avatar);
              setInterests([...currentUser.interests]);
              setIsEditing(true);
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition cursor-pointer active:scale-95"
            title="Edit profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {isEditing ? (
        /* EDIT PROFILE */
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-5 shadow-xs space-y-3.5 border border-slate-200/80"
        >
          {/* Avatar selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    avatar === url
                      ? "border-teal-600 ring-2 ring-teal-200 scale-105"
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

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                min="16"
                max="45"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {AVAILABLE_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Major
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Interests
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interests.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200/60 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(item)}
                    className="hover:text-rose-500 cursor-pointer"
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
                placeholder="Add interest tag..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer transition shadow-xs"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-md cursor-pointer transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* VIEW PROFILE */
        <div className="space-y-3.5 pb-8">
          {/* Hero Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 text-center flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-50 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-teal-500 ring-2 ring-white" />
            </div>

            <h2 className="font-display font-extrabold text-xl text-slate-900">
              {currentUser.name}, {currentUser.age}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold mt-0.5">
              <span>{currentUser.major}</span>
              <span>•</span>
              <span>{currentUser.year}</span>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-slate-600 max-w-xs mt-3 leading-relaxed">
                "{currentUser.bio}"
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {currentUser.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200/60 text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Multi-User Switcher */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Repeat className="w-3.5 h-3.5 text-teal-600" />
              <span>Switch Perspective (Demo Personas)</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {peerProfiles.slice(0, 6).map((peer) => (
                <button
                  key={peer.id}
                  onClick={() => onSwitchPersona(peer.id)}
                  className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer active:scale-95 transition"
                >
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-teal-500 transition"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] font-bold text-slate-600 max-w-[50px] truncate group-hover:text-teal-700 transition">
                    {peer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Log Out */}
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          {/* App Brand Footer */}
          <div className="flex flex-col items-center justify-center pt-3 pb-2 opacity-80">
            <Logo size="sm" showText={true} subtitle="College Friends & Study Buddies" />
          </div>
        </div>
      )}
    </div>
  );
};
