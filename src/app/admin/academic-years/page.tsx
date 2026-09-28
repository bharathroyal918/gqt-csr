"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { AcademicYearRecord } from "@/types";
import {
  Calendar,
  CheckCircle2,
  Lock,
  Plus,
  ArrowRight,
  Archive,
  Sparkles,
  Building2,
  Users,
  Briefcase,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminAcademicYearsPage() {
  const [sessions, setSessions] = useState<AcademicYearRecord[]>(() =>
    AdminService.getAcademicYears()
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newYear, setNewYear] = useState("2028-29");
  const [newStartDate, setNewStartDate] = useState("2028-06-01");
  const [newEndDate, setNewEndDate] = useState("2029-05-31");

  const handleSetActiveYear = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        status: s.id === id ? "Current" : s.status === "Current" ? "Archived" : s.status,
      }))
    );
    toast.success("Active Academic Year updated successfully", {
      description: "Default drive filters and candidate batches shifted to the new active session.",
    });
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AcademicYearRecord = {
      id: `ay-${newYear.replace("/", "-")}`,
      year: newYear,
      startDate: newStartDate,
      endDate: newEndDate,
      status: "Upcoming",
      drivesCount: 0,
      collegesCount: 0,
      studentsCount: 0,
      isLocked: false,
    };
    setSessions([created, ...sessions]);
    setIsAddModalOpen(false);
    toast.success(`Academic Year ${newYear} initialized`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Session Governance
            </span>
            <span className="text-xs text-blue-200">Statewide Cohort & Annual Term Migration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Academic Year & Term Management
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Switch between academic cycles, manage institutional roll-over, archive completed terms, and configure future CSR drive seasons.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 text-[#005BBB]" />
          Create Academic Session
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => {
          const isCurrent = session.status === "Current";
          return (
            <div
              key={session.id}
              className={`p-6 rounded-2xl border transition-all ${
                isCurrent
                  ? "bg-white dark:bg-slate-900 border-[#005BBB] ring-2 ring-blue-500/20 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCurrent
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : session.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {session.status.toUpperCase()}
                    </span>
                    {session.isLocked && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                    Academic Year {session.year}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {session.startDate} to {session.endDate}
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleSetActiveYear(session.id)}
                    className="px-3.5 py-1.5 bg-[#001B4D] hover:bg-[#003366] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Set as Current
                  </button>
                )}
              </div>

              {/* Statistics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2.5 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Drives</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {session.drivesCount} Drives
                  </span>
                </div>
                <div className="p-2.5 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Colleges</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {session.collegesCount} Colleges
                  </span>
                </div>
                <div className="p-2.5 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Students</span>
                  <span className="text-base font-bold text-[#005BBB] dark:text-cyan-400 mt-0.5 block">
                    {session.studentsCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Academic Year Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Initialize Academic Session
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Session Year Label</label>
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="e.g. 2028-29"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001B4D] hover:bg-[#003366] text-white rounded-lg font-bold shadow-md"
                >
                  Save Academic Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
