import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  X,
  BookOpen,
  Sparkles,
  Heart,
  GraduationCap,
  User,
  Camera,
  MapPin,
} from "lucide-react";
import { AcademicYear, UserProfile } from "../types";
import { Logo } from "./Logo";

interface OnboardingFlowProps {
  initialEmail: string;
  onComplete: (profile: UserProfile) => void;
  onBackToAuth?: () => void;
}

const COMMON_MAJORS = [
  { name: "Computer Science", icon: "💻" },
  { name: "Biology", icon: "🌿" },
  { name: "Business & Finance", icon: "📈" },
  { name: "Art & Design", icon: "🎨" },
  { name: "Psychology", icon: "🧠" },
  { name: "History", icon: "🏛️" },
  { name: "Mechanical Engineering", icon: "⚙️" },
  { name: "Economics", icon: "📊" },
  { name: "Political Science", icon: "⚖️" },
  { name: "Pre-Med", icon: "🩺" },
  { name: "Communications", icon: "🎙️" },
  { name: "Mathematics", icon: "📐" },
];

const RECOMMENDED_CLASSES_BY_MAJOR: Record<string, string[]> = {
  "Computer Science": ["CS 101", "CS 225", "CS 374", "MATH 257", "STAT 200"],
  "Biology": ["BIO 150", "BIO 202", "CHEM 102", "CHEM 232", "PHYS 101"],
  "Business & Finance": ["ACCY 200", "ECON 102", "FIN 221", "BADM 310"],
  "Art & Design": ["ART 100", "ARTD 218", "DES 202", "ARTH 110"],
  "Psychology": ["PSYC 100", "PSYC 210", "STAT 212", "NEUR 200"],
  "History": ["HIST 100", "HIST 240", "HIST 320", "POLS 100"],
  "Mechanical Engineering": ["ME 200", "TAM 212", "MATH 241", "PHYS 211"],
  "Economics": ["ECON 101", "ECON 202", "ECON 302", "STAT 200"],
  "Political Science": ["POLS 100", "POLS 240", "PHIL 102", "SOC 100"],
  "Pre-Med": ["BIO 150", "CHEM 232", "MCB 250", "PHYS 101"],
};

const CATEGORIZED_INTERESTS: { category: string; items: { name: string; icon: string }[] }[] = [
  {
    category: "Campus & Study",
    items: [
      { name: "Quiet Study", icon: "🤫" },
      { name: "Coding", icon: "💻" },
      { name: "Hackathons", icon: "⚡" },
      { name: "Group Projects", icon: "👥" },
      { name: "Library Runs", icon: "📚" },
      { name: "Research", icon: "🔬" },
    ],
  },
  {
    category: "Food & Drinks",
    items: [
      { name: "Coffee", icon: "☕" },
      { name: "Boba", icon: "🧋" },
      { name: "Tacos", icon: "🌮" },
      { name: "Matcha", icon: "🍵" },
      { name: "Ramen", icon: "🍜" },
      { name: "Late Night Pizza", icon: "🍕" },
    ],
  },
  {
    category: "Sports & Fitness",
    items: [
      { name: "Gym & Fitness", icon: "🏋️" },
      { name: "Basketball", icon: "🏀" },
      { name: "Running", icon: "🏃" },
      { name: "Hiking", icon: "🌲" },
      { name: "Volleyball", icon: "🏐" },
      { name: "Yoga", icon: "🧘" },
    ],
  },
  {
    category: "Creative & Chill",
    items: [
      { name: "Gaming", icon: "🎮" },
      { name: "Photography", icon: "📸" },
      { name: "Music", icon: "🎵" },
      { name: "Anime", icon: "✨" },
      { name: "Board Games", icon: "🎲" },
      { name: "Film & Cinema", icon: "🎬" },
    ],
  },
];

const LOOKING_FOR_OPTIONS = [
  { label: "Study groups & course prep", icon: "📚" },
  { label: "Lunch & boba companions", icon: "🧋" },
  { label: "Gym & workout partners", icon: "🏋️" },
  { label: "Campus events & weekend hangouts", icon: "🎉" },
  { label: "Hackathons & project teammates", icon: "🚀" },
];

