"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
  Download,
  Shield,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export function FacultyDashboard() {
  const { currentUser, students, drives } = useApp();

  const departmentName = currentUser.department || "Academic Department";

  // Filter students from faculty department
  const deptStudents = currentUser.department
    ? students.filter(
        (s) =>
          s.branch?.toLowerCase().includes(currentUser.department!.toLowerCase()) ||
          currentUser.department!.toLowerCase().includes(s.branch?.toLowerCase() || "")
      )
    : students;

  const totalRegistered = deptStudents.length;
  const examAttended = deptStudents.filter(
    (s) => s.examResult || s.status === "Exam Completed" || s.status === "Qualified" || s.status === "Offer Accepted"
  ).length;

  const qualifiedCount = deptStudents.filter(
    (s) => s.examResult?.qualified || s.status === "Qualified" || s.status === "Offer Accepted"
  ).length;

  const handleDownloadHallTickets = () => {
    toast.success("Department Hall Tickets Downloaded", {
      description: `Generated printable batch for ${totalRegistered} students.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Faculty Hero Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#005BBB] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-indigo-200 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>{departmentName} • Faculty Coordination Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-2xl leading-relaxed">
              Campus computer lab proctoring, student attendance verification, hall ticket validation, and departmental performance tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadHallTickets}
              className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-300" />
              <span>Batch Hall Tickets</span>
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-300" />
              <span>FACULTY COORDINATOR</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* Faculty Department KPIs */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Department Assessment Pulse
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Dept Enrolled"
            value={totalRegistered}
            icon={Users}
            subtitle={departmentName ? departmentName.split(" ")[0] : "Department"}
            gradient="blue"
          />
          <StatCard
            title="Hall Tickets"
            value={totalRegistered}
            icon={FileCheck}
            subtitle="Verified & Issued"
            gradient="cyan"
          />
          <StatCard
            title="Lab Attendance"
            value={examAttended}
            icon={Clock}
            subtitle={`${Math.round((examAttended / totalRegistered) * 100)}% Attended`}
            gradient="navy"
          />
          <StatCard
            title="Qualified Exam"
            value={qualifiedCount}
            icon={CheckCircle2}
            subtitle="Scorecard ≥ 50%"
            gradient="emerald"
          />
          <StatCard
            title="Average Score"
            value="74.2%"
            icon={Award}
            subtitle="Department Median"
            gradient="amber"
          />
          <StatCard
            title="HR Shortlisted"
            value={Math.round(qualifiedCount * 0.85)}
            icon={TrendingUp}
            subtitle="Advanced to Panel"
            gradient="purple"
          />
        </div>
      </div>

      {/* Grid: Upcoming Proctoring Schedules + Department Coordination Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Campus Exam Lab Schedules & Proctoring Duty
            </h3>
            <span className="text-xs font-bold text-[#005BBB]">Lab Block A & B</span>
          </div>

          <div className="space-y-3">
            {drives.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-300">
                      {d.batch}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                      {d.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Exam Date: <strong className="text-slate-700 dark:text-slate-300">{d.schedule?.examDate || "Scheduled Soon"}{d.schedule?.examTime ? ` (${d.schedule.examTime})` : ""}</strong>{d.venue ? ` • Venue: ${d.venue}` : ""}
                  </p>
                </div>

                <Link
                  href="/portal/attendance"
                  className="px-3 py-1.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-[#004A99] transition-colors shrink-0 text-center"
                >
                  Proctor Attendance
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Coordination Actions */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-2">
            Faculty Actions
          </h3>

          <Link
            href="/portal/attendance"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Live Exam Attendance Check-in
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleDownloadHallTickets}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#005BBB]" /> Download Hall Ticket Roster
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <Link
            href="/portal/tasks"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" /> Lab Tasks & Duty Checklist
            </span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Department Candidates Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-4">
          Department Candidates Tracker ({deptStudents.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">USN</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Exam Result</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deptStudents.slice(0, 6).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#005BBB] dark:text-blue-400">
                    {s.usn}
                  </td>
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {s.fullName}
                  </td>
                  <td className="p-3 text-slate-500">
                    {s.branch}
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    {s.examResult ? `${s.examResult.percentage}%` : "Attending"}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
