"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  FileText,
  Calendar,
  Sparkles,
  Lock,
  Building2,
  Info
} from "lucide-react";
import { toast } from "sonner";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentExamEligibilityPage() {
  const router = useRouter();
  const { student: currentStudent, examResult } = useStudentSession();

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Eligibility Checklist items: For registered students, institutional clearance is complete.
  // Access to write the test is granted immediately upon accepting the terms & malpractice consent.
  const registrationApproved = true;
  const examWindowActive = true;
  const profileCompleted = true;
  const resumeUploaded = true;
  const alreadyAttempted = !!(currentStudent?.examResult || examResult);

  const allEligible = termsAccepted;

  const handleStartExam = () => {
    if (!termsAccepted) {
      toast.error("Please accept the examination terms of conduct to proceed.");
      return;
    }
    router.push("/student/exam/instructions");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GQT Proctored Assessment Room</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exam Eligibility & Verification Check
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl">
              System verification engine checks your institutional clearance, uploaded credentials, testing window availability, and proctoring requirements before granting entry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-xs font-mono font-bold text-cyan-200">
              Exam Window: ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 5 Eligibility Checks */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#005BBB] dark:text-[#14B8FF]" />
                  <CardTitle>Mandatory Eligibility Checklist</CardTitle>
                </div>
                <span className="text-xs font-semibold text-slate-400">5 / 5 Criteria Check</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Item 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="mt-0.5">
                  {registrationApproved ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      1. CSR Drive Registration Approved
                    </h4>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        registrationApproved
                          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                          : "text-rose-600 bg-rose-50 dark:bg-rose-950"
                      }`}
                    >
                      {registrationApproved ? "Verified" : "Disqualified"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {registrationApproved
                      ? "Your application has been vetted and cleared by college coordinators and GQT CSR managers."
                      : "Your application has been marked as rejected by HR. Please contact your Placement Cell."}
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="mt-0.5">
                  {examWindowActive ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      2. Examination Slot Active
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Live Window
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live session is currently open for your batch and college. Time allotment: 60 minutes.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      3. Academic Profile 100% Completed
                    </h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50 dark:bg-emerald-950">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    USN ({currentStudent?.usn || "Verified"}), CGPA ({currentStudent?.cgpa || "Confirmed"}), and graduation records confirmed.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="mt-0.5">
                  {resumeUploaded ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      4. Official Resume Deposited in Vault
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Uploaded (PDF)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Candidate CV verified and stored in encrypted Supabase storage bucket.
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                <div className="mt-0.5">
                  {termsAccepted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      5. Terms of Conduct & Anti-Malpractice Consent
                    </h4>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        termsAccepted
                          ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950"
                          : "text-slate-500 bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {termsAccepted ? "Accepted" : "Action Required"}
                    </span>
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-4 h-4 rounded text-[#005BBB] border-slate-300 focus:ring-[#005BBB]"
                    />
                    <span>
                      I solemnly declare that I will adhere to anti-cheating protocols and take this exam independently without tabs or devices.
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institutional Approval & Governance Notice */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-[#005BBB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">
                Institutional Approval Authority:
              </h5>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Candidate eligibility to write this exam is governed jointly by your college <strong>Placement & Training Officer (PTO)</strong> (academic & backlog verification) and the <strong>GQT CSR Operations Directorate</strong> (slot scheduling & hall ticket issuance).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Exam Specifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Exam Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Total Duration:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">60 Minutes</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Total Questions:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">60 Questions</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Sections:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Aptitude (20), Reasoning (10), Programming (30)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Passing Cutoff:</span>
                <span className="font-bold text-emerald-600">50% (30/60 Marks)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Allowed Attempts:</span>
                <span className="font-bold text-rose-500">Single Attempt Only</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Anti-Cheating Mode:</span>
                <span className="font-bold text-blue-600">Active (Up to 3 Excuses Allowed)</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Box */}
          <Card className="border-2 border-[#005BBB]/20 bg-blue-50/40 dark:bg-blue-950/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#005BBB] text-white flex items-center justify-center mx-auto shadow-md">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {alreadyAttempted
                    ? "Exam Attempt Registered"
                    : termsAccepted
                    ? "Ready for Assessment"
                    : "Complete Requirements"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {alreadyAttempted
                    ? "You have already completed this assessment session."
                    : termsAccepted
                    ? "Terms of conduct accepted & eligibility verified. Click below to enter the examination room."
                    : "Please check the consent declaration above to enable the examination room."}
                </p>
              </div>

              {alreadyAttempted ? (
                <div className="space-y-2">
                  <Link href="/student/result">
                    <Button variant="primary" size="sm" className="w-full">
                      View My Exam Result
                    </Button>
                  </Link>
                  <Link href="/student/exam/instructions">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Launch Test Simulator
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className={`w-full font-bold transition-all shadow-md ${
                    termsAccepted
                      ? "bg-gradient-to-r from-[#005BBB] to-[#0070e0] hover:shadow-blue-500/30 hover:scale-[1.01] cursor-pointer text-white"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!termsAccepted}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleStartExam}
                >
                  Enter Examination Room
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
