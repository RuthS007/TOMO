import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  MessageSquarePlus,
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activePeer]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePeer) return;
    onSendMessage(activePeer.id, inputText.trim());
    setInputText("");
  };

  const sendQuickIcebreaker = (promptText: string) => {
    if (!activePeer) return;
    onSendMessage(activePeer.id, promptText);
  };

  // Find any active or latest meetup plan in this conversation
  const latestPlanMessage = [...messages]
    .reverse()
    .find((m) => m.planMeetup);
  const latestPlan = latestPlanMessage?.planMeetup;

  return (
    <div className="min-h-screen bg-[#110f2e] text-slate-100 pb-28 pt-4 px-4 max-w-2xl mx-auto flex flex-col">
      {/* If viewing a specific conversation */}
      {activePeer ? (
        <div className="flex flex-col h-[calc(100vh-140px)]">
          {/* Chat Room Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 bg-[#110f2e]/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectPeer(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 transition cursor-pointer"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative">
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-teal-400"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#110f2e]" />
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  {activePeer.name}
                </h3>
                <p className="text-[11px] text-teal-300">
                  {activePeer.major} • {activePeer.year}
                </p>
              </div>
            </div>

            {/* Plan Meetup Quick Action */}
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/25 hover:bg-indigo-500/35 border border-indigo-400/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plan Meetup</span>
            </button>
          </div>

          {/* PINNED MEETUP PLAN CARD (If one exists in this conversation) */}
          {latestPlan && (
            <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-teal-900/30 border border-teal-400/30 shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-400/20 text-teal-300 border border-teal-400/30">
                      Meetup: {latestPlan.category.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        latestPlan.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : latestPlan.status === "declined"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {latestPlan.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white mt-1 truncate">
                    {latestPlan.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {latestPlan.dateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {latestPlan.location}
                    </span>
                  </div>

                  {latestPlan.notes && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">
                      "{latestPlan.notes}"
                    </p>
                  )}
                </div>

                {/* Accept / Decline controls if proposed by other user and still pending */}
                {latestPlan.status === "proposed" && (
                  <div className="flex flex-col gap-1 shrink-0">
                    {latestPlan.proposerId !== currentUser.id ? (
                      <>
                        <button
                          onClick={() => onRespondPlan(latestPlan.id, "accepted")}
                          className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => onRespondPlan(latestPlan.id, "declined")}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer transition"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Sent to {activePeer.nickname || activePeer.name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Sparkles className="w-10 h-10 text-teal-400 mb-2 opacity-80" />
                <p className="text-sm font-semibold text-white">
                  Start your conversation with {activePeer.name}
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Say hi, discuss classes, or suggest meeting up for study or lunch!
                </p>

                {/* Suggested icebreakers */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md">
                  {[
                    `Hey ${activePeer.nickname || activePeer.name}! Free to grab lunch sometime?`,
                    `Saw you're in ${activePeer.major}! How are your classes going?`,
                    `Want to do a study session together this week?`,
                  ].map((ice, i) => (
                    <button
                      key={i}
                      onClick={() => sendQuickIcebreaker(ice)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs text-left transition cursor-pointer"
                    >
                      "{ice}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-xl object-cover shrink-0 ring-1 ring-white/10"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-md ${
                        isMe
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-[#1c1844] border border-white/10 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {/* Attached Plan inside message */}
                      {msg.planMeetup && (
                        <div className="mb-2 p-2.5 rounded-xl bg-slate-950/40 border border-teal-400/30">
                          <div className="font-bold text-xs text-teal-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Proposed Meetup: {msg.planMeetup.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-1">
                            📍 {msg.planMeetup.location} • ⏰ {msg.planMeetup.dateTime}
                          </div>
                        </div>
                      )}

                      <p className="leading-relaxed">{msg.text}</p>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          isMe ? "text-purple-200/80" : "text-slate-400"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
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

          {/* Icebreaker shortcuts */}
          <div className="py-1 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() =>
                sendQuickIcebreaker("Are you free for lunch at the student center?")
              }
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap text-[11px] transition cursor-pointer"
            >
              🥪 Free for lunch?
            </button>
            <button
              onClick={() =>
                sendQuickIcebreaker("Want to study in the library together?")
              }
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap text-[11px] transition cursor-pointer"
            >
              📚 Study in library?
            </button>
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-2.5 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/30 whitespace-nowrap text-[11px] font-semibold transition cursor-pointer"
            >
              📅 Set up plan to meet up
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPlanModal(true)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 transition cursor-pointer"
              title="Propose Meetup Plan"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activePeer.nickname || activePeer.name}...`}
              className="flex-1 px-4 py-3 bg-[#18153d] border border-white/15 rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-3 rounded-2xl transition cursor-pointer shadow-md ${
                inputText.trim()
                  ? "bg-gradient-to-r from-purple-600 to-teal-400 text-slate-950 shadow-teal-400/20"
                  : "bg-white/10 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Plan Meetup Modal */}
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
        /* CONVERSATIONS LIST */
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-xl text-white">Chats</h2>
              <p className="text-xs text-slate-400">
                Continue chatting with campus peers you have matched with
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time Sync</span>
            </div>
          </div>

          {/* Matched Peers Quick Tray */}
          <div className="mb-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Your Matches Ready to Chat
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {peerProfiles.map((peer) => (
                <button
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-teal-400 transition"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#110f2e]" />
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium max-w-[64px] truncate group-hover:text-teal-300">
                    {peer.nickname || peer.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversations feed */}
          <div className="space-y-2.5">
            {peerProfiles.map((peer) => {
              // Get last message with this peer
              const convMsgs = messages.filter(
                (m) =>
                  (m.senderId === peer.id && m.receiverId === currentUser.id) ||
                  (m.senderId === currentUser.id && m.receiverId === peer.id)
              );
              const last = convMsgs[convMsgs.length - 1];
              const hasPlan = convMsgs.some((m) => m.planMeetup);

              return (
                <div
                  key={peer.id}
                  onClick={() => onSelectPeer(peer)}
                  className="p-3.5 rounded-3xl bg-[#18153d] hover:bg-[#201c4e] border border-white/10 hover:border-teal-400/40 transition flex items-center justify-between gap-3 cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-teal-400 transition"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#18153d]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-teal-300">
                          {peer.name}
                        </h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                          {peer.major}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {last ? last.text : `Start chatting with ${peer.name}`}
                      </p>

                      {hasPlan && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-teal-300 font-semibold">
                          <Calendar className="w-3 h-3" />
                          <span>Meetup plan in progress</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-400">
                      {last
                        ? new Date(last.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Active"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
