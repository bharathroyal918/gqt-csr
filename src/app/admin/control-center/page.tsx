"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminService } from "@/services/admin.service";
import {
  Zap,
  Activity,
  ShieldCheck,
  HardDrive,
  Users,
  Database,
  Globe,
  Sliders,
  Sparkles,
  Calendar,
  Lock,
  Radio,
  Clock,
  Server,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Download,
  Mail,
  Smartphone,
  Bell,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

export default function AdminControlCenterPage() {
  const [flags, setFlags] = useState(() => AdminService.getFeatureFlags());
  const [health] = useState(() => AdminService.getSystemHealth());
  const buckets = AdminService.getStorageBuckets();
  const sessions = AdminService.getActiveSessions();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const totalStorageSize = buckets.reduce((acc, b) => acc + b.totalSizeBytes, 0);
  const formattedStorage = (totalStorageSize / (1024 * 1024 * 1024)).toFixed(1) + " GB";

  const toggleFlag = (key: string) => {
    const updated = AdminService.toggleFeatureFlag(key);
    setFlags(updated);
    toast.success("Feature Flag state synchronized with Edge runtime", {
      description: `Flag ${key} updated across all active sessions.`,
    });
  };

  const handleMaintenanceToggle = () => {
    const nextState = !maintenanceMode;
    setMaintenanceMode(nextState);
    if (nextState) {
      toast.warning("Platform Maintenance Window Activated", {
        description: "Public registration and student testing throttled. Super Admin whitelist preserved.",
      });
    } else {
      toast.success("Platform Returned to Normal Operation", {
        description: "All student and college gateways are fully open.",
      });
    }
  };

  const handleLiveSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Global OS telemetry synchronized with Supabase master cluster");
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001B4D] via-[#002B66] to-[#005BBB] p-6 md:p-8 text-white shadow-2xl border border-blue-500/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                GQT Platform Master OS
              </span>
              <span className="text-xs text-blue-200">
                Super Admin Governance Hub • Enterprise v3.4.0
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Platform Control Center
            </h1>
            <p className="text-sm md:text-base text-blue-100/90 leading-relaxed">
              Master administration console orchestrating user security, role permission matrices, real-time message queues, storage buckets, database replication, and global feature flags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleMaintenanceToggle}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                maintenanceMode
                  ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                  : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {maintenanceMode ? "Maintenance ACTIVE" : "Maintenance Mode"}
            </button>

            <button
              onClick={handleLiveSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <RefreshCw className={`w-4 h-4 text-[#005BBB] ${isSyncing ? "animate-spin" : ""}`} />
              Sync Platform OS
            </button>
          </div>
        </div>
      </div>

      {/* 12 TOP SYSTEM HEALTH & TELEMETRY CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            Infrastructure Telemetry & Cluster Status
          </h2>
          <span className="text-xs text-slate-500">Live Polling: 14ms latency</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">System Uptime</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block">99.98%</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">All Systems GO</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Active Users</span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block">21,850</span>
            <span className="text-[10px] text-slate-500 block">Candidates & Staff</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Online Now</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 block">1,840</span>
            <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-medium block">Live Sessions</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Storage Used</span>
              <HardDrive className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-xl font-black text-purple-600 dark:text-purple-400 block">{formattedStorage}</span>
            <span className="text-[10px] text-slate-500 block">8 S3 Buckets</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Realtime Hub</span>
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">12 Nodes</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium block">0 Drop Rate</span>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Failed Logins</span>
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 block">1 Today</span>
            <span className="text-[10px] text-rose-700 dark:text-rose-300 font-medium block">IP Quarantined</span>
          </div>
        </div>

        {/* Realtime Message Queues Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50/60 dark:bg-slate-900/80 rounded-xl border border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">WhatsApp Queue</span>
                <span className="text-[10px] text-slate-500">Meta Cloud API Gateway</span>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-600">0 Pending • 100% OK</span>
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-slate-900/80 rounded-xl border border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Email Engine Queue</span>
                <span className="text-[10px] text-slate-500">Corporate SMTP Relay</span>
              </div>
            </div>
            <span className="font-mono font-bold text-blue-600">0 Pending • 100% OK</span>
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-slate-900/80 rounded-xl border border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-purple-600" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Push Notification Drawer</span>
                <span className="text-[10px] text-slate-500">Supabase State Broadcast</span>
              </div>
            </div>
            <span className="font-mono font-bold text-purple-600">Active Realtime</span>
          </div>
        </div>
      </div>

      {/* OS WORKSPACE LAUNCHPAD (12 TILES) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Operating System Navigation & Administration Workspaces
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">User Directory & Bulk Engine</h3>
            <p className="text-xs text-slate-500 mt-1">Manage 21,850+ users, bulk excel imports, college assignments.</p>
          </Link>

          <Link
            href="/admin/roles"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Role & Identity Governance</h3>
            <p className="text-xs text-slate-500 mt-1">11 standard system roles + custom authority profiles.</p>
          </Link>

          <Link
            href="/admin/permissions"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Enterprise Permission Matrix</h3>
            <p className="text-xs text-slate-500 mt-1">Granular 19 modules × 11 action matrices (View, Edit, Approve, Export).</p>
          </Link>

          <Link
            href="/admin/feature-flags"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Global Feature Flag Center</h3>
            <p className="text-xs text-slate-500 mt-1">Instant switches for Exam, Interviews, WhatsApp, LOIs, Realtime.</p>
          </Link>

          <Link
            href="/admin/security"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Security & Active Sessions</h3>
            <p className="text-xs text-slate-500 mt-1">Kill live sessions, inspect trusted devices, failed login forensics.</p>
          </Link>

          <Link
            href="/admin/storage"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <HardDrive className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Storage & Bucket Explorer</h3>
            <p className="text-xs text-slate-500 mt-1">Resumes, student photos, offer letters, audio recordings, certificates.</p>
          </Link>

          <Link
            href="/admin/branding"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Branding & White-Label</h3>
            <p className="text-xs text-slate-500 mt-1">Customize GQT logos, primary brand hues, footer texts, font styles.</p>
          </Link>

          <Link
            href="/admin/academic-years"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Academic Year Sessions</h3>
            <p className="text-xs text-slate-500 mt-1">Active 2026-27 session, archive past terms, roll over colleges.</p>
          </Link>

          <Link
            href="/admin/integrations"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">API Keys & Integrations</h3>
            <p className="text-xs text-slate-500 mt-1">Supabase, Meta Cloud API, SMTP, Razorpay, Zoom, Webhook endpoints.</p>
          </Link>

          <Link
            href="/admin/backup"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">Backup & Restore Center</h3>
            <p className="text-xs text-slate-500 mt-1">124 GB automated daily snapshots, selective module restoration.</p>
          </Link>

          <Link
            href="/admin/system-health"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">System Health & Sentry</h3>
            <p className="text-xs text-slate-500 mt-1">Realtime latency diagnostics, worker queue status, error resolution.</p>
          </Link>

          <Link
            href="/admin/license"
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mt-3 text-sm">License & Build Notes</h3>
            <p className="text-xs text-slate-500 mt-1">Enterprise multi-tenant core, release changelog, tier validation.</p>
          </Link>
        </div>
      </div>

      {/* QUICK LIVE FEATURE FLAGS TOGGLE STRIP */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              Live Feature Flags Quick-Toggles
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly enable or disable core candidate workflows across all sub-portals.
            </p>
          </div>
          <Link
            href="/admin/feature-flags"
            className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline"
          >
            Open Full Flag Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {flags.slice(0, 6).map((flag) => (
            <div
              key={flag.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {flag.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">
                  {flag.key}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleFlag(flag.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  flag.isEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    flag.isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
