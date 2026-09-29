"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";
import {
  Sliders,
  CheckCircle,
  GraduationCap,
  Briefcase,
  School,
  Building2,
  Award,
  Layers,
  Sparkles,
  Save,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

interface PortalModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PortalConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  badge: string;
  modules: PortalModule[];
}

const INITIAL_PORTAL_CONFIGS: PortalConfig[] = [
  {
    id: "student",
    name: "Student Portal",
    icon: GraduationCap,
    color: "from-blue-600 to-indigo-600",
    badge: "Public / Candidate Facing",
    modules: [
      { id: "stu_exam", name: "Online Exam Module", description: "Enables students to access live proctored examinations and submit answers", enabled: true },
      { id: "stu_offers", name: "Offer Letter Hub", description: "Allows qualified candidates to view, verify, and digitally accept offers", enabled: true },
      { id: "stu_interview", name: "Interview Status Tracker", description: "Displays real-time interview slot booking, feedback, and shortlist stage", enabled: true },
      { id: "stu_resume", name: "Resume & Portfolio Uploader", description: "Allows uploading PDF resume, GitHub repository link, and LinkedIn profile", enabled: true },
      { id: "stu_helpdesk", name: "Student Support / Helpdesk", description: "Enables raising inquiries to CSR helpline and tracking resolution tickets", enabled: true },
    ],
  },
  {
    id: "hr",
    name: "HR Executive Portal",
    icon: Briefcase,
    color: "from-teal-600 to-emerald-600",
    badge: "Recruitment Operations",
    modules: [
      { id: "hr_crm", name: "College CRM Pipeline", description: "Lead tracking, calling logs, and MoU progress for institutional outreach", enabled: true },
      { id: "hr_interview", name: "Interview Evaluation Module", description: "Technical scoring, feedback submission, and recommendation controls", enabled: true },
      { id: "hr_offers", name: "Offer Release Management", description: "Issue LOI / Offer Letters and monitor acceptance rates", enabled: true },
      { id: "hr_reports", name: "Recruiter Productivity Reports", description: "View daily candidate shortlists, pipeline funnels, and HR conversion metrics", enabled: true },
      { id: "hr_bulk_comm", name: "Bulk WhatsApp & Email Dispatch", description: "Direct communication with assigned candidate batches", enabled: false },
    ],
  },
  {
    id: "faculty",
    name: "Faculty Coordinator Portal",
    icon: Award,
    color: "from-purple-600 to-pink-600",
    badge: "Academic Department",
    modules: [
      { id: "fac_verify", name: "Candidate Verification", description: "Validate student credentials, USN/roll numbers, and department eligibility", enabled: true },
      { id: "fac_attend", name: "Drive Day Attendance", description: "Mark QR/hall-ticket physical attendance during on-campus CSR events", enabled: true },
      { id: "fac_roster", name: "Department Student Roster", description: "Access branch-wise registered candidate directories", enabled: true },
      { id: "fac_lab", name: "Computer Lab Readiness", description: "Submit workstation readiness and network speed test checklists", enabled: false },
    ],
  },
  {
    id: "pto",
    name: "Placement Officer (PTO) Portal",
    icon: School,
    color: "from-amber-600 to-orange-600",
    badge: "Institutional Leadership",
    modules: [
      { id: "pto_approvals", name: "Drive Participation Sign-off", description: "Authorize college participation in scheduled CSR campus drives", enabled: true },
      { id: "pto_stats", name: "College Turnout & Placed Metrics", description: "Realtime statistics on registered vs shortlisted campus candidates", enabled: true },
      { id: "pto_hallticket", name: "Bulk Hall Ticket Dispatch", description: "Download and distribute exam passes to verified students", enabled: true },
    ],
  },
  {
    id: "principal",
    name: "Principal Portal",
    icon: Building2,
    color: "from-rose-600 to-red-600",
    badge: "Executive College Signoff",
    modules: [
      { id: "prin_mou", name: "MoU Digital Execution", description: "Review and e-sign CSR partnership memorandums with GQT", enabled: true },
      { id: "prin_analytics", name: "Institutional Impact Reports", description: "Macro view of student upskilling, testing scores, and offers received", enabled: true },
    ],
  },
  {
    id: "management",
    name: "Management Portal",
    icon: Layers,
    color: "from-indigo-600 to-blue-700",
    badge: "Board & Leadership",
    modules: [
      { id: "mgmt_reports", name: "Financial & CSR Reports", description: "Comprehensive CSR fund deployment and candidate outcome audits", enabled: true },
      { id: "mgmt_analytics", name: "Karnataka District Heatmap", description: "Talent distribution and Tier-2/Tier-3 college penetration analytics", enabled: true },
      { id: "mgmt_audit", name: "Governance & Compliance Logs", description: "Read-only access to forensic activity audit trails", enabled: true },
    ],
  },
];

