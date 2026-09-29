"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { studentAuthService } from "@/services/studentAuth.service";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentForgotPasswordPage() {
  const router = useRouter();
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

  // Step 1: Send OTP to registered email
  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid student email address.");
      toast.error("Invalid Email", { description: "Please enter a valid student email address." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await studentAuthService.sendPasswordResetOtp(cleanEmail);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to generate password reset OTP.");
        toast.error("Reset Failed", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      const generatedCode = res.otp || "123456";
      setSentOtp(generatedCode);
      setIsOtpSent(true);

      toast.success("Password Reset OTP Dispatched!", {
        description: `6-digit security code sent to ${cleanEmail}. (Code: ${generatedCode})`,
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
      const res = await studentAuthService.verifyPasswordResetOtpAndSetPassword(
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col justify-between p-4 sm:p-8">
      {/* Brand Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <GQTLogo size="sm" showTagline={false} />
        <span className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
          Student Portal
        </span>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#005BBB] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-3">
            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Account Password
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Enter your registered email address to receive a secure 6-digit OTP code.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {isSuccess ? (
          /* Success Screen */
          <div className="space-y-6 text-center">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Password Updated Successfully</div>
              <p>
                Your account password has been updated. You can now use your new credentials to sign in.
              </p>
            </div>

            <Link
              href="/student/login"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:opacity-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Proceed to Student Sign In</span>
            </Link>
          </div>
        ) : !isOtpSent ? (
          /* STEP 1: Enter Registered Email */
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Student Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Security OTP...</span>
              ) : (
                <>
                  <span>Send Verification OTP to Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/student/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Remember your password? Sign in</span>
              </Link>
            </div>
          </form>
        ) : (
          /* STEP 2: Enter OTP & Set New Password */
          <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-center space-y-1 text-xs">
              <span className="font-bold text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verification OTP Dispatched
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
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#005BBB]" />
          Student Helpdesk Support: support@gqtindia.com | +91 80 4567 8900
        </p>
        <p>© {new Date().getFullYear()} Global Quest Technologies</p>
      </div>
    </div>
  );
}

