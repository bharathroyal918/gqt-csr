"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  X,
  FileCheck2,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import { toast } from "sonner";

interface CalendarEventItem {
  id: string;
  candidateId: string;
  candidateName: string;
  photoUrl: string;
  usn: string;
  collegeName: string;
  course: string;
  date: string; // YYYY-MM-DD
  time: string;
  panelMember: string;
  status: "Scheduled" | "Completed" | "Rescheduled" | "Cancelled";
  meetingLink: string;
  examScore: number;
}

const INITIAL_EVENTS: CalendarEventItem[] = [
  {
    id: "evt-01",
    candidateId: "stu-001",
    candidateName: "Aditya V. Kashyap",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    usn: "1RV22CS014",
    collegeName: "R.V. College of Engineering",
    course: "Java Full Stack + Agentic AI",
    date: "2026-09-24",
    time: "10:30 AM - 11:15 AM",
    panelMember: "Priya Nair",
    status: "Completed",
    meetingLink: "https://meet.google.com/rvc-java-panel",
    examScore: 87,
  },
  {
    id: "evt-02",
    candidateId: "stu-002",
    candidateName: "Sneha Ramachandra Rao",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    usn: "1BM22IS089",
    collegeName: "BMS College of Engineering",
    course: "Python Full Stack + AI/ML",
    date: "2026-09-25",
    time: "11:00 AM - 11:45 AM",
    panelMember: "Arun Menon",
    status: "Scheduled",
    meetingLink: "https://meet.google.com/bms-py-panel",
    examScore: 91,
  },
  {
    id: "evt-03",
    candidateId: "stu-003",
    candidateName: "Karthik Srinivas",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    usn: "1MS22CS102",
    collegeName: "Ramaiah Institute of Technology",
    course: "MERN Stack + Cloud",
    date: "2026-09-26",
    time: "02:00 PM - 02:45 PM",
    panelMember: "Divya H",
    status: "Scheduled",
    meetingLink: "https://meet.google.com/msr-mern-panel",
    examScore: 79,
  },
  {
    id: "evt-04",
    candidateId: "stu-004",
    candidateName: "Pooja Hegde",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    usn: "4NI22CS078",
    collegeName: "NIE Mysuru",
    course: "Java Full Stack + Agentic AI",
    date: "2026-09-26",
    time: "04:00 PM - 04:45 PM",
    panelMember: "Priya Nair",
    status: "Rescheduled",
    meetingLink: "https://meet.google.com/nie-java-panel",
    examScore: 76,
  },
  {
    id: "evt-05",
    candidateId: "stu-006",
    candidateName: "Nikhil B. Patil",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200",
    usn: "2BL22CS045",
    collegeName: "BLDEA CET, Vijayapura",
    course: "Java Full Stack + Agentic AI",
    date: "2026-09-24",
    time: "09:00 AM - 09:45 AM",
    panelMember: "Priya Nair",
    status: "Cancelled",
    meetingLink: "https://meet.google.com/bld-java-panel",
    examScore: 82,
  },
];

import { useApp } from "@/context/AppContext";

