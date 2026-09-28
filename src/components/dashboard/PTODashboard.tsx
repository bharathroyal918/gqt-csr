"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  Copy,
  Download,
  Share2,
  Search,
  ChevronRight,
  Shield,
  FileSpreadsheet,
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

export function PTODashboard() {
  const { currentUser, colleges, drives, students } = useApp();
  const [searchUSN, setSearchUSN] = useState("");

  // Determine college for this PTO
  const college = colleges.find(
    (c) => c.id === currentUser.collegeId || (currentUser.collegeName && c.name.toLowerCase() === currentUser.collegeName.toLowerCase())
  ) || colleges[0];

  const collegeName = currentUser.collegeName || college?.name || "";

  // Filter students from this college
  const collegeStudents = college
    ? students.filter(
        (s) => s.collegeId === college.id || (collegeName && s.collegeName?.toLowerCase() === collegeName.toLowerCase())
      )
    : students;

  const totalEligible = college?.eligibleStudentsCount || collegeStudents.length;
  const enrolledCount = collegeStudents.length;
  const examAttended = collegeStudents.filter(
    (s) => s.examResult || s.status === "Exam Completed" || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const qualifiedCount = collegeStudents.filter(
    (s) => s.examResult?.qualified || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const placedCount = collegeStudents.filter(
    (s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted" || s.status === "Offer Sent"
  ).length;

  const placementRate = enrolledCount > 0 ? Math.round((placedCount / enrolledCount) * 100) : 0;

  // Active drives for this college
  const activeDrives = drives.filter((d) => d.status !== "Completed" && d.status !== "Archived");

  // Department breakdown data
  const branchCounts: Record<string, { registered: number; qualified: number }> = {};
  collegeStudents.forEach((s) => {
    const branch = s.branch || "General";
    if (!branchCounts[branch]) {
      branchCounts[branch] = { registered: 0, qualified: 0 };
    }
    branchCounts[branch].registered += 1;
    if (s.examResult?.qualified || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Accepted") {
      branchCounts[branch].qualified += 1;
    }
  });

  const branchChartData = Object.keys(branchCounts).length > 0
    ? Object.entries(branchCounts).map(([branch, data]) => ({
        branch: branch.length > 10 ? branch.slice(0, 10) + ".." : branch,
        registered: data.registered,
        qualified: data.qualified,
      }))
    : [
        { branch: "CSE", registered: 45, qualified: 32 },
        { branch: "ISE", registered: 30, qualified: 22 },
        { branch: "ECE", registered: 28, qualified: 18 },
        { branch: "EEE", registered: 15, qualified: 10 },
      ];

  const filteredCandidates = collegeStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchUSN.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchUSN.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchUSN.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const handleExportCSV = () => {
    const headers = "USN,Name,Branch,CGPA,Status,College\n";
    const rows = collegeStudents
      .map((s) => `"${s.usn}","${s.fullName}","${s.branch}",${s.cgpa},"${s.status}","${collegeName}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${collegeName.replace(/\s+/g, "_")}_Candidates.csv`;
    a.click();
    toast.success("Candidate roster exported successfully");
  };

  return (
    <div className="space-y-8">
      {/* PTO Hero Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#003087] via-[#004A99] to-[#005BBB] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-cyan-200 mb-3">
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>{collegeName} • Placement & Training Officer Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Managing campus drive eligibility, student online assessment batches, hall ticket distribution, and digital offer verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 text-white font-bold text-xs hover:bg-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export Roster (CSV)</span>
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-300" />
              <span>PTO AUTHORITY</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* College Placement Performance KPIs */}
      <div>
        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight mb-4">
          Campus Recruitment Health
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Eligible Students"
            value={totalEligible}
            icon={GraduationCap}
            subtitle="Final-Year 2026 Batch"
            gradient="blue"
          />
          <StatCard
            title="Drive Enrolled"
            value={enrolledCount}
            icon={Users}
            subtitle={`${Math.round((enrolledCount / totalEligible) * 100)}% Enrolled`}
            gradient="cyan"
          />
          <StatCard
            title="Exams Attended"
            value={examAttended}
            icon={CheckCircle2}
            subtitle="Proctored Labs"
            gradient="navy"
          />
          <StatCard
            title="Qualified Cutoff"
            value={qualifiedCount}
            icon={Award}
            subtitle="Scorecard ≥ 50%"
            gradient="emerald"
          />
          <StatCard
            title="Offers Received"
            value={placedCount}
            icon={Briefcase}
            subtitle="Corporate Placements"
            gradient="amber"
          />
          <StatCard
            title="Placement Rate"
            value={`${placementRate}%`}
            icon={Building2}
            subtitle="Target ≥ 80%"
            gradient="purple"
          />
        </div>
      </div>

      {/* Active Drives Open For This College */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Active CSR Campus Drives Open for Your College
            </h3>
            <p className="text-xs text-slate-400">
              Direct registration links and proctored assessment schedules for enrolled students
            </p>
          </div>
          <span className="text-xs font-bold text-[#005BBB] dark:text-blue-400">
            {activeDrives.length} Drives Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDrives.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#005BBB]/10 text-[#005BBB] dark:text-blue-400">
                    {d.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-white mt-1">
                    {d.name}
                  </h4>
                </div>
                <StatusBadge status={d.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Mode:</span>
                  <span className="font-medium">{d.mode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Exam Date:</span>
                  <span className="font-medium">{d.schedule?.examDate || "Scheduled Soon"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Min CGPA:</span>
                  <span className="font-bold text-[#005BBB]">{d.minCgpa}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Allowed Backlogs:</span>
                  <span className="font-medium">{d.backlogAllowed ? `Up to ${d.maxBacklogs}` : "Zero"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(d.automation?.registrationLink || `http://localhost:3000/student/register?drive=${d.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#005BBB]" />
                  <span>Copy Registration Link</span>
                </button>
                <Link
                  href={`/portal/drives/${d.id}`}
                  className="text-xs font-bold text-[#005BBB] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Drive Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Department Breakdown Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch-wise Performance */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-1">
            Department-wise Candidate Engagement
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Registered vs Qualified students across engineering departments
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="branch" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
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
                <Bar dataKey="registered" name="Registered" fill="#005BBB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qualified" name="Qualified" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PTO Resource & Coordination Card */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            Placement Cell Actions
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[#005BBB] dark:text-blue-400 text-xs font-bold hover:bg-blue-100 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" /> Download Complete Batch Roster
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href="/portal/attendance"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#005BBB]" /> Check Campus Exam Attendance
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portal/offers"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Verify College Digital Offers
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs space-y-1">
            <span className="font-bold block">Support & Helpdesk</span>
            <p className="text-[11px] leading-relaxed">
              Need to add or modify eligibility criteria for an upcoming campus drive? Contact the CSR operations lead.
            </p>
          </div>
        </div>
      </div>

      {/* College Students Roster Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Campus Candidates Roster ({collegeStudents.length})
            </h3>
            <p className="text-xs text-slate-400">
              Students from {collegeName} registered for GQT CSR initiatives
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by USN or Name..."
              value={searchUSN}
              onChange={(e) => setSearchUSN(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">USN</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Branch</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Exam Result</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCandidates.map((s) => (
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
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">
                    {s.cgpa}
                  </td>
                  <td className="p-3">
                    {s.examResult ? (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.examResult.qualified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {s.examResult.percentage}% ({s.examResult.qualified ? "Passed" : "Retake"})
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Pending</span>
                    )}
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
