"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Send,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function HRSchedulePage() {
  const { students } = useApp();

  const qualifiedStudents = students.filter(
    (s) => s.status === "Qualified" || s.status === "HR Interview Scheduled"
  );

  const [selectedDate, setSelectedDate] = useState("2026-09-28");
  const [slotTime, setSlotTime] = useState("11:00 AM");
  const [meetingPlatform, setMeetingPlatform] = useState("Google Meet");

  const handleBulkSchedule = () => {
    toast.success("Bulk Interview Slots Dispatched!", {
      description: `Google Meet invites & WhatsApp notifications generated for ${qualifiedStudents.length} candidates.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/portal/hr/pipeline" className="hover:text-[#005BBB] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to HR Pipeline
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Interview Slot Scheduling & Google Meet Dispatch
          </h1>
        </div>

        <button
          onClick={handleBulkSchedule}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Bulk Dispatch Slots ({qualifiedStudents.length})</span>
        </button>
      </div>

      {/* Grid: Calendar Slot Generator & Candidate Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Generator Config Card */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            Configure Interview Window
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Target Interview Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Time Slot Format
            </label>
            <input
              type="text"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Meeting Platform
            </label>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-semibold"
            >
              <option value="Google Meet">Google Meet (Auto-generated Link)</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Zoom">Zoom Enterprise</option>
              <option value="Campus Lab">On-Campus Physical Lab</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-[#005BBB] dark:text-blue-300">
            Platform will automatically inject meeting URLs into WhatsApp message template wa-tmpl-03.
          </div>
        </div>

        {/* Candidate Queue */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            Qualified Candidate Slot Allocation Queue ({qualifiedStudents.length})
          </h3>

          <div className="space-y-3">
            {qualifiedStudents.map((s, idx) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-[#0F172A] dark:text-white">{s.fullName}</span>
                    <span className="font-mono text-[11px] text-[#005BBB] font-bold">({s.usn})</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.collegeName} • {s.branch}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">
                      {selectedDate} ({10 + idx}:30 AM)
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Ready for Dispatch</span>
                  </div>

                  <button
                    onClick={() => toast.success(`Single slot sent to ${s.fullName} via WhatsApp & Email`)}
                    className="p-2 rounded-xl bg-blue-50 text-[#005BBB] hover:bg-blue-100"
                    title="Dispatch Single Slot"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
