"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { toast } from "sonner";

export default function StudentForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid student email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await studentAuthService.requestPasswordReset(cleanEmail);
      if (!res.success) {
        toast.error("Password Reset Failed", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      setIsSent(true);
      toast.success("Reset Instructions Dispatched!", {
        description: `Check your inbox at ${cleanEmail} for your password reset link.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending reset request";
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#005BBB] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-4">
            <KeyRound className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Candidate Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Enter your registered student email address. We will verify your account in Supabase and send password recovery instructions.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Reset Link Dispatched</div>
              <p>
                We have transmitted password reset credentials to{" "}
                <span className="font-semibold text-slate-900 dark:text-white">{email}</span>. Click the link in the message to set a new password.
              </p>
            </div>

            <Link
              href="/student/login"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:opacity-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Student Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Supabase Reset Link...
                </span>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
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
