import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
} from "lucide-react";
import { AcademicYear, UserProfile } from "../types";
import { Logo } from "./Logo";

interface OnboardingFlowProps {
  initialEmail: string;
  onComplete: (profile: UserProfile) => void;
}

const COMMON_MAJORS = [
  { name: "Computer Science", icon: "💻" },
  { name: "Biology", icon: "🌿" },
  { name: "Business", icon: "📈" },
  { name: "Art & Design", icon: "🎨" },
  { name: "Psychology", icon: "🧠" },
  { name: "History", icon: "🏛️" },
  { name: "Mechanical Engineering", icon: "⚙️" },
  { name: "Economics", icon: "📊" },
];

const INTERESTS_PRESETS = [
  { name: "Coding", icon: "💻" },
  { name: "Coffee", icon: "☕" },
  { name: "Boba", icon: "🧋" },
  { name: "Gaming", icon: "🎮" },
  { name: "Gym & Fitness", icon: "🏋️" },
  { name: "Basketball", icon: "🏀" },
  { name: "Photography", icon: "📸" },
  { name: "Music", icon: "🎵" },
  { name: "Tacos", icon: "🌮" },
  { name: "History", icon: "📚" },
  { name: "Quiet Study", icon: "🤫" },
  { name: "Hiking", icon: "🌲" },
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
  const [age, setAge] = useState<number>(20);
  const [year, setYear] = useState<AcademicYear>("Junior");
  const [major, setMajor] = useState<string>("Computer Science");
  const [interests, setInterests] = useState<string[]>([
    "Coding",
    "Coffee",
    "Gaming",
    "Boba",
  ]);
  const [customInterest, setCustomInterest] = useState("");
  const [bio, setBio] = useState<string>(
    "Looking for coffee breaks, coding study buddies, and campus events!"
  );
  const [avatar, setAvatar] = useState<string>(AVATAR_PRESETS[0]);

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const addCustom = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const finalProfile: UserProfile = {
        id: "current-user",
        email: initialEmail,
        name: name.trim() || "Riley Davis",
        nickname: name.split(" ")[0] || "Riley",
        age: age || 20,
        year,
        major,
        interests: interests.length > 0 ? interests : ["Coffee", "Study"],
        bio: bio.trim(),
        avatar,
        campus: "North Quad",
        classes: [major.substring(0, 3).toUpperCase() + " 201"],
        lookingFor: ["Study buddies", "Lunch buddies"],
      };
      onComplete(finalProfile);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header & Progress */}
      <div className="max-w-md w-full mx-auto pt-2">
        <div className="flex items-center justify-between mb-3">
          <Logo size="sm" showText={true} />
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-white text-teal-800 border border-slate-200/80 shadow-xs">
            Step {step} of {totalSteps}
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

      {/* Main Questions */}
      <div className="max-w-md w-full mx-auto my-auto py-4">
        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 animate-fadeIn">
            <span className="text-3xl">👋</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Your name?
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              How campus peers see you
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          </div>
        )}

        {/* STEP 2: AGE */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 text-center animate-fadeIn">
            <span className="text-3xl">🎂</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Your age?
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Connect with peers
            </p>

            <div className="flex items-center justify-center gap-5 my-2">
              <button
                type="button"
                onClick={() => setAge(Math.max(16, age - 1))}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-2xl flex items-center justify-center cursor-pointer transition active:scale-95"
              >
                -
              </button>
              <div className="font-display font-black text-5xl text-slate-900 w-24">
                {age}
              </div>
              <button
                type="button"
                onClick={() => setAge(Math.min(40, age + 1))}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-2xl flex items-center justify-center cursor-pointer transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: YEAR */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 animate-fadeIn">
            <span className="text-3xl">🎓</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Academic Year?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Your campus standing
            </p>

            <div className="space-y-2">
              {[
                { y: "Freshman", icon: "🌱" },
                { y: "Sophomore", icon: "🌿" },
                { y: "Junior", icon: "🌳" },
                { y: "Senior", icon: "🎓" },
                { y: "Graduate", icon: "📜" },
              ].map(({ y, icon }) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y as AcademicYear)}
                  className={`w-full p-3 rounded-2xl border text-left font-bold text-xs flex items-center justify-between transition cursor-pointer ${
                    year === y
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span>{y}</span>
                  </span>
                  {year === y && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: MAJOR */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 animate-fadeIn">
            <span className="text-3xl">📚</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Your Major?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              For course & study matching
            </p>

            <div className="grid grid-cols-2 gap-2">
              {COMMON_MAJORS.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setMajor(m.name)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                    major === m.name
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{m.icon}</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: INTERESTS */}
        {step === 5 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 animate-fadeIn">
            <span className="text-3xl">✨</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Interests?
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pick your favorite campus vibes
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {INTERESTS_PRESETS.map((item) => {
                const isSelected = interests.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                      isSelected
                        ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Add custom interest..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={addCustom}
                className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 rounded-xl text-xs font-bold cursor-pointer transition"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: PHOTO & BIO */}
        {step === 6 && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 animate-fadeIn">
            <span className="text-3xl">📸</span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-2 mb-1">
              Photo & Bio
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pick an avatar and one line
            </p>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3">
              {AVATAR_PRESETS.map((url, i) => (
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

            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What do you like to do on campus?"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-medium"
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between gap-3 pt-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-12 h-12 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center cursor-pointer transition active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex-1 py-3.5 px-6 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
        >
          <span>{step === totalSteps ? "Launch Matches" : "Next"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
