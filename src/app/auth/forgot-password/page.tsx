"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Password reset instructions dispatched to your official email.");
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B132B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GQTLogo size="lg" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your official institutional or staff email to receive recovery instructions.
          </p>
        </div>

        <div className="gqt-card p-8 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
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
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We have sent secure reset instructions to{" "}
                <span className="font-semibold text-[#005BBB]">{email}</span>.
              </p>
            </div>
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
