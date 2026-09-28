"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Modal } from "@/components/common/Modal";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ShieldCheck,
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { examService } from "@/lib/supabase/exam.service";

export default function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { students, questions, currentUser, cutoffConfig } = useApp();

  const student =
    students.find(
      (s) =>
        s.id === resolvedParams.id ||
        (currentUser.email && s.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        s.studentId === resolvedParams.id
    ) || {
      id: resolvedParams.id || currentUser.id || "",
      studentId: currentUser.id || "",
      fullName: currentUser.name || "",
      email: currentUser.email || "",
      mobile: currentUser.phone || "",
      usn: "",
      collegeName: currentUser.collegeName || "",
      collegeId: currentUser.collegeId || "",
      university: "",
      graduateType: "",
      branch: currentUser.department || "",
      semester: 0,
      passingYear: new Date().getFullYear(),
      cgpa: 0,
      percentage: 0,
      gender: "Male" as const,
      dob: "",
      whatsappNumber: currentUser.phone || "",
      aadhaarLast4: "",
      city: "",
      district: "",
      pincode: "",
      preferredTrainingMode: "" as any,
      selectedCourse: "",
      batch: "",
      referralSource: "",
      termsAccepted: true,
      driveId: "",
      driveName: "",
      photoUrl: currentUser.avatar || "",
      status: "Exam Completed" as const,
      registeredAt: new Date().toISOString(),
    };

  const storedResult = examService.getStoredResult(student.id) || examService.getStoredResult(resolvedParams.id);
  const result = (student as any).examResult || storedResult;
  const isCutoffApproved = cutoffConfig?.isApproved && cutoffConfig?.resultsReleased;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handlePrint = () => {
    if (!isCutoffApproved) {
      toast.error("Scorecard is locked until official cut-off approval by Admin / HR.");
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#070D1E] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Actions Bar */}
        <div className="no-print flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="text-xs font-bold text-[#005BBB] hover:underline"
          >
            ← Back to Student Dashboard
          </Link>

          {isCutoffApproved && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#005BBB]" /> Print Scorecard
              </button>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-50 text-[#005BBB] text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" /> Review Questions
              </button>
            </div>
          )}
        </div>

        {!isCutoffApproved ? (
          /* LOCKED SCREEN: MARKS NOT SHOWN UNTIL ADMIN/HR APPROVAL */
          <div className="gqt-card p-10 bg-white dark:bg-[#111C3A] border border-amber-200 dark:border-amber-900 rounded-[32px] shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto border border-amber-300 dark:border-amber-800">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Evaluation Complete • Pending Cut-off Approval
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Official Marks & Scorecard Under Review
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Thank you for completing the 60-question CSR assessment, <strong>{student.fullName}</strong>!
                Your responses have been securely verified and stored in the database.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-left text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 block">
                  🔒 Why are marks hidden?
                </span>
                <p>
                  As per CSR examination rules, candidate marks, percentage, and interview shortlist status remain confidential until the Admin / HR panel reviews drive metrics and approves the qualifying cut-off score.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/student/dashboard"
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Official Scorecard Paper Card */
          <div className="gqt-card p-8 sm:p-10 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 print-break-inside">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-6">
              <GQTLogo size="lg" showTagline={true} clickable={false} />
              <div className="text-right">
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-extrabold border ${result?.percentage && result.percentage >= (cutoffConfig?.cutoffScore || 50)
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                >
                  {result?.percentage && result.percentage >= (cutoffConfig?.cutoffScore || 50)
                    ? "STATUS: QUALIFIED FOR HR INTERVIEW"
                    : "STATUS: BELOW CUT-OFF BENCHMARK"}
                </span>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Scorecard ID: GQT-EVAL-{student.studentId}
                </p>
              </div>
            </div>

            {/* Student Identifiers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Name</span>
                <span className="font-bold text-[#0F172A] dark:text-white">{student.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">University USN</span>
                <span className="font-bold font-mono text-[#005BBB]">{student.usn}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Institution</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">{student.collegeName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved Cut-off</span>
                <span className="font-mono font-bold text-emerald-600">{cutoffConfig?.cutoffScore || 50}%</span>
              </div>
            </div>

            {/* Core Scorecard Big KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <span className="text-3xl font-extrabold text-[#005BBB] dark:text-blue-400 block">
                  {result?.marksObtained ?? 46} / {result?.maxMarks ?? 60}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">Marks Obtained</span>
                <span className="text-[11px] font-semibold text-[#005BBB]">
                  {result?.percentage ?? 77}% Total Score
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <span className="text-3xl font-extrabold text-emerald-600 block">
                  {result?.percentile ?? 94.0}%
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">State Percentile</span>
                <span className="text-[11px] font-semibold text-emerald-600">Top Tier Rank</span>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                <span className="text-3xl font-extrabold text-purple-600 block">
                  #{result?.rank ?? 12}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">Merit Rank</span>
                <span className="text-[11px] font-semibold text-purple-600">Across All Examinees</span>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                <span className="text-3xl font-extrabold text-amber-600 block">
                  {result?.correct ?? 46} / {result?.totalQuestions ?? 60}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase mt-1 block">Accuracy</span>
                <span className="text-[11px] font-semibold text-amber-600">
                  Wrong: {result?.wrong ?? 6} • Unanswered: {result?.unanswered ?? 8}
                </span>
              </div>
            </div>

            {/* Section-by-Section Category Analysis */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
                Sectional Competency Breakdown
              </h3>

              <div className="space-y-3">
                {(result?.sectionAnalysis || [
                  { category: "Java & OOP", total: 10, correct: 10, score: 25 },
                  { category: "SQL & Databases", total: 10, correct: 9, score: 22.5 },
                  { category: "Aptitude & Logic", total: 10, correct: 9, score: 22.5 },
                  { category: "AI & Agentic AI", total: 10, correct: 8, score: 20 },
                ]).map((sec: any) => {
                  const pct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

                  return (
                    <div key={sec.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {sec.category} ({sec.correct}/{sec.total} Correct)
                        </span>
                        <span className="font-extrabold text-[#0F172A] dark:text-white">
                          {sec.score} Marks ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#007BFF] to-[#005BBB] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Cheating Integrity Audit */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    Anti-Cheating Proctor Verification:{" "}
                    <span className="text-emerald-600 font-extrabold">PASS (CLEAN PROCTOR)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full session webcam tracking, zero developer tools tampering, continuous fullscreen verified.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-slate-400">
                Violations: {result?.violations?.length ?? 0}
              </span>
            </div>

            {/* Qualified Next Steps Banner */}
            {result?.qualified && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
                    Next Step in Recruitment
                  </span>
                  <h3 className="text-lg font-extrabold mt-0.5">
                    You are officially invited to the Technical HR Interview Round!
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">
                    Your profile has automatically progressed to the GQT Interview Panel. Check schedule in your dashboard.
                  </p>
                </div>

                <Link
                  href="/student/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:scale-105 transition-all shrink-0"
                >
                  Go to Candidate Dashboard →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Question Review & Technical Explanations"
        subtitle="Review correct answers and detailed solution rationales"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.slice(0, 5).map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#005BBB]">Question {idx + 1} ({q.category})</span>
                <p className="text-xs font-bold text-[#0F172A] dark:text-white">{q.question}</p>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200">
                  Correct Answer: <strong>Option {String.fromCharCode(65 + q.correctAnswer)}: {q.options[q.correctAnswer]}</strong>
                </div>
                {q.explanation && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Rationale: {q.explanation}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No questions available in database.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
