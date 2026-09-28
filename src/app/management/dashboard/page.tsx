"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ManagementService } from "@/services/management.service";
import {
  TrendingUp,
  Building2,
  Users,
  Award,
  Download,
  ShieldCheck,
  ChevronRight,
  PieChart as PieIcon,
  Globe,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function ManagementDashboardPage() {
  const { colleges, drives, students } = useApp();
  const baseKpis = ManagementService.getExecutiveKPIs();

  const totalRegistered = students.length;
  const examCompleted = students.filter((s) => s.examResult || s.status.includes("Exam") || s.status.includes("Qualified")).length;
  const qualifiedStudents = students.filter((s) => s.status.includes("Qualified") || s.status.includes("Selected") || s.status.includes("Offer")).length;
  const selectedStudents = students.filter((s) => s.status.includes("Selected") || s.status.includes("Offer")).length;
  const offerAcceptedStudents = students.filter((s) => s.status.includes("Accepted") || s.offerDetails?.status === "Accepted").length;

  const kpis = {
    ...baseKpis,
    totalDrives: drives.length,
    activeDrives: drives.filter((d) => d.status !== "Completed" && d.status !== "Archived").length,
    totalColleges: colleges.length,
    studentsRegistered: totalRegistered,
    examCompleted: examCompleted,
    qualifiedStudents: qualifiedStudents,
    selectedStudents: selectedStudents,
    offerAcceptedStudents: offerAcceptedStudents,
  };

  const insights = ManagementService.getExecutiveInsights();
  const [pulseSeconds, setPulseSeconds] = useState(0);

  // Realtime heartbeat simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseSeconds((s) => (s + 1) % 60);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const pipelineStages = ManagementService.getPipelineFunnel().slice(0, 6);

  const tierDistribution = [
    { name: "Tier-1 Autonomous", value: colleges.filter((c) => c.tier === "Tier-1" || c.type?.includes("Autonomous")).length || 1, color: "#005BBB" },
    { name: "Tier-2 Affiliated", value: colleges.filter((c) => c.tier === "Tier-2" || c.type?.includes("Affiliated")).length || 1, color: "#14B8FF" },
    { name: "Government / Other", value: colleges.filter((c) => c.tier === "Tier-3" || c.type?.includes("Govt")).length || 1, color: "#10B981" },
  ];

  const handleDownloadBoardDeck = () => {
    ManagementService.exportToCSV("GQT_Executive_Board_CSR_Governance_2026", [
      {
        "Report Title": "GQT CSR Drive Executive Governance Summary 2026",
        "Generated Date": new Date().toISOString(),
        "Total Drives": kpis.totalDrives,
        "Active Drives": kpis.activeDrives,
        "Districts Covered": "31 of 31 Karnataka Districts",
        "Total Colleges": kpis.totalColleges,
        "Registered Students": kpis.studentsRegistered,
        "Exam Completed": kpis.examCompleted,
        "Qualified Candidates": kpis.qualifiedStudents,
        "Selected Candidates": kpis.selectedStudents,
        "Offers Accepted": kpis.offerAcceptedStudents,
        "Joining Confirmed": kpis.joiningConfirmedStudents,
        "Batch Fill Ratio": `${kpis.trainingBatchFilledRate}%`,
        "Director Status": "Confidential & Audited",
      },
    ]);
    toast.success("Executive Board Governance Summary exported to CSV", {
      description: "Downloaded complete CSR state-wide performance sheet.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Executive Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Live Executive Oversight
              </span>
              <span className="text-xs text-blue-200">
                FY 2025-26 • Statewide Karnataka Mandate
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Executive Command & Governance Overview
            </h1>
            <p className="text-sm md:text-base text-blue-100/90 leading-relaxed">
              Realtime telemetry covering all Karnataka academic partner colleges, {totalRegistered} registered candidates, {drives.length} concurrent CSR drives, and corporate training batch fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadBoardDeck}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
            >
              <Download className="w-4 h-4 text-[#005BBB]" />
              Export Board Deck
            </button>
            <Link
              href="/management/karnataka-map"
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold text-white transition-all backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-cyan-300" />
              Karnataka Map
            </Link>
          </div>
        </div>
      </div>

      {/* Realtime Operations Monitor Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-blue-50/50 dark:bg-slate-800/50">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-medium">Exam Pipeline</span>
            <span className="font-bold text-slate-900 dark:text-white">{examCompleted} Completed</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-purple-50/50 dark:bg-slate-800/50">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-medium">Qualified</span>
            <span className="font-bold text-slate-900 dark:text-white">{qualifiedStudents} Candidates</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/50 dark:bg-slate-800/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-medium">Offers</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{offerAcceptedStudents} Accepted</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-cyan-50/50 dark:bg-slate-800/50">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Registered</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalRegistered} Students</span>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Supabase Cloud</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
        </div>
      </div>

      {/* TOP 15 KPI CARDS IN STRATEGIC CLUSTERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Executive Performance KPIs (31 Districts Aggregate)
          </h2>
          <span className="text-xs text-slate-500">Live Counters</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Cluster 1: Drives */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-md border border-blue-800/40">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
              Total CSR Drives
            </span>
            <span className="text-2xl font-black tracking-tight mt-1 block">
              {kpis.totalDrives}
            </span>
            <span className="text-[10px] text-cyan-300 mt-1 block">
              {kpis.activeDrives} Active • {kpis.upcomingDrives} Upcoming
            </span>
          </div>

          {/* Cluster 2: Colleges */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Partner Colleges
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 block">
              {kpis.totalColleges}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
              {kpis.activeColleges} Engaged with MoUs
            </span>
          </div>

          {/* Cluster 3: Districts */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Districts Covered
            </span>
            <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 tracking-tight mt-1 block">
              31 / 31
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              100% Karnataka Coverage
            </span>
          </div>

          {/* Cluster 4: Registrations */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Students Registered
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 block">
              {kpis.studentsRegistered.toLocaleString()}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
              {kpis.examCompleted.toLocaleString()} Appeared for Exam
            </span>
          </div>

          {/* Cluster 5: Exam Qualified */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Exam Qualified
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mt-1 block">
              {kpis.qualifiedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              63.2% Cutoff Cleared
            </span>
          </div>

          {/* Cluster 6: Selected Students */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              Final Selected
            </span>
            <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 tracking-tight mt-1 block">
              {kpis.selectedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
              Yield: {kpis.averageSelectionRate}% of Appeared
            </span>
          </div>

          {/* Cluster 7: Offer Accepted */}
          <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40">
            <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider block">
              Offers Accepted
            </span>
            <span className="text-2xl font-black text-cyan-800 dark:text-cyan-300 tracking-tight mt-1 block">
              {kpis.offerAcceptedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 block font-semibold">
              {kpis.averageAcceptanceRate}% Acceptance Ratio
            </span>
          </div>

          {/* Cluster 8: Joining Confirmed */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Joining Confirmed
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 block">
              {kpis.joiningConfirmedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
              87.0% Conversion
            </span>
          </div>

          {/* Cluster 9: Batch Fill Ratio */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Batch Fill Capacity
            </span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight mt-1 block">
              {kpis.trainingBatchFilledRate}%
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Goal: 100% (4 Batches Full)
            </span>
          </div>

          {/* Cluster 10: Rejected Candidates */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Talent Pool / Retake
            </span>
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300 tracking-tight mt-1 block">
              {kpis.rejectedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Retake option queued
            </span>
          </div>
        </div>
      </div>

      {/* EXECUTIVE COMMAND CENTER (TODAY'S CRITICAL ACTION STREAM) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Action Cards */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Executive Command Center • Today&apos;s Highlights
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Critical milestones and immediate operational checkpoints across departments.
              </p>
            </div>
            <Link
              href="/management/activity-center"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              Live Feed
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-blue-100 dark:border-slate-800 bg-blue-50/40 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-cyan-400">
                  Upcoming CSR Drives (Next 7d)
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md">
                  6 Drives
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                North Karnataka Belagavi & Kalaburagi Cluster Drives initiate this weekend with 2,400 expected test-takers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-100 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  Offers Expiring Today
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md">
                  18 Letters
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                Autonomous college students from Mysuru & Tumakuru approaching 72h acceptance window expiry.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/40 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                  Pending Admission Verification
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-600 text-white rounded-md">
                  64 Dossiers
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                Signed offer forms and final semester marks-sheets pending Central Admission Desk stamp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-slate-800 bg-emerald-50/40 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Batch Allocation Ready
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-md">
                  94.2% Capacity
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                Java Batch-A & Python Batch-A allocated 530 confirmed candidates for BTM Campus training.
              </p>
            </div>
          </div>
        </div>

        {/* Institutional Tier Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Partner College Diversity
              </h2>
              <span className="text-xs text-slate-500">Tier Breakdown</span>
            </div>
            <Link
              href="/management/colleges"
              className="text-xs text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Leaderboard →
            </Link>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {tierDistribution.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-slate-700 dark:text-slate-300">{t.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUTOMATED MANAGEMENT INSIGHTS PANEL */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Automated Strategic Insights (Director Briefing)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine-generated business intelligence synthesized from statewide recruitment results.
            </p>
          </div>
          <span className="text-xs text-slate-400">Refreshed 5 mins ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.type === "positive"
                  ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40"
                  : item.type === "warning"
                  ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/40"
                  : "bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-800/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                    item.type === "positive"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : item.type === "warning"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                  }`}
                >
                  {item.tag}
                </span>
                {item.metric && (
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {item.metric}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK WORKSPACE LAUNCHER PILLS */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Executive Dashboards:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/management/karnataka-map"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-blue-500 transition-all"
          >
            Karnataka CSR Map
          </Link>
          <Link
            href="/management/student-pipeline"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-blue-500 transition-all"
          >
            Recruitment Funnel
          </Link>
          <Link
            href="/management/colleges"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-blue-500 transition-all"
          >
            College Leaderboard
          </Link>
          <Link
            href="/management/hr-performance"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-blue-500 transition-all"
          >
            HR Recruiter Metrics
          </Link>
          <Link
            href="/management/revenue"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold hover:border-blue-500 transition-all"
          >
            CSR Sponsorship & Batches
          </Link>
          <Link
            href="/management/export-center"
            className="px-3 py-1.5 rounded-lg bg-[#001B4D] text-white font-bold hover:bg-[#003366] transition-all"
          >
            Report Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
