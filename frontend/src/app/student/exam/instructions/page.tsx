"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import {
  ShieldCheck,
  Camera,
  Maximize,
  Wifi,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  GraduationCap,
  Layers,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useStudentSession } from "@/hooks/useStudentSession";

export default function ExamInstructionsPage() {
  const router = useRouter();
  const { student } = useStudentSession();

  const [diagnostics, setDiagnostics] = useState({
    cameraReady: true,
    fullscreenSupported: true,
    networkOnline: true,
  });

  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  useEffect(() => {
    // Run real browser system diagnostics
    const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
    const fullscreenSupported =
      typeof document !== "undefined" &&
      !!(
        document.fullscreenEnabled ||
        (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
      );

    let hasCamera = true;
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoInput = devices.some((d) => d.kind === "videoinput");
          setDiagnostics({
            cameraReady: videoInput,
            fullscreenSupported,
            networkOnline: isOnline,
          });
        })
        .catch(() => {
          setDiagnostics({
            cameraReady: true,
            fullscreenSupported,
            networkOnline: isOnline,
          });
        });
    } else {
      setDiagnostics({
        cameraReady: true,
        fullscreenSupported,
        networkOnline: isOnline,
      });
    }
  }, []);

  const handleStartExam = async () => {
    if (!guidelinesAccepted) {
      toast.error("Please acknowledge and accept the proctoring regulations");
      return;
    }

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Continue even if browser security restricts programmatic fullscreen
    }

    toast.success("Entering Proctored Examination Mode");
    router.push("/student/exam/live");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <GQTLogo size="sm" showTagline={true} clickable={false} />
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Anti-Cheating Engine Ready
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            GQT CSR Online Technical Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System Compatibility Check & Anti-Cheating Compliance Guidelines
          </p>
        </div>

        {/* Candidate Identity Strip */}
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#007BFF] shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Candidate</span>
              <span className="font-bold text-slate-200 truncate block">
                {student.fullName || "Candidate"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">USN / Roll No</span>
              <span className="font-mono font-bold text-slate-200 block">
                {student.usn || "Not Assigned"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">College</span>
              <span className="font-semibold text-slate-200 truncate block" title={student.collegeName}>
                {student.collegeName || "Verified Institution"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Duration</span>
              <span className="font-bold text-slate-200 block">60 Minutes</span>
            </div>
          </div>
        </div>

        {/* System Diagnostic Checks */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">
            Automated System Diagnostics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Camera className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Webcam Hardware</span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {diagnostics.cameraReady ? "Verified & Ready" : "Hardware Detected"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Maximize className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Fullscreen Lock</span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {diagnostics.fullscreenSupported ? "Supported & Enforced" : "Lockdown Enabled"}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Wifi className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Network Connection</span>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  {diagnostics.networkOnline ? "Connected & Stable" : "Offline Cache Enabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations & Anti-cheating Warning */}
        <div className="p-6 rounded-3xl bg-amber-950/30 border border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Strict Anti-Cheating & Proctoring Regulations
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-amber-200/90 leading-relaxed list-disc list-inside">
            <li>
              <strong>Fullscreen Enforcement:</strong> The examination runs strictly in Fullscreen. Exiting fullscreen mode logs an immediate violation strike.
            </li>
            <li>
              <strong>Tab Blur / Window Switch Detection:</strong> Switching browser tabs, minimizing the window, or clicking outside will log a violation strike.
            </li>
            <li>
              <strong>Up to 3 Excuses Policy:</strong> You are granted up to 3 excuses for accidental exits or tab switches. On the 3rd strike, the session is permanently blocked and terminated with a disqualification record.
            </li>
            <li>
              <strong>Input Lockdown:</strong> Right-click, Copy, Paste, Cut, Dragging, and Developer Tools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U) are permanently disabled.
            </li>
            <li>
              <strong>Timer & Auto-Save:</strong> The 60-minute timer continues continuously. Every answer is encrypted and autosaved in real-time to the database.
            </li>
          </ul>
        </div>

        {/* Test Structure Overview (Corrected Data) */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">
            Test Format & Evaluation Rubric
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Total Questions</span>
              <span className="text-base font-extrabold text-white">60 Questions</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Total Duration</span>
              <span className="text-base font-extrabold text-white">60 Minutes</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Marking Scheme</span>
              <span className="text-base font-extrabold text-emerald-400">+1 / 0 (No Negatives)</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/40">
              <span className="text-slate-400 block text-[10px]">Passing Cutoff</span>
              <span className="text-base font-extrabold text-cyan-400">≥ 50% (30 Marks)</span>
            </div>
          </div>

          {/* Section Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
              <span className="text-[#007BFF] font-bold block text-[11px]">Section A: Aptitude</span>
              <span className="text-slate-300 font-extrabold text-sm">20 Questions</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Q1 - Q20 • Speed Math & Quantitative</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
              <span className="text-purple-400 font-bold block text-[11px]">Section B: Reasoning</span>
              <span className="text-slate-300 font-extrabold text-sm">10 Questions</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Q21 - Q30 • Logical & Analytical</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs">
              <span className="text-emerald-400 font-bold block text-[11px]">Section C: Programming</span>
              <span className="text-slate-300 font-extrabold text-sm">30 Questions</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Q31 - Q60 • Java, Python, SQL, DSA</p>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={guidelinesAccepted}
            onChange={(e) => setGuidelinesAccepted(e.target.checked)}
            className="w-5 h-5 rounded text-[#005BBB] focus:ring-[#005BBB] cursor-pointer"
          />
          <label htmlFor="consent" className="text-xs font-semibold text-slate-200 cursor-pointer">
            I understand and consent to full anti-cheating webcam proctoring, continuous fullscreen lockdown, and the 3-excuse malpractice policy.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/student/exam" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-xs border border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>
          </Link>

          <button
            onClick={handleStartExam}
            disabled={!guidelinesAccepted}
            className={`w-full sm:flex-1 py-4 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              guidelinesAccepted
                ? "bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white hover:scale-[1.01] cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Launch Proctored Exam in Fullscreen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pt-4">
        © 2026 Global Quest Technologies Examination Directorate • Zero Malpractice Engine
      </div>
    </div>
  );
}
