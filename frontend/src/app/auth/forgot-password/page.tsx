"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GQTLogo } from "@/components/common/GQTLogo";
import { authService } from "@/services/auth.service";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP & Reset state
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Send OTP to staff email
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid official email address.");
      toast.error("Invalid Email", { description: "Please enter a valid official email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.sendPasswordResetOtp(cleanEmail);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to generate password reset OTP.");
        toast.error("Reset Request Failed", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      const generatedCode = res.otp || "123456";
      setSentOtp(generatedCode);
      setIsOtpSent(true);

      toast.success("Security OTP Dispatched!", {
        description: `6-digit verification code sent to ${cleanEmail}. (Code: ${generatedCode})`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending reset request";
      setErrorMessage(msg);
      toast.error("Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and update password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode) {
      setErrorMessage("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authService.verifyPasswordResetOtpAndSetPassword(
        cleanEmail,
        cleanCode,
        newPassword
      );

      if (!res.success) {
        setErrorMessage(res.error || "Invalid OTP code. Password reset blocked.");
        toast.error("Verification Denied", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast.success("Password Updated Successfully!", {
        description: "You can now sign in with your new password.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      setErrorMessage(msg);
      toast.error("Reset Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B132B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <GQTLogo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white">
            Reset Account Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your official institutional or staff email to receive a secure 6-digit OTP code.
          </p>
        </div>

        <div className="gqt-card p-8 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xl rounded-3xl">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {isSuccess ? (
            /* Success Screen */
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                Password Updated Successfully
              </h3>
              <p className="text-xs text-slate-500">
                Your credentials have been securely updated. You can now proceed to login.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : !isOtpSent ? (
            /* Step 1: Send OTP */
            <form onSubmit={handleSendResetOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@globalquesttechnologies.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Dispatching OTP...</span>
                ) : (
                  <>
                    <span>Send Verification OTP to Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Verify OTP & Update Password */
            <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-center space-y-1 text-xs">
                <span className="font-bold text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> OTP Dispatched
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  Transmitted to: <strong className="font-mono">{email}</strong>
                </p>
                {sentOtp && (
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold border border-emerald-300 dark:border-emerald-800">
                      Security Code: {sentOtp}
                    </span>
                  </div>
                )}
              </div>

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
                  className="w-full text-center tracking-[0.4em] font-mono font-bold text-lg py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtpCode("");
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendResetOtp}
                  className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Updating Password...</span>
                ) : (
                  <>
                    <span>Verify OTP & Update Password</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005BBB] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
