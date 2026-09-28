"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  FileCheck2,
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ArrowLeft,
  Lock,
  Unlock,
  Sparkles,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
  Sliders,
  Check,
  Building2,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { examService, DetailedExamSubmission } from "@/lib/supabase/exam.service";

export default function AdminExamResultsPage() {
  const {
    students,
    questions,
    cutoffConfig,
    updateCutoffConfig,
    approveAndReleaseCutoff,
    shortlistStudent,
    currentUser,
  } = useApp();

  // Dynamic submissions aggregated from real students and database
  const submissions = useMemo(() => {
    return examService.getAllSubmissions(students);
  }, [students]);

  // Cut-off Score Form State
  const [targetCutoff, setTargetCutoff] = useState<number>(cutoffConfig.cutoffScore || 50);
  const [isApproving, setIsApproving] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [scoreRangeFilter, setScoreRangeFilter] = useState("all");
  const [proctoringFilter, setProctoringFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score_desc");

  // Selected Submission for Detailed Review Modal
  const [selectedSubmission, setSelectedSubmission] = useState<DetailedExamSubmission | null>(null);

  // Extract unique colleges and branches for filters
  const uniqueColleges = useMemo(() => {
    return Array.from(new Set(submissions.map((s) => s.collegeName))).filter(Boolean);
  }, [submissions]);

  const uniqueBranches = useMemo(() => {
    return Array.from(new Set(submissions.map((s) => s.branch))).filter(Boolean);
  }, [submissions]);

  // Calculations for live preview based on targetCutoff
  const qualifyingAtTarget = useMemo(() => {
    return submissions.filter((s) => s.percentage >= targetCutoff && s.violationCount < 3);
  }, [submissions, targetCutoff]);

  const belowAtTarget = useMemo(() => {
    return submissions.filter((s) => s.percentage < targetCutoff || s.violationCount >= 3);
  }, [submissions, targetCutoff]);

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((s) => {
        // Search filter
        const matchesSearch =
          s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        let matchesStatus = true;
        if (statusFilter === "shortlisted") matchesStatus = s.status === "Qualified" || s.meetsCutoff;
        else if (statusFilter === "below_cutoff") matchesStatus = s.status === "Disqualified" || !s.meetsCutoff;
        else if (statusFilter === "pending") matchesStatus = s.status === "Exam Completed";
        else if (statusFilter === "flagged") matchesStatus = s.violationCount > 0;

        // College filter
        const matchesCollege = collegeFilter === "all" || s.collegeName === collegeFilter;

        // Branch filter
        const matchesBranch = branchFilter === "all" || s.branch === branchFilter;

        // Score range filter
        let matchesScore = true;
        if (scoreRangeFilter === "top_tier") matchesScore = s.percentage >= 80;
        else if (scoreRangeFilter === "mid_high") matchesScore = s.percentage >= 65 && s.percentage < 80;
        else if (scoreRangeFilter === "mid_tier") matchesScore = s.percentage >= 50 && s.percentage < 65;
        else if (scoreRangeFilter === "below_50") matchesScore = s.percentage < 50;

        // Proctoring filter
        let matchesProctor = true;
        if (proctoringFilter === "clean") matchesProctor = s.violationCount === 0;
        else if (proctoringFilter === "flagged") matchesProctor = s.violationCount > 0;

        return matchesSearch && matchesStatus && matchesCollege && matchesBranch && matchesScore && matchesProctor;
      })
      .sort((a, b) => {
        if (sortBy === "score_desc") return b.percentage - a.percentage;
        if (sortBy === "score_asc") return a.percentage - b.percentage;
        if (sortBy === "aptitude_desc") {
          const aApt = a.sectionBreakdown.find((x) => x.category === "Aptitude")?.score || 0;
          const bApt = b.sectionBreakdown.find((x) => x.category === "Aptitude")?.score || 0;
          return bApt - aApt;
        }
        if (sortBy === "prog_desc") {
          const aProg = a.sectionBreakdown.find((x) => x.category === "Programming")?.score || 0;
          const bProg = b.sectionBreakdown.find((x) => x.category === "Programming")?.score || 0;
          return bProg - aProg;
        }
        if (sortBy === "name_asc") return a.studentName.localeCompare(b.studentName);
        return 0;
      });
  }, [
    submissions,
    searchTerm,
    statusFilter,
    collegeFilter,
    branchFilter,
    scoreRangeFilter,
    proctoringFilter,
    sortBy,
  ]);

  // Overall Metrics
  const avgScore = useMemo(() => {
    if (submissions.length === 0) return 0;
    const sum = submissions.reduce((acc, s) => acc + s.percentage, 0);
    return Math.round(sum / submissions.length);
  }, [submissions]);

  const topScore = useMemo(() => {
    if (submissions.length === 0) return 0;
    return Math.max(...submissions.map((s) => s.percentage));
  }, [submissions]);

  // Handle Approve Cut-off & Shortlist Candidates
  const handleApproveCutoff = async () => {
    setIsApproving(true);
    try {
      await approveAndReleaseCutoff(targetCutoff, currentUser.name || "Super Admin");
    } finally {
      setIsApproving(false);
    }
  };

  // Toggle Marks Visibility Only
  const handleToggleRelease = async () => {
    const nextState = !cutoffConfig.resultsReleased;
    await updateCutoffConfig({ resultsReleased: nextState });
    toast.success(
      nextState
        ? "Marks and scorecards are now VISIBLE to students"
        : "Marks and scorecards are now HIDDEN from students"
    );
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const headers = [
      "Student Name",
      "USN",
      "Email",
      "College",
      "Branch",
      "Aptitude (20)",
      "Reasoning (10)",
      "Programming (30)",
      "Total Marks (60)",
      "Percentage",
      "Current Cut-off",
      "Meets Cut-off",
      "Status",
      "Violations",
      "Submitted At",
    ];

    const rows = filteredSubmissions.map((s) => {
      const apt = s.sectionBreakdown.find((x) => x.category === "Aptitude")?.score || 0;
      const reas = s.sectionBreakdown.find((x) => x.category === "Reasoning")?.score || 0;
      const prog = s.sectionBreakdown.find((x) => x.category === "Programming")?.score || 0;
      return [
        `"${s.studentName}"`,
        `"${s.usn}"`,
        `"${s.email}"`,
        `"${s.collegeName}"`,
        `"${s.branch}"`,
        apt,
        reas,
        prog,
        s.marksObtained,
        `${s.percentage}%`,
        `${cutoffConfig.cutoffScore}%`,
        s.meetsCutoff ? "YES" : "NO",
        `"${s.status}"`,
        s.violationCount,
        `"${s.submittedAt}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GQT_CSR_Exam_Results_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("Exam results exported to CSV successfully");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/40 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/exams"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Exam Dashboard
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Exam Results & Cut-off Shortlisting Hub
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
            Administer 60-question examination results, set and approve drive cut-off scores, release verified marks,
            and shortlist high-aptitude candidates for technical interview rounds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="border-slate-700 hover:bg-slate-800 text-white gap-2 font-bold"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel / CSV
          </Button>

          <Button
            onClick={handleToggleRelease}
            variant={cutoffConfig.resultsReleased ? "danger" : "primary"}
            size="sm"
            className="gap-2 font-bold"
          >
            {cutoffConfig.resultsReleased ? (
              <>
                <Lock className="w-4 h-4" /> Hide Marks from Students
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" /> Release Marks to Students
              </>
            )}
          </Button>
        </div>
      </div>

      {/* CUT-OFF SCORE APPROVAL CONTROL BAR (CORE FEATURE) */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-[28px] border border-blue-200/60 dark:border-blue-900/50 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Drive Cut-off Score & Shortlist Controller
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase flex items-center gap-1.5 ${
                    cutoffConfig.isApproved && cutoffConfig.resultsReleased
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse"
                  }`}
                >
                  {cutoffConfig.isApproved && cutoffConfig.resultsReleased ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Released ({cutoffConfig.cutoffScore}%)
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Pending Cut-off Approval (Marks Hidden)
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {cutoffConfig.isApproved
                  ? `Cut-off set to ${cutoffConfig.cutoffScore}% by ${cutoffConfig.approvedBy || "Admin"}. Candidates meeting this score are shortlisted.`
                  : "Students taking the test will NOT see their marks until you approve the cut-off score and publish the shortlist."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-bold">Cut-off Threshold:</span>
              <span className="text-lg font-black text-[#005BBB] dark:text-[#14B8FF]">{targetCutoff}%</span>
              <span className="text-xs text-slate-400">({Math.round((targetCutoff / 100) * 60)}/60 marks)</span>
            </div>

            <Button
              onClick={handleApproveCutoff}
              variant="primary"
              size="md"
              disabled={isApproving}
              className="gap-2 font-black shadow-md shadow-blue-500/20"
            >
              {isApproving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Approve Cut-off & Shortlist Candidates
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Live Impact Preview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Adjust Cut-off Threshold (%):
            </span>
            <input
              type="range"
              min={30}
              max={90}
              step={5}
              value={targetCutoff}
              onChange={(e) => setTargetCutoff(Number(e.target.value))}
              className="w-36 accent-[#005BBB] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-700 dark:text-slate-200">
              Qualify at {targetCutoff}%:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                {qualifyingAtTarget.length} candidates ({submissions.length > 0 ? Math.round((qualifyingAtTarget.length / submissions.length) * 100) : 0}%)
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-xs text-slate-700 dark:text-slate-200">
              Below Cut-off:{" "}
              <strong className="text-rose-600 dark:text-rose-400 font-black">
                {belowAtTarget.length} candidates
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Examinees</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{submissions.length}</p>
          <span className="text-[11px] text-slate-500">Verified unique students</span>
        </div>

        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Cut-off</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-[#005BBB] dark:text-[#14B8FF] mt-2">
            {cutoffConfig.cutoffScore}%
          </p>
          <span className="text-[11px] text-slate-500">
            {cutoffConfig.isApproved ? "Approved by Admin" : "Pending official approval"}
          </span>
        </div>

        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted (Qualified)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {submissions.filter((s) => s.status === "Qualified" || s.percentage >= cutoffConfig.cutoffScore).length}
          </p>
          <span className="text-[11px] text-slate-500">Eligible for Technical Interview</span>
        </div>

        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top / Avg Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {topScore}% <span className="text-sm font-semibold text-slate-400">/ avg {avgScore}%</span>
          </p>
          <span className="text-[11px] text-slate-500">Across 60 exam questions</span>
        </div>
      </div>

      {/* MULTI-FACETED FILTER STRIP */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, USN, college, email..."
              className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 text-xs rounded-xl"
            />
          </div>

          {/* Status / Cutoff Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Verdicts</option>
            <option value="shortlisted">Meets Cut-off / Shortlisted</option>
            <option value="below_cutoff">Below Cut-off</option>
            <option value="pending">Pending Evaluation</option>
            <option value="flagged">Proctoring Flagged</option>
          </select>

          {/* College Filter */}
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium truncate"
          >
            <option value="all">All Colleges</option>
            {uniqueColleges.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium truncate"
          >
            <option value="all">All Branches</option>
            {uniqueBranches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Second Row Filters: Score Range, Proctoring, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-400">Score Range:</span>
            {[
              { id: "all", label: "All Scores" },
              { id: "top_tier", label: "≥ 80%" },
              { id: "mid_high", label: "65% - 79%" },
              { id: "mid_tier", label: "50% - 64%" },
              { id: "below_50", label: "< 50%" },
            ].map((rng) => (
              <button
                key={rng.id}
                onClick={() => setScoreRangeFilter(rng.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  scoreRangeFilter === rng.id
                    ? "bg-[#005BBB] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {rng.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="score_desc">Total Score (High → Low)</option>
                <option value="score_asc">Total Score (Low → High)</option>
                <option value="aptitude_desc">Section A: Aptitude</option>
                <option value="prog_desc">Section C: Programming</option>
                <option value="name_asc">Candidate Name (A → Z)</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredSubmissions.length} of {submissions.length} students
            </span>
          </div>
        </div>
      </div>

      {/* REAL STUDENTS RESULTS TABLE (ZERO DUPLICATES) */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-[28px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="p-4 pl-6">Candidate & USN</th>
                <th className="p-4">College & Branch</th>
                <th className="p-4 text-center">Sec A: Aptitude (20)</th>
                <th className="p-4 text-center">Sec B: Reasoning (10)</th>
                <th className="p-4 text-center">Sec C: Coding (30)</th>
                <th className="p-4 text-center">Total Marks (60)</th>
                <th className="p-4 text-center">Cut-off Verdict</th>
                <th className="p-4 text-center">Proctoring</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                    No examination submissions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s) => {
                  const aptScore = s.sectionBreakdown.find((x) => x.category === "Aptitude")?.score || 0;
                  const reasScore = s.sectionBreakdown.find((x) => x.category === "Reasoning")?.score || 0;
                  const progScore = s.sectionBreakdown.find((x) => x.category === "Programming")?.score || 0;
                  const isQualified = s.status === "Qualified" || s.percentage >= cutoffConfig.cutoffScore;

                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors">
                      {/* Candidate */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.photoUrl}
                            alt={s.studentName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {s.studentName}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{s.usn}</span>
                          </div>
                        </div>
                      </td>

                      {/* College & Branch */}
                      <td className="p-4 max-w-xs">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {s.collegeName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{s.branch}</div>
                      </td>

                      {/* Section A: Aptitude */}
                      <td className="p-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-xs">
                          {aptScore}/20
                        </span>
                      </td>

                      {/* Section B: Reasoning */}
                      <td className="p-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs">
                          {reasScore}/10
                        </span>
                      </td>

                      {/* Section C: Programming */}
                      <td className="p-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs">
                          {progScore}/30
                        </span>
                      </td>

                      {/* Total Marks & % */}
                      <td className="p-4 text-center">
                        <div className="font-black text-slate-900 dark:text-white text-sm">
                          {s.marksObtained}/60
                        </div>
                        <div className="text-xs font-bold text-blue-600 dark:text-cyan-400">
                          {s.percentage}%
                        </div>
                      </td>

                      {/* Cut-off Verdict Badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-extrabold ${
                            isQualified
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {isQualified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isQualified ? "Shortlisted" : "Below Cut-off"}
                        </span>
                      </td>

                      {/* Proctoring */}
                      <td className="p-4 text-center">
                        {s.violationCount === 0 ? (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Clean (0)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-500 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {s.violationCount} Strikes
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSubmission(s)}
                            title="View Scorecard & Answers"
                            className="h-8 px-2.5 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Scorecard
                          </Button>

                          <Button
                            size="sm"
                            variant={isQualified ? "outline" : "primary"}
                            onClick={() =>
                              shortlistStudent(
                                s.studentId,
                                isQualified ? "Disqualified" : "Qualified"
                              )
                            }
                            className="h-8 px-2.5 text-xs font-bold"
                          >
                            {isQualified ? "Remove" : "Shortlist"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DETAILED SCORECARD & ANSWER SHEET MODAL */}
      {selectedSubmission && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title={`Exam Submission: ${selectedSubmission.studentName} (${selectedSubmission.usn})`}
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Details */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-bold">College</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSubmission.collegeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Branch</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedSubmission.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Total Marks</span>
                <span className="text-base font-black text-[#005BBB] dark:text-[#14B8FF]">
                  {selectedSubmission.marksObtained} / 60 ({selectedSubmission.percentage}%)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Recruitment Verdict</span>
                <span
                  className={`font-black ${
                    selectedSubmission.percentage >= cutoffConfig.cutoffScore ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {selectedSubmission.percentage >= cutoffConfig.cutoffScore ? "Shortlisted for Interview" : "Below Cut-off"}
                </span>
              </div>
            </div>

            {/* Section Breakdown Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sectional Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedSubmission.sectionBreakdown.map((sec) => (
                  <div
                    key={sec.category}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <span className="text-[11px] font-bold text-slate-500 block">{sec.category}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {sec.score} / {sec.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proctoring Log */}
            {selectedSubmission.violations && selectedSubmission.violations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Proctoring Strikes Log
                </h4>
                <div className="space-y-1.5">
                  {selectedSubmission.violations.map((v, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between"
                    >
                      <span>
                        Strike {v.strikeNumber}: {v.message} ({v.type})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(v.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 60 Questions Review Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Examination Questions Sample (60 Questions Bank)
              </h4>
              <div className="space-y-3">
                {questions.slice(0, 10).map((q, qIdx) => {
                  const studentAnsIdx = selectedSubmission.answers[qIdx];
                  const isCorrect = studentAnsIdx === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Q{qIdx + 1}. {q.question}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF]">
                          {q.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg border ${
                              oIdx === q.correctAnswer
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                                : oIdx === studentAnsIdx && !isCorrect
                                ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 line-through"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={() => setSelectedSubmission(null)} variant="primary" size="sm">
                Close Scorecard
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
