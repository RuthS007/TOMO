import React, { useState } from "react";
import { X, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
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
  "Main Library Cafe",
  "Student Center Courtyard",
  "Campus Rec Center",
  "North Quad Coffeehouse",
];

export const PlanMeetupModal: React.FC<PlanMeetupModalProps> = ({
  peer,
  isOpen,
  onClose,
  onSubmitPlan,
}) => {
  const [title, setTitle] = useState(`Meet with ${peer.nickname || peer.name.split(" ")[0]}`);
  const [category, setCategory] = useState<BuddyCategory | "general">("study");
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateTime, setDateTime] = useState("Today at 3:30 PM");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submitted) return;
    setIsSubmitting(true);
    setSubmitted(true);
    onSubmitPlan({
      title: title.trim() || `Meet with ${peer.name}`,
      category,
      location,
      dateTime: dateTime.trim(),
    });
    setTimeout(() => {
      setSubmitted(false);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-slate-800 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={peer.avatar}
              alt={peer.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-display font-extrabold text-sm text-slate-900">
                Plan Meetup
              </h3>
              <p className="text-[11px] text-teal-700 font-semibold">
                with {peer.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-teal-600 mb-2 animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">Invite Sent!</h4>
            <p className="text-xs text-slate-500 mt-1">
              {peer.name.split(" ")[0]} has been notified in chat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Category pills */}
            <div className="flex gap-1.5">
              {[
                { id: "study", label: "📚 Study" },
                { id: "lunch", label: "🥪 Lunch" },
                { id: "activity", label: "🏀 Activity" },
                { id: "general", label: "☕ Coffee" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id as any)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    category === item.id
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Plan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study history together"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium appearance-none"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                When
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g. Today at 3:30 PM"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 font-bold text-xs uppercase tracking-wider text-white shadow-md cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending Invite..." : "Send Invite"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
