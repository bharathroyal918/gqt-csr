"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  FileText,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Building2,
  Download,
  XCircle,
  AlertCircle,
  Video,
  Send,
  Eye,
  CheckSquare,
  Square
} from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5 text-blue-600" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

export default function QualifiedCandidateQueuePage() {
  const { drives, students, updateStudent } = useApp();
  const liveCandidates = React.useMemo(() => getLiveCandidateProfiles(students), [students]);
  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveCandidates);

  React.useEffect(() => {
    if (liveCandidates.length > 0) {
      setCandidates(liveCandidates);
    }
  }, [liveCandidates]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedViolations, setSelectedViolations] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [schedulingCandidate, setSchedulingCandidate] = useState<CandidateFullProfile | null>(null);
  const [rejectingCandidate, setRejectingCandidate] = useState<CandidateFullProfile | null>(null);
  const [holdingCandidate, setHoldingCandidate] = useState<CandidateFullProfile | null>(null);
  const [previewResumeCandidate, setPreviewResumeCandidate] = useState<CandidateFullProfile | null>(null);

  // Form states for modals
  const [slotDate, setSlotDate] = useState("2026-09-26");
  const [slotTime, setSlotTime] = useState("10:00 AM - 10:45 AM");
  const [slotMode, setSlotMode] = useState<"Online" | "Offline">("Online");
  const [slotPanel, setSlotPanel] = useState("Priya Nair (Senior HR Lead)");
  const [rejectionReason, setRejectionReason] = useState("");
  const [holdFollowupDate, setHoldFollowupDate] = useState("2026-10-02");
  const [holdRemarks, setHoldRemarks] = useState("");

  // Only qualified/eligible pipeline students
  const qualifiedList = candidates.filter((c) => c.exam.percentage >= c.exam.cutoff);

  const filteredCandidates = qualifiedList.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCollege = selectedCollege === "all" || c.collegeName === selectedCollege;
    const matchesCourse = selectedCourse === "all" || c.selectedCourse === selectedCourse;
    const matchesViolations =
      selectedViolations === "all" ||
      (selectedViolations === "clean" && c.exam.violationsCount === 0) ||
      (selectedViolations === "flagged" && c.exam.violationsCount > 0);

    return matchesSearch && matchesCollege && matchesCourse && matchesViolations;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingCandidate) return;

    const newSlot = {
      id: `slot-${Date.now().toString().slice(-4)}`,
      date: slotDate,
      time: slotTime,
      mode: slotMode,
      meetingLink: `https://meet.google.com/gqt-${schedulingCandidate.usn.toLowerCase().slice(-6)}`,
      panelMembers: [slotPanel],
      hrExecutive: "Priya Nair",
      stage: "Technical Calibration Round 1",
    };

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === schedulingCandidate.id
          ? {
              ...c,
              status: "Interview Scheduled",
              interviewSlot: newSlot,
            }
          : c
      )
    );

    try {
      await updateStudent(schedulingCandidate.id, {
        status: "HR Interview Scheduled",
        interviewSlot: newSlot as any,
      });
    } catch (err) {
      console.error("Failed to update student schedule status in Supabase:", err);
    }

    toast.success(`Interview scheduled for ${schedulingCandidate.fullName}!`, {
      description: `Calendar invite dispatched for ${slotDate} (${slotTime}).`,
    });
    setSchedulingCandidate(null);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCandidate || !rejectionReason.trim()) {
      toast.error("Please specify a reason for rejecting the candidate.");
      return;
    }

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === rejectingCandidate.id
          ? {
              ...c,
              status: "Rejected",
              decision: {
                outcome: "Rejected",
                reason: rejectionReason,
                rejectionStage: "Pre-Interview Screening",
                decidedBy: "HR Recruiter",
                timestamp: new Date().toISOString(),
                notes: rejectionReason,
              },
            }
          : c
      )
    );

    try {
      await updateStudent(rejectingCandidate.id, {
        status: "HR Rejected",
      });
    } catch (err) {
      console.error("Failed to persist rejection to Supabase:", err);
    }

    toast.error(`${rejectingCandidate.fullName} marked as Rejected.`, {
      description: "Candidate moved to Rejected Archive. Audit entry created.",
    });
    setRejectingCandidate(null);
    setRejectionReason("");
  };

  const handleConfirmHold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holdingCandidate) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === holdingCandidate.id
          ? {
              ...c,
              status: "Hold",
              decision: {
                outcome: "Hold",
                followUpDate: holdFollowupDate,
                reason: holdRemarks || "Candidate put on hold for background check.",
                decidedBy: "HR Recruiter",
                timestamp: new Date().toISOString(),
                notes: holdRemarks,
              },
            }
          : c
      )
    );

    try {
      await updateStudent(holdingCandidate.id, {
        status: "HR On Hold",
      });
    } catch (err) {
      console.error("Failed to persist hold to Supabase:", err);
    }

    toast.warning(`${holdingCandidate.fullName} moved to Hold status.`, {
      description: `Follow-up set for ${holdFollowupDate}.`,
    });
    setHoldingCandidate(null);
    setHoldRemarks("");
  };

  const uniqueColleges = Array.from(new Set(qualifiedList.map((c) => c.collegeName)));
  const uniqueCourses = Array.from(new Set(qualifiedList.map((c) => c.selectedCourse)));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Post-Examination Pipeline
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Cutoff Qualification
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Qualified Candidate Queue</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Students who scored above the required assessment cutoff are ingested here instantly with full proctoring telemetry, rankings, and credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/interviews/schedule">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <Calendar className="w-4 h-4" />
              Launch Auto-Scheduler
            </Button>
          </Link>
          <Link href="/hr/candidates">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              View Master Pipeline
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Total Qualified</span>
          <p className="text-2xl font-bold text-foreground mt-0.5">{qualifiedList.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Cleared assessment cutoff</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Clean Proctoring</span>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">
            {qualifiedList.filter((c) => c.exam.violationsCount === 0).length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">0 strikes or tab switches</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Awaiting Interview Slot</span>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">
            {qualifiedList.filter((c) => c.status === "Qualified").length}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Pending allocation</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Selected Top Tier</span>
          <p className="text-2xl font-bold text-primary mt-0.5">
            {qualifiedList.filter((c) => c.status === "Selected").length}
          </p>
          <span className="text-[10px] text-primary font-medium">Passed Technical & HR</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidate, USN, college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Colleges ({uniqueColleges.length})</option>
              {uniqueColleges.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Courses / Tracks</option>
              {uniqueCourses.map((crs) => (
                <option key={crs} value={crs}>
                  {crs}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedViolations}
              onChange={(e) => setSelectedViolations(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Proctoring Telemetry (All)</option>
              <option value="clean">Clean Proctoring (0 Violations)</option>
              <option value="flagged">Flagged Telemetry (&gt; 0 Violations)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Ribbon */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 mt-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg">
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected for bulk action
            </span>
            <div className="flex items-center gap-2">
              <Link href={`/hr/interviews/schedule?bulkIds=${selectedIds.join(",")}`}>
                <Button size="sm" variant="primary" className="text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Bulk Schedule Slots
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  toast.success(`Exported CSV for ${selectedIds.length} candidates.`);
                  setSelectedIds([]);
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Export Selected
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Candidates Table */}
      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="flex items-center text-foreground">
                    {selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Institution & Track</th>
                <th className="py-3 px-4 font-semibold">Exam Score & Cutoff</th>
                <th className="py-3 px-4 font-semibold">Ranks</th>
                <th className="py-3 px-4 font-semibold">Portfolios & Resume</th>
                <th className="py-3 px-4 font-semibold">Proctoring Telemetry</th>
                <th className="py-3 px-4 font-semibold">Stage</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCandidates.map((candidate) => {
                const isSelected = selectedIds.includes(candidate.id);
                return (
                  <tr key={candidate.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? "bg-primary/5" : ""}`}>
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <button onClick={() => toggleSelectOne(candidate.id)} className="flex items-center text-foreground">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>

                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-border shadow-sm"
                        />
                        <div>
                          <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                            {candidate.fullName}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{candidate.studentId}</span>
                            <span>•</span>
                            <span className="font-mono">{candidate.usn}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{candidate.collegeName}</p>
                      <p className="text-[11px] text-muted-foreground">{candidate.branch} • {candidate.selectedCourse}</p>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{candidate.exam.score}/100</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {candidate.exam.percentage}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Cutoff: {candidate.exam.cutoff}%</span>
                    </td>

                    {/* Ranks */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-xs text-primary">State #{candidate.exam.statewideRank}</span>
                      <div className="text-[11px] text-muted-foreground">
                        College #{candidate.exam.collegeRank} • {candidate.exam.percentile}th %ile
                      </div>
                    </td>

                    {/* Portfolio / Links */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {candidate.resumeUrl && (
                          <button
                            onClick={() => setPreviewResumeCandidate(candidate)}
                            title="Preview Resume"
                            className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-primary" />
                          </button>
                        )}
                        {candidate.githubUrl && (
                          <a
                            href={candidate.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground"
                            title="GitHub Profile"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {candidate.linkedinUrl && (
                          <a
                            href={candidate.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground"
                            title="LinkedIn Profile"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {candidate.portfolioUrl && (
                          <a
                            href={candidate.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-muted hover:bg-muted/80 text-foreground"
                            title="Portfolio Website"
                          >
                            <Globe className="w-3.5 h-3.5 text-teal-600" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Proctoring */}
                    <td className="py-3.5 px-4">
                      {candidate.exam.violationsCount === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Clean Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {candidate.exam.violationsCount} Violation{candidate.exam.violationsCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          candidate.status === "Selected"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : candidate.status === "Interview Scheduled"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : candidate.status === "Hold"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                            : candidate.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/hr/interviews/${candidate.id}`}>
                          <Button size="sm" variant="primary" className="text-xs flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            Review
                          </Button>
                        </Link>
                        {candidate.status === "Qualified" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => setSchedulingCandidate(candidate)}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                          title="Put On Hold"
                          onClick={() => setHoldingCandidate(candidate)}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                          title="Reject Without Interview"
                          onClick={() => setRejectingCandidate(candidate)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Schedule Slot Modal */}
      {schedulingCandidate && (
        <Modal
          isOpen={!!schedulingCandidate}
          onClose={() => setSchedulingCandidate(null)}
          title={`Schedule Interview: ${schedulingCandidate.fullName}`}
        >
          <form onSubmit={handleConfirmSchedule} className="space-y-4">
            <div className="p-3 rounded-lg bg-muted text-xs space-y-1">
              <p><strong>Candidate USN:</strong> {schedulingCandidate.usn}</p>
              <p><strong>College:</strong> {schedulingCandidate.collegeName}</p>
              <p><strong>Exam Score:</strong> {schedulingCandidate.exam.score}/100 (State Rank #{schedulingCandidate.exam.statewideRank})</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Interview Date</label>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Time Slot</label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                placeholder="e.g. 10:00 AM - 10:45 AM"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Mode</label>
              <select
                value={slotMode}
                onChange={(e) => setSlotMode(e.target.value as "Online" | "Offline")}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="Online">Online Video (Google Meet / WebRTC)</option>
                <option value="Offline">Offline Campus Placement Cell</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Assigned HR / Technical Panel</label>
              <input
                type="text"
                value={slotPanel}
                onChange={(e) => setSlotPanel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setSchedulingCandidate(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm & Dispatch Invite
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectingCandidate && (
        <Modal
          isOpen={!!rejectingCandidate}
          onClose={() => setRejectingCandidate(null)}
          title={`Reject Candidate: ${rejectingCandidate.fullName}`}
        >
          <form onSubmit={handleConfirmReject} className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Rejecting this candidate removes them from the qualified queue and archives their profile with permanent rejection notes.
            </p>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Mandatory Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-rose-500"
                placeholder="Specify why candidate was rejected before interview (e.g. Document mismatch, backlogs exceeding policy, academic criteria)..."
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectingCandidate(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm">
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Hold Modal */}
      {holdingCandidate && (
        <Modal
          isOpen={!!holdingCandidate}
          onClose={() => setHoldingCandidate(null)}
          title={`Place on Hold: ${holdingCandidate.fullName}`}
        >
          <form onSubmit={handleConfirmHold} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Follow-up Date</label>
              <input
                type="date"
                value={holdFollowupDate}
                onChange={(e) => setHoldFollowupDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Hold Notes & Follow-up Instructions</label>
              <textarea
                value={holdRemarks}
                onChange={(e) => setHoldRemarks(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                placeholder="e.g. Awaiting submission of 7th semester marksheet, or pending secondary technical review..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setHoldingCandidate(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Place on Hold
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Resume Preview Modal */}
      {previewResumeCandidate && (
        <Modal
          isOpen={!!previewResumeCandidate}
          onClose={() => setPreviewResumeCandidate(null)}
          title={`Resume Preview: ${previewResumeCandidate.fullName}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-muted/40 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-foreground">{previewResumeCandidate.fullName}</span>
                <span className="text-xs text-muted-foreground font-mono">{previewResumeCandidate.usn}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Institution:</strong> {previewResumeCandidate.collegeName}</p>
                <p><strong>Department:</strong> {previewResumeCandidate.branch}</p>
                <p><strong>CGPA:</strong> {previewResumeCandidate.cgpa} / 10.0</p>
                <p><strong>Core Skills:</strong> {previewResumeCandidate.skills.join(", ")}</p>
              </div>
            </div>

            <div className="p-8 text-center border-2 border-dashed border-border rounded-xl">
              <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
              <p className="text-xs font-semibold text-foreground">Verified Digital Resume on File</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Uploaded and authenticated via VTU Student Vault</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => toast.success(`Initiated resume download for ${previewResumeCandidate.fullName}`)}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
