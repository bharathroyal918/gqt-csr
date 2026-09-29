"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Briefcase,
  Building2,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  PlusCircle,
  FileText,
  PhoneCall,
  ArrowRight,
  TrendingUp,
  CloudSun,
  Shield,
  HelpCircle,
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";

export function CSRManagerDashboard() {
  const {
    currentUser,
    currentRole,
    drives,
    colleges,
    students,
    followUps,
    auditLogs,
    isLoading,
  } = useApp();

  const [timeRange, setTimeRange] = useState<"academic_year" | "month">("academic_year");

  // Dynamic Aggregated KPI numbers
  const totalDrives = drives.length;
  const activeDrives = drives.filter((d) => d.status !== "Completed" && d.status !== "Archived").length;
  const completedDrives = drives.filter((d) => d.status === "Completed").length;
  const totalColleges = colleges.length;
  const activeColleges = colleges.filter((c) => c.status === "Active").length;

  const totalRegistered = students.length;
  const examAttended = students.filter(
    (s) => s.examResult || s.status === "Exam Completed" || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const qualifiedStudents = students.filter(
    (s) => s.examResult?.qualified || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const interviewSelected = students.filter(
    (s) => s.status === "HR Selected" || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const offersSent = students.filter(
    (s) => s.offerDetails || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const acceptedOffers = students.filter(
    (s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted"
  ).length;

  // Monthly Drives Chart Data (derived from real drives & students)
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const monthlyDriveData = MONTH_NAMES.slice(0, Math.max(currentMonthIdx + 1, 6)).map((month, idx) => {
    const monthDrives = drives.filter((d) => {
      const dateStr = d.schedule?.regStart || d.schedule?.examDate;
      if (!dateStr) return false;
      const dDate = new Date(dateStr);
      return !isNaN(dDate.getTime()) && dDate.getMonth() === idx;
    }).length;
    const monthRegs = students.filter((s) => {
      if (!s.registeredAt) return false;
      const sDate = new Date(s.registeredAt);
      return !isNaN(sDate.getTime()) && sDate.getMonth() === idx;
    }).length;
    return {
      month,
      drives: monthDrives,
      registrations: monthRegs,
    };
  });

  // Course-wise Registration Pie Data (derived from real student courses)
  const courseCounts: Record<string, number> = {};
  students.forEach((s) => {
    const course = s.selectedCourse || s.branch || "General";
    courseCounts[course] = (courseCounts[course] || 0) + 1;
  });
  const coursePalette = ["#005BBB", "#14B8FF", "#7C3AED", "#10B981", "#F59E0B", "#EC4899"];
  const courseRegistrationData =
    Object.keys(courseCounts).length > 0
      ? Object.entries(courseCounts).map(([name, count], i) => ({
        name,
        value: count,
        color: coursePalette[i % coursePalette.length],
      }))
      : [];

  // Recruitment Funnel Data
  const funnelData = [
    { stage: "Registered", count: totalRegistered, fill: "#007BFF" },
    { stage: "Exam Attended", count: examAttended, fill: "#005BBB" },
    { stage: "Qualified", count: qualifiedStudents, fill: "#14B8FF" },
    { stage: "HR Selected", count: interviewSelected, fill: "#7C3AED" },
    { stage: "Offers Issued", count: offersSent, fill: "#F59E0B" },
    { stage: "Accepted", count: acceptedOffers, fill: "#10B981" },
  ];

  // College Participation Data (derived from real colleges & students)
  const collegeParticipationData = colleges.length > 0
    ? colleges.slice(0, 7).map((c) => {
      const cStudents = students.filter((s) => s.collegeId === c.id || s.collegeName === c.name);
      const cQualified = cStudents.filter(
        (s) => s.examResult?.qualified || s.status === "Qualified" || s.status === "HR Selected" || s.status === "Offer Accepted"
      );
      return {
        college: c.name.length > 16 ? c.name.slice(0, 16) + "..." : c.name,
        students: cStudents.length || c.eligibleStudentsCount || 0,
        qualified: cQualified.length || c.studentsPlaced || 0,
      };
    })
    : [{ college: "No Colleges Added", students: 0, qualified: 0 }];

  return (
    <div className="space-y-8">
      {/* Weather & Persona Greeting Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-r from-[#001B4D] via-[#003087] to-[#005BBB] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-cyan-200 mb-3">
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>Bengaluru, Karnataka • 28°C Sunny • Academic Year 2025-2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Managing end-to-end CSR campus drives, proctored examinations, HR interviews, and verifiable digital offer letters across 100+ Karnataka institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/30 text-white font-bold text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-300" />
              <span>CSR OPERATIONS COMMAND</span>
            </div>

            <Link
              href="/portal/drives/create"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#14B8FF] to-[#007BFF] text-white font-bold text-xs shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create CSR Drive</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
      </div>

      {/* 12 Enterprise KPI Widgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
            Recruitment & Skilling Pulse
          </h2>
          <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setTimeRange("academic_year")}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${timeRange === "academic_year"
                ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
                }`}
            >
              AY 2025-26
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${timeRange === "month"
                ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
                }`}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
          <StatCard
            title="Total CSR Drives"
            value={totalDrives}
            icon={Briefcase}
            change="+18%"
            subtitle={`${activeDrives} Active • ${completedDrives} Closed`}
            gradient="blue"
          />
          <StatCard
            title="Partner Colleges"
            value={totalColleges}
            icon={Building2}
            change="+12"
            subtitle={`${activeColleges} Signed MoUs`}
            gradient="navy"
          />
          <StatCard
            title="Students Registered"
            value={totalRegistered.toLocaleString()}
            icon={Users}
            change="+24%"
            subtitle="Autonomous & Premier"
            gradient="cyan"
          />
          <StatCard
            title="Exam Attendance"
            value={examAttended.toLocaleString()}
            icon={GraduationCap}
            change="88.2%"
            subtitle="Anti-Cheat Monitored"
            gradient="purple"
          />
          <StatCard
            title="Qualified Students"
            value={qualifiedStudents.toLocaleString()}
            icon={CheckCircle2}
            change="38.5%"
            subtitle="Cutoff Score ≥ 50%"
            gradient="emerald"
          />
          <StatCard
            title="Offers Accepted"
            value={acceptedOffers.toLocaleString()}
            icon={Award}
            change="94.8%"
            subtitle="Avg. ₹ 6.5 LPA"
            gradient="amber"
          />
        </div>
      </div>

      {/* Modern Data Visualizations: 4 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Drive Trajectory & Registrations */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Monthly Drive Trajectory & Registrations
              </h3>
              <p className="text-xs text-slate-400">
                Active drives conducted vs. student intake volume
              </p>
            </div>
            <div className="flex items-center gap-3.5 text-xs shrink-0">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005BBB]" /> Registrations
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14B8FF]" /> Drives Conducted
              </span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyDriveData}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005BBB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#005BBB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="driveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Student Registrations"
                  stroke="#005BBB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#regGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="drives"
                  name="Drives Conducted"
                  stroke="#14B8FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#driveGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Course-wise Enrollment Pie */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Course-wise Enrollment
              </h3>
              <p className="text-xs text-slate-400">
                Breakdown of students by specialized technical domain
              </p>
            </div>
            <Link
              href="/portal/reports"
              className="text-xs font-bold text-[#005BBB] hover:underline"
            >
              Full Breakdown →
            </Link>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseRegistrationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {courseRegistrationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {courseRegistrationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Recruitment Funnel Bar */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Candidate Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-400">
                Conversion funnel from registration to accepted job offers
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {((acceptedOffers / (totalRegistered || 1)) * 100).toFixed(1)}% Conversion
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} />
                <YAxis
                  dataKey="stage"
                  type="category"
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#FFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`funnel-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: College Participation */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Partner College Performance
              </h3>
              <p className="text-xs text-slate-400">
                Enrolled students vs. qualified candidates by institution
              </p>
            </div>
            <Link
              href="/portal/colleges"
              className="text-xs font-bold text-[#005BBB] hover:underline"
            >
              All Colleges →
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeParticipationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="college" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} />
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
                <Bar dataKey="students" name="Students Enrolled" fill="#005BBB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="qualified" name="Qualified Cutoff" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active CSR Drives Quick Overview Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Active CSR Campus Drives
            </h3>
            <p className="text-xs text-slate-400">
              Live recruitment drives across 15 operational workflow phases
            </p>
          </div>
          <Link
            href="/portal/drives"
            className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1"
          >
            <span>View All Drives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Drive Code</th>
                <th className="p-3">Drive Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Workflow Status</th>
                <th className="p-3">Registered</th>
                <th className="p-3">Exam Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {drives.slice(0, 5).map((drive) => (
                <tr key={drive.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#005BBB] dark:text-blue-400">
                    {drive.driveCode}
                  </td>
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {drive.name}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-300">
                      {drive.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={drive.status} size="sm" />
                  </td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                    {drive.metrics?.registeredStudents ?? (drive.metrics as any)?.registeredCount ?? 0}
                  </td>
                  <td className="p-3 text-slate-500 font-medium">
                    {drive.schedule.examDate}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/portal/drives/${drive.id}`}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] dark:text-blue-400 font-bold text-[11px] hover:bg-blue-100"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRM Interaction Feed & Scheduled Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Recent CRM Communications
              </h3>
              <p className="text-xs text-slate-400">
                Institutional outreach calls, emails, and MoU discussions
              </p>
            </div>
            <Link
              href="/portal/crm"
              className="text-xs font-bold text-[#005BBB] hover:underline"
            >
              Open CRM →
            </Link>
          </div>

          <div className="space-y-3">
            {colleges.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-white">
                    {c.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Contact: {c.placementOfficer?.name || "Placement Cell"}{c.district ? ` • ${c.district}` : ""}{c.state ? `, ${c.state}` : ""}
                  </p>
                </div>
                <StatusBadge status={c.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Follow-ups */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Scheduled Follow-up Reminders
              </h3>
              <p className="text-xs text-slate-400">
                Action items for partner engineering colleges
              </p>
            </div>
            <Link
              href="/portal/crm/follow-ups"
              className="text-xs font-bold text-[#005BBB] hover:underline"
            >
              View Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {followUps.slice(0, 3).map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#0F172A] dark:text-white">
                    {f.collegeName ? f.collegeName.split("(")[0] : "College"}
                  </span>
                  <StatusBadge status={f.dueCategory} size="sm" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {f.purpose}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Contact: {f.contactPerson}</span>
                  <span className="font-semibold text-[#005BBB]">{f.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Immutable Audit Feed */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Live Immutable Audit Activity
            </h3>
            <p className="text-xs text-slate-400">
              Enterprise tamper-proof audit trail of system events, tests, and offer letters
            </p>
          </div>
          <Link
            href="/portal/audit-logs"
            className="text-xs font-bold text-[#005BBB] hover:underline"
          >
            Audit Log Console →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#005BBB] mt-2 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                      {log.user}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
