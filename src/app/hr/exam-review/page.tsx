"use client";

import React, { useState, useMemo } from "react";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Users,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  FileText,
  Code,
  Share2,
  Globe,
  Sparkles,
  RefreshCw,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Sliders,
  Check,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";
import { examService, DetailedExamSubmission } from "@/lib/supabase/exam.service";

export default function HRExamReviewPage() {
  const {
    students,
    questions,
    cutoffConfig,
    updateCutoffConfig,
    approveAndReleaseCutoff,
    shortlistStudent,
    currentUser,
  } = useApp();

  // Deduplicated submissions from real students & Supabase
  const submissions = useMemo(() => {
    return examService.getAllSubmissions(students);
  }, [students]);

  // Cut-off threshold input
  const [targetCutoff, setTargetCutoff] = useState<number>(cutoffConfig.cutoffScore || 50);
  const [isApproving, setIsApproving] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<DetailedExamSubmission | null>(null);

  // Unique lists for dropdowns
  const uniqueColleges = useMemo(() => {
    return Array.from(new Set(submissions.map((s) => s.collegeName))).filter(Boolean);
  }, [submissions]);

  const uniqueBranches = useMemo(() => {
    return Array.from(new Set(submissions.map((s) => s.branch))).filter(Boolean);
  }, [submissions]);

  // Live qualifying preview
  const qualifyingAtTarget = useMemo(() => {
    return submissions.filter((s) => s.percentage >= targetCutoff && s.violationCount < 3);
  }, [submissions, targetCutoff]);

  // Filtered submissions
  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch =
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "shortlisted") matchesStatus = s.status === "Qualified" || s.meetsCutoff;
      else if (statusFilter === "below_cutoff") matchesStatus = s.status === "Disqualified" || !s.meetsCutoff;
      else if (statusFilter === "pending") matchesStatus = s.status === "Exam Completed";
      else if (statusFilter === "flagged") matchesStatus = s.violationCount > 0;

      const matchesCollege = collegeFilter === "all" || s.collegeName === collegeFilter;
      const matchesBranch = branchFilter === "all" || s.branch === branchFilter;

      let matchesScore = true;
      if (scoreFilter === "top_tier") matchesScore = s.percentage >= 80;
      else if (scoreFilter === "mid_tier") matchesScore = s.percentage >= 60 && s.percentage < 80;
      else if (scoreFilter === "low_tier") matchesScore = s.percentage < 60;

      return matchesSearch && matchesStatus && matchesCollege && matchesBranch && matchesScore;
    });
  }, [submissions, searchTerm, statusFilter, collegeFilter, branchFilter, scoreFilter]);

  // Handle Approve Cut-off & Shortlist Candidates
  const handleApproveCutoff = async () => {
    setIsApproving(true);
    try {
      await approveAndReleaseCutoff(targetCutoff, currentUser.name || "HR Lead");
    } finally {
      setIsApproving(false);
    }
  };

  // Move candidate to Interview Schedule
  const handleScheduleInterview = async (sub: DetailedExamSubmission) => {
    await shortlistStudent(sub.studentId, "HR Interview Scheduled");
    toast.success(`Interview Invite Dispatched`, {
      description: `${sub.studentName} scheduled for Google Meet technical interview.`,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/40 to-slate-900/40 border border-blue-500/20 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-bold text-blue-400 mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>HR Recruiter Assessment Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Exam Evaluation & Candidate Shortlisting
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
            Review 60-question assessment submissions, apply drive cut-offs, inspect section performance (Aptitude,
            Reasoning, Programming), and shortlist verified candidates for HR interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/interviews">
            <Button variant="primary" size="sm" className="gap-2 font-bold shadow-md shadow-blue-500/20">
              <Calendar className="w-4 h-4" /> Go to HR Interview Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* HR CUT-OFF SCORE APPROVAL CONTROL BAR */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-[28px] border border-blue-200/60 dark:border-blue-900/50 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  HR Cut-off Criteria & Shortlisting Engine
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase flex items-center gap-1.5 ${
                    cutoffConfig.isApproved && cutoffConfig.resultsReleased
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  }`}
                >
                  {cutoffConfig.isApproved && cutoffConfig.resultsReleased ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved ({cutoffConfig.cutoffScore}%)
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Pending Cut-off Approval
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {cutoffConfig.isApproved
                  ? `Cut-off set at ${cutoffConfig.cutoffScore}%. Candidates meeting this mark are eligible for Technical Interview scheduling.`
                  : "Student marks remain securely hidden until you or Admin approve the cut-off score."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-bold">Cut-off Threshold:</span>
              <span className="text-lg font-black text-[#005BBB] dark:text-[#14B8FF]">{targetCutoff}%</span>
            </div>

            <Button
              onClick={handleApproveCutoff}
              variant="primary"
              size="md"
              disabled={isApproving}
              className="gap-2 font-black"
            >
              {isApproving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Approve Cut-off & Shortlist
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Live Preview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Set Cut-off Score (%):</span>
            <input
              type="range"
              min={30}
              max={90}
              step={5}
              value={targetCutoff}
              onChange={(e) => setTargetCutoff(Number(e.target.value))}
              className="w-32 accent-[#005BBB] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>
              Qualifying at {targetCutoff}%:{" "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                {qualifyingAtTarget.length} students ({submissions.length > 0 ? Math.round((qualifyingAtTarget.length / submissions.length) * 100) : 0}%)
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>
              Below Cut-off:{" "}
              <strong className="text-rose-600 dark:text-rose-400 font-black">
                {submissions.length - qualifyingAtTarget.length} students
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search candidate, USN, college..."
              className="w-full pl-10 pr-4 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Verdicts</option>
            <option value="shortlisted">Shortlisted / Meets Cut-off</option>
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

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">
            Showing {filtered.length} of {submissions.length} verified candidates (Zero Duplicates)
          </span>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Quick Score:</span>
            {[
              { id: "all", label: "All" },
              { id: "top_tier", label: "≥ 80%" },
              { id: "mid_tier", label: "60% - 79%" },
              { id: "low_tier", label: "< 60%" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setScoreFilter(btn.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  scoreFilter === btn.id
                    ? "bg-[#005BBB] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUBMISSIONS TABLE */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-[28px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <tr>
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4">College & Branch</th>
                <th className="p-4 text-center">Aptitude (20)</th>
                <th className="p-4 text-center">Reasoning (10)</th>
                <th className="p-4 text-center">Coding (30)</th>
                <th className="p-4 text-center">Total (60)</th>
                <th className="p-4 text-center">Cut-off Status</th>
                <th className="p-4 text-center">Proctoring</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                    No candidates match the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const aptScore = s.sectionBreakdown.find((x) => x.category === "Aptitude")?.score || 0;
                  const reasScore = s.sectionBreakdown.find((x) => x.category === "Reasoning")?.score || 0;
                  const progScore = s.sectionBreakdown.find((x) => x.category === "Programming")?.score || 0;
                  const isQualified = s.status === "Qualified" || s.percentage >= cutoffConfig.cutoffScore;

                  return (
                    <tr key={s.studentId} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
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

                      <td className="p-4 max-w-xs">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {s.collegeName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{s.branch}</div>
                      </td>

                      <td className="p-4 text-center font-bold text-blue-600 dark:text-blue-400">
                        {aptScore}/20
                      </td>

                      <td className="p-4 text-center font-bold text-purple-600 dark:text-purple-400">
                        {reasScore}/10
                      </td>

                      <td className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {progScore}/30
                      </td>

                      <td className="p-4 text-center">
                        <div className="font-black text-slate-900 dark:text-white">{s.marksObtained}/60</div>
                        <div className="text-xs font-bold text-blue-500">{s.percentage}%</div>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                            isQualified
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {isQualified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isQualified ? "Shortlisted" : "Below Cut-off"}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        {s.violationCount === 0 ? (
                          <span className="text-[11px] font-semibold text-emerald-500">Clean</span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-500">{s.violationCount} Strikes</span>
                        )}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSubmission(s)}
                            className="h-8 px-2.5 text-xs font-bold gap-1 text-[#005BBB] dark:text-[#14B8FF]"
                          >
                            <Eye className="w-3.5 h-3.5" /> Scorecard
                          </Button>

                          <Button
                            size="sm"
                            variant={isQualified ? "primary" : "outline"}
                            onClick={() => handleScheduleInterview(s)}
                            className="h-8 px-2.5 text-xs font-bold gap-1"
                          >
                            <Calendar className="w-3 h-3" /> Interview
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

      {/* SCORECARD MODAL */}
      {selectedSubmission && (
        <Modal
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title={`Candidate Scorecard: ${selectedSubmission.studentName}`}
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-bold block">USN & College</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedSubmission.usn} • {selectedSubmission.collegeName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Total Marks</span>
                <span className="text-base font-black text-[#005BBB] dark:text-[#14B8FF]">
                  {selectedSubmission.marksObtained} / 60 ({selectedSubmission.percentage}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {selectedSubmission.sectionBreakdown.map((sec) => (
                <div
                  key={sec.category}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <span className="text-[11px] font-bold text-slate-500 block">{sec.category}</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    {sec.score} / {sec.total}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleScheduleInterview(selectedSubmission);
                  setSelectedSubmission(null);
                }}
              >
                Schedule Technical Interview
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
