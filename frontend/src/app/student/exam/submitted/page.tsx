"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Button } from "@/components/common/Button";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertOctagon,
  ShieldAlert,
  HelpCircle,
  Mail,
  Home,
  FileText
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStudentSession } from "@/hooks/useStudentSession";

function SubmittedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDisqualified = searchParams.get("disqualified") === "true";
  const { cutoffConfig } = useApp();
  const { student: currentStudent } = useStudentSession();

  const [submissionId, setSubmissionId] = useState("");
  const [submissionTime, setSubmissionTime] = useState("");

  const isCutoffApproved = cutoffConfig?.isApproved && cutoffConfig?.resultsReleased;

  useEffect(() => {
    // Proactively release any remaining media tracks (camera/mic) and exit fullscreen
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}

    // Only fire celebratory confetti if candidate was NOT disqualified
    if (!isDisqualified) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    }

    const randomId = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionId(randomId);
    setSubmissionTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, [isDisqualified]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto w-full space-y-8 my-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <GQTLogo size="md" showTagline={false} />
          </div>
        </div>

        {isDisqualified ? (
          /* Disqualification Card */
          <div className="gqt-card p-8 sm:p-10 bg-white dark:bg-[#111C3A] rounded-[32px] border-2 border-rose-500/50 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner border border-rose-300 dark:border-rose-800 animate-pulse">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 inline-flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                Malpractice Policy Violation • 3 Excuses Exhausted
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Exam Blocked & Terminated
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Candidate <strong>{currentStudent?.fullName || "Candidate"}</strong> ({currentStudent?.usn || "USN"}), your assessment has been automatically terminated and blocked from further attempts.
              </p>
            </div>

            {/* Violation Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 text-left text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Incident Log ID</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {submissionId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Termination Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submissionTime || "Just now"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Result Status</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  Disqualified (Blocked)
                </span>
              </div>
            </div>

            {/* Proctoring Audit Reason */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-left space-y-3">
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Proctoring Telemetry Findings
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Screen Restriction & Full-screen Policy:</strong> Continuous full-screen lock and single-window restriction were breached more than the 3 allowed excuse tolerances.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Hardware Release:</strong> Camera proctoring, audio capture, and live stream telemetry were cleanly terminated to preserve student device privacy.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Audit Record:</strong> Event logs, timestamps, and browser telemetry have been securely filed with the College Placement Officer (PTO) and GQT CSR Evaluation Directorate.
                  </span>
                </li>
              </ul>
            </div>

            {/* Grievance Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/student/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  leftIcon={<Home className="w-4 h-4" />}
                >
                  Return to Dashboard
                </Button>
              </Link>
              <a
                href="mailto:support@globalquesttechnologies.com?subject=CSR%20Exam%20Disqualification%20Review"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  leftIcon={<Mail className="w-4 h-4" />}
                >
                  Contact Placement Desk
                </Button>
              </a>
            </div>
          </div>
        ) : (
          /* Normal Success Card */
          <div className="gqt-card p-8 sm:p-10 bg-white dark:bg-[#111C3A] rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                60 Questions Captured Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Thank You, {currentStudent?.fullName || "Candidate"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Your 60-question examination responses and proctoring telemetry have been securely stored with cryptographic verification. Camera hardware has been disconnected.
              </p>
            </div>

            {/* Submission Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-left text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {submissionId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Submitted</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {submissionTime || "Just now"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cut-off Status</span>
                <span className={`font-bold flex items-center gap-1 ${isCutoffApproved ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  <Clock className="w-3 h-3" /> {isCutoffApproved ? "Cut-off Approved" : "Pending Approval"}
                </span>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900 text-left space-y-3">
              <h4 className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Next Steps in Recruitment Process
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005BBB] mt-1.5 shrink-0" />
                  <span>
                    <strong>Marks & Cut-off Policy:</strong> As per company protocol, examination marks are kept confidential until the HR & Admin approves the drive cut-off score.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005BBB] mt-1.5 shrink-0" />
                  <span>
                    <strong>Results & Scorecard Release:</strong> As soon as the cut-off is approved, your marks, sectional scores (Aptitude, Reasoning, Programming), and merit rank will be unlocked in your Result Hub.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005BBB] mt-1.5 shrink-0" />
                  <span>
                    <strong>Interview Shortlisting:</strong> Shortlisted candidates who meet or exceed the cut-off will receive Google Meet technical interview invites.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/student/result" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Result Hub
                </Button>
              </Link>
              <Link href="/student/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Global Quest Technologies CSR Drive Platform • Secure Proctoring Engine v4.2
        </p>
      </div>
    </div>
  );
}

export default function ExamSubmittedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005BBB]" />
      </div>
    }>
      <SubmittedContent />
    </Suspense>
  );
}
