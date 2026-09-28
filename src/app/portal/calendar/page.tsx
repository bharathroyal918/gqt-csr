"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CalendarEvent } from "@/types";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function CalendarPage() {
  const { calendarEvents } = useApp();

  const [filterType, setFilterType] = useState("all");

  const filteredEvents = calendarEvents.filter(
    (e) => filterType === "all" || e.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            CSR Master Operations Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unified schedule of on-campus CSR drives, online proctored exams, HR interview slots, and state holidays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Connected to Google Calendar")}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
          >
            Sync Google Calendar
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", "Drive", "Exam", "Interview", "Follow-up", "Holiday"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === t
              ? "bg-[#005BBB] text-white shadow-xs"
              : "bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
          >
            {t === "all" ? "All Schedules" : t}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-2">
          Scheduled Operations Schedule (September - October 2026)
        </h3>

        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] uppercase">{new Date(evt.date).toLocaleDateString([], { month: "short" })}</span>
                  <span className="text-base leading-none">{new Date(evt.date).getDate()}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                      {evt.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#005BBB] dark:bg-blue-900/60 dark:text-blue-300">
                      {evt.type}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#005BBB] dark:text-blue-400" /> {evt.startTime} - {evt.endTime}
                    </span>
                    {evt.collegeName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {evt.collegeName} ({evt.venue})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 shrink-0">
                {evt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
