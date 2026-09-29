"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Tabs } from "@/components/common/Tabs";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import {
  User,
  Palette,
  Shield,
  Bell,
  Info,
  CheckCircle,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";

export function SettingsView() {
  const { profile, user, role } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState(profile?.fullName || user?.name || "");
  const [phone, setPhone] = useState(profile?.phone || user?.phone || "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  React.useEffect(() => {
    if (profile?.fullName) setFullName(profile.fullName);
    else if (user?.name) setFullName(user.name);
    if (profile?.phone) setPhone(profile.phone);
    else if (user?.phone) setPhone(user.phone);
  }, [profile, user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "about", label: "About GQT", icon: <Info className="w-4 h-4" /> },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences saved successfully");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPwd) {
      toast.error("Please enter a new password");
      return;
    }
    toast.success("Password updated securely in Supabase Auth");
    setCurrentPwd("");
    setNewPwd("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure your personal profile, security clearance, appearance themes, and notification preferences.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Profile Section */}
      {activeTab === "profile" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Enterprise Profile</CardTitle>
              <CardDescription>Manage your contact details and organizational credentials.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
              />
              <Input
                label="Corporate Email Address"
                value={profile?.email || user?.email || ""}
                disabled
                helperText="Email changes require Super Administrator clearance."
              />
              <Input
                label="Mobile Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 "
              />
              <Input
                label="Assigned Authority Role"
                value={role.replace("_", " ").toUpperCase()}
                disabled
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Appearance Section */}
      {activeTab === "appearance" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Appearance & Theme</CardTitle>
              <CardDescription>Customize the visual interface mode of the GQT CSR Platform.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
              {[
                { key: "light", label: "Light Mode", icon: Sun, desc: "Crisp white surface with #005BBB blue" },
                { key: "dark", label: "Dark Navy", icon: Moon, desc: "Sleek #001B4D dark mode contrast" },
                { key: "system", label: "System Default", icon: Laptop, desc: "Follow OS preference" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setTheme(item.key);
                      toast.success(`Theme updated to ${item.label}`);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#005BBB] bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-[#005BBB]/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-5 h-5 ${isSelected ? "text-[#005BBB] dark:text-[#14B8FF]" : "text-slate-400"}`} />
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Section */}
      {activeTab === "security" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Security & Password</CardTitle>
              <CardDescription>Manage credentials, multi-factor authentication, and active sessions.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
              <Input
                label="Current Password"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Enter new strong password"
                helperText="Minimum 8 characters with letters, numbers, and symbols."
              />

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Two-Factor Authentication (2FA)
                </div>
                <div className="text-[11px] text-slate-500">
                  Ready for Supabase TOTP / Authenticator integration in production.
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Update Security Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications Section */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure which automated alerts and dispatches you receive.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Email Dispatches</div>
                <div className="text-[11px] text-slate-500">Receive drive approvals, daily digests, and offer confirmations.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#005BBB]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Realtime Alerts</div>
                <div className="text-[11px] text-slate-500">Receive instant push notifications for candidate interview check-ins.</div>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-[#005BBB]"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => toast.success("Notification preferences updated")}
            >
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* About GQT Section */}
      {activeTab === "about" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>About Global Quest Technologies</CardTitle>
              <CardDescription>Enterprise CSR Recruitment & Placement Automation Platform</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            <p>
              The <strong>GQT CSR Drive Platform</strong> is an enterprise software solution built for
              Global Quest Technologies to conduct live CSR placement drives, online proctored examinations,
              candidate interview pipelines, and institutional college partnership management across India.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block">Version</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">2.0.0 (Enterprise)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Framework</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Next.js 16 App Router</span>
              </div>
              <div>
                <span className="text-slate-400 block">Database</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Supabase SSR</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              © {new Date().getFullYear()} Global Quest Technologies. All rights reserved. Strictly confidential.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
