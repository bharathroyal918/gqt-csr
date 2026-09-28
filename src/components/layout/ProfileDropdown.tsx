"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useApp } from "@/context/AppContext";
import { Avatar } from "@/components/common/Avatar";
import { getRoleLoginUrl } from "@/lib/rbac/permissions";
import { UserRole } from "@/types";
import { Settings, LogOut, Shield, ChevronDown, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ProfileDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, role, logout: authLogout } = useAuth();
  const { currentUser, currentRole, logout: appLogout, students } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Detect active role from route or state
  const isStudentPortal = pathname?.startsWith("/student");
  const effectiveRole: UserRole = isStudentPortal ? "student" : (currentRole || role || "student");

  // Dynamically resolve student profile if in student portal
  const savedStudentEmail = typeof window !== "undefined" ? localStorage.getItem("gqt_user_email") : null;
  const savedStudentName = typeof window !== "undefined" ? localStorage.getItem("gqt_user_name") : null;

  const activeStudent = isStudentPortal
    ? students.find(
      (s) =>
        (savedStudentEmail && (s.email?.toLowerCase() === savedStudentEmail.toLowerCase() || s.usn?.toLowerCase() === savedStudentEmail.toLowerCase())) ||
        (currentUser?.email && s.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        (user?.email && s.email?.toLowerCase() === user.email.toLowerCase()) ||
        (currentUser?.id && s.id === currentUser.id)
    ) || null
    : null;

  const isStaffFallback = (val?: string | null) => !val || val.toLowerCase().includes("staff") || val.toLowerCase().includes("gqt staff");

  // Resolve authentic name, email, and avatar dynamically from database / session
  const displayName = isStudentPortal
    ? (activeStudent?.fullName || (!isStaffFallback(savedStudentName) ? savedStudentName : null) || (!isStaffFallback(currentUser?.name) ? currentUser?.name : null) || "")
    : (currentUser?.name || profile?.fullName || user?.email?.split("@")[0] || "");

  const userEmail = isStudentPortal
    ? (activeStudent?.email || (!isStaffFallback(savedStudentEmail) ? savedStudentEmail : null) || (!isStaffFallback(currentUser?.email) ? currentUser?.email : null) || "")
    : (currentUser?.email || profile?.email || user?.email || "");

  const avatarUrl = isStudentPortal
    ? (activeStudent?.photoUrl || currentUser?.avatar || profile?.avatarUrl || "")
    : (currentUser?.avatar || profile?.avatarUrl || "");

  const roleNameMap: Record<string, { label: string; portal: string }> = {
    super_admin: { label: "Super Admin", portal: "Super Admin Portal" },
    csr_manager: { label: "CSR Manager", portal: "CSR Manager Portal" },
    hr: { label: "HR Recruiter", portal: "HR Recruitment Portal" },
    hr_recruiter: { label: "HR Recruiter", portal: "HR Recruitment Portal" },
    placement_officer: { label: "Placement Officer", portal: "Placement Officer Portal" },
    pto: { label: "Placement Officer", portal: "Placement Officer Portal" },
    faculty: { label: "Faculty Coordinator", portal: "Faculty Portal" },
    faculty_coordinator: { label: "Faculty Coordinator", portal: "Faculty Portal" },
    principal: { label: "Principal / Dean", portal: "Principal Portal" },
    student: { label: "Student Candidate", portal: "Student CSR Portal" },
    management: { label: "Executive Governance", portal: "Management Portal" },
    admission_team: { label: "Admission Officer", portal: "Admission Portal" },
    admission: { label: "Admission Officer", portal: "Admission Portal" },
    placement_coordinator: { label: "Placement Coordinator", portal: "Placement Portal" },
  };

  const portalInfo = roleNameMap[effectiveRole] || { label: "Enterprise Staff", portal: "CSR Portal" };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      if (appLogout) await appLogout();
      await authLogout();
    } catch { }

    // Clear session storage and cookies
    if (typeof window !== "undefined") {
      localStorage.removeItem("gqt_role");
      localStorage.removeItem("gqt_user_email");
      localStorage.removeItem("gqt_user_name");
      localStorage.removeItem("gqt_user_id");
      document.cookie = "gqt_active_role=; path=/; max-age=0";
      document.cookie = "gqt_auth_user=; path=/; max-age=0";
    }

    toast.success("Signed out successfully");
    const loginUrl = getRoleLoginUrl(effectiveRole);
    router.push(loginUrl);
  };

  // Find appropriate settings URL based on role
  const settingsUrl = effectiveRole === "student"
    ? "/student/profile"
    : effectiveRole === "super_admin"
      ? "/admin/settings"
      : "/portal/settings";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        aria-label="User profile options"
      >
        <Avatar src={avatarUrl} name={displayName} size="sm" status="online" />
        <div className="hidden md:block text-left mr-1">
          <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
            {displayName}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
            {isStudentPortal && activeStudent?.usn ? activeStudent.usn : portalInfo.label}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-[#111C3A] rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Identity Box */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} name={displayName} size="md" status="online" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {userEmail}
                  </div>
                  {isStudentPortal && activeStudent?.usn && (
                    <div className="text-[10px] font-mono text-primary font-bold mt-0.5">
                      USN: {activeStudent.usn}
                    </div>
                  )}
                </div>
              </div>

              {/* Portal & Role Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#005BBB] dark:text-[#14B8FF]">
                  <Shield className="w-3 h-3" />
                  {portalInfo.label}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] uppercase font-bold">
                  {effectiveRole}
                </span>
              </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-1">
              {isStudentPortal && (
                <Link
                  href="/student/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#005BBB] transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile & USN</span>
                </Link>
              )}

              <Link
                href={settingsUrl}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#005BBB] transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
