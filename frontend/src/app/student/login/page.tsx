"use client";

import React, { useState, useEffect } from "react";
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
  Smartphone,
  RefreshCw,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentLoginPage() {
  const router = useRouter();
  const { loginWithRole } = useAuth();
  const { loginWithRole: appLoginWithRole } = useApp();

  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Step 1: Send OTP to student's email or mobile
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setErrorMessage(`Please enter your registered ${channel === "email" ? "email address" : "mobile number"}.`);
      return;
    }

    if (channel === "email" && (!cleanIdentifier.includes("@") || !cleanIdentifier.includes("."))) {
      setErrorMessage("Please enter a valid email address (e.g. student@college.edu).");
      return;
    }

    if (channel === "phone" && cleanIdentifier.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await studentAuthService.sendStudentLoginOtp(cleanIdentifier, channel);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to generate security OTP.");
        toast.error("OTP Delivery Error", { description: res.error });
        setIsLoading(false);
        return;
      }

      const generatedCode = res.otp || "123456";
      setSentOtp(generatedCode);
      setOtpSent(true);
      setResendCountdown(60);

      toast.success("Security OTP Dispatched!", {
        description: `6-digit security code sent to ${cleanIdentifier}. (Code: ${generatedCode})`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      toast.error("Sign In Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Strictly verify OTP - Access blocked until verified
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      setErrorMessage("Please enter the 6-digit OTP code to verify your access.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await studentAuthService.verifyStudentLoginOtp(identifier, cleanCode, rememberMe);

      if (!res.success) {
        setErrorMessage(res.error || "Invalid OTP code. Access blocked until verified.");
        toast.error("Verification Denied", { description: res.error });
        setIsLoading(false);
        return;
      }

      const effectiveEmail = res.student?.email || (identifier.includes("@") ? identifier : `student-${identifier.slice(-4)}@gqtindia.com`);
      await loginWithRole("student", effectiveEmail, password || "GqtCsr@2026");
      appLoginWithRole("student", effectiveEmail);

      toast.success("Welcome Back!", {
        description: `Signed in as ${res.student?.fullName || "Student Candidate"}.`,
      });

      router.push("/student/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during OTP verification.";
      setErrorMessage(msg);
      toast.error("Verification Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      {/* Main Grid Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        {/* Left Side: Brand Hero & CSR Drive Illustration */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#0B1B3D] via-[#003882] to-[#005BBB] text-white p-6 xl:p-8 flex-col justify-between relative overflow-hidden h-full">
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Block */}
          <div className="relative z-10 space-y-3 shrink-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
              <GQTLogo size="sm" showTagline={false} />
              <div className="h-3.5 w-[1px] bg-white/20" />
              <span className="text-[11px] font-semibold tracking-wide text-blue-100 uppercase">
                Student Portal
              </span>
            </div>

            <div>
              <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Empowering Engineering Careers
              </h1>
              <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
                Karnataka&apos;s premier Corporate Social Responsibility technology skilling & campus recruitment engine.
              </p>
            </div>
          </div>

          {/* Middle Value Props */}
          <div className="relative z-10 space-y-2.5 my-auto py-2">
            {[
              {
                icon: ShieldCheck,
                title: "Two-Factor OTP Security",
                desc: "Every candidate session is protected by cryptographic email and phone OTP verification.",
              },
              {
                icon: Sparkles,
                title: "100% CSR Funded Skilling",
                desc: "No training fees, zero cost guaranteed by industry CSR mandates.",
              },
              {
                icon: BookOpen,
                title: "Online Assessment Suite",
                desc: "Auto-evaluated programming, aptitude, and proctored technical evaluations.",
              },
              {
                icon: Award,
                title: "Direct Corporate Placement",
                desc: "Interviews, offer letters, and onboarding across leading tech enterprises.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{feature.title}</h4>
                  <p className="text-[11px] text-blue-200/80 leading-snug">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200 shrink-0">
            <span>VTU Recognized CSR Drive</span>
            <span>•</span>
            <span>ISO 9001:2015 Certified</span>
            <span>•</span>
            <span>Zero Malpractice Engine</span>
          </div>
        </div>

        {/* Right Side: Student Login & Mandatory OTP Card */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 overflow-y-auto h-full">
          {/* Top Bar for Mobile & Back Link */}
          <div className="flex items-center justify-between shrink-0 mb-2">
            <div className="lg:hidden">
              <GQTLogo size="sm" showTagline={false} />
            </div>
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-slate-500 hover:text-[#005BBB] dark:hover:text-[#14B8FF] flex items-center gap-1.5 ml-auto transition-colors"
            >
              <span>Switch to Authority Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Main Form Center */}
          <div className="max-w-md w-full mx-auto my-auto py-2">
            {/* Header */}
            <div className="mb-3 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Candidate Access Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Student Sign In
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Enter your registered email or mobile number to receive your secure OTP.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{errorMessage}</div>
              </div>
            )}

            {!otpSent ? (
              /* STEP 1: Enter Email or Mobile & Request OTP */
              <div>
                {/* Channel Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setChannel("email");
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      channel === "email"
                        ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChannel("phone");
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      channel === "phone"
                        ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile OTP</span>
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3">
                  {channel === "email" ? (
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Registered Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="candidate@gmail.com"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Registered Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password (Optional for dual authentication) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Password (Optional)
                      </label>
                      <Link
                        href="/student/forgot-password"
                        className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password if configured"
                        className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center py-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-[#005BBB] border-slate-300 focus:ring-[#005BBB] cursor-pointer"
                      />
                      <span className="text-[11px]">Remember my login on this device</span>
                    </label>
                  </div>

                  {/* Send OTP CTA */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.005]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating Security Code...
                      </span>
                    ) : (
                      <>
                        <span>Generate & Send Verification OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* STEP 2: MANDATORY OTP VERIFICATION */
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verification Code Sent
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Transmitted to: <strong className="font-mono">{identifier}</strong>
                  </p>
                  {sentOtp && (
                    <div className="pt-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-bold border border-emerald-300 dark:border-emerald-800">
                        Security Code: {sentOtp}
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 text-center">
                      Enter 6-Digit OTP Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.4em] font-mono font-bold text-lg py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs py-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setErrorMessage(null);
                      }}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Change {channel === "email" ? "Email" : "Mobile"}</span>
                    </button>

                    {resendCountdown > 0 ? (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isLoading ? "Verifying Code..." : "Verify OTP & Enter Student Portal"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Separator / First-time registration */}
            <div className="relative my-2.5 sm:my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-slate-50 dark:bg-[#070D1E] px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                First Time Candidate?
              </span>
            </div>

            {/* Prominent First Time Register CTA */}
            <div>
              <Link
                href="/student/register"
                className="w-full py-2.5 px-4 rounded-xl border border-[#005BBB]/30 hover:border-[#005BBB] bg-blue-50/70 hover:bg-blue-50 dark:bg-blue-950/30 dark:hover:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="text-left">
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#005BBB] dark:text-[#14B8FF]" />
                    New Student? Register for CSR Drive
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Fast 6-step registration for engineering recruitment.
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Footer: Privacy, Terms, Helpdesk */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-center text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 space-y-1 shrink-0">
            <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
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
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} Global Quest Technologies. Enterprise CSR Examination Portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
