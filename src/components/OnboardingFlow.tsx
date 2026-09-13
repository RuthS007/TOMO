import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Calendar,
  GraduationCap,
  BookOpen,
  Heart,
  Sparkles,
  Camera,
  Plus,
} from "lucide-react";
import { AcademicYear, UserProfile } from "../types";
import { Logo } from "./Logo";

interface OnboardingFlowProps {
  initialEmail: string;
  onComplete: (profile: UserProfile) => void;
}

const COMMON_MAJORS = [
  "Computer Science",
  "Business Administration",
  "Biology / Pre-Med",
  "Mechanical Engineering",
  "Psychology",
  "History",
  "Art & Design",
  "Economics",
  "Data Science",
  "Nursing",
  "Communications",
  "English Literature",
];

const INTEREST_CATEGORIES = [
  {
    category: "Study & Academic",
    items: ["Coding", "History", "Pre-Med", "Hackathons", "Quiet Study", "Reading", "Debate", "Startups"],
  },
  {
    category: "Food & Drinks",
    items: ["Coffee", "Boba", "Tacos", "Ramen", "Cooking", "Matcha", "Healthy Food"],
  },
  {
    category: "Activities & Sports",
    items: ["Gym & Fitness", "Basketball", "Hiking", "Cycling", "Yoga", "Running", "Pickleball"],
  },
  {
    category: "Hobbies & Creative",
    items: ["Gaming", "Photography", "Anime", "Music", "Board Games", "UI/UX", "Art", "Film"],
  },
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialEmail,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [name, setName] = useState("Riley Davis");
  const [nickname, setNickname] = useState("Riley");
  const [age, setAge] = useState<number>(20);
  const [year, setYear] = useState<AcademicYear>("Junior");
  const [major, setMajor] = useState<string>("Computer Science");
  const [customMajor, setCustomMajor] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([
    "Coding",
    "Coffee",
    "Gaming",
    "History",
    "Boba",
  ]);
  const [customInterestInput, setCustomInterestInput] = useState<string>("");
  const [bio, setBio] = useState<string>(
    "Looking to connect with study partners, lunch buddies, and explore campus events!"
  );
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[0]);
  const [campus, setCampus] = useState<string>("North Quad");

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (
      customInterestInput.trim() &&
      !interests.includes(customInterestInput.trim())
    ) {
      setInterests([...interests, customInterestInput.trim()]);
      setCustomInterestInput("");
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete profile
      const chosenMajor = customMajor.trim() ? customMajor.trim() : major;
      const finalProfile: UserProfile = {
        id: "current-user",
        email: initialEmail,
        name: name.trim() || "Campus Student",
        nickname: nickname.trim() || name.split(" ")[0] || "Buddy",
        age: age || 20,
        year,
        major: chosenMajor,
        interests: interests.length > 0 ? interests : ["Coffee", "Study"],
        bio: bio.trim(),
        avatar,
        campus,
        classes: [chosenMajor.substring(0, 3).toUpperCase() + " 201"],
        lookingFor: ["Study buddies", "Lunch buddies", "Activities buddies"],
      };
      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return name.trim().length > 1;
    if (step === 2) return age >= 16 && age <= 40;
    if (step === 3) return Boolean(year);
    if (step === 4) return Boolean(major || customMajor.trim());
    if (step === 5) return interests.length >= 2;
    return true;
  };

  return (
    <div className="min-h-screen w-full bg-[#131037] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background glow ambient effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Progress */}
      <div className="relative max-w-xl w-full mx-auto z-10 pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-display font-semibold text-sm text-slate-300">
              Profile Setup
            </span>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-teal-300 backdrop-blur-md">
            Step {step} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Center Area - Each in its own screen */}
      <div className="relative max-w-xl w-full mx-auto my-auto z-10 py-6">
        {/* SCREEN 1: NAME */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
              What is your name?
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Let your campus peers know how to address you.
            </p>

            <div className="space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  id="onboarding-fullname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/15 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium text-base"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nickname / Preferred Name
                </label>
                <input
                  id="onboarding-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-3.5 bg-slate-900/80 border border-white/15 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: AGE */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
              How old are you?
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Helps connect you with peers at similar campus stages.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6">
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setAge(Math.max(16, age - 1))}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <div className="w-28 py-3 bg-slate-900/90 border border-teal-400/40 rounded-3xl text-4xl font-bold font-display text-teal-300 shadow-inner">
                  {age}
                </div>
                <button
                  type="button"
                  onClick={() => setAge(Math.min(45, age + 1))}
                  className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xl flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Quick age pill options */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[18, 19, 20, 21, 22, 23, 24].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      age === a
                        ? "bg-teal-400 text-slate-950 shadow-md shadow-teal-400/30"
                        : "bg-white/10 hover:bg-white/15 text-slate-300"
                    }`}
                  >
                    {a} yrs
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: YEAR */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
              What year are you in?
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Select your current academic standing.
            </p>

            <div className="space-y-3">
              {(
                [
                  { value: "Freshman", desc: "1st Year • Discovering campus & core classes" },
                  { value: "Sophomore", desc: "2nd Year • Declaring majors & foundational study" },
                  { value: "Junior", desc: "3rd Year • Upper division coursework & internships" },
                  { value: "Senior", desc: "4th Year • Capstones, projects & graduation prep" },
                  { value: "Graduate", desc: "Masters / PhD • Specialized research & studies" },
                ] as const
              ).map((item) => {
                const isSelected = year === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setYear(item.value)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600/30 to-teal-500/20 border-teal-400 shadow-md shadow-teal-500/10"
                        : "bg-white/5 hover:bg-white/10 border-white/10"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-base text-white">{item.value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                        isSelected
                          ? "bg-teal-400 border-teal-400 text-slate-950"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 4: MAJOR */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
              What is your major?
            </h2>
            <p className="text-sm text-slate-300 mb-4">
              Connect with classmates taking the same courses and exam preps.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl space-y-4">
              {/* Popular Majors Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {COMMON_MAJORS.map((m) => {
                  const isSelected = major === m && !customMajor.trim();
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMajor(m);
                        setCustomMajor("");
                      }}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-teal-400 text-slate-950 border-teal-300 font-bold"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200"
                      }`}
                    >
                      <span className="truncate">{m}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>

              {/* Or enter custom major */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Or enter your specific major
                </label>
                <input
                  id="onboarding-custom-major"
                  type="text"
                  value={customMajor}
                  onChange={(e) => setCustomMajor(e.target.value)}
                  placeholder="e.g. Cognitive Science, Film Production..."
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 5: PERSONAL INTERESTS */}
        {step === 5 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Personal Interests
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                {interests.length} selected
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Pick at least 2 interests. We use these to calculate your compatibility score!
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl max-h-[340px] overflow-y-auto space-y-4">
              {INTEREST_CATEGORIES.map((cat) => (
                <div key={cat.category}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {cat.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => {
                      const isSelected = interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleInterest(item)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-gradient-to-r from-purple-500 to-teal-400 text-slate-950 font-bold border-teal-300 shadow-sm"
                              : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-200"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Add custom interest tag */}
              <div className="pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomInterest()}
                  placeholder="Add custom interest (e.g. Chess, K-Pop)..."
                  className="flex-1 px-3.5 py-2 bg-slate-900/80 border border-white/15 text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="px-3 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 6: PHOTO & QUICK BIO */}
        {step === 6 && (
          <div className="animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
              Photo & Quick Bio
            </h2>
            <p className="text-sm text-slate-300 mb-4">
              Final touch! Choose an avatar and tell others about your vibe.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-5">
              {/* Avatar selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {AVATAR_PRESETS.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(imgUrl)}
                      className={`relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                        avatar === imgUrl
                          ? "border-teal-400 scale-105 ring-4 ring-teal-400/20"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Preset ${i}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Short Bio / About You
                </label>
                <textarea
                  id="onboarding-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share what you like doing, what classes you're in, or what buddies you seek..."
                  className="w-full px-4 py-3 bg-slate-900/80 border border-white/15 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm resize-none"
                />
              </div>

              {/* Campus location preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Primary Campus Quad / Location
                </label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/15 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="North Quad">North Quad & Engineering</option>
                  <option value="Central Campus">Central Campus & Library</option>
                  <option value="South Campus">South Campus & Arts</option>
                  <option value="East Dorms">East Dorms & Recreation Center</option>
                  <option value="Off-Campus">Off-Campus / Commuter</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="relative max-w-xl w-full mx-auto z-10 pt-4 flex items-center justify-between gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          id="onboarding-next-btn"
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide uppercase flex items-center gap-2 transition cursor-pointer shadow-lg ${
            isStepValid()
              ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 text-white shadow-purple-600/30 active:scale-98"
              : "bg-white/10 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>{step === totalSteps ? "Finish & Launch Home" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
