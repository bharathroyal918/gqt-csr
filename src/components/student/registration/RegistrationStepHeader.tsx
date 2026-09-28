"use client";

import React from "react";
import Link from "next/link";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Check, ShieldCheck } from "lucide-react";

interface StepHeaderProps {
  currentStep: number;
}

const steps = [
  { step: 1, label: "Identity", path: "/student/register" },
  { step: 2, label: "OTP Verify", path: "/student/register/verify" },
  { step: 3, label: "Password", path: "/student/register/password" },
  { step: 4, label: "Profile", path: "/student/register/profile" },
  { step: 5, label: "Documents", path: "/student/register/profile#documents" },
  { step: 6, label: "Success", path: "/student/register/success" },
];

export function RegistrationStepHeader({ currentStep }: StepHeaderProps) {
  return (
    <div className="w-full bg-white dark:bg-[#111C3A] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Top brand & Login link */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <GQTLogo size="sm" showTagline={false} />
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
              <span>Official CSR Registration Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already registered?</span>
            <Link
              href="/student/login"
              className="font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              Sign In Instead →
            </Link>
          </div>
        </div>

        {/* Wizard Steps Stepper */}
        <div className="overflow-x-auto pb-1">
          <div className="flex items-center justify-between min-w-[550px]">
            {steps.map((s, idx) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <React.Fragment key={s.step}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-[#005BBB] text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900/40"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                    </div>
                    <span
                      className={`text-xs font-semibold whitespace-nowrap ${
                        isCurrent
                          ? "text-[#005BBB] dark:text-[#14B8FF] font-bold"
                          : isPassed
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                        currentStep > s.step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
