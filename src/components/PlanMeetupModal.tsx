import React, { useState } from "react";
import { X, Calendar, MapPin, Clock, FileText, CheckCircle2, Sparkles } from "lucide-react";
import { BuddyCategory, PeerProfile } from "../types";

interface PlanMeetupModalProps {
  peer: PeerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPlan: (plan: {
    title: string;
    category: BuddyCategory | "general";
    location: string;
    dateTime: string;
    notes?: string;
  }) => void;
}

const CAMPUS_LOCATIONS = [
  "Hall of Letters, Class B4",
  "Main Library Cafe, 1st Floor",
  "Grainger Library, 4th Floor Silent Zone",
  "Student Union Courtyard Tables",
  "Campus Rec Center, Court 2",
  "North Quad Coffeehouse",
  "Green Table Organic Eatery",
];

export const PlanMeetupModal: React.FC<PlanMeetupModalProps> = ({
  peer,
  isOpen,
  onClose,
  onSubmitPlan,
}) => {
  const [title, setTitle] = useState(`Meetup with ${peer.nickname || peer.name}`);
  const [category, setCategory] = useState<BuddyCategory | "general">("study");
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState("");
  const [dateTime, setDateTime] = useState("Today at 3:30 PM");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = customLocation.trim() || location;
    onSubmitPlan({
      title: title.trim() || `Meetup with ${peer.name}`,
      category,
      location: finalLocation,
      dateTime: dateTime.trim(),
      notes: notes.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#18153d] border border-white/15 rounded-3xl p-6 shadow-2xl text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-teal-400"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Set Up Plans to Meet Up
              </h3>
              <p className="text-xs text-slate-300">
                Planning meetup with {peer.name} ({peer.major})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-14 h-14 text-teal-400 mb-3 animate-bounce" />
            <h4 className="font-bold text-lg text-white">Meetup Plan Sent!</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              {peer.nickname || peer.name} will receive your invitation in chat with the details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Meetup Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "study", label: "📚 Study" },
                  { id: "lunch", label: "🥪 Lunch" },
                  { id: "activity", label: "🎯 Activity" },
                  { id: "general", label: "☕ Coffee" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as BuddyCategory | "general")}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition cursor-pointer text-center ${
                      category === item.id
                        ? "bg-teal-400 text-slate-950 border-teal-300 font-bold"
                        : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Plan Title
              </label>
              <div className="relative flex items-center">
                <Sparkles className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. History Midterm Review / Lunch Break"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Meeting Location
              </label>
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (e.target.value !== "custom") setCustomLocation("");
                    }}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-slate-900 text-white">
                        {loc}
                      </option>
                    ))}
                    <option value="custom" className="bg-slate-900 text-white">
                      + Custom spot...
                    </option>
                  </select>
                </div>

                {location === "custom" && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter specific classroom, dorm lounge, or cafe..."
                    className="w-full px-3 py-2 bg-slate-900/80 border border-teal-400/40 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                    autoFocus
                  />
                )}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date & Time
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g. Today at 3:30 PM or Tomorrow at 12:00 PM"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-white/15 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Notes / What to bring (optional)
              </label>
              <div className="relative">
                <FileText className="absolute top-2.5 left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. I have the chapter 4 slides and practice questions ready!"
                  className="w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-400 hover:from-purple-500 hover:to-teal-300 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-purple-600/25 active:scale-98 transition cursor-pointer"
              >
                Send Meetup Invitation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
