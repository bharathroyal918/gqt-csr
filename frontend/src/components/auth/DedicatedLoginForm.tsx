"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { UserRole } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { useApp } from "@/context/AppContext";
import { getRoleHomeRoute } from "@/lib/rbac/permissions";
import { authService } from "@/services/auth.service";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  GraduationCap,
  AlertTriangle,
  Smartphone,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface DedicatedLoginFormProps {
  role: UserRole;
  portalTitle: string;
  portalSubtitle: string;
  authorityBadge: string;
  icon: React.ElementType;
  defaultEmail: string;
  extraFieldLabel?: string;
  extraFieldPlaceholder?: string;
  allowSelfRegistration?: boolean;
}

export function DedicatedLoginForm({
  role,
  portalTitle,
  portalSubtitle,
  authorityBadge,
  icon: IconComponent,
  defaultEmail,
  extraFieldLabel,
  extraFieldPlaceholder,
  allowSelfRegistration = false,
}: DedicatedLoginFormProps) {
  const router = useRouter();
  const { loginWithRole: authLoginWithRole } = useAuth();
  const { loginWithRole: appLoginWithRole } = useApp();

  const [channel, setChannel] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("+91 98451 98765");
  const [extraValue, setExtraValue] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Resend OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const activeDestination = channel === "email" ? email.trim() : phone.trim();

  // Step 1: Send OTP to user's entered email or phone
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!activeDestination) {
      setErrorMessage(`Please enter your registered ${channel === "email" ? "email address" : "mobile number"}.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.sendPortalLoginOtp(activeDestination, channel, role);

      if (!res.success) {
        setErrorMessage(res.error || "Failed to generate security OTP.");
        toast.error("OTP Delivery Error", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      const generatedCode = res.data?.otp || "123456";
      setSentOtp(generatedCode);
      setOtpSent(true);
      setResendCountdown(60);

      toast.success("Security OTP Dispatched!", {
        description: `6-digit security code sent to ${activeDestination}. (Code: ${generatedCode})`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate OTP.";
      setErrorMessage(msg);
      toast.error("Transmission Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Strictly verify OTP - Login is blocked until valid OTP is provided
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      setErrorMessage("Please enter the 6-digit OTP code to verify your access.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.verifyPortalLoginOtp(activeDestination, cleanCode, channel, role);

      if (!res.success) {
        setErrorMessage(res.error || "Invalid OTP code. Access blocked until verified.");
        toast.error("Access Denied", {
          description: res.error || "Verification failed. Please enter the valid OTP.",
        });
        setIsSubmitting(false);
        return;
      }

      // OTP Verified! Complete login
      const destinationEmail = channel === "email" ? activeDestination : (email || defaultEmail).trim();
      await authLoginWithRole(role, destinationEmail);
      appLoginWithRole(role, destinationEmail);

      toast.success("OTP Verified Successfully!", {
        description: `Welcome to ${portalTitle}.`,
      });

      const destinationRoute = getRoleHomeRoute(role);
      router.push(destinationRoute);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during OTP verification.";
      setErrorMessage(msg);
      toast.error("Authentication Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden relative bg-gradient-to-br from-[#F0F7FF] via-[#F8FBFF] to-[#E5F1FF] dark:from-[#070D1E] dark:via-[#0B132B] dark:to-[#070D1E] flex flex-col justify-between items-center px-4 py-2">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Top Bar: Navigation & Authority Badge */}
      <div className="w-full max-w-md flex items-center justify-between z-10 shrink-0 pt-0.5">
        <Link
          href="/auth/login"
          className="text-[11px] font-semibold text-slate-500 hover:text-[#005BBB] dark:hover:text-[#14B8FF] flex items-center gap-1 transition-colors"
        >
          ← All Authority Portals
        </Link>
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-bold uppercase tracking-wider">
          <IconComponent className="w-3 h-3" />
          <span>{authorityBadge}</span>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 my-auto py-1">
        {/* Brand Header */}
        <div className="text-center mb-2.5">
          <div className="flex justify-center mb-1.5">
            <GQTLogo size="md" showTagline={false} />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            {portalTitle}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto line-clamp-1">
            {portalSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="gqt-card p-4 sm:p-5 sm:px-6 bg-white dark:bg-[#111C3A] shadow-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl relative overflow-hidden">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005BBB] via-[#14B8FF] to-[#005BBB]" />

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!otpSent ? (
            /* STEP 1: Enter Email or Phone & Request OTP */
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
                  <span>Phone OTP</span>
                </button>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-3">
                {channel === "email" ? (
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Official Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@globalquest.in"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                      />
                    </div>
                  </div>
                )}

                {extraFieldLabel && (
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      {extraFieldLabel}
                    </label>
                    <input
                      type="text"
                      value={extraValue}
                      onChange={(e) => setExtraValue(e.target.value)}
                      placeholder={extraFieldPlaceholder || "Enter code"}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                    />
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#005BBB] shrink-0 mt-0.5" />
                  <span>
                    A secure 6-digit OTP will be dispatched to your entered {channel === "email" ? "email" : "mobile number"}. Authentication is restricted until verified.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Generating Security Code...</span>
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
                  <ShieldCheck className="w-3.5 h-3.5" /> One-Time Password Sent
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Transmitted to: <strong className="font-mono">{activeDestination}</strong>
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
                    Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
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
                    <span>Change {channel === "email" ? "Email" : "Phone"}</span>
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
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Verifying Security Code..." : "Verify OTP & Access Portal"}</span>
                </button>
              </form>
            </div>
          )}

          {allowSelfRegistration && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                New candidate applying for CSR recruitment drive?
              </p>
              <Link
                href="/student/register"
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Register for GQT CSR Drive
              </Link>
            </div>
          )}
        </div>

        {/* Security & Terms Footer */}
        <div className="text-center text-[10px] sm:text-[11px] text-slate-400 mt-2 space-y-1">
          <p className="flex items-center justify-center gap-1">
            <KeyRound className="w-3 h-3 text-[#005BBB]" />
            Enterprise Multi-Factor OTP Verification Protocol Active.
          </p>
          <div className="flex items-center justify-center gap-3 text-slate-500">
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} Global Quest Technologies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

