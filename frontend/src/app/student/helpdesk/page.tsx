"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  LifeBuoy,
  Send,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  Clock,
  PlusCircle,
  ShieldCheck,
  Paperclip,
  Search,
  Filter,
  AlertTriangle,
  User,
  ExternalLink,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TicketReply {
  sender: string;
  role: "student" | "support";
  message: string;
  time: string;
}

interface StudentTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: "Registration Issue" | "Exam Issue" | "Interview Issue" | "Offer Issue" | "Technical Issue" | "General Query";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Closed";
  hasAttachment?: boolean;
  createdAt: string;
  replies: TicketReply[];
}

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentHelpdeskPage() {
  const { student: currentStudent } = useStudentSession();

  const [ticketsList, setTicketsList] = useState<StudentTicketItem[]>([
    {
      id: "t-1",
      ticketNumber: "TICK-2026-081",
      subject: "Proctored Exam Webcam Permission Issue on Chrome",
      category: "Exam Issue",
      priority: "High",
      status: "In Progress",
      hasAttachment: true,
      createdAt: "Recently",
      replies: [
        {
          sender: currentStudent?.fullName || "Candidate",
          role: "student",
          message: "During initial system diagnostics, Chrome failed to detect the secondary monitor constraint.",
          time: "10:30 AM",
        },
        {
          sender: "GQT Technical Operations",
          role: "support",
          message: "Please ensure third-party extensions are disabled and allow media permissions in site settings. Your test session has been unlocked for retry.",
          time: "11:45 AM",
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<"All" | "Open" | "In Progress" | "Closed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<StudentTicketItem | null>(ticketsList[0] || null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<StudentTicketItem["category"]>("Exam Issue");
  const [newPriority, setNewPriority] = useState<StudentTicketItem["priority"]>("Medium");
  const [newDescription, setNewDescription] = useState("");

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newReply: TicketReply = {
      sender: currentStudent?.fullName || "Candidate",
      role: "student",
      message: replyMessage.trim(),
      time: "Just now",
    };

    const updated = {
      ...selectedTicket,
      replies: [...selectedTicket.replies, newReply],
    };

    setTicketsList((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyMessage("");

    // Persist to Supabase ticket_messages
    if (isSupabaseConfigured) {
      try {
        await supabase.from("ticket_messages").insert([
          {
            ticket_id: selectedTicket.id,
            sender_name: currentStudent?.fullName || "Candidate",
            sender_role: "student",
            message: newReply.message,
          },
        ]);
      } catch {}
    }

    toast.success("Reply submitted to Technical Support Desk");
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const ticketNum = `TICK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newId = `t-${Date.now()}`;

    const newTicket: StudentTicketItem = {
      id: newId,
      ticketNumber: ticketNum,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: "Open",
      createdAt: "Just now",
      replies: [
        {
          sender: currentStudent?.fullName || "Candidate",
          role: "student",
          message: newDescription.trim(),
          time: "Just now",
        },
      ],
    };

    setTicketsList((prev) => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setIsNewTicketOpen(false);

    // Reset Form
    setNewSubject("");
    setNewDescription("");

    // Persist to Supabase helpdesk_tickets
    if (isSupabaseConfigured) {
      try {
        await supabase.from("helpdesk_tickets").insert([
          {
            id: newId,
            ticket_number: ticketNum,
            student_id: currentStudent?.id,
            student_name: currentStudent?.fullName,
            usn: currentStudent?.usn,
            subject: newTicket.subject,
            category: newCategory,
            priority: newPriority,
            status: "Open",
          },
        ]);
      } catch (err) {
        console.warn("Supabase helpdesk insert fallback:", err);
      }
    }

    toast.success(`Ticket ${ticketNum} Registered Successfully!`, {
      description: "Our technical support operations team has received your inquiry.",
    });
  };

  const filteredTickets = ticketsList.filter((t) => {
    const matchesTab = activeTab === "All" || t.status === activeTab;
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>GQT Helpdesk Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Candidate Support & Helpdesk
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Report proctored assessment queries, document review concerns, hall ticket corrections, or interview rescheduling.
            </p>
          </div>

          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#14B8FF] to-[#007BFF] hover:from-[#007BFF] hover:to-[#005BBB] text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Open Support Ticket</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 span): Tickets List */}
        <div className="space-y-4">
          {/* Search & Tabs */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket # or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(["All", "Open", "In Progress", "Closed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    activeTab === tab
                      ? "bg-[#005BBB] text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Cards */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`gqt-card p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-[#005BBB] shadow-md shadow-blue-500/10"
                        : "bg-white dark:bg-[#111C3A] border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#005BBB] dark:text-[#14B8FF]">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "Open"
                            ? "bg-blue-100 text-[#005BBB] dark:bg-blue-950"
                            : t.status === "In Progress"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {t.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>{t.category}</span>
                      <span>{t.createdAt}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No tickets found. Click "Open Support Ticket" above.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (2 spans): Active Ticket Thread & Conversation */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[550px]">
              {/* Thread Header */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF]">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs text-slate-400">• {selectedTicket.category}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedTicket.status === "Open"
                        ? "bg-blue-100 text-[#005BBB] dark:bg-blue-950"
                        : selectedTicket.status === "In Progress"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {selectedTicket.subject}
                </h2>
              </div>

              {/* Messages Discussion Stream */}
              <div className="flex-1 py-5 space-y-4 overflow-y-auto">
                {selectedTicket.replies.map((reply, i) => {
                  const isStudent = reply.role === "student";
                  return (
                    <div
                      key={`reply-${i}`}
                      className={`flex flex-col ${isStudent ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-600 dark:text-slate-300">
                          {reply.sender}
                        </span>
                        <span>•</span>
                        <span>{reply.time}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm max-w-lg leading-relaxed ${
                          isStudent
                            ? "bg-[#005BBB] text-white rounded-br-xs shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/60 dark:border-slate-700"
                        }`}
                      >
                        {reply.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message or inquiry..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendReply();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
                <button
                  onClick={handleSendReply}
                  className="px-5 py-2.5 rounded-xl bg-[#005BBB] hover:bg-[#004494] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-[24px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              Select a support ticket on the left to view the message thread.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setIsNewTicketOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Support Ticket
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Describe the issue or query for the CSR drive technical coordination desk.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assessment timer glitch or webcam check failure"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as StudentTicketItem["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="Exam Issue">Exam Issue</option>
                    <option value="Registration Issue">Registration Issue</option>
                    <option value="Interview Issue">Interview Issue</option>
                    <option value="Offer Issue">Offer Issue</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as StudentTicketItem["priority"])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide detailed description of the issue encountered..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold shadow-md hover:bg-[#004494]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
