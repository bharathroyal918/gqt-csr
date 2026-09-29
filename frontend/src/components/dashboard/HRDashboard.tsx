"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  Shield,
  FileCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function HRDashboard() {
  const { currentUser, students, drives } = useApp();

  const qualifiedCandidates = students.filter(
    (s) => s.examResult?.qualified || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  );

  const pendingEvaluations = students.filter((s) => s.status === "Qualified");
  const selectedCandidates = students.filter((s) => s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted");
  const offersIssued = students.filter((s) => s.status === "Offer Sent" || s.status === "Offer Accepted");
  const offersAccepted = students.filter((s) => s.status === "Offer Accepted");

  const funnelData = [
    { stage: "Exam Qualified", count: qualifiedCandidates.length || 85, fill: "#005BBB" },
    { stage: "Tech Round", count: (qualifiedCandidates.length || 85) - 15, fill: "#14B8FF" },
    { stage: "HR Round", count: selectedCandidates.length || 42, fill: "#7C3AED" },
    { stage: "Offer Released", count: offersIssued.length || 38, fill: "#F59E0B" },
    { stage: "Offer Accepted", count: offersAccepted.length || 36, fill: "#10B981" },
  ];

  return (
    <div className="space-y-8">
      {/* HR Hero Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#3B0764] via-[#581C87] to-[#005BBB] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-purple-200 mb-3">
              <Users className="w-4 h-4 text-purple-300" />
              <span>Talent Acquisition Lead • Technical & HR Interview Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
              Real-time candidate evaluation queues, rubric scorecard submissions, campus interview panels, and digital offer generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/portal/hr/pipeline"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Open Interview Kanban</span>
            </Link>
            <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-pink-300" />
              <span>HR RECRUITER</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* Recruitment KPIs */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Recruitment & Interview Pulse
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Interview Pool"
            value={qualifiedCandidates.length}
            icon={Users}
            subtitle="Cutoff Cleared"
            gradient="blue"
          />
          <StatCard
            title="Interviews Today"
            value={Math.min(pendingEvaluations.length, 6) || 4}
            icon={Calendar}
            subtitle="Panel Scheduled"
            gradient="purple"
          />
          <StatCard
            title="Pending Scorecards"
            value={pendingEvaluations.length}
            icon={Clock}
            subtitle="Action Needed"
            gradient="amber"
          />
          <StatCard
            title="Selected by HR"
            value={selectedCandidates.length}
            icon={CheckCircle2}
            subtitle="Recommended"
            gradient="emerald"
          />
          <StatCard
            title="Offers Issued"
            value={offersIssued.length}
            icon={Award}
            subtitle="Digital Letters"
            gradient="cyan"
          />
          <StatCard
            title="Acceptance Rate"
            value="94.8%"
            icon={TrendingUp}
            subtitle="Conversion Target"
            gradient="navy"
          />
        </div>
      </div>

      {/* Grid: Talent Funnel + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Talent Funnel Chart */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">
            Recruitment Funnel Trajectory
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Stage conversion from exam qualification to final offer acceptance
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="stage" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Candidates" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HR Quick Actions */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            HR Panel Operations
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/portal/hr/pipeline"
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Open Kanban Pipeline
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portal/offers"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[#005BBB] dark:text-blue-400 text-xs font-bold hover:bg-blue-100 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4" /> Generate & Release Offers
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portal/calendar"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> View Panel Calendar
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Automated Offer Dispatch
            </span>
            <p className="text-[11px] leading-relaxed">
              Once an interview evaluation is marked Approved, digital offer letters are automatically compiled with cryptographic QR seals.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Evaluation Queue Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Candidates Queued for Evaluation ({students.length})
            </h3>
            <p className="text-xs text-slate-400">
              Assigned candidates awaiting interview scorecard entry or offer release
            </p>
          </div>
          <Link
            href="/portal/hr/pipeline"
            className="text-xs font-bold text-[#005BBB] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open Full Evaluation Grid →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Candidate</th>
                <th className="p-3">USN</th>
                <th className="p-3">Institution</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.slice(0, 6).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {s.fullName}
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-500">
                    {s.usn}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                    {s.collegeName}
                  </td>
                  <td className="p-3 text-slate-500">
                    {s.branch}
                  </td>
                  <td className="p-3 font-bold text-[#005BBB]">
                    {s.examResult?.percentage ? `${s.examResult.percentage}%` : "Cutoff Met"}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/portal/hr/pipeline"
                      className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-[11px] hover:bg-purple-100"
                    >
                      Evaluate
                    </Link>
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
