"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import {
  Printer,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useStudentSession } from "@/hooks/useStudentSession";

export default function RegistrationCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { students, currentUser } = useApp();
  const { student: sessionStudent } = useStudentSession();

  const student =
    students.find(
      (s) =>
        s.id === resolvedParams.id ||
        (currentUser.email && s.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        s.studentId === resolvedParams.id
    ) || (sessionStudent?.id ? sessionStudent : {
      id: resolvedParams.id || currentUser.id || "",
      studentId: currentUser.id ? `GQT-2026-${currentUser.id.slice(-4)}` : "",
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
      passingYear: 0,
      cgpa: 0,
      percentage: 0,
      gender: "Male" as const,
      dob: "",
      whatsappNumber: currentUser.phone || "",
      aadhaarLast4: "",
      city: "",
      district: "",
      pincode: "",
      preferredTrainingMode: "Hybrid" as const,
      selectedCourse: "",
      batch: "",
      referralSource: "",
      termsAccepted: true,
      driveId: "",
      driveName: "",
      photoUrl: currentUser.avatar || "",
      status: "Registered" as const,
      registeredAt: new Date().toISOString(),
    });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `GQT-VERIFY:${student.studentId}:${student.usn}:${student.fullName}`
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070D1E] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Actions bar (hidden in print) */}
        <div className="no-print flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="text-xs font-bold text-[#005BBB] hover:underline"
          >
            ← Back to Student Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#005BBB]" /> Print / Save PDF
            </button>

            <Link
              href="/student/exam/instructions"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <span>Take Online Exam</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Official Printable Hall Ticket Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 text-[#0F172A] relative overflow-hidden print-break-inside">
          {/* Top Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-[#005BBB]/20 pb-6">
            <GQTLogo size="lg" showTagline={true} clickable={false} />
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005BBB] text-xs font-extrabold border border-blue-200">
                OFFICIAL HALL TICKET
              </span>
              <p className="text-xs font-mono font-bold text-slate-400 mt-1">
                ID: {student.studentId}
              </p>
            </div>
          </div>

          {/* Drive & College Ribbon */}
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#005BBB]">
                CSR Recruitment Drive
              </span>
              <h2 className="text-base font-extrabold text-[#001B4D]">
                {student.driveName}
              </h2>
              <p className="text-xs text-slate-500">{student.selectedCourse}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-[#005BBB] block">
                University Batch {student.passingYear}
              </span>
              <span className="text-[11px] text-slate-400">Semester {student.semester}</span>
            </div>
          </div>

          {/* Student Profile & QR verification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Student Photo & Identity */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
              {student.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md mb-2"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#005BBB] to-cyan-500 text-white flex items-center justify-center text-2xl font-bold border-2 border-white shadow-md mb-2">
                  {student.fullName.charAt(0)}
                </div>
              )}
              <h3 className="font-extrabold text-sm text-[#0F172A]">
                {student.fullName}
              </h3>
              <span className="text-xs font-mono font-bold text-[#005BBB]">
                USN: {student.usn}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Aadhaar: •••• {student.aadhaarLast4}</span>
            </div>

            {/* Academic & Slot Details */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">College</span>
                  <span className="font-bold text-[#0F172A]">{student.collegeName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch</span>
                  <span className="font-bold text-[#0F172A]">{student.branch}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">CGPA / %</span>
                  <span className="font-bold text-emerald-600">{student.cgpa} ({student.percentage}%)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Training Mode</span>
                  <span className="font-bold text-[#005BBB]">{student.preferredTrainingMode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessment Date</span>
                  <span className="font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#005BBB]" /> Oct 08, 2026
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Exam Slot</span>
                  <span className="font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#005BBB]" /> 10:30 AM - 12:00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Verification Seal & Signature */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Hall Ticket Security QR"
                className="w-24 h-24 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs"
              />
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-[#001B4D] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Proctor Verified QR
                </span>
                <p className="text-[10px] text-slate-500 max-w-xs leading-tight">
                  Scan to verify candidate identity, test center authorization, and anti-cheating token.
                </p>
                <span className="text-[9px] font-mono text-slate-400 block">
                  Token: GQT-SEC-{student.studentId}
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/signatures/director-signature.png"
                alt="Authorized Signatory"
                className="h-10 w-auto inline-block object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <p className="text-xs font-bold text-[#0F172A] mt-1">Controller of Examinations</p>
              <p className="text-[10px] text-slate-400">Global Quest Technologies</p>
            </div>
          </div>

          {/* Exam Instructions Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <span className="font-bold uppercase tracking-wider block text-amber-800">
              Exam Hall Proctoring Regulations:
            </span>
            <p>1. Must keep webcam & microphone active throughout the 90-minute online test.</p>
            <p>2. Fullscreen mode is enforced. Tab switching or window blur triggers automatic termination.</p>
            <p>3. Copy-pasting, right-clicking, and multiple faces will result in immediate disqualification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
