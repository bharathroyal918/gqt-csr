"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { StatCard } from "@/components/common/StatCard";
import { Drawer } from "@/components/common/Drawer";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
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
  ShieldAlert,
  GraduationCap,
  Plus,
  BarChart3,
  Megaphone
} from "lucide-react";
import { TaskItem } from "@/types";

export default function CSRManagerDashboardPage() {
  const {
    drives,
    colleges,
    students,
    users,
    followUps,
    crmInteractions,
    tasks,
    addTask,
    updateTaskStatus,
  } = useApp();

  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskEntity, setNewTaskEntity] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("high");
  const [newTaskCategory, setNewTaskCategory] = useState("MoU Follow-up");

  // Dynamic KPI counts computed directly from database
  const totalDrives = drives.length;
  const activeDrives = drives.filter(
    (d) =>
      d.status.toLowerCase().includes("progress") ||
      d.status.toLowerCase().includes("open") ||
      d.status.toLowerCase().includes("active")
  ).length;
  const draftDrives = drives.filter((d) => d.status.toLowerCase().includes("draft")).length;
  const upcomingDrives = drives.filter(
    (d) =>
      d.status.toLowerCase().includes("upcoming") ||
      d.status.toLowerCase().includes("scheduled")
  ).length;
  const completedDrives = drives.filter((d) => d.status.toLowerCase().includes("completed")).length;

  const collegesAssigned = colleges.length;
  const pendingConfirmations = colleges.filter(
    (c) => c.status === "Contacted" || c.status === "In Discussion"
  ).length;
  const studentsRegistered = students.length;
  const examScheduled = students.filter(
    (s) =>
      s.status.includes("Exam") ||
      s.status.includes("Scheduled") ||
      s.status.includes("Registered")
  ).length;
  const interviewScheduled = students.filter(
    (s) => s.status.includes("Interview") || s.status.includes("Qualified")
  ).length;
  const offerLettersPending = students.filter(
    (s) => s.status.toLowerCase().includes("select") || s.status.toLowerCase().includes("offer")
  ).length;

  const todayCallsCount =
    crmInteractions.filter(
      (c) => c.type === "Call" || (c.summary && c.summary.toLowerCase().includes("call"))
    ).length || colleges.filter((c) => c.placementOfficer?.mobile).length;

  const upcomingFollowupsCount =
    followUps.filter((f) => f.status === "Pending").length || pendingConfirmations;
  const assignedHRsCount = users.filter(
    (u) => u.role === "hr" || (u.role as string) === "hr_recruiter"
  ).length;
  const driveSuccessPct = `${studentsRegistered > 0
      ? Math.round(
        (students.filter(
          (s) => s.status.includes("Offer") || s.status.includes("Selected")
        ).length /
          studentsRegistered) *
        100
      )
      : 0
    }%`;

  // Dynamic Operational Milestones computed from live CSR Drives
  const dynamicMilestones = useMemo(() => {
    const list: any[] = [];
    drives.forEach((d) => {
      if (d.schedule?.examDate) {
        list.push({
          id: `exam-${d.id}`,
          title: `${d.name} — Technical Screening Exam`,
          date: `${d.schedule.examDate} (${d.schedule.examTime || "10:00 AM"})`,
          category: "Online Examination",
          entity: `${d.metrics?.registeredStudents || 0} Registered Candidates`,
          desc: `Auto-proctored statewide assessment for ${d.name}. Venues and remote links calibrated.`,
        });
      }
      if (d.schedule?.interviewDate) {
        list.push({
          id: `interview-${d.id}`,
          title: `${d.name} — HR Recruiter Interviews`,
          date: `${d.schedule.interviewDate}`,
          category: "Interview Panel",
          entity: `${d.metrics?.qualifiedStudents || 0} Shortlisted Candidates`,
          desc: `Technical and behavioral evaluation rounds conducted by assigned HR leads.`,
        });
      }
      if (d.schedule?.regEnd) {
        list.push({
          id: `reg-${d.id}`,
          title: `${d.name} — Registration Closes`,
          date: `${d.schedule.regEnd} (11:59 PM)`,
          category: "Registration Deadline",
          entity: `${d.metrics?.collegesCount || colleges.length} Enrolled Colleges`,
          desc: `Final cutoff for student USN verification and hall ticket issuance.`,
        });
      }
    });

    if (list.length === 0) {
      list.push({
        id: "default-1",
        title: "Active CSR Campus Drives Screening",
        date: "Current Academic Cycle",
        category: "Operations",
        entity: "Statewide Karnataka",
        desc: "Monitoring college onboarding, candidate registrations, and recruiter panel capacity.",
      });
    }

    return list.slice(0, 4);
  }, [drives, colleges]);

  // Operational Action Tasks: merged from database tasks and live institutional actions
  const operationalTasks = useMemo<TaskItem[]>(() => {
    if (tasks && tasks.length > 0) {
      return tasks.slice(0, 8);
    }
    // Fallback baseline tasks mapped from active colleges
    return colleges.slice(0, 5).map((c, i) => ({
      id: `task-${c.id}`,
      title: `MoU & Placement Cell Coordination with ${c.name}`,
      description: `Institutional partner in ${c.district}`,
      priority: (i === 0 ? "High" : i === 1 ? "Medium" : "Low") as TaskItem["priority"],
      status: (c.status === "MoU Signed" ? "Done" : "Todo") as TaskItem["status"],
      assignedTo: "CSR Operations Team",
      dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
    }));
  }, [tasks, colleges]);

  const handleToggleTask = (task: TaskItem) => {
    const nextStatus: TaskItem["status"] = task.status === "Done" ? "Todo" : "Done";
    updateTaskStatus(task.id, nextStatus);
    toast.success("Operational action status updated in database");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    addTask({
      title: newTaskTitle.trim(),
      description: newTaskEntity ? `Target institution: ${newTaskEntity}` : "Operational milestone",
      priority: (newTaskPriority === "high" ? "High" : newTaskPriority === "medium" ? "Medium" : "Low") as TaskItem["priority"],
      status: "Todo",
      assignedTo: "CSR Manager",
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    });

    toast.success("Operational action added to database queue!");
    setNewTaskTitle("");
    setNewTaskEntity("");
    setIsNewTaskModalOpen(false);
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
              Live PostgreSQL Feed
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
          <Link href="/csr-manager/candidates">
            <Button variant="outline" className="border-border hover:bg-muted gap-2 text-xs">
              <GraduationCap className="w-4 h-4 text-primary" /> Candidate Pipeline
            </Button>
          </Link>
          <Link href="/csr-manager/calendar">
            <Button variant="outline" className="border-border hover:bg-muted gap-2 text-xs">
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
        {/* Left Column (2 Cols): Live Operations Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-md">
            <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Today&apos;s Operational Action Panel
                </CardTitle>
                <CardDescription className="text-xs">
                  Live operational deadlines, institutional outreach, and testing schedules synced from database
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="h-8 text-xs gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Action
                </Button>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {operationalTasks.filter((t) => t.status !== "Done").length} Pending
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-border/40">
              {operationalTasks.map((task) => {
                const isCompleted = task.status === "Done";
                return (
                  <div
                    key={task.id}
                    className={`py-3 flex items-center justify-between gap-4 transition-colors ${isCompleted ? "opacity-50" : ""
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-border hover:border-primary"
                          }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${task.priority === "High" || task.priority === "Urgent"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : task.priority === "Medium"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Assigned to: <strong className="text-foreground">{task.assignedTo || "Operations Lead"}</strong>
                          {task.dueDate && ` • Target: ${new Date(task.dueDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Drive Health Matrix */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Active CSR Drives Status
              </h3>
              <Link
                href="/csr-manager/drives"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All Drives ({drives.length}) <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {drives.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-muted/30 rounded-2xl border border-border/40 flex items-center justify-between hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{d.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {d.academicYear} • {d.metrics?.collegesCount || colleges.length} Institutions Enrolled
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">
                        {d.metrics?.registeredStudents || students.filter((s) => s.driveId === d.id).length || 0}
                      </p>
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

        {/* Right Column (1 Col): Dynamic Milestones & Workspaces */}
        <div className="space-y-6">
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-md">
            <CardTitle className="text-sm font-bold flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              Live Operational Milestones
            </CardTitle>
            <div className="space-y-3 text-xs">
              {dynamicMilestones.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedCalendarEvent(event)}
                  className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl cursor-pointer hover:bg-blue-500/15 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">{event.date}</span>
                    <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground mt-1 line-clamp-1">{event.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{event.entity}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/40 mt-3 text-center">
              <Link
                href="/csr-manager/calendar"
                className="text-xs text-primary font-semibold hover:underline"
              >
                Open Full Operations Calendar →
              </Link>
            </div>
          </Card>

          {/* Curated Manager Workspaces Shortcuts */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Curated Manager Workspaces
            </h4>
            <Link
              href="/csr-manager/candidates"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
                <span>Candidate Master Pipeline</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/colleges"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>Partner Colleges & MoUs</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/assignments"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>HR Recruiter Allocations</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/announcements"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>Announcements Broadcast</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/csr-manager/reports"
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted transition-colors text-xs font-semibold text-foreground"
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>CSR Performance Reports</span>
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

      {/* Add Operational Action Modal (Direct to Database) */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Schedule Operational Action"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1">
              Action Description <span className="text-rose-500">*</span>
            </label>
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Follow up on signed MoU with Principal"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Target Entity / College</label>
            <Input
              value={newTaskEntity}
              onChange={(e) => setNewTaskEntity(e.target.value)}
              placeholder="e.g. RVS College of Engineering"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Action Category</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs"
              >
                <option value="MoU Follow-up">MoU Follow-up</option>
                <option value="Exam Coordination">Exam Coordination</option>
                <option value="Recruiter Panel">Recruiter Panel</option>
                <option value="Registration Window">Registration Window</option>
                <option value="Candidate Support">Candidate Support</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-foreground text-xs"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Normal</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsNewTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Save to Database Queue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
