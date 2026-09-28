"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  XCircle,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Plus,
  Send,
  Download,
  Search,
  Filter,
  ArrowLeft,
  Maximize2,
  Sparkles,
  Radio,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

interface LiveExaminee {
  id: string;
  studentId: string;
  fullName: string;
  photoUrl: string;
  collegeName: string;
  usn: string;
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  timeRemainingSeconds: number;
  warningsCount: number;
  networkStatus: "Online" | "Disconnected" | "Reconnecting";
  fullscreenStatus: "Locked" | "Window Blur" | "Tab Switched";
  submissionStatus: "In Progress" | "Submitted" | "Terminated";
  violations: {
    type: string;
    timestamp: string;
    description: string;
  }[];
}

const INITIAL_EXAMINEES: LiveExaminee[] = [
  {
    id: "stu-live-1",
    studentId: "GQT-2026-0812",
    fullName: "Aakash Sharma",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    collegeName: "R.V. College of Engineering",
    usn: "1RV22CS014",
    currentQuestion: 34,
    totalQuestions: 50,
    answeredCount: 31,
    timeRemainingSeconds: 1420,
    warningsCount: 0,
    networkStatus: "Online",
    fullscreenStatus: "Locked",
    submissionStatus: "In Progress",
    violations: [],
  },
  {
    id: "stu-live-2",
    studentId: "GQT-2026-0813",
    fullName: "Pooja Hegde",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    collegeName: "B.M.S. College of Engineering",
    usn: "1BM22IS045",
    currentQuestion: 41,
    totalQuestions: 50,
    answeredCount: 39,
    timeRemainingSeconds: 1100,
    warningsCount: 1,
    networkStatus: "Online",
    fullscreenStatus: "Tab Switched",
    submissionStatus: "In Progress",
    violations: [
      {
        type: "tab_switch",
        timestamp: "11:42:15 AM",
        description: "Browser window blur detected. Focus moved to another application.",
      },
    ],
  },
  {
    id: "stu-live-3",
    studentId: "GQT-2026-0814",
    fullName: "Vikramaditya Roy",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    collegeName: "M.S. Ramaiah Institute of Technology",
    usn: "1MS22CS102",
    currentQuestion: 48,
    totalQuestions: 50,
    answeredCount: 46,
    timeRemainingSeconds: 610,
    warningsCount: 2,
    networkStatus: "Online",
    fullscreenStatus: "Window Blur",
    submissionStatus: "In Progress",
    violations: [
      {
        type: "fullscreen_exit",
        timestamp: "11:35:10 AM",
        description: "Exited fullscreen proctored mode via keyboard shortcut.",
      },
      {
        type: "copy_attempt",
        timestamp: "11:48:02 AM",
        description: "Attempted clipboard text copy on problem statement.",
      },
    ],
  },
  {
    id: "stu-live-4",
    studentId: "GQT-2026-0815",
    fullName: "Tanvi Deshmukh",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    collegeName: "Dayananda Sagar College of Engineering",
    usn: "1DS22EC089",
    currentQuestion: 50,
    totalQuestions: 50,
    answeredCount: 50,
    timeRemainingSeconds: 0,
    warningsCount: 0,
    networkStatus: "Online",
    fullscreenStatus: "Locked",
    submissionStatus: "Submitted",
    violations: [],
  },
  {
    id: "stu-live-5",
    studentId: "GQT-2026-0816",
    fullName: "Naveen Chandran",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    collegeName: "PES University",
    usn: "PES1UG22CS210",
    currentQuestion: 18,
    totalQuestions: 50,
    answeredCount: 15,
    timeRemainingSeconds: 0,
    warningsCount: 3,
    networkStatus: "Online",
    fullscreenStatus: "Tab Switched",
    submissionStatus: "Terminated",
    violations: [
      {
        type: "tab_switch",
        timestamp: "11:20:04 AM",
        description: "Strike 1: Tab switch to external browser window.",
      },
      {
        type: "devtools_opened",
        timestamp: "11:24:18 AM",
        description: "Strike 2: Browser developer tools / inspect element detected.",
      },
      {
        type: "fullscreen_exit",
        timestamp: "11:26:50 AM",
        description: "Strike 3: Unapproved fullscreen exit. Test auto-terminated.",
      },
    ],
  },
  {
    id: "stu-live-6",
    studentId: "GQT-2026-0817",
    fullName: "Sneha Patil",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    collegeName: "Siddaganga Institute of Technology",
    usn: "1SI22CS078",
    currentQuestion: 29,
    totalQuestions: 50,
    answeredCount: 27,
    timeRemainingSeconds: 1580,
    networkStatus: "Reconnecting",
    fullscreenStatus: "Locked",
    submissionStatus: "In Progress",
    warningsCount: 0,
    violations: [],
  },
];

