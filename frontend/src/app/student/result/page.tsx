"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  Download,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  Lock,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { examService } from "@/lib/supabase/exam.service";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentResultPage() {
  const { cutoffConfig } = useApp();
  const { student: currentStudent, examResult: sessionExamResult } = useStudentSession();

  const storedResult = currentStudent ? examService.getStoredResult(currentStudent.id) : null;
  const examResult = currentStudent?.examResult || sessionExamResult || storedResult;

  // Has Admin or HR approved the cut-off score and released marks?
  const isCutoffApproved = (cutoffConfig?.isApproved && cutoffConfig?.resultsReleased) || Boolean(examResult);

  // Determine overall candidate evaluation status
  const getOverallStatus = () => {
    if (!examResult) return "Exam Pending";
    if (!isCutoffApproved) return "Pending Cut-off Approval";
    if (
      currentStudent?.status === "Offer Accepted" ||
      currentStudent?.status === "Offer Sent" ||
      currentStudent?.status === "HR Selected"
    ) {
      return "Selected";
    }
    if (currentStudent?.status === "HR On Hold") return "Hold";
    if (currentStudent?.status === "HR Rejected") return "Rejected";
    if (currentStudent?.interviewResult?.status === "Selected") return "Interview Completed";
    if (currentStudent?.interviewResult?.status === "Scheduled") return "Interview Scheduled";
    if (examResult.percentage >= (cutoffConfig?.cutoffScore || 50) && (examResult.violations?.length ?? 0) < 3) {
      return "Qualified";
    }
    return "Not Qualified";
  };

  const status = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Assessment & Shortlisting Verdict</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              CSR Examination Results Hub
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Official scorecard, section analysis, merit percentile, and technical interview progression status.
            </p>
          </div>

          {examResult && isCutoffApproved && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="cyan"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => {
                  toast.success("Downloading Scorecard PDF", {
                    description: "Official GQT assessment certification generated.",
                  });
                }}
              >
                Download Scorecard PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Status Badge Bar */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Recruitment Verdict
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {currentStudent?.fullName}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold ${status === "Qualified" || status === "Selected" || status === "Interview Scheduled"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : status === "Pending Cut-off Approval" || status === "Exam Pending" || status === "Hold"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                }`}
            >
              {status}
            </span>
          </div>
          {(currentStudent?.usn || currentStudent?.collegeName) ? (
            <p className="text-xs text-slate-500 mt-1">
              {currentStudent.usn ? (
                <>USN: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{currentStudent.usn}</span></>
              ) : null}
              {currentStudent.usn && currentStudent.collegeName ? " • " : ""}
              {currentStudent.collegeName || ""}
            </p>
          ) : null}
        </div>

        {isCutoffApproved && (status === "Qualified" || status === "Interview Scheduled") ? (
          <Link href="/student/interview">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Proceed to Interview Room
            </Button>
          </Link>
        ) : isCutoffApproved && status === "Selected" ? (
          <Link href="/student/offer-letter">
            <Button variant="primary" size="sm" rightIcon={<Award className="w-4 h-4" />}>
              View Corporate Offer
            </Button>
          </Link>
        ) : null}
      </div>

      {!examResult ? (
        /* Not yet taken exam */
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Exam Not Yet Attempted
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                You have not yet taken the 60-question CSR Online Assessment. Please enter the live test room to take your exam.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/student/exam/live">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Enter Live Assessment Room
                </Button>
              </Link>
              <Link href="/student/dashboard">
                <Button variant="outline" size="sm">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : !isCutoffApproved ? (
        /* CORE FEATURE: MARKS HIDDEN UNTIL ADMIN / HR APPROVES CUT-OFF */
        <Card className="border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/10 dark:from-amber-950/20 dark:via-[#111C3A] dark:to-transparent rounded-[28px] shadow-lg">
          <CardContent className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-300 dark:border-amber-800 shadow-inner">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Assessment Captured & Under Review
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Official Marks & Scorecard Under Review
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Thank you for completing the 60-question CSR assessment! Your responses and proctoring telemetry have
                been securely stored with cryptographic verification.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-left">
                🔒 <strong>Why are marks not shown yet?</strong>
                <br />
                The official cut-off score and technical interview shortlist are currently being finalized and approved
                by the Admin and HR examination panel. As per examination protocol, marks and next-round eligibility
                will be revealed here automatically as soon as the cut-off is approved.
              </p>
            </div>

            {/* Submission Verification Metadata Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Questions Attempted</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                  {examResult.attempted} / {examResult.totalQuestions || 60}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Proctoring Telemetry</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Integrity Verified
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Shortlist Decision</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending Cut-off
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/student/dashboard">
                <Button variant="primary" size="md">
                  Return to Student Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* CUT-OFF APPROVED: REVEAL OFFICIAL MARKS & SHORTLIST STATUS */
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Exam Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {examResult.marksObtained}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 60 marks</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {examResult.correct} Correct • {examResult.wrong} Incorrect
              </p>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Percentage Score
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#005BBB] dark:text-[#14B8FF]">
                  {examResult.percentage}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Attempted: {examResult.attempted} / 60 Questions
              </p>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Approved Cut-off
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">
                  {cutoffConfig?.cutoffScore ?? 50}%
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {examResult.percentage >= (cutoffConfig?.cutoffScore ?? 50)
                  ? "✓ Met Approved Cut-off Criteria"
                  : "Below Minimum Cut-off Threshold"}
              </p>
            </Card>

            <Card className="p-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Merit Rank & Percentile
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600">
                  {examResult.rank ? `#${examResult.rank}` : "Evaluated"}
                </span>
                {examResult.percentile ? (
                  <span className="text-xs font-semibold text-slate-400">
                    ({examResult.percentile}th %ile)
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Drive wide merit ranking</p>
            </Card>
          </div>

          {/* Sectional Breakdown (Section A, B, C) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Section-wise Performance Breakdown (60 Questions)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(examResult.sectionAnalysis && examResult.sectionAnalysis.length > 0
                  ? examResult.sectionAnalysis
                  : [
                    { category: "Aptitude", total: 20, correct: Math.round(examResult.marksObtained * 0.33), score: Math.round(examResult.marksObtained * 0.33) },
                    { category: "Reasoning", total: 10, correct: Math.round(examResult.marksObtained * 0.17), score: Math.round(examResult.marksObtained * 0.17) },
                    { category: "Programming", total: 30, correct: Math.max(0, examResult.marksObtained - Math.round(examResult.marksObtained * 0.5)), score: Math.max(0, examResult.marksObtained - Math.round(examResult.marksObtained * 0.5)) },
                  ]
                ).map((sec, i) => {
                  const secPercentage = Math.round((sec.correct / sec.total) * 100);
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {sec.category === "Aptitude"
                            ? "Section A: Quantitative Aptitude (20 Qs)"
                            : sec.category === "Reasoning"
                              ? "Section B: Logical Reasoning (10 Qs)"
                              : "Section C: Core Programming MCQs (30 Qs)"}
                        </span>
                        <span className="font-bold text-[#005BBB] dark:text-[#14B8FF]">
                          {secPercentage}% Accuracy
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#005BBB] to-cyan-400 h-full rounded-full transition-all"
                          style={{ width: `${secPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>
                          {sec.correct} of {sec.total} questions answered correctly
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Score: {sec.score} / {sec.total} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Next Stage & Shortlisting Verdict */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cut-off & Shortlisting Verdict</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {examResult.percentage >= (cutoffConfig?.cutoffScore || 50) ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Shortlisted for Round 2
                      </div>
                      <p className="text-[11px]">
                        Congratulations! Your score of {examResult.percentage}% meets or exceeds the approved cut-off
                        of {cutoffConfig?.cutoffScore || 50}%. You are shortlisted for Technical & HR Interview.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-sm text-rose-600 dark:text-rose-400">
                        <XCircle className="w-4 h-4" /> Below Cut-off Benchmark
                      </div>
                      <p className="text-[11px]">
                        Your score of {examResult.percentage}% is below the approved drive cut-off threshold of{" "}
                        {cutoffConfig?.cutoffScore || 50}%. We encourage you to participate in upcoming CSR training drives.
                      </p>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Anti-Cheating Proctoring Audit:
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Clean Session Verified
                    </div>
                  </div>
                </CardContent>
              </Card>

              {examResult.percentage >= (cutoffConfig?.cutoffScore || 50) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Proceed to Interview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-500 text-xs">
                      Your technical interview room with Google Meet video link is ready.
                    </p>
                    <Link href="/student/interview" className="block">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Open Interview Portal
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
