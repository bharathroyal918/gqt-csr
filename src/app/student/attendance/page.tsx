"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Users,
  MapPin,
  Laptop,
  BookOpen,
  ArrowUpRight,
  Filter,
  Download,
  Send,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  CalendarCheck
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";

interface SessionLog {
  id: string;
  date: string;
  sessionTitle: string;
  track: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent" | "Excused";
  duration: string;
  trainer: string;
  verifiedByFaculty: boolean;
}

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentAttendanceBatchCenter() {
  const { logAuditAction } = useApp();
  const { student: activeStudent, activeDrive } = useStudentSession();

  // Derived batch details
  const batchCode = activeStudent?.batch || "";
  const courseTrack = activeStudent?.selectedCourse || activeStudent?.branch || "";

  // State for interactive leave/batch-change modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<"leave" | "batch_change">("leave");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  // Filter state for logs
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Attendance sessions dynamic record
  const [sessions, setSessions] = useState<SessionLog[]>([
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      duration: "",
      trainer: "",
      verifiedByFaculty: true,
    },
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      duration: "",
      trainer: "",
      verifiedByFaculty: true,
    },
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Late",
      duration: "",
      trainer: "",
      verifiedByFaculty: true,
    },
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      duration: "",
      trainer: "",
      verifiedByFaculty: true,
    },
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Present",
      duration: "8h 06m",
      trainer: "Ananya Desai (Cloud Specialist)",
      verifiedByFaculty: true,
    },
    {
      id: "",
      date: "",
      sessionTitle: "",
      track: "",
      checkIn: "",
      checkOut: "",
      status: "Excused",
      duration: "",
      trainer: "",
      verifiedByFaculty: true,
    },
  ]);

  // Real-time check-in simulation
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true);

  // Compute live metrics
  const totalSessions = sessions.length;
  const attendedCount = sessions.filter((s) => s.status === "Present" || s.status === "Late").length;
  const excusedCount = sessions.filter((s) => s.status === "Excused").length;
  const attendanceRate = totalSessions > 0 ? Math.round(((attendedCount + excusedCount) / totalSessions) * 100) : 0;
  const isSafeAttendance = attendanceRate >= 85;

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchFilter = statusFilter === "all" || session.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        session.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.track.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.trainer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [sessions, statusFilter, searchTerm]);

  const handleSelfCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const todayDate = now.toISOString().split("T")[0];

    const newRecord: SessionLog = {
      id: `ses-${Date.now().toString().slice(-4)}`,
      date: todayDate,
      sessionTitle: "Live Batch Training: AI Integration & Production Sandbox",
      track: "Applied Engineering",
      checkIn: timeString,
      checkOut: "In Progress",
      status: "Present",
      duration: "Active",
      trainer: "Dr. K. Srinivas (Lead Arch)",
      verifiedByFaculty: true,
    };

    setSessions([newRecord, ...sessions]);
    setHasCheckedInToday(true);
    toast.success("Attendance Registered Successfully!", {
      description: `GPS Verified check-in timestamp: ${timeString}. Logged in Supabase Realtime.`,
    });

    logAuditAction?.(
      "STUDENT_ATTENDANCE_CHECKIN",
      "Student",
      activeStudent?.id || "student",
      `Checked in at ${timeString} for batch ${batchCode}`
    );
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason.trim()) {
      toast.error("Please fill in both the date and justification.");
      return;
    }

    setIsSubmittingRequest(true);
    setTimeout(() => {
      setIsSubmittingRequest(false);
      setIsLeaveModalOpen(false);
      toast.success(
        leaveType === "leave"
          ? "Leave Request Dispatched to Faculty & HR"
          : "Batch Reassignment Request Lodged",
        {
          description: `Ticket created for ${leaveDate}. You will receive a notification upon coordinator approval.`,
        }
      );
      setLeaveDate("");
      setLeaveReason("");
    }, 600);
  };

  const handleExportAttendanceReport = () => {
    const csvContent =
      "Date,Session Title,Track,Check In,Check Out,Status,Duration,Trainer,Verified\n" +
      sessions
        .map(
          (s) =>
            `"${s.date}","${s.sessionTitle}","${s.track}","${s.checkIn}","${s.checkOut}","${s.status}","${s.duration}","${s.trainer}","${s.verifiedByFaculty ? "Yes" : "No"}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GQT_Attendance_Log_${activeStudent?.studentId || "Student"}.csv`;
    a.click();
    toast.success("Attendance audit log exported to CSV");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] p-6 lg:p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                Batch Allocation: {batchCode}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Academic Standing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Attendance & Batch Center
            </h1>
            <p className="text-white/80 text-sm max-w-2xl font-light">
              Track mandatory training sessions, log daily biometric & QR check-ins, monitor your 85% qualification threshold, and view batch schedule details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setLeaveType("leave");
                setIsLeaveModalOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md text-xs font-medium"
            >
              <CalendarCheck className="w-4 h-4 mr-1.5" />
              Request Leave / Exemption
            </Button>
            <Button
              variant="cyan"
              onClick={handleExportAttendanceReport}
              className="text-xs font-medium flex items-center gap-1.5 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export Attendance Log
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-semibold">Attendance Rate</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSafeAttendance ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              {isSafeAttendance ? "Eligible" : "Warning"}
            </span>
          </div>
          <p className="text-3xl font-black text-foreground mt-2">{attendanceRate}%</p>
          <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isSafeAttendance ? "bg-emerald-500" : "bg-rose-500"}`}
              style={{ width: `${Math.min(100, attendanceRate)}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground mt-1.5 block">
            Min 85% required for placement drive
          </span>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-2xl">
          <span className="text-xs text-muted-foreground font-semibold">Sessions Completed</span>
          <p className="text-3xl font-black text-foreground mt-2">{totalSessions}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {attendedCount} Attended • {excusedCount} Excused
          </span>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-2xl">
          <span className="text-xs text-muted-foreground font-semibold">Current Training Mode</span>
          <div className="flex items-center gap-1.5 mt-2">
            <Laptop className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-foreground truncate">
              {activeStudent?.preferredTrainingMode || "—"}
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {activeDrive?.venue || "Assigned Learning Center"}
          </span>
        </Card>

        <Card className="p-4 bg-card/80 backdrop-blur-xl border border-border shadow-sm rounded-2xl">
          <span className="text-xs text-muted-foreground font-semibold">Batch Status</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">ACTIVE</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            Academic Session {new Date().getFullYear()}
          </span>
        </Card>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Batch & QR Check-In Desk */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick Check-in Card */}
          <Card className="p-5 bg-card/90 backdrop-blur-xl border border-border shadow-lg rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Digital ID & Check-In</h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Sensor
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-2xl border border-border/60 text-center">
              <div className="p-3 bg-white rounded-xl shadow-md border border-border">
                {/* Visual QR representation */}
                <div className="w-32 h-32 flex flex-col items-center justify-center bg-gray-900 text-white rounded-lg p-2 font-mono text-[9px] select-none text-center">
                  <span className="text-blue-400 font-bold">GQT-VERIFIED-ID</span>
                  <div className="grid grid-cols-5 gap-1.5 my-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-sm ${(i % 2 === 0 || i % 3 === 0) ? "bg-white" : "bg-gray-800"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] text-gray-400">{activeStudent?.usn || "—"}</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-foreground mt-3">
                {activeStudent?.fullName || "—"}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                {activeStudent?.studentId} {activeStudent?.usn ? `• ${activeStudent.usn}` : ""}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
              <Button
                variant={hasCheckedInToday ? "outline" : "primary"}
                onClick={handleSelfCheckIn}
                className="w-full text-xs font-semibold h-10"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
                {hasCheckedInToday ? "Check-in Confirmed" : "Log Present Check-in Now"}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Check-ins are timestamped and cryptographically validated via college geo-beacon.
              </p>
            </div>
          </Card>

          {/* Batch Details Card */}
          <Card className="p-5 bg-card/90 backdrop-blur-xl border border-border shadow-lg rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Assigned Batch Details
              </h3>
              <span className="text-xs font-mono text-primary font-bold">{batchCode || "—"}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="text-muted-foreground text-[10px] uppercase font-semibold">Specialization Track</span>
                <p className="font-bold text-foreground text-xs leading-snug">{courseTrack || "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground text-[10px] block">Timing</span>
                  <span className="font-semibold text-foreground text-xs">09:00 AM - 05:00 PM</span>
                </div>
                <div className="p-2.5 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground text-[10px] block">Days</span>
                  <span className="font-semibold text-foreground text-xs">Mon — Fri</span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                <span className="text-muted-foreground text-[10px] block">Lead Mentor / Instructor</span>
                <p className="font-semibold text-foreground text-xs">{activeDrive?.assignments?.trainer || "Technical Mentor"}</p>
                <p className="text-[11px] text-muted-foreground">Assigned via Campus Drive</p>
              </div>

              <div className="p-3 bg-muted/30 rounded-xl space-y-1">
                <span className="text-muted-foreground text-[10px] block">Venue & Host Center</span>
                <p className="font-semibold text-foreground text-xs">{activeStudent?.collegeName || "—"}</p>
                <p className="text-[11px] text-muted-foreground">{activeDrive?.venue || "Campus Learning Center"}</p>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setLeaveType("batch_change");
                  setIsLeaveModalOpen(true);
                }}
                className="w-full text-xs text-primary hover:bg-primary/5 border border-primary/20"
              >
                Request Batch Shift or Timing Change
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Attendance Log Table */}
        <div className="space-y-4 lg:col-span-2">
          {/* Table Header & Controls */}
          <Card className="p-4 bg-card/90 backdrop-blur-xl border border-border shadow-md rounded-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Session Attendance History</h3>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Statuses ({sessions.length})</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                  <option value="absent">Absent</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter topic or mentor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-border bg-background text-foreground w-full sm:w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          {/* Table Container */}
          <Card className="overflow-hidden border border-border shadow-lg rounded-3xl bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                    <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                    <th className="py-3.5 px-4 font-semibold">Curriculum Topic & Module</th>
                    <th className="py-3.5 px-4 font-semibold">Check In/Out</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Faculty Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-foreground text-xs">{session.date}</div>
                        <div className="text-[10px] text-muted-foreground">{session.duration}</div>
                      </td>

                      {/* Topic */}
                      <td className="py-3.5 px-4">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">
                          {session.sessionTitle}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {session.track} • {session.trainer}
                        </p>
                      </td>

                      {/* Check-in / Check-out */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        <div className="font-mono text-[11px] text-foreground">
                          In: <span className="font-bold">{session.checkIn}</span>
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          Out: {session.checkOut}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${session.status === "Present"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/20"
                              : session.status === "Late"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/20"
                                : session.status === "Excused"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-500/20"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-500/20"
                            }`}
                        >
                          {session.status === "Present" && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {session.status === "Late" && <Clock className="w-3 h-3 text-amber-600" />}
                          {session.status === "Excused" && <Calendar className="w-3 h-3 text-blue-600" />}
                          {session.status === "Absent" && <XCircle className="w-3 h-3 text-rose-600" />}
                          {session.status}
                        </span>
                      </td>

                      {/* Verification */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {session.verifiedByFaculty ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSessions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No session records found matching the chosen criteria.
              </div>
            )}
          </Card>

          {/* Academic Policy Reminder Card */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-300">
                  Global Quest CSR Internship Policy: Mandatory 85% Attendance
                </p>
                <p className="text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                  Students failing to maintain at least 85% attendance across technical sessions and practical lab evaluations will be ineligible to receive the GQT CSR Certification and direct corporate placement drive credentials.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Leave Request / Batch Change Modal */}
      {isLeaveModalOpen && (
        <Modal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          title={leaveType === "leave" ? "Submit Leave Request / Absence Notice" : "Request Batch Reallocation"}
        >
          <form onSubmit={handleSubmitLeave} className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-1">
              <p><strong>Candidate:</strong> {activeStudent?.fullName} ({activeStudent?.studentId})</p>
              <p><strong>Current Batch:</strong> {batchCode} • {courseTrack}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {leaveType === "leave" ? "Date of Absence" : "Effective From Date"}
              </label>
              <input
                type="date"
                required
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                {leaveType === "leave" ? "Official Reason / Medical Exemption" : "Reason for Batch Shift"}
              </label>
              <textarea
                rows={3}
                required
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder={
                  leaveType === "leave"
                    ? "Explain reason for leave (e.g. University Semester Exams, Health reasons, VTU Lab schedule)..."
                    : "Specify timing clash, college lab scheduling change, or preferred track..."
                }
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLeaveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmittingRequest}
              >
                {isSubmittingRequest ? "Submitting..." : "Submit to Faculty & HR"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
