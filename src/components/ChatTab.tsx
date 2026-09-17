import React, { useState, useEffect, useRef, useMemo } from "react";
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
  const [isSending, setIsSending] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Deduplicate messages by id or identical sender/receiver/text within a close time window
  const dedupedMessages = useMemo(() => {
    const result: ChatMessage[] = [];
    for (const msg of messages) {
      const isDupe = result.some(
        (existing) =>
          (existing.id && msg.id && existing.id === msg.id) ||
          (existing.senderId === msg.senderId &&
            existing.receiverId === msg.receiverId &&
            existing.text.trim() === msg.text.trim() &&
            Boolean(existing.planMeetup) === Boolean(msg.planMeetup) &&
            Math.abs(new Date(existing.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 5000)
      );
      if (!isDupe) {
        result.push(msg);
      }
    }
    return result;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dedupedMessages, activePeer]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || !activePeer || isSending) return;
    setIsSending(true);
    setInputText("");
    try {
      await onSendMessage(activePeer.id, textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const sendIcebreaker = async (text: string) => {
    if (!activePeer || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(activePeer.id, text);
    } finally {
      setIsSending(false);
    }
  };

  const latestPlanMessage = [...dedupedMessages].reverse().find((m) => m.planMeetup);
  const latestPlan = latestPlanMessage?.planMeetup;

  const filteredPeers = peerProfiles.filter((p) =>
    !searchQuery ? true : p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-28 pt-3 px-4 max-w-md mx-auto relative select-none">
      {activePeer ? (
        /* ACTIVE CONVERSATION ROOM */
        <div className="flex flex-col h-[calc(100vh-130px)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 bg-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectPeer(null)}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200/80 flex items-center justify-center transition cursor-pointer active:scale-95"
                aria-label="Back to chats"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative">
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-teal-500 ring-2 ring-white" />
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                  {activePeer.name}
                </h3>
                <p className="text-[11px] text-teal-700 font-semibold">
                  {activePeer.major}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPlanModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer border border-violet-200/70 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-violet-600" />
              <span>Meetup</span>
            </button>
          </div>

          {/* White Message Container Sheet */}
          <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] p-4 flex flex-col overflow-hidden border border-slate-200/80">
            {/* Pinned Plan Banner */}
            {latestPlan && (
              <div className="mb-3 p-3 rounded-2xl bg-violet-50/70 border border-violet-200/70 flex items-center justify-between gap-2 shadow-xs shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-900">
                    <span>📅 {latestPlan.category}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        latestPlan.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : latestPlan.status === "declined"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-violet-100 text-violet-800 font-semibold"
                      }`}
                    >
                      {latestPlan.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate mt-0.5">
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
                      className="px-3 py-1 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold cursor-pointer transition shadow-xs"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onRespondPlan(latestPlan.id, "declined")}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold cursor-pointer transition"
                    >
                      Pass
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {dedupedMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-13 h-13 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-2xl mb-2 border border-teal-100">
                    👋
                  </div>
                  <p className="font-bold text-sm text-slate-800">
                    Say hello to {activePeer.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Free for lunch, coffee, or looking to study?
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {[
                      "Hey! Free for lunch today?",
                      "Want to study in the library?",
                      "Saw you're in my major!",
                    ].map((ice, i) => (
                      <button
                        key={i}
                        disabled={isSending}
                        onClick={() => sendIcebreaker(ice)}
                        className="px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200/60 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        {ice}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                dedupedMessages.map((m) => {
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
                        className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm shadow-xs ${
                          isMe
                            ? "bg-teal-700 text-white rounded-br-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60"
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>
                        <div
                          className={`text-[9px] mt-1 text-right ${
                            isMe ? "text-teal-100" : "text-slate-400"
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
            <form onSubmit={handleSend} className="pt-2.5 flex items-center gap-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setShowPlanModal(true)}
                className="w-9 h-9 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/60 flex items-center justify-center shrink-0 cursor-pointer transition active:scale-95 disabled:opacity-50"
                title="Plan Meetup"
              >
                <Calendar className="w-4 h-4 text-violet-600" />
              </button>

              <input
                type="text"
                value={inputText}
                disabled={isSending}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isSending ? "Sending..." : "Type a message..."}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-75"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer active:scale-95 ${
                  inputText.trim() && !isSending
                    ? "bg-teal-700 hover:bg-teal-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
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
        /* CHATS LIST */
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pt-1 pb-3">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                Messages
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Connected campus friends & active threads
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center transition cursor-pointer">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Stories / Active Tray at top */}
          <div className="mb-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {peerProfiles.map((peer) => (
                <button
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group active:scale-95 transition"
                >
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-teal-500 ring-2 ring-white" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 max-w-[56px] truncate group-hover:text-teal-700 transition">
                    {peer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Clean Card Container for Conversations */}
          <div className="bg-white rounded-3xl p-3.5 shadow-xs border border-slate-200/80 min-h-[480px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
              Recent Chats
            </div>

            <div className="space-y-1.5">
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
                    className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={peer.avatar}
                          alt={peer.name}
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-teal-500 ring-2 ring-white" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-teal-700 transition">
                          {peer.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {last
                            ? `${last.senderId === currentUser.id ? "You: " : ""}${last.text}`
                            : `Hey ${currentUser.name.split(" ")[0]}! Want to grab lunch?`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {last
                          ? new Date(last.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "09:16 AM"}
                      </span>
                      {unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
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
