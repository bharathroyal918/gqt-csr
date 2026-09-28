"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RegistrationStepHeader } from "@/components/student/registration/RegistrationStepHeader";
import { useStudentRegistration } from "@/context/StudentRegistrationContext";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentRegisterStep3PasswordPage() {
  const router = useRouter();
  const { state, updateState } = useStudentRegistration();

  const [password, setPassword] = useState(state.password || "");
  const [confirmPassword, setConfirmPassword] = useState(state.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password rules validation
  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const validScore = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel =
    validScore <= 2 ? "Weak" : validScore <= 4 ? "Moderate" : "Strong";
  const strengthColor =
    validScore <= 2
      ? "bg-rose-500 text-rose-500"
      : validScore <= 4
      ? "bg-amber-500 text-amber-500"
      : "bg-emerald-500 text-emerald-500";

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLen || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      toast.error("Please satisfy all password security criteria.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    updateState({
      currentStep: 4,
      password: password.trim(),
    });

    toast.success("Security Password Set!", {
      description: "Now complete your academic profile and documents.",
    });

    router.push("/student/register/profile");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      <RegistrationStepHeader currentStep={3} />

      <div className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        <div className="bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Step 3 of 6 — Create Secure Password
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Set Your Account Password
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Create an enterprise password to protect your candidate exam submissions, test records, and digital offer letters.
            </p>
          </div>

          <form onSubmit={handleSetPassword} className="space-y-6">
            {/* Field 1: New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Security Strength:</span>
                    <span className={`font-bold ${strengthColor.split(" ")[1]}`}>{strengthLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor.split(" ")[0]}`}
                      style={{ width: `${(validScore / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Field 2: Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-rose-500 mt-1 font-medium">Passwords do not match.</p>
              )}
            </div>

            {/* Validation Checklist */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Password Security Requirements
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  {hasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasMinLen ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                    Minimum 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasUpper ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasLower ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                    At least 1 lowercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                    At least 1 number (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                  <span className={hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                    At least 1 special character (!@#$)
                  </span>
                </div>
              </div>
            </div>

            {/* Submit & Back Controls */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={validScore < 5 || !passwordsMatch}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                <span>Save Password & Continue to Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/student/register/verify")}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to OTP Verification</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
