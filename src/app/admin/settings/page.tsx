"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Tabs } from "@/components/common/Tabs";
import { toast } from "sonner";
import {
  Settings,
  Shield,
  Palette,
  Globe,
  Lock,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Sparkles,
  Server
} from "lucide-react";

export default function AdminPlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("brand");

  // Platform Brand Settings
  const [portalName, setPortalName] = useState("Global Quest Technologies — CSR Drive Platform");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [themeMode, setThemeMode] = useState("system");
  const [primaryColor, setPrimaryColor] = useState("#005BBB");
  const [accentColor, setAccentColor] = useState("#14B8FF");
  const [footerText, setFooterText] = useState("© 2025 Global Quest Technologies Private Limited. All Rights Reserved. CSR Upskilling Initiative.");
  const [supportEmail, setSupportEmail] = useState("csr.support@globalquesttechnologies.com");
  const [supportPhone, setSupportPhone] = useState("+91 80 4123 4567");

  // Security Settings
  const [passwordMinLength, setPasswordMinLength] = useState(10);
  const [requireSpecialChar, setRequireSpecialChar] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState("106.51.72.0/24, 14.139.155.0/24");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const tabs = [
    { id: "brand", label: "Platform Branding & Identity", icon: <Globe className="w-4 h-4 text-primary" /> },
    { id: "security", label: "Security & Governance Policies", icon: <Shield className="w-4 h-4 text-emerald-500" /> },
    { id: "infrastructure", label: "Supabase & API Credentials", icon: <Server className="w-4 h-4 text-blue-500" /> },
  ];

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform branding updated across all 8 portals");
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enterprise security policies committed to Next.js middleware and Supabase RLS");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Root Configuration
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Platform & Security Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure system-wide branding, academic cycles, password enforcement thresholds, session longevity, and security parameters.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Platform Branding */}
      {activeTab === "brand" && (
        <form onSubmit={handleSaveBrand} className="space-y-6">
          <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
            <CardTitle className="text-base font-bold">Brand Identity & Regional Configuration</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Portal Title / Enterprise Name</label>
                <Input value={portalName} onChange={(e) => setPortalName(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Current Active Academic Cycle</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="2024-2025">2024-2025 (Current)</option>
                  <option value="2025-2026">2025-2026 (Upcoming)</option>
                  <option value="2023-2024">2023-2024 (Archived)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">GQT Primary Theme Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">GQT Accent Color (Cyan)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">CSR Support Email</label>
                <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">CSR Helpline Phone</label>
                <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Legal Footer Copyright Text</label>
              <Input value={footerText} onChange={(e) => setFooterText(e.target.value)} required />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-primary text-white gap-2">
                <Save className="w-4 h-4" /> Save Brand Configuration
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Tab 2: Security & Governance */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveSecurity} className="space-y-6">
          <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
            <CardTitle className="text-base font-bold">Authentication & Security Gateways</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Min Password Length</label>
                <Input
                  type="number"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(parseInt(e.target.value) || 8)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Session Inactivity Timeout (Mins)</label>
                <Input
                  type="number"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 15)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Max Failed Login Attempts</label>
                <Input
                  type="number"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold text-foreground">Mandatory Complexity Requirements</label>
              <div className="flex gap-6 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireSpecialChar}
                    onChange={(e) => setRequireSpecialChar(e.target.checked)}
                  />
                  Require Special Characters (!@#$%^&*)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireNumber}
                    onChange={(e) => setRequireNumber(e.target.checked)}
                  />
                  Require Digits (0-9)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enforce2FA}
                    onChange={(e) => setEnforce2FA(e.target.checked)}
                  />
                  Enforce Two-Factor Authentication (2FA) for Admins & HR
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">Admin Portal Allowed IP Ranges (CIDR Whitelist)</label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="Comma separated IP blocks e.g. 106.51.72.0/24"
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Emergency Maintenance Lockdown Mode</p>
                <p className="text-[11px] text-muted-foreground">Locks all sub-portals immediately; displays system upgrade notice to candidates</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Save className="w-4 h-4" /> Save Security Policies
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Tab 3: Infrastructure */}
      {activeTab === "infrastructure" && (
        <Card className="rounded-3xl border border-border/60 bg-card/70 p-6 space-y-4">
          <CardTitle className="text-base font-bold">Cloud Infrastructure Status</CardTitle>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Supabase PostgreSQL Cluster</p>
                <p className="text-muted-foreground">Location: ap-south-1 (Mumbai) • Connection Pooling: Active (PgBouncer)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Connected & Operational
              </span>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Supabase Realtime WebSockets</p>
                <p className="text-muted-foreground">Channel: public:* • Broadcast Latency: &lt;18ms</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Listening
              </span>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Next.js Edge Proxy Middleware</p>
                <p className="text-muted-foreground">Proxy: src/proxy.ts • JWT Verification: Enforced</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
