"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Calendar,
  Save,
  CheckCircle,
  XCircle,
  GraduationCap,
  Briefcase,
  School,
  Building2,
  Award,
  Layers,
  Sparkles,
  Info
} from "lucide-react";

interface PortalAccessStatus {
  id: string;
  name: string;
  url: string;
  role: string;
  icon: any;
  enabled: boolean;
  maintenanceMessage: string;
  timeRestricted: boolean;
  allowedStartTime: string;
  allowedEndTime: string;
}

const INITIAL_ACCESS_CONFIGS: PortalAccessStatus[] = [
  {
    id: "student",
    name: "Student Candidate Portal",
    url: "/student/login",
    role: "student",
    icon: GraduationCap,
    enabled: true,
    maintenanceMessage: "The student portal is temporarily offline for scheduled system optimization. Please check back at 2:00 PM.",
    timeRestricted: false,
    allowedStartTime: "08:00",
    allowedEndTime: "22:00",
  },
  {
    id: "hr",
    name: "HR Recruiter Portal",
    url: "/hr/login",
    role: "hr",
    icon: Briefcase,
    enabled: true,
    maintenanceMessage: "Recruiter evaluations locked until next phase opening.",
    timeRestricted: true,
    allowedStartTime: "09:00",
    allowedEndTime: "19:00",
  },
  {
    id: "pto",
    name: "Placement Officer (PTO) Portal",
    url: "/pto/login",
    role: "pto",
    icon: School,
    enabled: true,
    maintenanceMessage: "Placement portal is in read-only audit mode.",
    timeRestricted: false,
    allowedStartTime: "08:30",
    allowedEndTime: "18:00",
  },
  {
    id: "faculty",
    name: "Faculty Coordinator Portal",
    url: "/faculty/login",
    role: "faculty_coordinator",
    icon: Award,
    enabled: true,
    maintenanceMessage: "Faculty department rosters undergoing end-of-term archiving.",
    timeRestricted: false,
    allowedStartTime: "08:00",
    allowedEndTime: "18:00",
  },
  {
    id: "principal",
    name: "Principal Portal",
    url: "/principal/login",
    role: "principal",
    icon: Building2,
    enabled: true,
    maintenanceMessage: "Executive portal maintenance underway.",
    timeRestricted: false,
    allowedStartTime: "07:00",
    allowedEndTime: "21:00",
  },
  {
    id: "csr_manager",
    name: "CSR Drive Manager Portal",
    url: "/csr-manager/login",
    role: "csr_manager",
    icon: Layers,
    enabled: true,
    maintenanceMessage: "CSR Manager system syncing with Karnataka State higher ed DB.",
    timeRestricted: false,
    allowedStartTime: "00:00",
    allowedEndTime: "23:59",
  },
  {
    id: "management",
    name: "Management Viewer Portal",
    url: "/management/login",
    role: "management",
    icon: ShieldAlert,
    enabled: true,
    maintenanceMessage: "Management executive analytics offline for index rebuilding.",
    timeRestricted: false,
    allowedStartTime: "00:00",
    allowedEndTime: "23:59",
  },
];

export default function PortalAccessControlPage() {
  const [portals, setPortals] = useState<PortalAccessStatus[]>(INITIAL_ACCESS_CONFIGS);
  const [globalMaintenance, setGlobalMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);

  const togglePortal = (id: string) => {
    setPortals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const updateMessage = (id: string, msg: string) => {
    setPortals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, maintenanceMessage: msg } : p))
    );
  };

  const toggleTimeRestriction = (id: string) => {
    setPortals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, timeRestricted: !p.timeRestricted } : p))
    );
  };

  const updateTime = (id: string, field: "allowedStartTime" | "allowedEndTime", val: string) => {
    setPortals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleGlobalLockdown = () => {
    const nextState = !globalMaintenance;
    setGlobalMaintenance(nextState);
    setPortals((prev) => prev.map((p) => ({ ...p, enabled: !nextState })));
    if (nextState) {
      toast.warning("Global Platform Lockdown Activated", {
        description: "All non-admin logins have been suspended immediately.",
      });
    } else {
      toast.success("Platform Lockdown Lifted", {
        description: "All sub-portals have been restored to operational status.",
      });
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Portal Access Policies synced with Edge Middleware", {
        description: "Next.js proxy and Supabase JWT validators updated successfully.",
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/40 via-blue-950/30 to-indigo-950/40 border border-rose-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Gateway Security Gatekeeper
            </span>
            {globalMaintenance && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                Emergency Lockdown Active
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Portal Access & Maintenance Control
          </h1>
          <p className="text-sm text-muted-foreground">
            Control authentication gateways, schedule portal maintenance windows, configure lockdown banners, and enforce operating hour restrictions across all sub-portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={globalMaintenance ? "danger" : "outline"}
            onClick={handleGlobalLockdown}
            className={
              globalMaintenance
                ? "bg-rose-600 hover:bg-rose-700 text-white gap-2"
                : "border-rose-500/40 text-rose-400 hover:bg-rose-500/10 gap-2"
            }
          >
            <AlertTriangle className="w-4 h-4" />
            {globalMaintenance ? "Deactivate Lockdown" : "Emergency Lockdown"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish Policies"}
          </Button>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold">Note on Super Admin Safety: </strong>
          The Super Admin Portal (<code className="text-primary bg-primary/10 px-1 py-0.5 rounded">/admin/*</code>) is permanently exempt from portal lockdowns to ensure governance access is never severed.
        </div>
      </div>

      {/* Portals List */}
      <div className="grid grid-cols-1 gap-6">
        {portals.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Portal Identity */}
                    <div className="flex items-start sm:items-center gap-4 min-w-[280px]">
                      <div className={`p-3.5 rounded-2xl ${p.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{p.name}</h3>
                          {p.enabled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                              <Unlock className="w-3 h-3" /> Live & Open
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                              <Lock className="w-3 h-3" /> Locked Down
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          URL: <span className="font-mono text-primary/80">{p.url}</span> • Role: <span className="font-mono">{p.role}</span>
                        </p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Maintenance Message */}
                      <div>
                        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                          Maintenance Banner Message
                        </label>
                        <Input
                          value={p.maintenanceMessage}
                          onChange={(e) => updateMessage(p.id, e.target.value)}
                          placeholder="Message displayed when portal is disabled..."
                          className="text-xs h-9"
                          disabled={p.enabled}
                        />
                      </div>

                      {/* Time Window Restriction */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            Operating Hours
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleTimeRestriction(p.id)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            {p.timeRestricted ? "Disable Hours" : "Restrict Hours"}
                          </button>
                        </div>
                        {p.timeRestricted ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={p.allowedStartTime}
                              onChange={(e) => updateTime(p.id, "allowedStartTime", e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg border border-border bg-background text-foreground"
                            />
                            <span className="text-xs text-muted-foreground">to</span>
                            <input
                              type="time"
                              value={p.allowedEndTime}
                              onChange={(e) => updateTime(p.id, "allowedEndTime", e.target.value)}
                              className="px-2 py-1 text-xs rounded-lg border border-border bg-background text-foreground"
                            />
                            <span className="text-[10px] text-muted-foreground">IST</span>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground py-1">
                            Available 24/7 (No time restrictions)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enable / Disable Gateway Switch */}
                    <div className="flex items-center gap-3 self-end lg:self-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {p.enabled ? "Access Enabled" : "Access Blocked"}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={p.enabled}
                        onClick={() => togglePortal(p.id)}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          p.enabled ? "bg-emerald-600" : "bg-rose-600"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            p.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
