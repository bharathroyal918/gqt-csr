"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  User,
  Shield,
  Key,
  Laptop,
  Smartphone,
  Lock,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  LogOut
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useApp } from "@/context/AppContext";

export default function AdminProfilePage() {
  const { user, profile } = useAuth();
  const { currentUser, updateCurrentUserProfile, updateCurrentUserPassword } = useApp();

  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateCurrentUserProfile({ name, phone });
      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await updateCurrentUserPassword(newPassword);
      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    toast.success("Notification preferences saved successfully");
  };

  const displayRole = (currentUser?.role || "super_admin").replace(/_/g, " ").toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Profile Hero */}
      <Card className="border border-border/60 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
            alt="Admin Avatar"
            className="w-24 h-24 rounded-3xl object-cover border-2 border-primary/40 shadow-xl"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{currentUser?.name || "Administrator"}</h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold">
                {displayRole}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentUser?.email || ""}{currentUser?.phone ? ` • ${currentUser.phone}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Global Quest Technologies Private Limited • Bengaluru, Karnataka
            </p>
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-[11px] text-muted-foreground">
              <span>Last Login: <strong className="text-foreground">Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} IST</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2FA Hardware Token Active
              </span>
            </div>
          </div>
          <div>
            <Button
              variant={isEditingProfile ? "outline" : "primary"}
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Phone Number</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSavingProfile} className="bg-primary text-white">
                <Save className="w-3.5 h-3.5 mr-1" />
                {isSavingProfile ? "Saving..." : "Save Profile Changes"}
              </Button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permissions Summary Card */}
        <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Root Governance Authority
          </CardTitle>
          <div className="space-y-2 text-xs">
            <p className="text-muted-foreground">
              As Root Super Admin, your cryptographic JWT session holds unrestricted write and execute permissions across all 18 platform modules:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                "User Provisioning",
                "RBAC Role Matrix",
                "CSR Drive Lifecycle",
                "College Master DB",
                "Exam Question Bank",
                "Live Proctoring",
                "HR Decision Override",
                "Offer Release",
                "Forensic Auditing",
                "Disaster Recovery",
              ].map((perm, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/40 rounded-xl text-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Change Password Card */}
        <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" /> Credential Rotation
          </CardTitle>
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">New Super Admin Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 12 characters..."
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
              />
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={isUpdatingPassword} className="w-full bg-primary text-white">
                {isUpdatingPassword ? "Rotating Password in Supabase..." : "Rotate Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Authorized Devices & Sessions */}
      <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Laptop className="w-4 h-4 text-primary" /> Authorized Security Devices
        </CardTitle>
        <div className="divide-y divide-border/40 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="font-bold text-foreground">Windows 11 Workstation — Chrome 122</p>
                <p className="text-muted-foreground text-[11px]">Bangalore, Karnataka • IP: 106.51.72.18 (Current Active Session)</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active Now
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-bold text-foreground">Apple iPhone 15 Pro — Safari Mobile</p>
                <p className="text-muted-foreground text-[11px]">Bangalore, Karnataka • IP: 106.51.72.25 • 2 hours ago</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-xs text-rose-400 hover:bg-rose-500/10">
              Revoke Session
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Admin Alert Subscriptions
          </CardTitle>
          <Button size="sm" onClick={handleSavePreferences} className="text-xs">
            <Save className="w-3.5 h-3.5 mr-1" /> Save Subscriptions
          </Button>
        </div>
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 cursor-pointer">
            <div>
              <p className="font-bold text-foreground">Proctoring Malpractice Alerts</p>
              <p className="text-muted-foreground text-[11px]">Receive instant alert when candidate violations exceed threshold</p>
            </div>
            <input type="checkbox" checked={securityAlerts} onChange={(e) => setSecurityAlerts(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 cursor-pointer">
            <div>
              <p className="font-bold text-foreground">HR Override & Offer Acceptance Digest</p>
              <p className="text-muted-foreground text-[11px]">Daily summary of candidate decisions and offer acceptances</p>
            </div>
            <input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
          </label>
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 cursor-pointer">
            <div>
              <p className="font-bold text-foreground">Weekly Platform Health & Backup Digest</p>
              <p className="text-muted-foreground text-[11px]">Snapshot integrity audits and Supabase database metrics</p>
            </div>
            <input type="checkbox" checked={weeklyDigest} onChange={(e) => setWeeklyDigest(e.target.checked)} />
          </label>
        </div>
      </Card>
    </div>
  );
}
