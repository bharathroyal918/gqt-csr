"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { FollowUpReminder } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import {
  CalendarCheck,
  PlusCircle,
  Calendar,
  Columns3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  Share2,
  Filter,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function FollowUpsPage() {
  const { followUps, colleges, currentUser, addFollowUp, updateFollowUpStatus } = useApp();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const initialCollege = colleges[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    collegeId: initialCollege?.id || "",
    contactPerson: initialCollege?.placementOfficer?.name || initialCollege?.principal?.name || "",
    contactPhone: initialCollege?.placementOfficer?.mobile || initialCollege?.principal?.mobile || "",
    scheduledFor: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    dueCategory: "Today" as FollowUpReminder["dueCategory"],
    purpose: "",
    assignedTo: currentUser.name || "CSR Manager",
    priority: "High" as FollowUpReminder["priority"],
    status: "Pending" as FollowUpReminder["status"],
    emailReminderSent: true,
    whatsappReminderSent: true,
  });

  const kanbanColumns: { title: string; category: FollowUpReminder["dueCategory"]; color: string }[] = [
    { title: "Overdue (Escalated)", category: "Overdue", color: "border-rose-300 dark:border-rose-800 bg-rose-50/20" },
    { title: "Due Today", category: "Today", color: "border-blue-300 dark:border-blue-800 bg-blue-50/20" },
    { title: "Due Tomorrow", category: "Tomorrow", color: "border-amber-300 dark:border-amber-800 bg-amber-50/20" },
    { title: "Upcoming", category: "Upcoming", color: "border-slate-300 dark:border-slate-700 bg-slate-50/20" },
    { title: "Completed", category: "Completed", color: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20" },
  ];

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUp.purpose) {
      toast.error("Please enter purpose of follow-up");
      return;
    }

    const matchedCollege = colleges.find((c) => c.id === newFollowUp.collegeId);

    addFollowUp({
      ...newFollowUp,
      collegeName: matchedCollege?.name || "Karnataka Engineering Institution",
    });

    setIsModalOpen(false);
    setNewFollowUp({ ...newFollowUp, purpose: "" });
  };

  const handleMarkDone = (id: string) => {
    updateFollowUpStatus(id, "Completed");
    toast.success("Follow-up marked as Completed!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Follow-Up & Escalation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated CRM follow-up scheduler, overdue alerts, and multi-channel reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> List Agenda
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanbanColumns.map((col) => {
            const items = followUps.filter((f) => f.dueCategory === col.category);

            return (
              <div
                key={col.category}
                className={`rounded-3xl border ${col.color} p-4 flex flex-col min-h-[500px] shadow-xs`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                  <h3 className="font-extrabold text-xs text-[#0F172A] dark:text-white uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-8 text-center italic">
                      No reminders in this stage
                    </p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 group hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-[#0F172A] dark:text-white leading-tight">
                            {item.collegeName ? item.collegeName.split("(")[0] : "College"}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              item.priority === "Urgent"
                                ? "bg-rose-50 text-rose-600"
                                : item.priority === "High"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {item.purpose}
                        </p>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Contact:</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.contactPerson}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Assigned:</span>
                            <span className="font-semibold text-[#005BBB]">{item.assignedTo}</span>
                          </div>
                        </div>

                        {item.status !== "Completed" && (
                          <button
                            onClick={() => handleMarkDone(item.id)}
                            className="w-full py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {followUps.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                      {item.collegeName}
                    </span>
                    <StatusBadge status={item.dueCategory} size="sm" />
                    <span className="text-xs text-slate-400">• {item.priority} Priority</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {item.purpose}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Assigned to: {item.assignedTo} • Contact: {item.contactPerson} ({item.contactPhone})
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {item.status !== "Completed" && (
                    <button
                      onClick={() => handleMarkDone(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Follow-Up Reminder"
        subtitle="Set automated reminders with college placement officers"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateFollowUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              College
            </label>
            <select
              value={newFollowUp.collegeId}
              onChange={(e) => setNewFollowUp({ ...newFollowUp, collegeId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.collegeCode || c.vtuCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Due Category
            </label>
            <select
              value={newFollowUp.dueCategory}
              onChange={(e) => setNewFollowUp({ ...newFollowUp, dueCategory: e.target.value as FollowUpReminder["dueCategory"] })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold"
            >
              <option value="Today">Due Today</option>
              <option value="Tomorrow">Due Tomorrow</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Overdue">Overdue / Escalated</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Purpose & Agenda
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Discuss finalized lab batch timing for physical drive..."
              value={newFollowUp.purpose}
              onChange={(e) => setNewFollowUp({ ...newFollowUp, purpose: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700"
            >
              Create Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
