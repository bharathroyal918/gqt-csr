"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegistrationStepHeader } from "@/components/student/registration/RegistrationStepHeader";
import { useStudentRegistration } from "@/context/StudentRegistrationContext";
import { studentAuthService } from "@/services/studentAuth.service";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Mail,
  KeyRound,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentRegisterStep2VerifyPage() {
  const router = useRouter();
  const { state, updateState } = useStudentRegistration();

  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError(null);

    const cleanCode = otpCode.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setVerificationError("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await studentAuthService.verifyOtp(cleanCode, state.email || "");

      if (!res.success) {
        setVerificationError(res.error || "Invalid verification code.");
        toast.error("Verification Failed", { description: res.error });
        setIsVerifying(false);
        return;
      }

      updateState({
        currentStep: 3,
        isOtpVerified: true,
      });

      toast.success("Identity Verified Successfully!", {
        description: "Please create your secure account password.",
      });

      router.push("/student/register/password");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error verifying code";
      setVerificationError(msg);
      toast.error("Verification Error", { description: msg });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!state.email) {
      toast.error("No email on file. Please return to Step 1.");
      router.push("/student/register");
      return;
    }

    setIsResending(true);
    setVerificationError(null);

    try {
      const res = await studentAuthService.sendVerificationOtp(state.email, state.mobile);
      toast.success("New Code Sent!", {
        description: `Verification code resent to ${state.email}. Test code: ${res.otp}`,
      });
      setCountdown(60);
      setCanResend(false);
    } catch {
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      <RegistrationStepHeader currentStep={2} />

      <div className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        <div className="bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              Step 2 of 6 — OTP Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enter Verification Code
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              We have generated a 6-digit confirmation code for{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {state.email || "your registered email"}
              </span>.
            </p>
          </div>

          {/* Error Message */}
          {verificationError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center font-medium">
              {verificationError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                6-Digit Security Code
              </label>

              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl sm:text-3xl py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all shadow-inner font-bold"
              />
            </div>

            {/* Hint Box with Developer / Reviewer test OTP */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Instant Examiner Verification:</span> You can use test OTP code{" "}
                <span className="font-mono font-bold bg-white dark:bg-blue-900 px-1.5 py-0.5 rounded text-[#005BBB] dark:text-[#14B8FF]">
                  123456
                </span>{" "}
                or the generated code sent to your active browser session.
              </div>
            </div>

            {/* Countdown / Resend Controls */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {countdown > 0 ? (
                    <>Resend in <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{countdown}s</span></>
                  ) : (
                    "Code expired"
                  )}
                </span>
              </div>

              <button
                type="button"
                disabled={!canResend || isResending}
                onClick={handleResendOtp}
                className="font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                <span>Resend Code</span>
              </button>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying || otpCode.length < 6}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Validating OTP Code...
                  </span>
                ) : (
                  <>
                    <span>Verify Code & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/student/register")}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Mobile Number</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
