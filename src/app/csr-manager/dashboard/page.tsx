"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { StatCard } from "@/components/common/StatCard";
import { Drawer } from "@/components/common/Drawer";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  Users,
  Award,
  Calendar,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileCheck2,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface OperationTask {
  id: string;
  title: string;
  category: "Call" | "Approval" | "Registration" | "Exam" | "Interview" | "WhatsApp" | "Reminder";
  time: string;
  entity: string;
  priority: "High" | "Medium" | "Normal";
  completed: boolean;
}

const INITIAL_TASKS: OperationTask[] = [
  { id: "task-01", title: "Principal MoU Follow-up Call", category: "Call", time: "11:00 AM", entity: "R.V. College of Engineering", priority: "High", completed: false },
  { id: "task-02", title: "Review Department Faculty Signoffs", category: "Approval", time: "12:30 PM", entity: "BMSCE — ISE Dept", priority: "Medium", completed: false },
  { id: "task-03", title: "Registration Window Closing (Phase-1)", category: "Registration", time: "05:00 PM", entity: "Karnataka CSR Flagship", priority: "High", completed: false },
  { id: "task-04", title: "Live Online Exam Window Starts", category: "Exam", time: "02:00 PM", entity: "Batch 2025 Test Pool A", priority: "High", completed: false },
  { id: "task-05", title: "HR Interview Panel Room Calibration", category: "Interview", time: "03:30 PM", entity: "Hitha, Kusuma & Divya.H", priority: "Medium", completed: false },
  { id: "task-06", title: "Broadcast WhatsApp Batch Group Link", category: "WhatsApp", time: "04:15 PM", entity: "140 Qualified Candidates", priority: "Normal", completed: false },
  { id: "task-07", title: "Automated 24h Hall Ticket Push Notification", category: "Reminder", time: "06:00 PM", entity: "Omnichannel Bot Dispatch", priority: "Normal", completed: false },
];

