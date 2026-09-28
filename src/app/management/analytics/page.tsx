"use client";

import React, { useState } from "react";
import { ManagementService } from "@/services/management.service";
import {
  TrendingUp,
  GraduationCap,
  Layers,
  Calendar,
  ShieldCheck,
  Smartphone,
  Mail,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  PieChart as PieIcon,
  Server,
  Zap,
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

export default function ManagementAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<
    "courses" | "branches" | "exams" | "communication" | "health"
  >("courses");

  const courses = ManagementService.getCourseAnalytics();
  const branches = ManagementService.getBranchAnalytics();
  const passingYears = ManagementService.getPassingYearAnalytics();

  const examMetrics = {
    avgScore: "68.4 / 100",
    highestScore: "98.5 / 100",
    lowestScore: "24.0 / 100",
    passPct: 63.2,
    violationsLogged: 142,
    terminations: 18,
  };

  const hardQuestions = [
    { id: "Q-104", subject: "Agentic Reasoning & Tools", accuracy: "28.4%", skipped: "42.0%", issue: "Multi-tool dispatch logic" },
    { id: "Q-082", subject: "Java Concurrency & Virtual Threads", accuracy: "32.1%", skipped: "38.5%", issue: "Deadlock resolution" },
    { id: "Q-059", subject: "SQL Window Functions & Partitioning", accuracy: "35.8%", skipped: "29.0%", issue: "DENSE_RANK partition framing" },
    { id: "Q-118", subject: "Python AsyncIO Event Loops", accuracy: "37.2%", skipped: "26.4%", issue: "Coroutine cancellation handling" },
  ];

  const commMetrics = {
    whatsAppSent: 48520,
    whatsAppReadRate: 94.6,
    emailSent: 34100,
    emailOpenRate: 78.4,
    meetingsCompletedRate: 92.5,
    followUpsCompletedRate: 89.2,
    escalationRate: 3.4,
    collegeResponseRate: 91.0,
  };

  const systemHealth = [
    { label: "Active Platform Users", value: "2,410", status: "Healthy" },
    { label: "Students Online Now", value: "1,840", status: "Active Session" },
    { label: "HR Recruiters Online", value: "18", status: "Full Roster" },
    { label: "Realtime WebSocket Nodes", value: "12 / 12", status: "Low Latency (14ms)" },
    { label: "Message Queue Telemetry", value: "0 Lag", status: "Realtime Delivery" },
    { label: "Database Health (Supabase)", value: "99.98%", status: "Optimal I/O" },
  ];

  const handleExportDeepAnalytics = () => {
    ManagementService.exportToCSV("GQT_Statewide_Deep_Analytics_2026", [
      ...courses.map((c) => ({
        Module: "Course Analytics",
        Category: c.courseName,
        Registrations: c.registrations,
        Qualified: c.qualified,
        Selections: c.selections,
        Accepted: c.accepted,
        "Capacity Filled %": `${((c.batchFilled / c.batchCapacity) * 100).toFixed(1)}%`,
      })),
      ...branches.map((b) => ({
        Module: "Branch Distribution",
        Category: b.branch,
        Registrations: b.registrations,
        Selections: b.selections,
        Accepted: Math.round(b.selections * (b.acceptanceRate / 100)),
        "Capacity Filled %": `${b.acceptanceRate}%`,
      })),
    ]);
    toast.success("Executive Deep Analytics dataset exported");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Statewide Business Intelligence
            </span>
            <span className="text-xs text-blue-200">Curriculum, Branch, Exam & Telemetry Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Deep Multi-Dimensional Analytics Suite
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Statewide academic segmentation across courses, engineering branches, passing out batches, AI proctoring integrity, and communication deliverability.
          </p>
        </div>

        <button
          onClick={handleExportDeepAnalytics}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Deep Analytics
        </button>
      </div>

      {/* Analytics Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "courses"
              ? "bg-[#001B4D] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Course Tracks (6)
        </button>

        <button
          onClick={() => setActiveTab("branches")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "branches"
              ? "bg-[#001B4D] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          Branches & Passing Years
        </button>

        <button
          onClick={() => setActiveTab("exams")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "exams"
              ? "bg-[#001B4D] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Exam & Question Difficulty
        </button>

        <button
          onClick={() => setActiveTab("communication")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "communication"
              ? "bg-[#001B4D] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          Communication Deliverability
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "health"
              ? "bg-[#001B4D] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Server className="w-4 h-4 text-cyan-400" />
          System Health & Security
        </button>
      </div>

      {/* TAB 1: COURSE ANALYTICS */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((crs) => (
              <div
                key={crs.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      style={{ color: crs.color }}
                      className="text-[10px] font-bold uppercase tracking-wider block"
                    >
                      {crs.shortCode} Track
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {crs.courseName}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-cyan-300 rounded-md">
                    {crs.completionForecastDays}d to Launch
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-slate-500 block">Registered</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {crs.registrations.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                    <span className="text-slate-500 block">Qualified</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {crs.qualified.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                    <span className="text-emerald-700 dark:text-emerald-400 block">Selected</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                      {crs.selections.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/20 rounded-xl">
                    <span className="text-cyan-700 dark:text-cyan-400 block">Accepted</span>
                    <span className="font-bold text-cyan-800 dark:text-cyan-300 text-sm">
                      {crs.accepted.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Batch Filled Meter */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Batch Capacity:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {crs.batchFilled} / {crs.batchCapacity} (
                      {((crs.batchFilled / crs.batchCapacity) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${(crs.batchFilled / crs.batchCapacity) * 100}%`,
                        backgroundColor: crs.color,
                      }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BRANCHES & PASSING YEARS */}
      {activeTab === "branches" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Branch Distribution Table (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Branch-wise Academic Candidates Breakdown
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                      <th className="py-2.5 px-3">Branch Name</th>
                      <th className="py-2.5 px-3 text-right">Registered</th>
                      <th className="py-2.5 px-3 text-right">Selected</th>
                      <th className="py-2.5 px-3 text-right">Acceptance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {branches.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                          {b.branch} ({b.code})
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                          {b.registrations.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {b.selections.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#005BBB] dark:text-cyan-400">
                          {b.acceptanceRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Passing Year Trends (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Candidate Volumes by Passing Year
              </h2>
              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={passingYears}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="#005BBB" name="Registered" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="selections" fill="#10B981" name="Selected" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXAM & QUESTION DIFFICULTY */}
      {activeTab === "exams" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Avg Score</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">{examMetrics.avgScore}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Highest Mark</span>
              <span className="text-lg font-bold text-emerald-600 mt-1 block">{examMetrics.highestScore}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Lowest Mark</span>
              <span className="text-lg font-bold text-slate-500 mt-1 block">{examMetrics.lowestScore}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pass Percentage</span>
              <span className="text-lg font-bold text-blue-600 dark:text-cyan-400 mt-1 block">{examMetrics.passPct}%</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-800">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-semibold block">Violations Logged</span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-1 block">{examMetrics.violationsLogged}</span>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-slate-800">
              <span className="text-[10px] text-rose-700 dark:text-rose-400 uppercase font-semibold block">Terminations</span>
              <span className="text-lg font-bold text-rose-700 dark:text-rose-400 mt-1 block">{examMetrics.terminations}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Questions Flagged for High Difficulty or Attrition
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Item ID</th>
                    <th className="py-2.5 px-3">Concept / Topic</th>
                    <th className="py-2.5 px-3 text-center">Correct %</th>
                    <th className="py-2.5 px-3 text-center">Skipped %</th>
                    <th className="py-2.5 px-3">Recommendation / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {hardQuestions.map((q) => (
                    <tr key={q.id}>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{q.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{q.subject}</td>
                      <td className="py-3 px-3 text-center font-bold text-rose-600">{q.accuracy}</td>
                      <td className="py-3 px-3 text-center text-amber-600">{q.skipped}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{q.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNICATION DELIVERABILITY */}
      {activeTab === "communication" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase block">WhatsApp Dispatched</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{commMetrics.whatsAppSent.toLocaleString()}</span>
              <span className="text-xs text-slate-500 mt-1 block">Read Ratio: {commMetrics.whatsAppReadRate}%</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase block">HTML Emails Sent</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">{commMetrics.emailSent.toLocaleString()}</span>
              <span className="text-xs text-slate-500 mt-1 block">Open Ratio: {commMetrics.emailOpenRate}%</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Meetings Held</span>
              <span className="text-2xl font-black text-purple-600 mt-1 block">{commMetrics.meetingsCompletedRate}%</span>
              <span className="text-xs text-slate-500 mt-1 block">With TPOs & Principals</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase block">Follow-Up Completion</span>
              <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 mt-1 block">{commMetrics.followUpsCompletedRate}%</span>
              <span className="text-xs text-slate-500 mt-1 block">Escalation Rate: {commMetrics.escalationRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM HEALTH & SECURITY */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemHealth.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white block">{item.value}</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
