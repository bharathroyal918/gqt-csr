"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Button } from "@/components/common/Button";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileText,
  Mail,
  HelpCircle,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function ExamSubmittedPage() {
  const router = useRouter();
  const { cutoffConfig } = useApp();
  const { student: currentStudent } = useStudentSession();

  const [submissionId, setSubmissionId] = useState("");
  const [submissionTime, setSubmissionTime] = useState("");

  const isCutoffApproved = cutoffConfig?.isApproved && cutoffConfig?.resultsReleased;

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }

    const randomId = `SUB-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmissionId(randomId);
    setSubmissionTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto w-full space-y-8 my-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <GQTLogo size="md" showTagline={false} />
          </div>
        </div>

        {/* Success Card */}
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
              Your 60-question examination responses and proctoring telemetry have been securely stored with cryptographic verification.
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

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400">
          Global Quest Technologies CSR Drive Platform • Secure Proctoring Engine v4.2
        </p>
      </div>
    </div>
  );
}