const CAMPUS_LOCATIONS = [
  "North Campus / Engineering Quad",
  "Central Campus / Main Quad",
  "South Campus / Fine Arts",
  "West Quad / Residences",
  "Graduate Hall / Research Park",
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
  onBackToAuth,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [name, setName] = useState("Riley Davis");
  const [nickname, setNickname] = useState("Riley");
  const [age, setAge] = useState<number>(20);
  const [year, setYear] = useState<AcademicYear>("Junior");
  const [major, setMajor] = useState<string>("Computer Science");
  const [customMajor, setCustomMajor] = useState("");
  
  // Classes / Courses State
  const [classes, setClasses] = useState<string[]>(["CS 225", "HIST 100", "STAT 200"]);
  const [newClassInput, setNewClassInput] = useState("");

  // Interests State
  const [interests, setInterests] = useState<string[]>([
    "Coding",
    "Coffee",
    "Gaming",
    "Boba",
    "History",
  ]);
  const [customInterest, setCustomInterest] = useState("");

  // Looking For & Campus
  const [lookingFor, setLookingFor] = useState<string[]>([
    "Study groups & course prep",
    "Lunch & boba companions",
  ]);
  const [campus, setCampus] = useState<string>("Central Campus / Main Quad");

  // Profile Bio & Avatar
  const [bio, setBio] = useState<string>(
    "Excited to meet new friends on campus for quick lunch breaks, library focus sessions, and weekend gaming!"
  );
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[0]);

  // Handlers
  const handleToggleClass = (courseCode: string) => {
    const formatted = courseCode.trim().toUpperCase();
    if (!formatted) return;
    if (classes.includes(formatted)) {
      setClasses(classes.filter((c) => c !== formatted));
    } else {
      setClasses([...classes, formatted]);
    }
  };

  const handleAddCustomClass = () => {
    const formatted = newClassInput.trim().toUpperCase();
    if (formatted && !classes.includes(formatted)) {
      setClasses([...classes, formatted]);
      setNewClassInput("");
    }
  };

  const handleToggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterest("");
    }
  };

  const handleToggleLookingFor = (item: string) => {
    if (lookingFor.includes(item)) {
      setLookingFor(lookingFor.filter((l) => l !== item));
    } else {
      setLookingFor([...lookingFor, item]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const activeMajor = customMajor.trim() || major;
      const finalProfile: UserProfile = {
        id: "current-user",
        email: initialEmail || "student@campus.edu",
        name: name.trim() || "Riley Davis",
        nickname: nickname.trim() || name.split(" ")[0] || "Riley",
        age: age || 20,
        year,
        major: activeMajor,
        interests: interests.length > 0 ? interests : ["Coffee", "Study"],
        classes: classes.length > 0 ? classes : [activeMajor.substring(0, 3).toUpperCase() + " 101"],
        lookingFor: lookingFor.length > 0 ? lookingFor : ["Study buddies"],
        campus,
        bio: bio.trim() || "Looking forward to meeting classmates and friends around campus!",
        avatar,
        createdAt: new Date().toISOString(),
      };
      onComplete(finalProfile);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header & Step Progress */}
      <div className="max-w-md w-full mx-auto pt-2">
        <div className="flex items-center justify-between mb-3">
          <Logo size="sm" showText={true} />
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-white text-teal-800 border border-slate-200/80 shadow-xs">
            Question {step} of {totalSteps}
          </div>
        </div>

        {/* Minimal rounded progress bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Cards */}
      <div className="max-w-md w-full mx-auto my-auto py-4">
        {/* STEP 1: NAME & BASIC INFO */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <User className="w-4 h-4" />
              <span>Step 1 • Profile Identity</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              What's your name?
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Let classmates and campus peers know who you are.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="onboarding-full-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!nickname || nickname === name.split(" ")[0]) {
                      setNickname(e.target.value.split(" ")[0]);
                    }
                  }}
                  placeholder="e.g. Riley Davis"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Nickname
                </label>
                <input
                  id="onboarding-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Riley"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age
                </label>
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-xs text-slate-500 font-medium">Age in years</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAge(Math.max(16, age - 1))}
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center justify-center cursor-pointer transition"
                    >
                      -
                    </button>
                    <span className="font-display font-extrabold text-lg text-slate-900 w-6 text-center">
                      {age}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAge(Math.min(45, age + 1))}
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center justify-center cursor-pointer transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: MAJOR & ACADEMIC YEAR */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Step 2 • Academic Details</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              What is your Major & Year?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              We use this to connect you with students in the same department or classes.
            </p>

            {/* Academic Year Selection */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"] as AcademicYear[]).map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYear(y)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      year === y
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Major Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Your Major
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {COMMON_MAJORS.map((m) => {
                  const isSelected = major === m.name && !customMajor;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setMajor(m.name);
                        setCustomMajor("");
                      }}
                      className={`p-2 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                        isSelected
                          ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span className="truncate">{m.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Major Input */}
              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <input
                  id="onboarding-custom-major"
                  type="text"
                  value={customMajor}
                  onChange={(e) => setCustomMajor(e.target.value)}
                  placeholder="Or type a custom major / minor..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CLASSES & COURSES (Explicitly requested by user) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Step 3 • Courses & Classes</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              What classes are you taking?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Connect with classmates taking the same courses for study groups and exam review.
            </p>

            {/* Currently added classes */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Enrolled Classes ({classes.length})
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-2xl">
                {classes.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No classes added yet. Select below or enter course codes.</span>
                ) : (
                  classes.map((cls) => (
                    <span
                      key={cls}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      <span>{cls}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleClass(cls)}
                        className="text-teal-200 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Custom Add Class */}
            <div className="flex gap-2 mb-4">
              <input
                id="onboarding-class-input"
                type="text"
                value={newClassInput}
                onChange={(e) => setNewClassInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomClass()}
                placeholder="e.g. CS 225, HIST 100, BIO 150"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
              />
              <button
                type="button"
                onClick={handleAddCustomClass}
                className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions for Selected Major */}
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Popular suggestions for {customMajor || major}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(RECOMMENDED_CLASSES_BY_MAJOR[customMajor || major] || [
                  "ENG 101",
                  "MATH 115",
                  "COMM 101",
                  "HIST 100",
                ]).map((code) => {
                  const isAdded = classes.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleToggleClass(code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                        isAdded
                          ? "bg-teal-100 text-teal-800 border-teal-300"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isAdded && <Check className="w-3 h-3 text-teal-700" />}
                      <span>{code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PERSONAL INTERESTS (Explicitly requested by user) */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4" />
              <span>Step 4 • Personal Interests & Hobbies</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              What do you love doing?
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Select interests to calculate compatibility with prospective buddies.
            </p>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {CATEGORIZED_INTERESTS.map((cat) => (
                <div key={cat.category}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {cat.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => {
                      const isSelected = interests.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleToggleInterest(item.name)}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                            isSelected
                              ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Interest Input */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <input
                id="onboarding-custom-interest"
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomInterest()}
                placeholder="Add custom hobby (e.g. Ceramics, Chess, Salsa)..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: WHAT ARE YOU LOOKING FOR & CAMPUS */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Step 5 • Campus Goals</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              What are you looking for?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Select all types of meetups and connections you want to make.
            </p>

            <div className="space-y-2 mb-4">
              {LOOKING_FOR_OPTIONS.map((opt) => {
                const isSelected = lookingFor.includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleToggleLookingFor(opt.label)}
                    className={`w-full p-3 rounded-2xl border text-left font-bold text-xs flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Primary Campus Hub / Area</span>
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 6: PHOTO & BIO */}
        {step === 6 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
              <Camera className="w-4 h-4" />
              <span>Step 6 • Photo & Bio</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              Choose your profile avatar
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Select an avatar and write a short hello for prospective classmates.
            </p>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-4">
              {AVATAR_PRESETS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    avatar === url
                      ? "border-teal-600 ring-4 ring-teal-200 scale-105"
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

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quick Campus Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What do you enjoy doing on campus? Any courses you want to study for?"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 7: SUMMARY & ENTER HOME SCREEN */}
        {step === 7 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles className="w-8 h-8 text-teal-700 animate-pulse" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-1">
              You're Ready for Campus!
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Here is your campus card. We've matched you with classmates and study buddies!
            </p>

            {/* Profile summary card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left mb-4 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={avatar}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">
                    {name} ({nickname})
                  </h3>
                  <p className="text-xs text-teal-700 font-bold">
                    {year} • {customMajor || major}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{campus}</span>
                  </p>
                </div>
              </div>

              {/* Classes summary */}
              <div className="mb-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Enrolled Classes
                </span>
                <div className="flex flex-wrap gap-1">
                  {classes.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[10px] font-bold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests summary */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Top Interests
                </span>
                <div className="flex flex-wrap gap-1">
                  {interests.slice(0, 5).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                  {interests.length > 5 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">
                      +{interests.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between gap-3 pt-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center cursor-pointer transition active:scale-95"
            title="Previous question"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : onBackToAuth ? (
          <button
            type="button"
            onClick={onBackToAuth}
            className="px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3.5 px-6 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
        >
          <span>{step === totalSteps ? "Enter Home Screen" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
