"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Users,
  Video
} from "lucide-react";

interface LiveCandidateExam {
  id: string;
  studentName: string;
  usn: string;
  collegeName: string;
  paperSet: string;
  progressPercent: number;
  timeRemainingMinutes: number;
  violationsCount: number;
  status: "Appearing" | "Submitted" | "Warning Issued" | "Terminated";
  lastPing: string;
}

const INITIAL_LIVE_EXAMS: LiveCandidateExam[] = [
  {
    id: "live-01",
    studentName: "Aditi S. Rao",
    usn: "1RV21CS014",
    collegeName: "R.V. College of Engineering",
    paperSet: "Set A",
    progressPercent: 88,
    timeRemainingMinutes: 14,
    violationsCount: 0,
    status: "Appearing",
    lastPing: "Just now",
  },
  {
    id: "live-02",
    studentName: "Karthik Hegde",
    usn: "2KL21EC012",
    collegeName: "KLE Technological University",
    paperSet: "Set A",
    progressPercent: 100,
    timeRemainingMinutes: 0,
    violationsCount: 0,
    status: "Submitted",
    lastPing: "2 mins ago",
  },
  {
    id: "live-03",
    studentName: "Sanjay Gowda",
    usn: "1BM21CS102",
    collegeName: "BMS College of Engineering",
    paperSet: "Set B",
    progressPercent: 42,
    timeRemainingMinutes: 28,
    violationsCount: 3,
    status: "Warning Issued",
    lastPing: "Just now",
  },
  {
    id: "live-04",
    studentName: "Naveen Prasad",
    usn: "1MS21CS054",
    collegeName: "Ramaiah Institute of Technology",
    paperSet: "Set B",
    progressPercent: 20,
    timeRemainingMinutes: 0,
    violationsCount: 6,
    status: "Terminated",
    lastPing: "5 mins ago",
  },
  {
    id: "live-05",
    studentName: "Pooja V",
    usn: "1RV21IS029",
    collegeName: "R.V. College of Engineering",
    paperSet: "Set A",
    progressPercent: 65,
    timeRemainingMinutes: 22,
    violationsCount: 1,
    status: "Appearing",
    lastPing: "Just now",
  },
];

export default function AdminLiveExamControlPage() {
  const [candidates, setCandidates] = useState<LiveCandidateExam[]>(INITIAL_LIVE_EXAMS);
  const [searchTerm, setSearchTerm] = useState("");

  const appearingCount = candidates.filter((c) => c.status === "Appearing" || c.status === "Warning Issued").length;
  const submittedCount = candidates.filter((c) => c.status === "Submitted").length;
  const warningsCount = candidates.reduce((acc, c) => acc + c.violationsCount, 0);
  const terminatedCount = candidates.filter((c) => c.status === "Terminated").length;

  const handleIssueWarning = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "Warning Issued", violationsCount: c.violationsCount + 1 }
          : c
      )
    );
    toast.warning(`Security warning sent directly to ${name}'s exam screen`);
  };

  const handleTerminate = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Terminated", timeRemainingMinutes: 0 } : c
      )
    );
    toast.error(`Exam session terminated for ${name} due to proctoring violation`);
  };

  const filtered = candidates.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Realtime Proctoring Room
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Live Exam Monitoring Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor real-time candidate testing sessions, track AI proctoring telemetry, detect multi-monitor flags, and enforce academic integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/exams/live">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Launch Live Proctoring War Room
            </Button>
          </Link>
          <Link href="/admin/exams/results">
            <Button variant="outline" className="border-border hover:bg-muted gap-2">
              View Results & Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Realtime KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Currently Appearing</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{appearingCount} Candidates</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Successfully Submitted</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{submittedCount} Candidates</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Proctoring Warnings</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{warningsCount} Events</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Terminated for Malpractice</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">{terminatedCount} Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter live examinee by name, USN, or college..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* Live Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Candidate & USN</th>
                <th className="p-4">College</th>
                <th className="p-4">Paper</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4 text-center">Remaining</th>
                <th className="p-4 text-center">Violations</th>
                <th className="p-4 text-center">Session Status</th>
                <th className="p-4 pr-6 text-right">Proctor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{c.studentName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{c.usn}</div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground truncate max-w-xs">
                    {c.collegeName}
                  </td>
                  <td className="p-4 text-xs font-mono">{c.paperSet}</td>
                  <td className="p-4 text-center">
                    <div className="text-xs font-bold text-foreground">{c.progressPercent}%</div>
                    <div className="w-16 h-1.5 bg-muted rounded-full mx-auto mt-1 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-center text-xs font-mono font-bold text-blue-400">
                    {c.timeRemainingMinutes > 0 ? `${c.timeRemainingMinutes}m` : "Finished"}
                  </td>
                  <td className="p-4 text-center text-xs">
                    <span
                      className={`font-bold ${
                        c.violationsCount === 0
                          ? "text-emerald-400"
                          : c.violationsCount <= 2
                          ? "text-amber-400"
                          : "text-rose-500"
                      }`}
                    >
                      {c.violationsCount} Flags
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        c.status === "Submitted"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : c.status === "Appearing"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : c.status === "Warning Issued"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {c.status !== "Submitted" && c.status !== "Terminated" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleIssueWarning(c.id, c.studentName)}
                            title="Issue Proctoring Warning"
                            className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTerminate(c.id, c.studentName)}
                            title="Terminate Exam for Malpractice"
                            className="h-8 w-8 p-0 hover:bg-rose-500/10 hover:text-rose-400"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
