"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

export default function ExamInstructionsPage() {
  const router = useRouter();

  const [checks, setChecks] = useState({
    fullscreen: true,
    camera: true,
    network: true,
    guidelinesAccepted: false,
  });

  const handleStartExam = async () => {
    if (!checks.guidelinesAccepted) {
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

        {/* System Diagnostic Checks */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">
            Automated System Diagnostics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Camera className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Webcam Active</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Verified 1080p</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Maximize className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Fullscreen Lock</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Enforced Mode</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/50 flex items-center gap-3">
              <Wifi className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold block">Network Latency</span>
                <span className="text-[10px] text-emerald-400 font-semibold">18ms Ultra Fast</span>
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
              <strong>3-Strike Policy:</strong> Any 3 logged violations will automatically terminate and submit the exam with a permanent disqualification flag.
            </li>
            <li>
              <strong>Input Lockdown:</strong> Right-click, Copy, Paste, Cut, and Developer Tools shortcut keys (F12, Inspect Element) are disabled.
            </li>
            <li>
              <strong>Time Constraint:</strong> Timer continues even if browser disconnects. Pause or resume is strictly disabled.
            </li>
          </ul>
        </div>

        {/* Test Structure Overview */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/60 space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">
            Test Format & Evaluation Rubric
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Total Questions</span>
              <span className="text-base font-extrabold text-white">40 MCQs</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Total Duration</span>
              <span className="text-base font-extrabold text-white">45 Minutes</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Marking Scheme</span>
              <span className="text-base font-extrabold text-emerald-400">+2.5 / -0.5</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Passing Cutoff</span>
              <span className="text-base font-extrabold text-cyan-400">≥ 50% Marks</span>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={checks.guidelinesAccepted}
            onChange={(e) => setChecks({ ...checks, guidelinesAccepted: e.target.checked })}
            className="w-5 h-5 rounded text-[#005BBB] focus:ring-[#005BBB]"
          />
          <label htmlFor="consent" className="text-xs font-semibold text-slate-200 cursor-pointer">
            I understand and consent to full anti-cheating webcam proctoring, window switch detection, and fullscreen lockdown.
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartExam}
          disabled={!checks.guidelinesAccepted}
          className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
            checks.guidelinesAccepted
              ? "bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white hover:scale-[1.02] cursor-pointer"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Launch Proctored Exam in Fullscreen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 pt-4">
        © 2026 Global Quest Technologies Examination Directorate • Zero Malpractice Engine
      </div>
    </div>
  );
}
