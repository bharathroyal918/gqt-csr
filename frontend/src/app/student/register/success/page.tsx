"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegistrationStepHeader } from "@/components/student/registration/RegistrationStepHeader";
import { useStudentRegistration } from "@/context/StudentRegistrationContext";
import {
  CheckCircle,
  QrCode,
  Download,
  ArrowRight,
  Printer,
  Building2,
  BookOpen,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  GraduationCap,
} from "lucide-react";

export default function StudentRegisterStep6SuccessPage() {
  const router = useRouter();
  const { state } = useStudentRegistration();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const student = state.registeredStudent || {
    id: "std-new",
    studentId: state.registrationNumber || "",
    fullName: state.fullName || "",
    email: state.email || "",
    mobile: state.mobile || "",
    collegeName: state.collegeName || "",
    branch: state.branch || "",
    usn: state.usn || "",
    selectedCourse: state.selectedCourse || "",
    driveName: state.driveName || "",
    registeredAt: new Date().toISOString(),
    status: "Registered",
  };

  const regNumber = state.registrationNumber || "";

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      <RegistrationStepHeader currentStep={6} />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Printable Card Area */}
        <div
          ref={printAreaRef}
          className="bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8"
        >
          {/* Top Success Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Registration Confirmed & Verified
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome to Global Quest Technologies CSR Drive!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your candidate profile has been authenticated in Supabase and enrolled in the upcoming Karnataka engineering examination.
            </p>
          </div>

          {/* Official Verification Slip */}
          <div className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/80 bg-blue-50/40 dark:bg-blue-950/20 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-blue-200/60 dark:border-blue-900/60">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#005BBB] dark:text-[#14B8FF]">
                  Official Candidate Registration Slip
                </span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {student.fullName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  USN: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{student.usn}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=GQT:${student.studentId}:${student.usn}`}
                  alt="Candidate QR Verification"
                  className="w-16 h-16 rounded-lg"
                />
                <div className="text-left text-[10px] text-slate-500 space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">QR Verified</div>
                  <div>Student ID:</div>
                  <div className="font-mono font-bold text-[#005BBB] dark:text-[#14B8FF]">{student.studentId}</div>
                </div>
              </div>
            </div>

            {/* Grid of Verified Credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Assigned Student ID</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {student.studentId}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Registration No</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {regNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Profile Completion</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                  100% Completed
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Partner College</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {student.collegeName}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Branch / Discipline</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {student.branch}
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Training Course</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {student.selectedCourse}
                </span>
              </div>
            </div>

            {/* Verification Status Banner */}
            <div className="flex items-center justify-between pt-3 border-t border-blue-200/60 dark:border-blue-900/60 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Live in HR Registration Queue (Status: Registered)
              </span>
              <span className="text-slate-400 text-[11px]">
                {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2 print:hidden">
            {/* Primary: Go to Dashboard */}
            <Link
              href="/student/dashboard"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>Go to Student Examination Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secondary Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#005BBB]" />
                <span>Print / Download Registration Slip</span>
              </button>

              <Link
                href={`/student/registration-card/${student.id || "me"}`}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>View Official QR Hall Ticket</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
