import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
  Sparkles,
  Coffee,
  BookOpen,
} from "lucide-react";
import { ChatMessage, PeerProfile, UserProfile } from "../types";
import { PlanMeetupModal } from "./PlanMeetupModal";

interface ChatTabProps {
  currentUser: UserProfile;
  peerProfiles: PeerProfile[];
  activePeer: PeerProfile | null;
  onSelectPeer: (peer: PeerProfile | null) => void;
  messages: ChatMessage[];
  onSendMessage: (receiverId: string, text: string) => void;
  onProposePlan: (peer: PeerProfile, plan: any) => void;
  onRespondPlan: (planId: string, status: "accepted" | "declined") => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  currentUser,
  peerProfiles,
  activePeer,
  onSelectPeer,
  messages,
  onSendMessage,
  onProposePlan,
  onRespondPlan,
}) => {
  const [inputText, setInputText] = useState("");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activePeer]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePeer) return;
    onSendMessage(activePeer.id, inputText.trim());
    setInputText("");
  };

  const sendIcebreaker = (text: string) => {
    if (!activePeer) return;
    onSendMessage(activePeer.id, text);
  };

  const latestPlanMessage = [...messages].reverse().find((m) => m.planMeetup);
  const latestPlan = latestPlanMessage?.planMeetup;

  const filteredPeers = peerProfiles.filter((p) =>
    !searchQuery ? true : p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bce3fa] via-[#d6f2fb] to-[#e4f9f0] text-slate-800 pb-24 pt-3 px-4 max-w-md mx-auto relative select-none">
      {activePeer ? (
        /* ACTIVE CONVERSATION ROOM */
        <div className="flex flex-col h-[calc(100vh-120px)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 bg-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectPeer(null)}
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition cursor-pointer"
                aria-label="Back to chats"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-base text-[#182635] leading-tight">
                  {activePeer.name}
                </h3>
                <p className="text-[11px] text-sky-600 font-semibold">
                  {activePeer.major}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlanModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-emerald-700 font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer border border-emerald-200"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Plan</span>
            </button>
          </div>

          {/* White Message Container Sheet */}
          <div className="flex-1 bg-white rounded-3xl shadow-xl p-4 flex flex-col overflow-hidden border border-white/80">
            {/* Pinned Plan Banner (Minimal words & visual badge) */}
            {latestPlan && (
              <div className="mb-3 p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between gap-2 shadow-xs shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                    <span>📅 {latestPlan.category}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.2 rounded-full ${
                        latestPlan.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : latestPlan.status === "declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {latestPlan.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-800 truncate mt-0.5">
                    {latestPlan.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {latestPlan.location} • {latestPlan.dateTime}
                  </div>
                </div>

                {latestPlan.status === "proposed" && latestPlan.proposerId !== currentUser.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onRespondPlan(latestPlan.id, "accepted")}
                      className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onRespondPlan(latestPlan.id, "declined")}
                      className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold cursor-pointer"
                    >
                      Pass
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center text-2xl mb-2">
                    👋
                  </div>
                  <p className="font-bold text-sm text-slate-700">
                    Say hello to {activePeer.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Free for lunch or looking to study?
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {[
                      "Hey! Free for lunch today?",
                      "Want to study in the library?",
                      "Saw you're in my major!",
                    ].map((ice, i) => (
                      <button
                        key={i}
                        onClick={() => sendIcebreaker(ice)}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition cursor-pointer"
                      >
                        {ice}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex items-end gap-2 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={m.senderAvatar}
                          alt={m.senderName}
                          className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isMe
                            ? "bg-[#182635] text-white rounded-br-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs"
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isMe ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 cursor-pointer"
                title="Plan Meetup"
              >
                <Calendar className="w-4 h-4 text-sky-500" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
                  inputText.trim()
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-300"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {showPlanModal && (
            <PlanMeetupModal
              peer={activePeer}
              isOpen={showPlanModal}
              onClose={() => setShowPlanModal(false)}
              onSubmitPlan={(plan) => {
                onProposePlan(activePeer, plan);
                setShowPlanModal(false);
              }}
            />
          )}
        </div>
      ) : (
        /* CHATS LIST (Matching Screen 3 in Reference Image) */
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pt-1 pb-3">
            <h1 className="font-display font-extrabold text-2xl text-[#17253b] tracking-tight">
              Chats
            </h1>

            <div className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition cursor-pointer">
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Stories / Active Tray at top (Matching circular avatars with green online badge in reference screen 3) */}
          <div className="mb-4">
            <div className="flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar">
              {peerProfiles.map((peer) => (
                <button
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-white" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 max-w-[56px] truncate">
                    {peer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* White Bottom Sheet Container for Conversations */}
          <div className="bg-white rounded-t-[36px] p-5 shadow-2xl min-h-[500px] border border-white/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Active
            </div>

            <div className="space-y-3">
              {filteredPeers.map((peer, idx) => {
                const convMsgs = messages.filter(
                  (m) =>
                    (m.senderId === peer.id && m.receiverId === currentUser.id) ||
                    (m.senderId === currentUser.id && m.receiverId === peer.id)
                );
                const last = convMsgs[convMsgs.length - 1];
                const unread = idx === 0 || idx === 1 ? idx + 1 : 0;

                return (
                  <div
                    key={peer.id}
                    onClick={() => onSelectPeer(peer)}
                    className="p-3 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-sky-600 transition">
                          {peer.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {last
                            ? `${last.senderId === currentUser.id ? "You: " : ""}${last.text}`
                            : `Hey ${currentUser.name.split(" ")[0]}! How you doin?`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400">
                        {last
                          ? new Date(last.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "09:16 AM"}
                      </span>
                      {unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
