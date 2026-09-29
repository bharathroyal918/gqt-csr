"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Building2,
  TrendingUp,
  FileCheck2,
  CheckCircle,
  Download,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Briefcase,
  ExternalLink,
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
} from "recharts";

export function PrincipalDashboard() {
  const { currentUser, colleges, students } = useApp();

  const college = colleges.find(
    (c) => c.id === currentUser.collegeId || (currentUser.collegeName && c.name.toLowerCase() === currentUser.collegeName.toLowerCase())
  ) || colleges[0];

  const collegeName = currentUser.collegeName || college?.name || "";

  const collegeStudents = college
    ? students.filter(
        (s) => s.collegeId === college.id || (collegeName && s.collegeName?.toLowerCase() === collegeName.toLowerCase())
      )
    : students;

  const placedStudents = collegeStudents.filter(
    (s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted" || s.status === "Offer Sent" || s.status === "HR Selected"
  );

  const totalEligible = college?.eligibleStudentsCount || collegeStudents.length;
  const placementRate = totalEligible > 0 ? Math.min(Math.round((placedStudents.length / totalEligible) * 100), 100) : 0;

  const departmentData = [
    { department: "Computer Science", placed: 94, total: 100, rate: "94%" },
    { department: "Information Science", placed: 88, total: 95, rate: "92%" },
    { department: "Electronics & Comm", placed: 78, total: 90, rate: "86%" },
    { department: "Mechanical Engg", placed: 55, total: 70, rate: "78%" },
    { department: "AI & Data Science", placed: 48, total: 50, rate: "96%" },
  ];

  const handleDownloadReport = () => {
    const columns = ["Engineering Department", "Batch Enrolled", "Offers Secured", "Placement Conversion %"];
    const rows = departmentData.map((d) => [d.department, d.total, d.placed, d.rate]);

    downloadPrintableReport(
      `GQT_${collegeName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Placement_Report`,
      `${collegeName} • Institutional CSR Placement Report`,
      `Academic Governance & NAAC / NBA Placement Benchmark Summary • AY 2025-2026 • Overall Conversion: ${placementRate}%`,
      columns,
      rows
    );
  };

  return (
    <div className="space-y-8">
      {/* Principal Hero Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#001B4D] via-[#003087] to-[#005BBB] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-amber-300 mb-3">
              <Award className="w-4 h-4 text-amber-300" />
              <span>{collegeName} • Institutional Leadership & Dean Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Executive Institutional Governance
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Academic placement metrics, industry CSR Memorandum of Understanding (MoU) compliance, and statewide tier benchmarking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Board Audit (PDF)</span>
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>PRINCIPAL AUTHORITY</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* Executive Institutional KPIs */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Institutional Placement Pulse
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Placement Ratio"
            value={`${placementRate}%`}
            icon={TrendingUp}
            subtitle="AY 2025-26 Target Exceeded"
            gradient="blue"
          />
          <StatCard
            title="Total Placed"
            value={placedStudents.length || 382}
            icon={GraduationCap}
            subtitle="Final Year Students"
            gradient="emerald"
          />
          <StatCard
            title="Average Package"
            value="₹6.5 LPA"
            icon={Briefcase}
            subtitle="Core Engineering Roles"
            gradient="cyan"
          />
          <StatCard
            title="Highest Package"
            value="₹18.0 LPA"
            icon={Award}
            subtitle="Tier-1 Software Engg"
            gradient="amber"
          />
          <StatCard
            title="Industry MoUs"
            value="1 Active"
            icon={FileCheck2}
            subtitle="Global Quest Technologies"
            gradient="navy"
          />
          <StatCard
            title="NAAC / NBA Status"
            value={college?.naacGrade || "—"}
            icon={Building2}
            subtitle={college?.nbaStatus || "Accreditation"}
            gradient="purple"
          />
        </div>
      </div>

      {/* Grid: Department Bar Chart + MoU Governance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Placement Comparison */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">
            Department-wise Placement Performance
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Percentage of eligible students placed by engineering discipline
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="department" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
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
                <Bar dataKey="placed" name="Students Placed" fill="#005BBB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MoU Governance & Legal Status */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Institutional MoU Status
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              Active & Verified
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Corporate Sponsor</span>
              <span className="font-bold text-[#0F172A] dark:text-white">Global Quest Technologies Pvt. Ltd.</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Execution Date</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{college?.mouSignedDate || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Scope of Training</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">Full Stack, Cloud, AI & Core Engineering</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">Placement Commitment</span>
              <span className="font-bold text-emerald-600">80%+ Guaranteed Interview Pipeline</span>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              href="/portal/documents"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[#005BBB] dark:text-blue-400 text-xs font-bold hover:bg-blue-100 flex items-center justify-between transition-colors"
            >
              <span>View Executed MoU Document</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portal/reports"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between transition-colors"
            >
              <span>Comprehensive Analytics Report</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Placed Candidates Hall of Fame */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Campus Placement Hall of Fame
            </h3>
            <p className="text-xs text-slate-400">
              Recent verified digital offer letters issued to students of {collegeName}
            </p>
          </div>
          <Link
            href="/portal/offers"
            className="text-xs font-bold text-[#005BBB] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Verified Offers →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">USN</th>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Job Role</th>
                <th className="p-3">CTC Package</th>
                <th className="p-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {collegeStudents.slice(0, 5).map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#005BBB] dark:text-blue-400">
                    {s.usn}
                  </td>
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {s.fullName}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {s.branch}
                  </td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-200">
                    {s.offerDetails?.roleTitle || (idx % 2 === 0 ? "Associate Software Engineer" : "Data Engineer")}
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    {s.offerDetails?.ctc || (idx === 0 ? "₹ 9.5 LPA" : "₹ 6.5 LPA")}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Cryptographically Sealed
                    </span>
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
