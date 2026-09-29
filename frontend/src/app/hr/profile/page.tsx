"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Building2,
  Award,
  CheckCircle2,
  Calendar,
  Lock,
  Save,
  Key,
  BadgeCheck
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function HRProfilePage() {
  const { currentUser, updateCurrentUserProfile, updateCurrentUserPassword } = useApp();

  const [name, setName] = useState(currentUser.name || "");
  const [empId, setEmpId] = useState(currentUser.employeeId || currentUser.id || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [designation, setDesignation] = useState("Corporate Recruiter");
  const [department, setDepartment] = useState(currentUser.department || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Re-synchronize form fields whenever active user changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmpId(currentUser.employeeId || currentUser.id || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setDepartment(currentUser.department || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCurrentUserProfile({
      name,
      email,
      phone,
      department,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    const res = await updateCurrentUserPassword(newPassword);
    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Staff Identity & Access
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">HR Recruiter Profile & Credentials</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Manage your recruitment authority credentials, institutional contact details, and platform security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl text-center">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"}
            alt={name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#005BBB]/20 shadow-md"
          />
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <h2 className="text-lg font-bold text-slate-900">{name}</h2>
            <BadgeCheck className="w-5 h-5 text-[#005BBB]" />
          </div>
          <p className="text-xs text-slate-500 font-mono font-bold">{empId}</p>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Active Recruiter
          </span>

          <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
            <div>
              <span className="text-slate-400">Designation:</span>
              <p className="font-semibold text-slate-800">{designation}</p>
            </div>
            <div>
              <span className="text-slate-400">Department:</span>
              <p className="font-semibold text-slate-800">{department}</p>
            </div>
            <div>
              <span className="text-slate-400">Assigned Territory:</span>
              <p className="font-semibold text-[#005BBB]">Bengaluru Urban & Mysuru Zone</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400">Colleges</span>
              <p className="font-bold text-slate-800 text-base mt-0.5">3</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400">Interviews</span>
              <p className="font-bold text-teal-600 text-base mt-0.5">64</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400">Offers</span>
              <p className="font-bold text-emerald-600 text-base mt-0.5">36</p>
            </div>
          </div>
        </Card>

        {/* Update Profile & Password Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Personal & Contact Information
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={empId}
                    disabled
                    className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="cyan" type="submit" className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#005BBB]" />
              Security & Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" type="submit" className="text-xs">
                  <Key className="w-3.5 h-3.5 mr-1" />
                  Update Security Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
