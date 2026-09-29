"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Briefcase,
  PhoneCall,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  FileCheck2,
  FileText,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
  Video,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface PriorityTask {
  id: string;
  title: string;
  category: "Follow-Up" | "Interview" | "Exam Review" | "Meeting" | "Offer";
  time: string;
  entity: string;
  priority: "High" | "Critical" | "Normal";
  completed: boolean;
  link: string;
}

const INITIAL_TASKS: PriorityTask[] = [
  {
    id: "TSK-01",
    title: "Technical Interview Round 1 — Rahul Verma",
    category: "Interview",
    time: "10:30 AM",
    entity: "RV College of Engineering",
    priority: "High",
    completed: false,
    link: "/hr/interviews",
  },
  {
    id: "TSK-02",
    title: "Review 12 Flagged Anti-Cheating Exam Submissions",
    category: "Exam Review",
    time: "11:45 AM",
    entity: "BMS College of Engineering",
    priority: "Critical",
    completed: false,
    link: "/hr/exam-review",
  },
  {
    id: "TSK-03",
    title: "Placement Officer Call: Confirm Hall Booking for Offline Hackathon",
    category: "Follow-Up",
    time: "02:00 PM",
    entity: "PES University",
    priority: "High",
    completed: false,
    link: "/hr/crm",
  },
  {
    id: "TSK-04",
    title: "Sign & Release LOI Offer Letters for 18 Selected Students",
    category: "Offer",
    time: "03:30 PM",
    entity: "Dayananda Sagar College",
    priority: "High",
    completed: false,
    link: "/hr/offer-letters",
  },
  {
    id: "TSK-05",
    title: "Pre-Placement Briefing with Principal & HODs",
    category: "Meeting",
    time: "05:00 PM",
    entity: "Siddaganga Institute of Technology",
    priority: "Normal",
    completed: false,
    link: "/hr/crm",
  },
];