export default function InterviewCalendarPage() {
  const { students } = useApp();
  const [view, setView] = useState<"Month" | "Week" | "Day" | "Agenda">("Month");

  const liveEvents = React.useMemo(() => {
    const evts: CalendarEventItem[] = [];
    students.forEach((s) => {
      if (s.interviews && s.interviews.length > 0) {
        s.interviews.forEach((inv, iIdx) => {
          evts.push({
            id: inv.id || `evt-${s.id}-${iIdx}`,
            candidateId: s.id,
            candidateName: s.fullName,
            photoUrl: s.photoUrl || "",
            usn: s.usn || "",
            collegeName: s.collegeName || "",
            course: s.branch || s.selectedCourse || "",
            date: inv.scheduledSlot ? inv.scheduledSlot.split("T")[0] : "",
            time: inv.scheduledSlot ? (inv.scheduledSlot.split("T")[1]?.slice(0, 5) || "10:00 AM") : "10:00 AM",
            panelMember: inv.interviewerName || "HR Panel",
            status: (inv.status === "Selected" || inv.status === "Hold" || inv.status === "Rejected") ? "Completed" : "Scheduled",
            meetingLink: inv.meetingLink || "",
            examScore: s.examScore || 0,
          });
        });
      }
    });
    return evts;
  }, [students]);

  const [events, setEvents] = useState<CalendarEventItem[]>(liveEvents);

  React.useEffect(() => {
    if (liveEvents.length > 0) {
      setEvents(liveEvents);
    }
  }, [liveEvents]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [drawerEvent, setDrawerEvent] = useState<CalendarEventItem | null>(null);

  const filteredEvents = events.filter(
    (e) => statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase()
  );

  const daysOfMonth = [
    { day: 21, dateStr: "2026-09-21" },
    { day: 22, dateStr: "2026-09-22" },
    { day: 23, dateStr: "2026-09-23" },
    { day: 24, dateStr: "2026-09-24" },
    { day: 25, dateStr: "2026-09-25" },
    { day: 26, dateStr: "2026-09-26" },
    { day: 27, dateStr: "2026-09-27" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Interactive Schedule Views
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Enterprise Interview Calendar</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Realtime multi-panel timeline for September 2026. Track upcoming, in-progress, completed, and rescheduled technical interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/interviews/schedule">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Schedule New Slot
            </Button>
          </Link>
          <Link href="/hr/interviews">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              List View
            </Button>
          </Link>
        </div>
      </div>

      {/* Calendar Controls & View Switcher */}
      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <span className="font-bold text-base text-foreground">September 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs border border-border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Statuses ({events.length})</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex border border-border rounded-lg overflow-hidden bg-background">
              {(["Month", "Week", "Day", "Agenda"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                    view === mode ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid (Week / Month preview) */}
      <Card className="p-5 bg-card border border-border shadow-sm rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfMonth.map((dayObj) => {
            const dayEvents = filteredEvents.filter((e) => e.date === dayObj.dateStr);
            const isToday = dayObj.dateStr === "2026-09-24";

            return (
              <div
                key={dayObj.dateStr}
                className={`p-3 rounded-xl border min-h-[260px] flex flex-col ${
                  isToday
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <span className="text-xs font-bold text-foreground">
                    {new Date(dayObj.dateStr).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    {dayObj.day}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setDrawerEvent(evt)}
                      className={`p-2 rounded-lg border text-xs cursor-pointer transition-all hover:scale-[1.02] shadow-sm ${
                        evt.status === "Completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                          : evt.status === "Scheduled"
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200"
                          : evt.status === "Rescheduled"
                          ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                          : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                      }`}
                    >
                      <div className="font-semibold truncate">{evt.candidateName}</div>
                      <div className="text-[10px] opacity-80 truncate">{evt.time}</div>
                      <div className="text-[10px] mt-1 font-mono font-medium truncate">{evt.collegeName.split(" ")[0]}</div>
                    </div>
                  ))}

                  {dayEvents.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-muted-foreground/60 italic">
                      No slots
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Slide-over Drawer for Event Details */}
      <AnimatePresence>
        {drawerEvent && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-card border-l border-border h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-primary">Interview Details</span>
                  </div>
                  <button
                    onClick={() => setDrawerEvent(null)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={drawerEvent.photoUrl}
                    alt={drawerEvent.candidateName}
                    className="w-14 h-14 rounded-full object-cover border border-border shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground">{drawerEvent.candidateName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{drawerEvent.usn}</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                        drawerEvent.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : drawerEvent.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : drawerEvent.status === "Rescheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {drawerEvent.status}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">College:</span>
                    <span className="font-semibold text-foreground text-right">{drawerEvent.collegeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Course Track:</span>
                    <span className="font-semibold text-foreground">{drawerEvent.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exam Score:</span>
                    <span className="font-bold text-primary">{drawerEvent.examScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Slot:</span>
                    <span className="font-semibold text-foreground">{drawerEvent.date} ({drawerEvent.time})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HR / Panel:</span>
                    <span className="font-semibold text-foreground">{drawerEvent.panelMember}</span>
                  </div>
                </div>

                <div className="p-3 border border-border rounded-xl">
                  <p className="text-xs font-semibold text-foreground mb-1">Virtual Meeting Room</p>
                  <a
                    href={drawerEvent.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline break-all flex items-center gap-1 font-mono"
                  >
                    <Video className="w-3.5 h-3.5" />
                    {drawerEvent.meetingLink}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <Link href={`/hr/interviews/${drawerEvent.candidateId}`} className="block">
                  <Button variant="primary" className="w-full text-xs flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" />
                    Open Live Candidate Workspace
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    toast.info(`Sent calendar reminder to ${drawerEvent.candidateName}`);
                    setDrawerEvent(null);
                  }}
                >
                  Dispatch Reminder Notice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