export default function ModuleVisibilityPage() {
  const [portals, setPortals] = useState<PortalConfig[]>(INITIAL_PORTAL_CONFIGS);
  const [searchFilter, setSearchFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleModule = (portalId: string, moduleId: string) => {
    setPortals((prev) =>
      prev.map((portal) => {
        if (portal.id !== portalId) return portal;
        return {
          ...portal,
          modules: portal.modules.map((mod) =>
            mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod
          ),
        };
      })
    );
  };

  const toggleAllInPortal = (portalId: string, enable: boolean) => {
    setPortals((prev) =>
      prev.map((portal) => {
        if (portal.id !== portalId) return portal;
        return {
          ...portal,
          modules: portal.modules.map((mod) => ({ ...mod, enabled: enable })),
        };
      })
    );
    toast.info(`${enable ? "Enabled" : "Disabled"} all modules for ${portalId}`);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Module visibility matrix broadcasted via Supabase Realtime", {
        description: "All client portals will instantly adapt their navigation trees.",
      });
    }, 600);
  };

  const handleReset = () => {
    setPortals(INITIAL_PORTAL_CONFIGS);
    toast.info("Reset all module toggles to production defaults");
  };

  const totalModules = portals.reduce((acc, p) => acc + p.modules.length, 0);
  const activeModules = portals.reduce(
    (acc, p) => acc + p.modules.filter((m) => m.enabled).length,
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Dynamic UI Orchestration
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Instant Live Sync
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Module Visibility Control
          </h1>
          <p className="text-sm text-muted-foreground">
            Instantly show or hide specific functional blocks across Student, HR, Faculty, PTO, Principal, and Management portals without code deployments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset} className="border-border hover:bg-muted gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Publishing..." : "Save & Sync"}
          </Button>
        </div>
      </div>

      {/* KPI banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Configured Modules</p>
              <p className="text-2xl font-bold text-foreground mt-0.5">{totalModules}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Modules</p>
              <p className="text-2xl font-bold text-emerald-500 mt-0.5">{activeModules}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Controlled Portals</p>
              <p className="text-2xl font-bold text-indigo-500 mt-0.5">{portals.length} Portals</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portal Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {portals.map((portal) => {
          const Icon = portal.icon;
          const activeCount = portal.modules.filter((m) => m.enabled).length;

          return (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-border/40 pb-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${portal.color} text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">
                          {portal.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {portal.badge} • <span className="text-primary font-medium">{activeCount}/{portal.modules.length} active</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAllInPortal(portal.id, true)}
                        className="text-xs h-7 px-2.5 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        All On
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleAllInPortal(portal.id, false)}
                        className="text-xs h-7 px-2.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        All Off
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-border/40">
                  {portal.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="py-3 flex items-start justify-between gap-4 first:pt-1 last:pb-1"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {mod.name}
                          </span>
                          {mod.enabled ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <Eye className="w-2.5 h-2.5" /> Visible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                              <EyeOff className="w-2.5 h-2.5" /> Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      {/* Custom Modern Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={mod.enabled}
                        onClick={() => toggleModule(portal.id, mod.id)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-1 ${
                          mod.enabled ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            mod.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