export default function HRDashboardPage() {
  const { drives, colleges, students } = useApp();
  const [tasks, setTasks] = useState<PriorityTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    toast.success("Task updated");
  };

  // Dynamic Metrics calculation directly from live database tables
  const totalAssignedDrives = drives.length;
  const totalAssignedColleges = colleges.length;
  const pendingCollegeFollowups = colleges.filter((c) => c.status === "Contacted" || c.status === "In Discussion").length;
  const todaysCalls = colleges.filter((c) => c.phone).length;
  const todaysMeetings = drives.filter((d) => d.status === "Exam In Progress" || d.status === "HR Pipeline" || d.status === "Registration Open").length;

  const totalRegistered = students.length;
  const appearedForExam = students.filter((s) => (s.examScore !== undefined && s.examScore > 0) || s.status.toLowerCase().includes("qualified") || s.status.toLowerCase().includes("selected") || s.status.toLowerCase().includes("offered")).length;
  const pendingReview = students.filter((s) => s.status.toLowerCase().includes("pending") || s.status.toLowerCase().includes("under review")).length;
  const qualifiedStudents = students.filter((s) => s.status.toLowerCase().includes("qualified") || s.status.toLowerCase().includes("selected") || s.status.toLowerCase().includes("offered")).length;
  const rejectedStudents = students.filter((s) => s.status.toLowerCase().includes("reject")).length;
  const selectedStudents = students.filter((s) => s.status.toLowerCase().includes("selected") || s.status.toLowerCase().includes("offered")).length;
  const holdStudents = students.filter((s) => s.status.toLowerCase().includes("hold")).length;
  const notAttendedStudents = students.filter((s) => s.status.toLowerCase().includes("attended") || s.status.toLowerCase().includes("absent")).length;
  const offerLettersPending = students.filter((s) => s.status.toLowerCase().includes("selected") && !s.offer).length;
  const offerLettersSent = students.filter((s) => Boolean(s.offer) || s.status.toLowerCase().includes("offered")).length;

  const kpis = [
    { title: "Assigned CSR Drives", value: totalAssignedDrives, icon: Briefcase, color: "text-[#005BBB]", sub: "Active Campaigns", link: "/hr/assigned-drives" },
    { title: "Assigned Colleges", value: totalAssignedColleges, icon: Building2, color: "text-indigo-600", sub: "Regional Campuses", link: "/hr/assigned-colleges" },
    { title: "Pending Follow-Ups", value: pendingCollegeFollowups, icon: CalendarCheck, color: "text-amber-500", sub: "Placement Officers", link: "/hr/followups" },
    { title: "Today's Calls", value: todaysCalls, icon: PhoneCall, color: "text-emerald-600", sub: "Scheduled Outreach", link: "/hr/crm" },
    { title: "Today's Meetings", value: todaysMeetings, icon: Calendar, color: "text-sky-600", sub: "Principal / PTO", link: "/hr/crm" },
    { title: "Students Registered", value: totalRegistered, icon: Users, color: "text-slate-800", sub: "Campus Roster", link: "/hr/students" },
    { title: "Appeared for Exam", value: appearedForExam, icon: FileText, color: "text-blue-600", sub: "Assessments Attempted", link: "/hr/exam-review" },
    { title: "Exam Pending Review", value: pendingReview, icon: Clock, color: "text-rose-500 font-bold animate-pulse", sub: "Requires Decision", link: "/hr/exam-review" },
    { title: "Qualified Students", value: qualifiedStudents, icon: Award, color: "text-teal-600", sub: "Cleared Cutoff", link: "/hr/students" },
    { title: "Rejected Students", value: rejectedStudents, icon: XCircle, color: "text-slate-500", sub: "Below Benchmark", link: "/hr/rejected-students" },
    { title: "Selected Students", value: selectedStudents, icon: CheckCircle2, color: "text-emerald-600 font-bold", sub: "Interview Cleared", link: "/hr/selected-students" },
    { title: "Hold Students", value: holdStudents, icon: AlertCircle, color: "text-amber-600", sub: "Under Review", link: "/hr/hold-students" },
    { title: "Not Attended", value: notAttendedStudents, icon: AlertTriangle, color: "text-purple-600", sub: "Absent in Round", link: "/hr/not-attended" },
    { title: "Offers Pending", value: offerLettersPending, icon: Clock, color: "text-amber-500", sub: "Draft / In Review", link: "/hr/offer-letters" },
    { title: "Offers Released", value: offerLettersSent, icon: Award, color: "text-emerald-600 font-bold", sub: "Official LOIs", link: "/hr/offer-letters" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Recruitment Command Operations
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">HR Recruiter Command Center</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Evaluate candidate assessments in real time, interview top percentile talent, manage campus MoUs, and issue verified GQT offer letters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/hr/exam-review">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <FileCheck2 className="w-4 h-4" />
              Review Exams ({pendingReview})
            </Button>
          </Link>
          <Link href="/hr/interviews">
            <Button variant="secondary" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Video className="w-4 h-4" />
              Start Interviews
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (15 Enterprise Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Link key={index} href={kpi.link} className="block group">
              <Card className="p-3.5 bg-white border border-slate-200 group-hover:border-[#005BBB]/50 transition-all shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-medium truncate">{kpi.title}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className={`text-2xl font-bold ${kpi.color}`}>
                    {typeof kpi.value === "number" ? kpi.value.toLocaleString() : kpi.value}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#005BBB] transition-colors" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                  {kpi.sub}
                </span>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Today's Action Center & Operational Alert Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Action Center */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#005BBB]" />
                <h3 className="font-bold text-slate-900 text-base">Today&apos;s Action Center</h3>
                <span className="bg-blue-100 text-[#005BBB] text-xs font-bold px-2 py-0.5 rounded-full">
                  {tasks.filter((t) => !t.completed).length} pending
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200 hover:border-[#005BBB]/40 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded text-[#005BBB] focus:ring-[#005BBB] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.category === "Interview"
                              ? "bg-purple-100 text-purple-700"
                              : task.category === "Exam Review"
                              ? "bg-rose-100 text-rose-700"
                              : task.category === "Offer"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {task.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            task.priority === "Critical" ? "text-rose-600" : "text-amber-600"
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-mono text-slate-500">{task.time}</span>
                      </div>
                      <h4
                        className={`text-sm font-semibold mt-0.5 ${
                          task.completed ? "line-through text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500">{task.entity}</p>
                    </div>
                  </div>

                  <Link href={task.link}>
                    <Button variant="outline" size="sm" className="text-xs shrink-0 h-8">
                      Execute
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Review Alert Banner */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">14 Exam Submissions Awaiting Decision</h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Proctoring algorithms completed automated grading and violation logs. Review candidates to clear them for 1-on-1 technical interview rounds.
                  </p>
                </div>
              </div>
              <Link href="/hr/exam-review">
                <Button variant="cyan" size="sm" className="shrink-0 text-xs shadow">
                  Open Evaluation Queue
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Live Operational Status & Fast Links */}
        <div className="space-y-4">
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#005BBB]" />
              Live Recruitment Funnel
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Exam Attempted</span>
                  <span className="font-bold text-slate-900">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#005BBB] h-2 rounded-full" style={{ width: "88%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Cutoff Qualified</span>
                  <span className="font-bold text-slate-900">45%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Interview Conversion</span>
                  <span className="font-bold text-slate-900">24%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "24%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Offer Acceptance</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <Link href="/hr/crm" className="flex items-center justify-between text-xs text-slate-700 hover:text-[#005BBB] p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  Log Outgoing Outreach Call
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link href="/hr/interviews" className="flex items-center justify-between text-xs text-slate-700 hover:text-[#005BBB] p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-slate-400" />
                  Calibrate Interview Slots
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link href="/hr/offer-letters" className="flex items-center justify-between text-xs text-slate-700 hover:text-[#005BBB] p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  Issue Placement LOI Batch
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </Card>

          {/* Quick Notice */}
          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Realtime Supabase Sync Active
            </div>
            <p className="text-slate-300">
              Exam submissions, proctoring violation alerts, and candidate decisions synchronize instantly across Admin and CSR Manager dashboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
