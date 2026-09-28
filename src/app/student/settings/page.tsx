"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  Settings,
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Smartphone,
  Mail
} from "lucide-react";
import { toast } from "sonner";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentSettingsPage() {
  const router = useRouter();
  const {
    currentUser,
    logout,
    updateStudent,
    updateCurrentUserProfile,
    updateCurrentUserPassword,
  } = useApp();

  const { student: currentStudent, updateProfile } = useStudentSession();

  const [activeTab, setActiveTab] = useState<"profile" | "password" | "notifications" | "privacy" | "language">("profile");

  // Settings State
  const [profileForm, setProfileForm] = useState({
    name: currentStudent?.fullName || "",
    email: currentStudent?.email || "",
    mobile: currentStudent?.mobile || "",
    usn: currentStudent?.usn || "",
    college: currentStudent?.collegeName || "",
  });

  // Re-synchronize form fields whenever current student changes or loads from Supabase
  React.useEffect(() => {
    if (currentStudent) {
      setProfileForm({
        name: currentStudent.fullName || "",
        email: currentStudent.email || "",
        mobile: currentStudent.mobile || "",
        usn: currentStudent.usn || "",
        college: currentStudent.collegeName || "",
      });
    }
  }, [currentStudent, currentUser]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailExamAlerts: true,
    smsExamReminders: true,
    interviewSchedulePush: true,
    offerLetterImmediateAlert: true,
    placementDriveAnnouncements: false,
  });

  const [privacy, setPrivacy] = useState({
    shareProfileWithRecruiters: true,
    displayInMeritRankings: true,
    allowDataAuditByCollege: true,
  });

  const [language, setLanguage] = useState("en");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const studentId = currentStudent?.id;
    await updateStudent(studentId, {
      fullName: profileForm.name,
      email: profileForm.email,
      mobile: profileForm.mobile,
      collegeName: profileForm.college,
      usn: profileForm.usn,
    });
    await updateCurrentUserProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.mobile,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match or are empty");
      return;
    }
    const res = await updateCurrentUserPassword(passwordForm.newPassword);
    if (res.success) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const handleSavePrivacy = () => {
    toast.success("Privacy configurations updated");
  };

  const handleLogout = () => {
    logout();
    toast.info("Signed out successfully");
    router.push("/student/login");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <Settings className="w-3.5 h-3.5" />
              <span>Student Account Configurations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Configure your candidate credentials, security keys, notification preferences, privacy consent, and session settings.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
          >
            Sign Out of Account
          </Button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profile Settings", icon: User },
            { id: "password", label: "Password & Security", icon: Lock },
            { id: "notifications", label: "Notification Channels", icon: Bell },
            { id: "privacy", label: "Privacy & Data Consent", icon: Shield },
            { id: "language", label: "Language & Regional", icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${activeTab === tab.id
                  ? "bg-[#005BBB] text-white shadow-md"
                  : "bg-white dark:bg-[#111C3A] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
                  }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-rose-200 dark:border-rose-900 cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Content Panels */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Registered Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        disabled
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Contact Mobile
                      </label>
                      <input
                        type="text"
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        University USN
                      </label>
                      <input
                        type="text"
                        value={profileForm.usn}
                        disabled
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Enrolled College / University
                    </label>
                    <input
                      type="text"
                      value={profileForm.college}
                      disabled
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Password & Security */}
          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Change Account Password</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm" leftIcon={<Lock className="w-4 h-4" />}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: "emailExamAlerts", label: "Email Exam Alerts", desc: "Receive email when your exam slot and instructions are unlocked." },
                    { key: "smsExamReminders", label: "SMS Exam Reminders", desc: "Receive automated SMS 15 minutes before the exam window starts." },
                    { key: "interviewSchedulePush", label: "Interview Slot Push Notifications", desc: "Get real-time notification when HR schedules your interview." },
                    { key: "offerLetterImmediateAlert", label: "Offer Letter Release Notification", desc: "Instant high-priority notification when an official offer letter is generated." },
                    { key: "placementDriveAnnouncements", label: "Placement Drive Announcements", desc: "Receive updates regarding new CSR drive batches and workshops." },
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{item.label}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-[#005BBB] border-slate-300 focus:ring-[#005BBB] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="sm" onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Privacy & Data Consent Policies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: "shareProfileWithRecruiters", label: "Share Academic Profile with GQT Hiring Partners", desc: "Permit verified recruiters to evaluate your resume and GitHub repositories." },
                    { key: "displayInMeritRankings", label: "Anonymized Merit Leaderboard Participation", desc: "Allow percentile display in college-level assessment rankings." },
                    { key: "allowDataAuditByCollege", label: "College Placement Cell Audit Access", desc: "Allow your college TPO to review verification status and offer acceptance status." },
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{item.label}</span>
                        <span className="text-[11px] text-slate-400">{item.desc}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy[item.key as keyof typeof privacy]}
                        onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-[#005BBB] border-slate-300 focus:ring-[#005BBB] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="sm" onClick={handleSavePrivacy}>
                    Save Privacy Consent
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Language */}
          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#005BBB]" />
                  <CardTitle>Language & Regional Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-xs">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Interface Display Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      toast.success("Interface language preference updated");
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <option value="en">English (Default)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">System Timezone</span>
                  <span className="text-slate-500">Asia/Kolkata (IST • UTC+05:30)</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