export default function CSRManagerDashboardPage() {
  const { drives, colleges, students, users, followUps, crmInteractions } = useApp();
  const [tasks, setTasks] = useState<OperationTask[]>(INITIAL_TASKS);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any | null>(null);

  // Dynamic KPI counts
  const totalDrives = drives.length;
  const activeDrives = drives.filter((d) => d.status.toLowerCase().includes("progress") || d.status.toLowerCase().includes("open") || d.status.toLowerCase().includes("active")).length;
  const draftDrives = drives.filter((d) => d.status.toLowerCase().includes("draft")).length;
  const upcomingDrives = drives.filter((d) => d.status.toLowerCase().includes("upcoming") || d.status.toLowerCase().includes("scheduled")).length;
  const completedDrives = drives.filter((d) => d.status.toLowerCase().includes("completed")).length;

  const collegesAssigned = colleges.length;
  const pendingConfirmations = colleges.filter((c) => c.status === "Contacted" || c.status === "In Discussion").length;
  const studentsRegistered = students.length;
  const examScheduled = students.filter((s) => s.status.includes("Exam") || s.status.includes("Scheduled") || s.status.includes("Registered")).length;
  const interviewScheduled = students.filter((s) => s.status.includes("Interview") || s.status.includes("Qualified")).length;
  const offerLettersPending = students.filter((s) => s.status.toLowerCase().includes("select") || s.status.toLowerCase().includes("offer")).length;

  const todayCallsCount = crmInteractions.filter((c) => c.type === "Call" || (c.summary && c.summary.toLowerCase().includes("call"))).length || colleges.filter((c) => c.placementOfficer?.mobile).length;
  const upcomingFollowupsCount = followUps.filter((f) => f.status === "Pending").length || pendingConfirmations;
  const assignedHRsCount = users.filter((u) => u.role === "hr" || (u.role as string) === "hr_recruiter").length;
  const driveSuccessPct = `${studentsRegistered > 0 ? Math.round((students.filter((s) => s.status.includes("Offer") || s.status.includes("Selected")).length / studentsRegistered) * 100) : 0}%`;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    toast.success("Operational task state updated");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Operations Command Console
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Operational Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            CSR Operations Command
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan multi-phase campus drives, orchestrate college MoUs, allocate recruiter panels, and monitor candidate throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/csr-manager/drives/create">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2">
              <Sparkles className="w-4 h-4" /> Create CSR Drive
            </Button>
          </Link>
          <Link href="/csr-manager/calendar">
            <Button variant="outline" className="border-border hover:bg-muted gap-2">
              <Calendar className="w-4 h-4" /> Operations Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* 14 Operational KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard title="Active Drives" value={activeDrives} change="In Execution" trend="up" icon={Briefcase} isPositive />
        <StatCard title="Draft Drives" value={draftDrives} change="Under Authoring" trend="neutral" icon={FileText} />
        <StatCard title="Upcoming Drives" value={upcomingDrives} change="Next 30 Days" trend="up" icon={Clock} isPositive />
        <StatCard title="Completed" value={completedDrives} change="Full Audit Ready" trend="up" icon={CheckCircle2} isPositive />
        <StatCard title="Colleges Assigned" value={collegesAssigned} change="Karnataka VTU" trend="up" icon={Building2} isPositive />
        <StatCard title="Pending Confirms" value={pendingConfirmations} change="MoU Negotiation" trend="down" icon={AlertTriangle} />
        <StatCard title="Registered" value={studentsRegistered.toLocaleString()} change="Verified Candidates" trend="up" icon={Users} isPositive />
        <StatCard title="Exam Scheduled" value={examScheduled} change="Auto-proctored" trend="up" icon={FileCheck2} isPositive />
        <StatCard title="Interview Slot" value={interviewScheduled} change="HR Recruiter Room" trend="up" icon={UserCheck} isPositive />
        <StatCard title="Offers Pending" value={offerLettersPending} change="Awaiting Release" trend="neutral" icon={Award} />
        <StatCard title="Today Calls" value={todayCallsCount} change="Principal & PTO" trend="up" icon={PhoneCall} isPositive />
        <StatCard title="Upcoming Follow-ups" value={upcomingFollowupsCount} change="Scheduled Outreach" trend="neutral" icon={Calendar} />
        <StatCard title="Assigned HRs" value={assignedHRsCount} change="Dedicated Panels" trend="up" icon={Users} isPositive />
        <StatCard title="Drive Success" value={driveSuccessPct} change="Throughput Yield" trend="up" icon={TrendingUp} isPositive />
      </div>

      {/* Two-Column Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Operations Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-md">
            <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Today's Operational Action Panel
                </CardTitle>
                <CardDescription className="text-xs">
                  Immediate operational deadlines, institutional outreach, and testing schedules
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {tasks.filter((t) => !t.completed).length} Pending Actions
              </span>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-border/40">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`py-3 flex items-center justify-between gap-4 transition-colors ${
                    task.completed ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            task.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                            task.priority === "High"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : task.priority === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.entity} • Scheduled at <span className="font-semibold text-foreground">{task.time}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {task.category}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Drive Health Matrix */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Active CSR Drives Status
              </h3>
              <Link href="/csr-manager/drives" className="text-xs text-primary hover:underline flex items-center gap-1">
                View All Drives <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {drives.slice(0, 3).map((d) => (
                <div key={d.id} className="p-3 bg-muted/30 rounded-2xl border border-border/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{d.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {d.academicYear} • {d.metrics?.collegesCount || 10} Institutions Enrolled
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{d.metrics?.registeredStudents || 420}</p>
                      <p className="text-[10px] text-muted-foreground">Registered</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Calendar Preview & Shortcuts */}
        <div className="space-y-6">
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-md">
            <CardTitle className="text-sm font-bold flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              Operational Milestones This Week
            </CardTitle>
            <div className="space-y-3 text-xs">
              <div
                onClick={() =>
                  setSelectedCalendarEvent({
                    title: "R.V. College Online Exam Day",
                    date: "Feb 18, 2025 (10:00 AM - 12:00 PM)",
                    desc: "Statewide technical screening for 280 registered CSE/ISE candidates.",
                    category: "Online Examination",
                  })
                }
                className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl cursor-pointer hover:bg-blue-500/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400">Feb 18, 2025</span>
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Exam</span>
                </div>
                <p className="font-semibold text-foreground mt-1">R.V. College Exam Day</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">280 candidates calibrated</p>
              </div>

              <div
                onClick={() =>
                  setSelectedCalendarEvent({
                    title: "BMSCE Technical Interviews",
                    date: "Feb 19, 2025 (09:30 AM - 05:00 PM)",
                    desc: "Recruiter panels assigned: Hitha, Kusuma & Divya.H for 45 shortlisted candidates.",
                    category: "Interview Panel",
                  })
                }
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl cursor-pointer hover:bg-emerald-500/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Feb 19, 2025</span>
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Interview</span>
                </div>
                <p className="font-semibold text-foreground mt-1">BMSCE Recruiter Interviews</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">45 candidates slotted</p>
              </div>

              <div
                onClick={() =>
                  setSelectedCalendarEvent({
                    title: "KLE Tech MoU Ratification",
                    date: "Feb 20, 2025 (11:00 AM)",
                    desc: "Executive meeting with VC Dr. Ashok Shettar for bilateral CSR signoff.",
                    category: "College Meeting",
                  })
                }
                className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl cursor-pointer hover:bg-purple-500/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400">Feb 20, 2025</span>
                  <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">MoU</span>
                </div>
                <p className="font-semibold text-foreground mt-1">KLE Tech MoU Execution</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Hubballi campus cluster</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 mt-3 text-center">
              <Link href="/csr-manager/calendar" className="text-xs text-primary font-semibold hover:underline">
                Open Full 30-Day Calendar →
              </Link>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Operational Workspaces
            </h4>
            <Link
              href="/csr-manager/colleges"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Colleges Master & Confirmation</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/assignments"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>HR Recruiter Workload</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/templates"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span>Bot & Template Manager</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </Card>
        </div>
      </div>

      {/* Calendar Event Details Drawer */}
      <Drawer
        isOpen={!!selectedCalendarEvent}
        onClose={() => setSelectedCalendarEvent(null)}
        title={selectedCalendarEvent?.title || "Operational Milestone"}
      >
        {selectedCalendarEvent && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                {selectedCalendarEvent.category}
              </span>
              <h3 className="text-sm font-bold text-foreground">{selectedCalendarEvent.title}</h3>
              <p className="text-muted-foreground">{selectedCalendarEvent.date}</p>
            </div>
            <p className="leading-relaxed text-muted-foreground">{selectedCalendarEvent.desc}</p>
            <div className="pt-4 border-t flex justify-end gap-2">
              <Button onClick={() => setSelectedCalendarEvent(null)}>Done</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
