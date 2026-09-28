"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { HelpdeskTicket } from "@/types";
import { Modal } from "@/components/common/Modal";
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send,
  User,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function HelpdeskPage() {
  const { tickets, currentUser, currentRole, addTicket, replyToTicket } = useApp();

  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    category: "Interview Reschedule" as HelpdeskTicket["category"],
    priority: "High" as HelpdeskTicket["priority"],
    message: "",
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject || !newTicketForm.message) return;

    addTicket(
      {
        raisedBy: currentUser.name,
        role: currentRole,
        email: currentUser.email,
        subject: newTicketForm.subject,
        category: newTicketForm.category,
        priority: newTicketForm.priority,
        status: "Open",
      },
      newTicketForm.message
    );

    setIsCreateModalOpen(false);
    setNewTicketForm({ subject: "", category: "Interview Reschedule", priority: "High", message: "" });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    replyToTicket(selectedTicket.id, replyMessage);
    setReplyMessage("");

    // Update local view
    const updated = tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Helpdesk & Candidate Dispute Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Resolve interview rescheduling appeals, student proctoring inquiries, and college lab questions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {/* Grid: Tickets List & Thread Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticket Queue */}
        <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Active Tickets ({tickets.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50/60 dark:bg-blue-950/40 border-[#005BBB] ring-2 ring-[#005BBB]/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-[#005BBB] dark:text-blue-400">{t.ticketNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        t.status === "Open"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : t.status === "In Progress"
                          ? "bg-blue-100 text-[#005BBB] dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-[#0F172A] dark:text-white line-clamp-1">
                    {t.subject}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    From: {t.raisedBy} ({t.category})
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Ticket Reply Thread */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Thread Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 text-xs font-mono font-bold">
                    {selectedTicket.ticketNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Category: {selectedTicket.category}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-slate-400">
                  Raised by <strong>{selectedTicket.raisedBy}</strong> ({selectedTicket.email}) • Priority: {selectedTicket.priority}
                </p>
              </div>

              {/* Message Thread History */}
              <div className="space-y-3 flex-1 overflow-y-auto my-4 max-h-[350px] pr-2">
                {selectedTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                      m.role === "student"
                        ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        : "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
                      <span>{m.sender} ({m.role.toUpperCase()})</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type a response to this ticket..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Post Reply
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 text-xs">
              Select a ticket from the left to view and respond to the conversation.
            </div>
          )}
        </div>
      </div>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Raise Support Ticket"
        subtitle="Submit queries regarding exam proctoring, slot changes, or offer verification"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. University lab exam clash on Oct 8th"
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
            <select
              value={newTicketForm.category}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value as HelpdeskTicket["category"] })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="Interview Reschedule" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Interview Reschedule</option>
              <option value="Exam Cheating Appeal" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Exam Proctoring Appeal</option>
              <option value="Registration" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Registration & USN Issues</option>
              <option value="Offer Query" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Offer Clarification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Message Details</label>
            <textarea
              rows={3}
              required
              placeholder="Describe your request in detail..."
              value={newTicketForm.message}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
