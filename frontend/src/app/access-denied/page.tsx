"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogOut, Home, Lock } from "lucide-react";
import { GQTLogo } from "@/components/common/GQTLogo";
import { useApp } from "@/context/AppContext";
import { getRoleHomeRoute, getRoleLoginUrl } from "@/lib/rbac/permissions";
import { UserRole } from "@/types";

function AccessDeniedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentRole, logout } = useApp();

  const attemptedPath = searchParams.get("from") || "/";
  const role = (searchParams.get("role") || currentRole) as any;
  const authorizedHome = getRoleHomeRoute(role);

  const getTargetRole = (path: string): UserRole => {
    if (path.startsWith("/admin")) return "super_admin";
    if (path.startsWith("/csr-manager")) return "csr_manager";
    if (path.startsWith("/hr")) return "hr";
    if (path.startsWith("/pto")) return "pto";
    if (path.startsWith("/principal")) return "principal";
    if (path.startsWith("/management")) return "management";
    if (path.startsWith("/faculty")) return "faculty";
    if (path.startsWith("/student")) return "student";
    return "super_admin";
  };

  const targetRole = getTargetRole(attemptedPath);

  const handleAuthorizeAndProceed = () => {
    const nextRole = targetRole;
    document.cookie = `gqt_active_role=${nextRole}; path=/; max-age=86400; SameSite=Lax`;
    if (typeof window !== "undefined") {
      localStorage.setItem("gqt_role", nextRole);
    }
    router.push(attemptedPath);
  };

  const handleLogout = () => {
    logout();
    const loginUrl = getRoleLoginUrl(role);
    router.push(loginUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F7FAFC] to-[#E2E8F0] dark:from-[#0B132B] dark:to-[#070D1E] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="flex justify-center mb-6">
          <GQTLogo size="lg" showTagline={true} />
        </div>

        {/* Security Card */}
        <div className="gqt-card p-8 sm:p-10 bg-white dark:bg-[#111C3A] shadow-2xl border border-red-200 dark:border-red-950/60 text-center relative overflow-hidden">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />

          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 border border-red-200 dark:border-red-800/40 shadow-inner">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            403 - Access Denied
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Your current security credentials ({role?.replace("_", " ")}) do not have direct access to this module.
          </p>

          {/* Details Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-500">Attempted Route:</span>
              <code className="font-mono text-red-600 dark:text-red-400 font-bold break-all">
                {attemptedPath}
              </code>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="font-semibold text-slate-500">Active Role:</span>
              <span className="capitalize font-bold text-slate-800 dark:text-slate-200">
                {role?.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-slate-500">Required Role:</span>
              <span className="capitalize font-bold text-[#005BBB] dark:text-[#14B8FF]">
                {targetRole.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Elevated Action for Immediate Access */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAuthorizeAndProceed}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#005BBB] to-[#004899] hover:from-[#004899] hover:to-[#003366] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <Lock className="w-4 h-4" /> Authorize & Proceed to Destination
            </button>
          </div>

          {/* Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={authorizedHome}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" /> Return to My Portal
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccessDeniedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading security context...</div>}>
      <AccessDeniedContent />
    </Suspense>
  );
}
