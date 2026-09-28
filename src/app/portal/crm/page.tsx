"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { CRMInteraction } from "@/types";
import { Modal } from "@/components/common/Modal";
import {
  PhoneCall,
  MessageSquare,
  Mail,
  Users,
  Play,
  Pause,
  Clock,
  Calendar,
  AlertTriangle,
  Paperclip,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  ArrowRight,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

export default function CRMPage() {
  const { crmInteractions, colleges, currentUser, logCRMInteraction } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Audio Playback simulation state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // New Interaction Modal State
  const initialCollege = colleges[0];
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    collegeId: initialCollege?.id || "",
    contactPerson: initialCollege?.placementOfficer?.name || initialCollege?.principal?.name || "",
    contactRole: initialCollege?.placementOfficer?.designation || "",
    contactPhone: initialCollege?.placementOfficer?.mobile || initialCollege?.principal?.mobile || "",
    type: "Call" as CRMInteraction["type"],
    direction: "Outbound" as CRMInteraction["direction"],
    durationMinutes: 12,
    outcome: "Interested" as CRMInteraction["outcome"],
    summary: "",
    meetingMinutes: [] as string[],
    nextAction: "",
    followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
    reminderTime: "10:30 AM",
    priority: "High" as CRMInteraction["priority"],
    tags: ["Follow-up", "MoU Discussion"],
    loggedBy: currentUser.name || "CSR Manager",
  });

  const filteredInteractions = crmInteractions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.collegeName.toLowerCase().includes(q) ||
      item.contactPerson.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q));

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;

    return matchesSearch && matchesType && matchesPriority;
  });

  const toggleAudioPlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      toast.info("Audio playback paused");
    } else {
      setPlayingId(id);
      toast.success("Playing call audio recording simulation...");
    }
  };

  const handleCreateInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.summary) {
      toast.error("Please enter a discussion summary");
      return;
    }

    const matchedCollege = colleges.find((c) => c.id === newLog.collegeId);

    logCRMInteraction({
      ...newLog,
      collegeName: matchedCollege?.name || "",
    });

    setIsLogModalOpen(false);
    setNewLog({ ...newLog, summary: "", nextAction: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            CRM Communication Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete interaction trail: calls, recordings, WhatsApp threads, and follow-up escalations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/crm/follow-ups"
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            Follow-up Engine (Kanban)
          </Link>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Communication</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search communications, tags, or outcomes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "Call", "WhatsApp", "Email", "Campus Visit"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors ${
                typeFilter === t
                  ? "bg-[#005BBB] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {t === "all" ? "All Channels" : t}
            </button>
          ))}
        </div>
      </div>

      {/* CRM Interaction Timeline Feed */}
      <div className="space-y-4">
        {filteredInteractions.map((item) => {
          const isPlaying = playingId === item.id;

          return (
            <div
              key={item.id}
              className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 flex items-center justify-center font-bold">
                    {item.type === "Call" && <PhoneCall className="w-5 h-5" />}
                    {item.type === "WhatsApp" && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                    {item.type === "Email" && <Mail className="w-5 h-5 text-indigo-600" />}
                    {item.type === "Campus Visit" && <Users className="w-5 h-5 text-amber-600" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                        {item.collegeName}
                      </h3>
                      {item.isEscalated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" /> Overdue Escalation
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Contact: <span className="font-semibold text-slate-600 dark:text-slate-300">{item.contactPerson}</span> ({item.contactRole}) • {item.direction}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-mono">
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.priority === "Urgent"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : item.priority === "High"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              </div>

              {/* Discussion Summary */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Discussion Summary & Outcome:{" "}
                  <span className="text-[#005BBB] font-extrabold">{item.outcome}</span>
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {item.summary}
                </p>
              </div>

              {/* Meeting Minutes Bullet Points */}
              {item.meetingMinutes && item.meetingMinutes.length > 0 && (
                <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/60">
                  <span className="text-[11px] font-bold text-[#005BBB] block mb-1">
                    Formal Minutes / Agreed Points:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {item.meetingMinutes.map((mm, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#005BBB] font-bold">•</span>
                        <span>{mm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Simulated Audio Player if Call recording available */}
              {item.audioRecordingUrl && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => toggleAudioPlay(item.id)}
                    className="w-9 h-9 rounded-xl bg-[#005BBB] text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs"
                    title={isPlaying ? "Pause" : "Play Recording"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-[#005BBB]" /> Verified Call Recording ({item.durationMinutes} mins)
                      </span>
                      <span className="font-mono text-slate-400">
                        {isPlaying ? "01:42 / 14:00" : "00:00 / 14:00"}
                      </span>
                    </div>
                    {/* Simulated Waveform / Progress bar */}
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-[#005BBB] rounded-full transition-all duration-300 ${
                          isPlaying ? "w-1/4 animate-pulse" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Actions & Tags */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {item.tags.map((tg) => (
                    <span
                      key={tg}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  {item.followUpDate && (
                    <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Next Action: {item.nextAction} ({item.followUpDate})
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">Logged by: {item.loggedBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log New Communication Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log CRM Communication"
        subtitle="Record calls, meetings, WhatsApp notes, and next follow-up dates forever"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateInteraction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                College / Institution
              </label>
              <select
                value={newLog.collegeId}
                onChange={(e) => setNewLog({ ...newLog, collegeId: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              >
                {colleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.collegeCode || col.vtuCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Channel / Mode
              </label>
              <select
                value={newLog.type}
                onChange={(e) => setNewLog({ ...newLog, type: e.target.value as CRMInteraction["type"] })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              >
                <option value="Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp Conversation</option>
                <option value="Email">Official Email</option>
                <option value="Campus Visit">Campus Visit / Physical Meeting</option>
                <option value="Virtual Meeting">Virtual Video Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                required
                value={newLog.contactPerson}
                onChange={(e) => setNewLog({ ...newLog, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Call Outcome
              </label>
              <select
                value={newLog.outcome}
                onChange={(e) => setNewLog({ ...newLog, outcome: e.target.value as CRMInteraction["outcome"] })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              >
                <option value="Interested">Interested in CSR Drive</option>
                <option value="MoU Agreed">MoU Agreed / Signed</option>
                <option value="Drive Scheduled">Drive Scheduled</option>
                <option value="Follow-up Needed">Follow-up Needed</option>
                <option value="Call Later">Call Later</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Discussion Summary & Notes
              </label>
              <textarea
                rows={3}
                required
                value={newLog.summary}
                onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                placeholder="Key takeaways, batch capacity discussed, laboratory requirements, etc..."
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0F172A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                Next Action Item
              </label>
              <input
                type="text"
                placeholder="e.g. Courier MoU hardcopy"
                value={newLog.nextAction}
                onChange={(e) => setNewLog({ ...newLog, nextAction: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={newLog.followUpDate}
                onChange={(e) => setNewLog({ ...newLog, followUpDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700"
            >
              Save Interaction Forever
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
