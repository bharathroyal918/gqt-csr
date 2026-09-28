"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GQTLogo } from "@/components/common/GQTLogo";
import { studentAuthService } from "@/services/studentAuth.service";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasMinLen = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const validScore = [hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validScore < 5) {
      toast.error("Please satisfy all password complexity criteria.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await studentAuthService.resetPassword(password.trim());
      if (!res.success) {
        toast.error("Password Update Failed", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      toast.success("Password Updated Successfully!", {
        description: "Your new password is now active in Supabase.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      toast.error("Error", { description: msg });
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
      <div className="max-w-md w-full mx-auto my-8 bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create New Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Enter your new secure password to restore access to your student examination account.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Password Successfully Reset</div>
              <p>You can now sign in using your new password.</p>
            </div>

            <Link
              href="/student/login"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:opacity-95"
            >
              <span>Sign In with New Password</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* New Password */}
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
                  placeholder="Enter new strong password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
              </div>
            </div>

            {/* Password Criteria */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                {hasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>8+ Characters</span>
              </div>
              <div className="flex items-center gap-2">
                {hasUpper && hasLower ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>Uppercase & Lowercase letters</span>
              </div>
              <div className="flex items-center gap-2">
                {hasNumber && hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least 1 number and 1 special symbol</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || validScore < 5 || !passwordsMatch}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {isSubmitting ? "Updating Supabase Password..." : "Set New Password & Sign In"}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Global Quest Technologies
      </div>
    </div>
  );
}
