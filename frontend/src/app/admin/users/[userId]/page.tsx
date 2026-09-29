"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { usersService } from "@/lib/supabase/services";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Briefcase,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolvedParams = use(params);
  const { users } = useApp();

  const user = users.find((u) => u.id === resolvedParams.userId) || {
    id: resolvedParams.userId,
    name: "Staff Member",
    email: "user@globalquesttechnologies.com",
    phone: "+91 98450 33445",
    role: "hr" as UserRole,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    collegeName: "Partner College",
    department: "Talent Acquisition",
    status: "active" as const,
    lastLogin: new Date().toISOString(),
    twoFactorEnabled: true,
  };

  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<"active" | "inactive">(user.status);
  const [assignedColleges, setAssignedColleges] = useState("Karnataka Colleges Network");
  const [assignedDrives, setAssignedDrives] = useState("Karnataka State-wide CSR Engineering Drive 2026");
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await usersService.update(user.id, { role, status });
      toast.success("User account and access permissions updated in Supabase", {
        description: `Role: ${role} • Status: ${status}`,
      });
    } catch (err: any) {
      toast.error("Failed to update user account", { description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResetting(true);
    try {
      const res = await usersService.resetPasswordForEmail(user.email);
      if (res.success) {
        toast.success(`Password reset link dispatched securely via Supabase Auth to ${user.email}`);
      } else {
        toast.error("Could not send password reset", { description: res.error });
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users Directory
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetPassword}
            type="button"
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            {isResetting ? "Sending Reset..." : "Reset Password"}
          </button>
          <button
            form="user-edit-form"
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#001B4D] hover:bg-[#003366] text-white rounded-lg text-xs font-bold shadow-md disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    status === "active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">User ID: {user.id}</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 font-mono">
            <span>Last Login: </span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              {new Date(user.lastLogin).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form id="user-edit-form" onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                type="text"
                defaultValue={user.phone}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
              <input
                type="text"
                defaultValue={user.department || "Operations"}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Platform Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
              >
                <option value="super_admin">Super Administrator</option>
                <option value="csr_manager">CSR Manager</option>
                <option value="hr">HR Executive / Recruiter</option>
                <option value="placement_officer">Placement Officer (TPO)</option>
                <option value="faculty">Faculty Coordinator</option>
                <option value="principal">Principal</option>
                <option value="management">Board Management</option>
                <option value="admission_team">Central Admission Team</option>
                <option value="student">Student Candidate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
              >
                <option value="active">Active & Operational</option>
                <option value="inactive">Suspended / Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Institutional & Drive Assignments
            </h3>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned Partner Colleges</label>
              <input
                type="text"
                value={assignedColleges}
                onChange={(e) => setAssignedColleges(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Assigned CSR Drives</label>
              <input
                type="text"
                value={assignedDrives}
                onChange={(e) => setAssignedDrives(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
