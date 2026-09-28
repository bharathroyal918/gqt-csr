"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { studentAuthService } from "@/services/studentAuth.service";
import { useAuth } from "@/providers/AuthProvider";
import { useApp } from "@/context/AppContext";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentLoginPage() {
  const router = useRouter();
  const { loginWithRole } = useAuth();
  const { loginWithRole: appLoginWithRole, students } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await studentAuthService.loginStudent({
        identifier: cleanIdentifier,
        password: password.trim(),
        rememberMe,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Authentication failed. Please verify credentials.");
        toast.error("Sign In Failed", { description: res.error });
        setIsLoading(false);
        return;
      }

      // Sync role into auth providers
      const effectiveEmail = res.student?.email || (cleanIdentifier.includes("@") ? cleanIdentifier : "student@gqtindia.com");
      await loginWithRole("student", effectiveEmail, password);
      appLoginWithRole("student", effectiveEmail);

      toast.success("Welcome Back!", {
        description: `Signed in as ${res.student?.fullName || "Student Candidate"}.`,
      });

      router.push("/student/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      toast.error("Sign In Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col justify-between">
      {/* Main Grid Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Side: Brand Hero & CSR Drive Illustration */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#0B1B3D] via-[#003882] to-[#005BBB] text-white p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Block */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <GQTLogo size="sm" showTagline={false} />
              <div className="h-4 w-[1px] bg-white/20" />
              <span className="text-xs font-semibold tracking-wide text-blue-100 uppercase">
                Student Portal
              </span>
            </div>

            <div>
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Global Quest Technologies
                <span className="block text-blue-200 font-semibold text-2xl xl:text-3xl mt-1">
                  CSR Platform & Examination Engine
                </span>
              </h1>
              <p className="text-xs xl:text-sm font-semibold tracking-widest uppercase text-blue-300 mt-2">
                Training • Innovation • Placement
              </p>
            </div>
          </div>

          {/* Middle: CSR Drive Illustration & Highlights */}
          <div className="relative z-10 my-8 space-y-6">
            {/* Career Launch Programme Badge Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                <GraduationCap className="w-48 h-48 text-white" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Karnataka State-wide Initiative
                </span>
                <span className="text-xs text-blue-200 font-medium">Batch 2026</span>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                Career Launch Programme 2026
              </h2>
              <p className="text-xs xl:text-sm text-blue-100/90 leading-relaxed mb-6">
                Sponsored engineering recruitment, AI-proctored technical assessments, automated score evaluation, and verifiable offer letter issuance.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15 text-xs">
                <div className="flex items-center gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero Student Fees</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" />
                  <span>AI Anti-Cheating Engine</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <FileCheck2 className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Instant Scorecards</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Award className="w-4 h-4 text-purple-300 shrink-0" />
                  <span>QR Verifiable Offers</span>
                </div>
              </div>
            </div>

            {/* Candidate Testimonial or Notice */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-blue-200">
              <BookOpen className="w-5 h-5 text-blue-300 shrink-0" />
              <p>
                Enrolled students can directly access live examination schedules, study material repositories, and technical interview rooms.
              </p>
            </div>
          </div>

          {/* Left Footer: Helpdesk Contact */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
              Candidate Helpdesk: +91 80 4567 8900
            </span>
            <span>support@gqtindia.com</span>
          </div>
        </div>

        {/* Right Side: Dedicated Student Login Card */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 xl:p-16">
          {/* Top Mobile Brand Navigation */}
          <div className="flex items-center justify-between lg:hidden mb-8">
            <GQTLogo size="sm" showTagline={false} />
            <span className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
              Student Portal
            </span>
          </div>

          {/* Center Form Card */}
          <div className="max-w-md w-full mx-auto my-auto py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007BFF] to-[#005BBB] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Student Sign In
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                Enter your registered email or mobile number to access your examinations, scorecards, and offers.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <div className="leading-relaxed font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Field 1: Email or Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Registered Email or Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="student@gmail.com or 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <Link
                    href="/student/forgot-password"
                    className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005BBB] border-slate-300 focus:ring-[#005BBB] cursor-pointer"
                  />
                  Remember my login on this device
                </label>
              </div>

              {/* Primary Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating Student Identity...
                  </span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Separator / First-time registration */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-slate-50 dark:bg-[#070D1E] px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                First Time Candidate?
              </span>
            </div>

            {/* Prominent First Time Register CTA */}
            <div className="space-y-3">
              <Link
                href="/student/register"
                className="w-full py-4 px-6 rounded-2xl border-2 border-[#005BBB]/30 hover:border-[#005BBB] bg-blue-50/70 hover:bg-blue-50 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
                    New Student? Register for CSR Drive
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Fast 6-step registration for sponsored engineering recruitment.
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Footer: Privacy, Terms, Helpdesk */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
              <Link href="#" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors">
                Terms & Conditions
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors">
                Helpdesk Contact
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Global Quest Technologies. Enterprise CSR Examination Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
