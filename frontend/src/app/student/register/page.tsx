"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RegistrationStepHeader } from "@/components/student/registration/RegistrationStepHeader";
import { useStudentRegistration } from "@/context/StudentRegistrationContext";
import { studentAuthService } from "@/services/studentAuth.service";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Mail,
  Smartphone,
  Calendar,
  Building2,
  Briefcase,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentRegisterStep1Page() {
  const router = useRouter();
  const { colleges, drives } = useApp();
  const { state, updateState } = useStudentRegistration();

  const [regNumber, setRegNumber] = useState(state.registrationNumber || "");
  const [email, setEmail] = useState(state.email || "");
  const [mobile, setMobile] = useState(state.mobile || "");
  const [dob, setDob] = useState(state.dob || "");
  const [selectedCollegeId, setSelectedCollegeId] = useState(
    state.collegeId || colleges[0]?.id || ""
  );
  const [selectedDriveId, setSelectedDriveId] = useState(
    state.driveId || drives[0]?.id || ""
  );

  React.useEffect(() => {
    if (!selectedCollegeId && colleges.length > 0) {
      setSelectedCollegeId(colleges[0].id);
    }
  }, [colleges, selectedCollegeId]);

  React.useEffect(() => {
    if (!selectedDriveId && drives.length > 0) {
      setSelectedDriveId(drives[0].id);
    }
  }, [drives, selectedDriveId]);

  const [isLoading, setIsLoading] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const handleCollegeChange = (colId: string) => {
    setSelectedCollegeId(colId);
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.replace(/[^0-9]/g, "");

    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (cleanMobile.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Verify availability in Supabase
      const checkResult = await studentAuthService.checkIdentityAvailability({
        email: cleanEmail,
        mobile: cleanMobile,
      });

      if (!checkResult.available) {
        setConflictWarning(checkResult.reason || "An account with this email/mobile already exists.");
        toast.error("Account Already Exists", {
          description: checkResult.reason || "Please proceed to sign in with your credentials.",
        });
        setIsLoading(false);
        return;
      }

      // 2. Request OTP
      const otpRes = await studentAuthService.sendVerificationOtp(cleanEmail, cleanMobile);

      const collegeObj = colleges.find((c) => c.id === selectedCollegeId);
      const driveObj = drives.find((d) => d.id === selectedDriveId);

      // 3. Save to state context
      updateState({
        currentStep: 2,
        registrationNumber: regNumber.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        dob,
        collegeId: selectedCollegeId,
        collegeName: collegeObj?.name || state.collegeName,
        district: collegeObj?.district || state.district,
        driveId: selectedDriveId,
        driveName: driveObj?.name || state.driveName,
        selectedCourse: driveObj?.courses?.[0] || state.selectedCourse,
      });

      toast.success("Verification Code Generated!", {
        description: `Code sent to ${cleanEmail}. Test OTP: ${otpRes.otp}`,
      });

      router.push("/student/register/verify");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification check failed.";
      toast.error("Verification Error", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      <RegistrationStepHeader currentStep={1} />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Step 1 of 6 — Identity Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              CSR Drive Candidate Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Enter your student identity details to check eligibility and begin your CSR Drive enrollment.
            </p>
          </div>

          {/* Account conflict warning */}
          {conflictWarning && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="font-semibold">{conflictWarning}</div>
                <Link
                  href="/student/login"
                  className="inline-flex items-center gap-1.5 font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
                >
                  Click here to Sign In to your account →
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyIdentity} className="space-y-6">
            {/* Grid of Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Student Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.name@college.edu or gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Official or personal active email for OTP and offer letters.</p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Primary Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">10-digit mobile number for SMS & WhatsApp updates.</p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                  />
                </div>
              </div>

              {/* GQT Registration Number (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  GQT Pre-Registration Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. GQT-2026-REG or leave empty"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB] transition-all"
                />
              </div>
            </div>

            {/* Institutional Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Institution & CSR Drive
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* College Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#005BBB]" />
                    Select Your Engineering College <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCollegeId}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {colleges.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name} ({col.district})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Drive */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#005BBB]" />
                    Target CSR Drive <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedDriveId}
                    onChange={(e) => setSelectedDriveId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {drives.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.academicYear})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF] shrink-0 mt-0.5" />
              <p>
                By proceeding, a secure 6-digit one-time password (OTP) will be generated for your email to verify your ownership before setting your login password.
              </p>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Identity against Database...
                </span>
              ) : (
                <>
                  <span>Verify Identity & Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