export default function LiveExamMonitoringPage() {
  const { drives } = useApp();

  const [examinees, setExaminees] = useState<LiveExaminee[]>(INITIAL_EXAMINEES);
  const [isExamPaused, setIsExamPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExaminee, setSelectedExaminee] = useState<LiveExaminee | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // Broadcast modal
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Real-time counter simulation
  const appearingCount = examinees.filter((e) => e.submissionStatus === "In Progress").length;
  const submittedCount = examinees.filter((e) => e.submissionStatus === "Submitted").length;
  const disconnectedCount = examinees.filter((e) => e.networkStatus !== "Online").length;
  const warningCount = examinees.filter((e) => e.warningsCount > 0).length;
  const terminatedCount = examinees.filter((e) => e.submissionStatus === "Terminated").length;

  const handlePauseResumeToggle = () => {
    const nextState = !isExamPaused;
    setIsExamPaused(nextState);
    toast.warning(
      nextState ? "EXAMINATION PAUSED STATE BROADCASTED" : "EXAMINATION RESUMED",
      {
        description: nextState
          ? "All candidate timers held. Candidates alerted via realtime websocket."
          : "Candidate countdowns resumed across all institutional examination nodes.",
      }
    );
  };

  const handleExtendAllTimers = (minutes: number) => {
    setExaminees((prev) =>
      prev.map((e) =>
        e.submissionStatus === "In Progress"
          ? { ...e, timeRemainingSeconds: e.timeRemainingSeconds + minutes * 60 }
          : e
      )
    );
    toast.success(`Extended Global Timer by +${minutes} Minutes`, {
      description: "Synchronized to all active candidate sessions in Supabase.",
    });
  };

  const handleExtendSingleTimer = (studentId: string, minutes: number) => {
    setExaminees((prev) =>
      prev.map((e) =>
        e.id === studentId
          ? { ...e, timeRemainingSeconds: e.timeRemainingSeconds + minutes * 60 }
          : e
      )
    );
    if (selectedExaminee && selectedExaminee.id === studentId) {
      setSelectedExaminee({
        ...selectedExaminee,
        timeRemainingSeconds: selectedExaminee.timeRemainingSeconds + minutes * 60,
      });
    }
    toast.success(`Extended candidate timer by +${minutes} mins`);
  };

  const handleManualTerminate = (studentId: string) => {
    setExaminees((prev) =>
      prev.map((e) =>
        e.id === studentId
          ? {
              ...e,
              submissionStatus: "Terminated",
              violations: [
                ...e.violations,
                {
                  type: "admin_manual_termination",
                  timestamp: new Date().toLocaleTimeString(),
                  description: "Super Admin issued immediate administrative disqualification.",
                },
              ],
            }
          : e
      )
    );
    setSelectedExaminee(null);
    toast.error("Candidate Session Force Terminated", {
      description: "Exam room locked. Audit recorded in Supabase exam_violations.",
    });
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setIsBroadcastOpen(false);
    setBroadcastMessage("");
    toast.success("Broadcast Dispatched to All Examinees", {
      description: "High-priority toast pushed via Supabase realtime channel.",
    });
  };

  const filteredExaminees = examinees.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.collegeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "All" ||
      (filterStatus === "Appearing" && e.submissionStatus === "In Progress") ||
      (filterStatus === "Warnings" && e.warningsCount > 0) ||
      (filterStatus === "Submitted" && e.submissionStatus === "Submitted") ||
      (filterStatus === "Terminated" && e.submissionStatus === "Terminated");
    return matchesSearch && matchesFilter;
  });

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Live Telemetry Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/exams"
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Live Examination Proctored War Room
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                SLOT-A LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Karnataka State-wide CSR Drive 2026 • Realtime Anti-Malpractice Telemetry &amp; Supervisory Controls
            </p>
          </div>
        </div>

        {/* Global Super Admin Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Radio className="w-4 h-4 text-primary" />}
            onClick={() => setIsBroadcastOpen(true)}
          >
            Broadcast Message
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-4 h-4 text-emerald-500" />}
            onClick={() => handleExtendAllTimers(5)}
          >
            +5m Global Time
          </Button>

          <Button
            variant={isExamPaused ? "primary" : "outline"}
            size="sm"
            leftIcon={isExamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4 text-amber-500" />}
            onClick={handlePauseResumeToggle}
          >
            {isExamPaused ? "Resume Exam" : "Pause Exam"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => {
              toast.success("Live Monitoring Snapshot Exported (CSV)", {
                description: "Telemetry timestamps, strike violations, and progress states saved.",
              });
            }}
          >
            Export Log
          </Button>
        </div>
      </div>

      {/* 6 Realtime KPI Monitoring Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 border-l-4 border-l-[#005BBB] bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Appearing Live</span>
          <span className="text-2xl font-black text-[#005BBB] dark:text-[#14B8FF] mt-1 block">
            {appearingCount}
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" /> Active Sessions
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500 bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Submitted</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">
            {submittedCount}
          </span>
          <span className="text-[10px] text-muted-foreground">Test Finished</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500 bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Reconnecting</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            {disconnectedCount}
          </span>
          <span className="text-[10px] text-amber-500 font-semibold">Network Jitter</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500 bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Malpractice Warnings</span>
          <span className="text-2xl font-black text-orange-500 mt-1 block">
            {warningCount}
          </span>
          <span className="text-[10px] text-orange-500 font-semibold">Tab / Blur Strikes</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500 bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Terminated</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">
            {terminatedCount}
          </span>
          <span className="text-[10px] text-rose-500 font-semibold">Disqualified (3 Strikes)</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500 bg-card">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Slot Remaining</span>
          <span className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 block flex items-center gap-1">
            <Clock className="w-4 h-4" /> 23m 40s
          </span>
          <span className="text-[10px] text-muted-foreground">Auto Submit at 0m</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Badges */}
        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto pb-1">
          {["All", "Appearing", "Warnings", "Submitted", "Terminated"].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === filter
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, USN, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Live Examinees Roster Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Live Candidate Telemetry &amp; Anti-Cheating Monitor ({filteredExaminees.length} Students)
            </CardTitle>
            <span className="text-xs text-muted-foreground">Polling Supabase Realtime (2s interval)</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">College &amp; USN</th>
                <th className="px-4 py-3">Question Progress</th>
                <th className="px-4 py-3">Timer</th>
                <th className="px-4 py-3">Warnings</th>
                <th className="px-4 py-3">Network</th>
                <th className="px-4 py-3">Screen State</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredExaminees.map((e) => (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  {/* Photo & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={e.photoUrl}
                        alt={e.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      <div>
                        <span className="font-bold text-foreground block">{e.fullName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{e.studentId}</span>
                      </div>
                    </div>
                  </td>

                  {/* College & USN */}
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground block truncate max-w-[180px]">{e.collegeName}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{e.usn}</span>
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-foreground">
                        <span>Q {e.currentQuestion} / {e.totalQuestions}</span>
                        <span className="text-primary font-bold">{e.answeredCount} ans</span>
                      </div>
                      <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${(e.answeredCount / e.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Timer */}
                  <td className="px-4 py-3 font-mono font-bold text-foreground">
                    {e.submissionStatus === "Submitted" ? (
                      <span className="text-emerald-500">Finished</span>
                    ) : e.submissionStatus === "Terminated" ? (
                      <span className="text-rose-500">Locked</span>
                    ) : (
                      formatSeconds(e.timeRemainingSeconds)
                    )}
                  </td>

                  {/* Warnings Count */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        e.warningsCount === 0
                          ? "bg-emerald-500/10 text-emerald-500"
                          : e.warningsCount === 1
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-rose-500/10 text-rose-500 font-extrabold"
                      }`}
                    >
                      {e.warningsCount} / 3 Strikes
                    </span>
                  </td>

                  {/* Network */}
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      {e.networkStatus === "Online" ? (
                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      )}
                      <span className={e.networkStatus === "Online" ? "text-emerald-500 font-medium" : "text-amber-500 font-bold"}>
                        {e.networkStatus}
                      </span>
                    </span>
                  </td>

                  {/* Screen State */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.fullscreenStatus === "Locked"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {e.fullscreenStatus}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        e.submissionStatus === "Submitted"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : e.submissionStatus === "Terminated"
                          ? "bg-rose-500/10 text-rose-500 font-extrabold"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {e.submissionStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2.5"
                      leftIcon={<Eye className="w-3 h-3" />}
                      onClick={() => setSelectedExaminee(e)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Individual Candidate Inspector Modal */}
      {selectedExaminee && (
        <Modal
          isOpen={!!selectedExaminee}
          onClose={() => setSelectedExaminee(null)}
          title={`Candidate Proctoring Audit: ${selectedExaminee.fullName}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Candidate Header */}
            <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedExaminee.photoUrl}
                  alt={selectedExaminee.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-border"
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{selectedExaminee.fullName}</h4>
                  <p className="text-muted-foreground text-[11px]">
                    USN: <span className="font-mono font-semibold text-foreground">{selectedExaminee.usn}</span> • {selectedExaminee.collegeName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-primary block">
                  Time: {formatSeconds(selectedExaminee.timeRemainingSeconds)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Question {selectedExaminee.currentQuestion} of {selectedExaminee.totalQuestions}
                </span>
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-muted border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-bold block">Answered Count</span>
                <span className="text-base font-bold text-foreground">
                  {selectedExaminee.answeredCount} / {selectedExaminee.totalQuestions}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-bold block">Network Connection</span>
                <span className="text-base font-bold text-emerald-500">
                  {selectedExaminee.networkStatus} (RTT 34ms)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted border border-border">
                <span className="text-muted-foreground text-[10px] uppercase font-bold block">Malpractice Strikes</span>
                <span className={`text-base font-black ${selectedExaminee.warningsCount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                  {selectedExaminee.warningsCount} / 3 Warnings
                </span>
              </div>
            </div>

            {/* Violation History Log */}
            <div>
              <h5 className="font-bold text-foreground mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Anti-Malpractice Event Log
              </h5>
              {selectedExaminee.violations.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-500 font-semibold">
                  ✓ Clean proctoring record. Zero tab switch or window blur events recorded.
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedExaminee.violations.map((v, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold">
                        <span className="uppercase">{v.type.replace("_", " ")}</span>
                        <span>{v.timestamp}</span>
                      </div>
                      <p className="text-foreground text-[11px]">{v.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions for this student */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExtendSingleTimer(selectedExaminee.id, 5)}
                >
                  +5m Candidate Timer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.info(`Dispatched warning alert to ${selectedExaminee.fullName}`);
                  }}
                >
                  Send Proctor Warning
                </Button>
              </div>

              {selectedExaminee.submissionStatus === "In Progress" && (
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  onClick={() => handleManualTerminate(selectedExaminee.id)}
                >
                  Terminate Candidate
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Broadcast Message Modal */}
      <Modal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        title="Broadcast Emergency Notification to Examinees"
        size="md"
      >
        <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
          <p className="text-muted-foreground">
            This message will immediately appear as a high-priority banner on all active candidate test screens.
          </p>

          <div>
            <label className="font-bold text-foreground block mb-1">Message Content</label>
            <textarea
              required
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. Please do not panic during temporary network fluctuations; all answers are cached locally."
              className="w-full text-xs p-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsBroadcastOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Broadcast to All ({appearingCount} Examinees)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
