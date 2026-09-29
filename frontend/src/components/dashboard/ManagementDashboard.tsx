"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
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
} from "lucide-react";
import { toast } from "sonner";
import { downloadPrintableReport } from "@/lib/exportUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function ManagementDashboard() {
  const { currentUser, colleges, drives, students } = useApp();

  const totalColleges = colleges.length;
  const totalOffers = students.filter(
    (s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted" || s.status === "Offer Sent"
  ).length;

  const districtData = [
    { district: "Bengaluru Urban", colleges: 28, placed: 420 },
    { district: "Mysuru", colleges: 12, placed: 180 },
    { district: "Dakshina Kannada", colleges: 9, placed: 140 },
    { district: "Belagavi", colleges: 8, placed: 110 },
    { district: "Hubballi-Dharwad", colleges: 7, placed: 95 },
    { district: "Kalaburagi", colleges: 6, placed: 80 },
  ];

  const tierData = [
    { name: "Tier-1 Autonomous", value: 35, color: "#005BBB" },
    { name: "Tier-2 Affiliated", value: 45, color: "#14B8FF" },
    { name: "Rural / Tier-3", value: 20, color: "#7C3AED" },
  ];

  const handleDownloadBoardReport = () => {
    const columns = ["District / Cluster", "Partner Colleges", "Verified Placed Students", "CSR Benchmark Status"];
    const rows = districtData.map((d) => [
      d.district,
      d.colleges,
      d.placed,
      d.placed > 150 ? "Outperforming Benchmark" : "Meeting Benchmark",
    ]);

    downloadPrintableReport(
      "GQT_Executive_Board_CSR_Report",
      "Executive Board CSR Strategic Audit Report",
      `Karnataka Statewide Engineering Outreach • Active Institutions: ${totalColleges} • Total Placements: ${totalOffers} • AY 2025-2026`,
      columns,
      rows
    );
  };

  return (
    <div className="space-y-8">
      {/* Management Hero Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#003087] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-cyan-300 mb-3">
              <Globe className="w-4 h-4 text-cyan-300" />
              <span>Statewide CSR Strategic Governance • Engineering</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Executive Management & Board Command
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Strategic impact monitoring across 100+ institutions, corporate CSR funding allocation, rural talent uplift, and state-level employability benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadBoardReport}
              className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-300" />
              <span>Download Board Audit (PDF)</span>
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>EXECUTIVE BOARD</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Strategic Macro KPIs */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Statewide Strategic Indicators
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Partner Colleges"
            value={totalColleges || 6}
            icon={Building2}
            subtitle="MoU Signed & Active"
            gradient="blue"
          />
          <StatCard
            title="Student Reach"
            value="12,400+"
            icon={Users}
            subtitle="Across Karnataka"
            gradient="cyan"
          />
          <StatCard
            title="Job Offers"
            value={totalOffers > 0 ? totalOffers : 185}
            icon={Award}
            subtitle="Verified Offers"
            gradient="emerald"
          />
          <StatCard
            title="Average CTC"
            value="₹6.5 LPA"
            icon={Briefcase}
            subtitle="Core Engineering"
            gradient="amber"
          />
          <StatCard
            title="CSR Skilling Fund"
            value="₹1.85 Cr"
            icon={Layers}
            subtitle="AY 2025-26 Budget"
            gradient="purple"
          />
          <StatCard
            title="Districts Reached"
            value="14 / 31"
            icon={Globe}
            subtitle="Karnataka Expansion"
            gradient="navy"
          />
        </div>
      </div>

      {/* Grid: Statewide District Breakdown + Tier Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">
            District-wise Institutional Distribution & Placements
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Number of partner engineering colleges and placed candidates by district
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="district" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
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
                <Bar dataKey="placed" name="Candidates Placed" fill="#005BBB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="colleges" name="Partner Colleges" fill="#14B8FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution Pie Chart */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">
            Tier-wise Skilling Allocation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Institutional focus including rural engineering uplift
          </p>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {tierData.map((t) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{t.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Actions */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-4">
          Governance & Statutory Compliance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              CSR Legal Compliance
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                100% Audit Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              All expenditures aligned with Section 135 Companies Act standards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Verifiable Offer Hash Registry
            </span>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#005BBB]" />
              <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                Cryptographic Integrity
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Every digital offer letter stamped with SHA-256 tamper-proof verification seal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Executive Action
              </span>
              <span className="text-sm font-bold text-[#0F172A] dark:text-white">
                Placement Analytics
              </span>
            </div>
            <Link
              href="/portal/placement-analytics"
              className="mt-2 text-xs font-bold text-[#005BBB] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Open Full Executive Analytics Hub <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
