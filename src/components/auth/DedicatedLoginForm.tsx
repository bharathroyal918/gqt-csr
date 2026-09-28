"use client";

import React, { useState } from "react";
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

  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [extraValue, setExtraValue] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await authService.signInWithEmail(email, password || "GqtCsr@2026");

      if (!res.success) {
        setErrorMessage(res.error || "Authentication failed. Please verify credentials.");
        toast.error("Authentication Error", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      await authLoginWithRole(role, email.trim(), password || "GqtCsr@2026");
      appLoginWithRole(role, email.trim());
      toast.success("Security Authentication Verified", {
        description: `Welcome to ${portalTitle}.`,
      });

      const destination = getRoleHomeRoute(role);
      router.push(destination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected authentication error occurred.";
      setErrorMessage(msg);
      toast.error("Authentication Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await authService.requestPhoneOtp(phone);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to transmit OTP");
        toast.error("OTP Delivery Failed", { description: res.error });
      } else {
        setOtpSent(true);
        toast.success("One-Time Password Sent", {
          description: `6-digit security code transmitted to ${phone}.`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await authService.verifyPhoneOtp(phone, otpCode);
      if (!res.success) {
        setErrorMessage(res.error || "Invalid OTP code");
        toast.error("Verification Error", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      await authLoginWithRole(role, email.trim());
      appLoginWithRole(role, email.trim());
      toast.success("OTP Verified Successfully", {
        description: `Welcome to ${portalTitle}.`,
      });

      const destination = getRoleHomeRoute(role);
      router.push(destination);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantAuthoritySignIn = async () => {
    const targetEmail = (email || defaultEmail).trim();
    await authLoginWithRole(role, targetEmail);
    appLoginWithRole(role, targetEmail);
    toast.success("Instant Authority Access Granted", {
      description: `Logged into ${portalTitle}.`,
    });
    const destination = getRoleHomeRoute(role);
    router.push(destination);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-[#F8FBFF] to-[#E5F1FF] dark:from-[#070D1E] dark:via-[#0B132B] dark:to-[#070D1E] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Animated Subtle Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/10 blur-3xl pointer-events-none animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <GQTLogo size="lg" showTagline={true} />
          </div>

          {/* Secure Authority Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold uppercase tracking-wider mb-2">
            <IconComponent className="w-3.5 h-3.5" />
            <span>{authorityBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            {portalTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {portalSubtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="gqt-card p-6 sm:p-8 bg-white dark:bg-[#111C3A] shadow-2xl border border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
          {/* Top Accent Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#005BBB] via-[#14B8FF] to-[#005BBB]" />

          {/* Authentication Mode Switcher (Password vs OTP) */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                authMode === "password"
                  ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("otp")}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                authMode === "otp"
                  ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              OTP Verification
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Student Candidate Quick Selector (Only in student portal) */}
          {role === "student" && authMode === "password" && (
            <div className="mb-4 p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span>Select Candidate Profile:</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Click to auto-fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("bharath@gmail.com");
                    setPassword("GqtCsr@2026");
                    setExtraValue("1RV22CS101");
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    email === "bharath@gmail.com"
                      ? "bg-[#005BBB] text-white border-[#005BBB] shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                  }`}
                >
                  <div className="font-bold text-xs truncate">Bharath Royal</div>
                  <div className="text-[10px] opacity-80 font-mono">1RV22CS101</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("aditi.rao@rvce.edu.in");
                    setPassword("GqtCsr@2026");
                    setExtraValue("1RV22CS001");
                  }}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    email === "aditi.rao@rvce.edu.in"
                      ? "bg-[#005BBB] text-white border-[#005BBB] shadow-xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                  }`}
                >
                  <div className="font-bold text-xs truncate">Aditi Rao</div>
                  <div className="text-[10px] opacity-80 font-mono">1RV22CS001</div>
                </button>
              </div>
            </div>
          )}

          {authMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gqt.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>

              {extraFieldLabel && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    {extraFieldLabel}
                  </label>
                  <input
                    type="text"
                    value={extraValue}
                    onChange={(e) => setExtraValue(e.target.value)}
                    placeholder={extraFieldPlaceholder || "Enter code"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword("GqtCsr@2026")}
                    className="text-[11px] font-semibold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
                  >
                    Default Password
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password or use default"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005BBB] focus:ring-[#005BBB] border-slate-300"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating Authority..." : "Sign In with Credentials"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleInstantAuthoritySignIn}
                className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/70 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Instant Verified Sign-In ({role.replace("_", " ").toUpperCase()})</span>
              </button>
            </form>
          ) : (
            /* Phone OTP Mode */
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Sending One-Time Password..." : "Send Verification Code"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.5em] font-mono text-lg py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Verifying..." : "Verify Code & Sign In"}</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {allowSelfRegistration && (
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New candidate applying for CSR recruitment drive?
              </p>
              <Link
                href="/student/registration"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Register for GQT CSR Drive
              </Link>
            </div>
          )}
        </div>

        {/* Security & Terms Footer */}
        <div className="text-center text-[11px] text-slate-400 mt-6 space-y-2">
          <p className="flex items-center justify-center gap-1.5">
            <KeyRound className="w-3 h-3 text-[#005BBB]" />
            Protected by Supabase Auth with Row Level Security.
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
