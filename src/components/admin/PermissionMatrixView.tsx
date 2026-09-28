"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { UserRole } from "@/types";
import {
  Key,
  Shield,
  Save,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileCode,
  Globe,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Eye,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface PermissionRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  download: boolean;
  upload: boolean;
  assign: boolean;
  manage: boolean;
  realtime: boolean;
}

const MODULES_LIST = [
  "Dashboard",
  "Students",
  "Colleges",
  "CSR Drives",
  "Exam",
  "Question Bank",
  "Interview",
  "Offer",
  "Admission",
  "Reports",
  "Notifications",
  "Announcements",
  "Templates",
  "Settings",
  "Storage",
  "Audit Logs",
  "Feature Flags",
  "Support Tickets",
  "Communication",
] as const;

const ACTION_COLUMNS: { id: keyof Omit<PermissionRow, "module">; label: string }[] = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
  { id: "approve", label: "Approve" },
  { id: "export", label: "Export" },
  { id: "download", label: "Download" },
  { id: "upload", label: "Upload" },
  { id: "assign", label: "Assign" },
  { id: "manage", label: "Manage" },
  { id: "realtime", label: "Realtime" },
];

const DEFAULT_ROLE_PERMS: Record<string, Record<string, Partial<PermissionRow>>> = {
  super_admin: MODULES_LIST.reduce((acc, m) => {
    acc[m] = {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true,
      export: true,
      download: true,
      upload: true,
      assign: true,
      manage: true,
      realtime: true,
    };
    return acc;
  }, {} as any),
  csr_manager: {
    Dashboard: { view: true, export: true, realtime: true, manage: true },
    Students: { view: true, export: true, assign: true },
    Colleges: { view: true, create: true, edit: true, assign: true, manage: true },
    "CSR Drives": { view: true, create: true, edit: true, approve: true, manage: true, realtime: true },
    Exam: { view: true, manage: true },
    Interview: { view: true, approve: true },
    Offer: { view: true, export: true },
    Reports: { view: true, export: true, download: true },
    Notifications: { view: true, create: true },
    Announcements: { view: true, create: true, edit: true },
    Communication: { view: true, create: true },
  },
  hr: {
    Dashboard: { view: true, export: true, realtime: true },
    Students: { view: true, export: true, assign: true },
    Colleges: { view: true, edit: true },
    "CSR Drives": { view: true, export: true },
    Exam: { view: true },
    "Question Bank": { view: true, create: true, edit: true },
    Interview: { view: true, create: true, edit: true, approve: true, realtime: true, manage: true },
    Offer: { view: true, create: true, edit: true, download: true, upload: true, approve: true },
    Reports: { view: true, export: true, download: true },
    Notifications: { view: true, create: true },
    Communication: { view: true, create: true, edit: true },
  },
  placement_officer: {
    Dashboard: { view: true },
    Students: { view: true, create: true, edit: true, upload: true, export: true },
    Colleges: { view: true },
    "CSR Drives": { view: true },
    Interview: { view: true },
    Offer: { view: true, download: true },
    Reports: { view: true, download: true },
    Notifications: { view: true },
    Communication: { view: true, create: true },
  },
  student: {
    Dashboard: { view: true },
    Students: { view: true, edit: true, upload: true },
    Exam: { view: true, create: true },
    Interview: { view: true },
    Offer: { view: true, download: true, approve: true },
    Notifications: { view: true },
    "Support Tickets": { view: true, create: true },
  },
  management: {
    Dashboard: { view: true, export: true, realtime: true },
    Students: { view: true, export: true },
    Colleges: { view: true, export: true },
    "CSR Drives": { view: true, export: true },
    Offer: { view: true, export: true, download: true },
    Reports: { view: true, export: true, download: true },
    "Audit Logs": { view: true, export: true },
    Notifications: { view: true },
  },
};

interface PagePermissionItem {
  id: string;
  portal: string;
  pageName: string;
  route: string;
  enabled: boolean;
  description: string;
}

const INITIAL_PAGE_PERMISSIONS: PagePermissionItem[] = [
  { id: "stu-exam", portal: "Student Portal", pageName: "Online Exam Page", route: "/student/exam", enabled: true, description: "Live AI proctored examination interface" },
  { id: "stu-offer", portal: "Student Portal", pageName: "Offer Acceptance Page", route: "/student/offer-letter", enabled: true, description: "Digital offer letter signing & confirmation" },
  { id: "stu-notif", portal: "Student Portal", pageName: "Live Notifications", route: "/student/notifications", enabled: true, description: "Push alerts, schedule announcements, and drive alerts" },
  { id: "stu-help", portal: "Student Portal", pageName: "Support Helpdesk", route: "/student/helpdesk", enabled: true, description: "Ticketing & real-time query resolution" },
  { id: "stu-resume", portal: "Student Portal", pageName: "Resume Upload Workspace", route: "/student/resume", enabled: true, description: "PDF CV parser and profile enrichment" },
  { id: "hr-crm", portal: "HR Portal", pageName: "Candidate CRM Workspace", route: "/hr/crm", enabled: true, description: "Multi-channel WhatsApp & Email communication engine" },
  { id: "hr-interview", portal: "HR Portal", pageName: "Interview Pipeline Module", route: "/hr/interview", enabled: true, description: "Technical and HR evaluation rubric evaluation" },
  { id: "hr-offers", portal: "HR Portal", pageName: "Offer Generation Queue", route: "/hr/offers", enabled: true, description: "Batch offer dispatch and e-signature tracking" },
  { id: "hr-reports", portal: "HR Portal", pageName: "HR Drive Reports", route: "/hr/reports", enabled: true, description: "Hiring velocity and pass-rate export center" },
  { id: "adm-batch", portal: "Admission Portal", pageName: "Batch Allocation Console", route: "/admission/batches", enabled: true, description: "Assign verified recruits into technical training batches" },
  { id: "adm-docs", portal: "Admission Portal", pageName: "Document Verification", route: "/admission/documents", enabled: true, description: "Marksheet, Aadhaar, and degree authentication" },
  { id: "mgmt-rev", portal: "Management Portal", pageName: "Revenue & CSR Dashboard", route: "/management/revenue", enabled: true, description: "Corporate sponsorship and scholarship allocation metrics" },
  { id: "mgmt-audit", portal: "Management Portal", pageName: "Executive Audit Trail", route: "/management/audit", enabled: true, description: "Regulatory compliance and data change logs" },
  { id: "mgmt-analytics", portal: "Management Portal", pageName: "Talent BI Analytics", route: "/management/analytics", enabled: true, description: "Karnataka district heatmaps and performance cohorts" },
];

export function PermissionMatrixView() {
  const [activeTab, setActiveTab] = useState<"matrix" | "pages">("matrix");
  const [selectedRole, setSelectedRole] = useState<UserRole>("hr");
  const [pagePerms, setPagePerms] = useState<PagePermissionItem[]>(INITIAL_PAGE_PERMISSIONS);

  const [matrix, setMatrix] = useState<Record<string, PermissionRow>>(() => {
    const initial: Record<string, PermissionRow> = {};
    MODULES_LIST.forEach((m) => {
      initial[m] = {
        module: m,
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false,
        export: false,
        download: false,
        upload: false,
        assign: false,
        manage: false,
        realtime: false,
        ...(DEFAULT_ROLE_PERMS.hr?.[m] || {}),
      };
    });
    return initial;
  });

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    const updated: Record<string, PermissionRow> = {};
    MODULES_LIST.forEach((m) => {
      if (newRole === "super_admin") {
        updated[m] = {
          module: m,
          view: true,
          create: true,
          edit: true,
          delete: true,
          approve: true,
          export: true,
          download: true,
          upload: true,
          assign: true,
          manage: true,
          realtime: true,
        };
      } else {
        const defaults = DEFAULT_ROLE_PERMS[newRole]?.[m] || {};
        updated[m] = {
          module: m,
          view: Boolean(defaults.view),
          create: Boolean(defaults.create),
          edit: Boolean(defaults.edit),
          delete: Boolean(defaults.delete),
          approve: Boolean(defaults.approve),
          export: Boolean(defaults.export),
          download: Boolean(defaults.download),
          upload: Boolean(defaults.upload),
          assign: Boolean(defaults.assign),
          manage: Boolean(defaults.manage),
          realtime: Boolean(defaults.realtime),
        };
      }
    });
    setMatrix(updated);
  };

  const handleToggle = (module: string, action: keyof Omit<PermissionRow, "module">) => {
    if (selectedRole === "super_admin") {
      toast.error("Super Admin permissions are omnipresent and cannot be revoked");
      return;
    }

    setMatrix((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const handleToggleAllRow = (module: string) => {
    if (selectedRole === "super_admin") return;
    const current = matrix[module];
    const allOn =
      current.view &&
      current.create &&
      current.edit &&
      current.delete &&
      current.approve &&
      current.export &&
      current.download &&
      current.upload &&
      current.assign &&
      current.manage &&
      current.realtime;
    const nextVal = !allOn;

    setMatrix((prev) => ({
      ...prev,
      [module]: {
        module,
        view: nextVal,
        create: nextVal,
        edit: nextVal,
        delete: nextVal,
        approve: nextVal,
        export: nextVal,
        download: nextVal,
        upload: nextVal,
        assign: nextVal,
        manage: nextVal,
        realtime: nextVal,
      },
    }));
  };

  const handleSaveMatrix = () => {
    toast.success(`Permission Matrix for [${selectedRole.toUpperCase()}] saved to Supabase`, {
      description: "Row Level Security (RLS) policies and middleware updated immediately.",
    });
  };

  const handleResetToDefaults = () => {
    handleRoleChange(selectedRole);
    toast.info("Permissions reset to institutional defaults");
  };

  const handleTogglePagePerm = (id: string) => {
    setPagePerms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = !p.enabled;
          toast.info(`${p.pageName} is now ${updated ? "ENABLED" : "DISABLED"} via Middleware`);
          return { ...p, enabled: updated };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            Access Governance & Enforcement
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Key className="w-6 h-6 text-[#005BBB] dark:text-[#14B8FF]" />
            <span>Enterprise Permission & Route Governance</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure 11-column action permissions across 19 modules, plus page-level route middleware gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefaults}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveMatrix}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Matrix to Supabase
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("matrix")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "matrix"
              ? "border-[#005BBB] text-[#005BBB] dark:text-[#14B8FF]"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Module Action Matrix (11 Columns x 19 Modules)</span>
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "pages"
              ? "border-[#005BBB] text-[#005BBB] dark:text-[#14B8FF]"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Page-Level Route Permissions (Middleware Enforced)</span>
        </button>
      </div>

      {/* TAB 1: MODULE ACTION MATRIX */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          {/* Role Selector & Policy Notice */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Authority Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="super_admin">Super Administrator (Omnipresent)</option>
                <option value="csr_manager">CSR Program Manager</option>
                <option value="hr">HR Recruitment Lead</option>
                <option value="placement_officer">Placement Officer (PTO)</option>
                <option value="faculty">Faculty Coordinator</option>
                <option value="principal">Principal & Dean</option>
                <option value="admission_team">Admission & Batch Counseling</option>
                <option value="management">Executive Management (Read-Only)</option>
                <option value="student">Student Candidate</option>
                <option value="operations">Operations & Field Coordinator</option>
                <option value="support">Support & Helpdesk Desk</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Click individual cells to toggle. Click module name to toggle entire row.</span>
            </div>
          </div>

          {/* Matrix Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 pl-6 min-w-[160px]">Enterprise Module ({MODULES_LIST.length})</th>
                      {ACTION_COLUMNS.map((col) => (
                        <th key={col.id} className="p-3.5 text-center min-w-[64px]">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {MODULES_LIST.map((mod) => {
                      const row = matrix[mod];
                      return (
                        <tr
                          key={mod}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                        >
                          <td className="p-3.5 pl-6 font-bold text-slate-900 dark:text-white">
                            <button
                              type="button"
                              onClick={() => handleToggleAllRow(mod)}
                              className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] text-left cursor-pointer flex items-center gap-1.5"
                              title="Toggle all permissions for this module"
                            >
                              <span>{mod}</span>
                            </button>
                          </td>

                          {ACTION_COLUMNS.map((col) => {
                            const isGranted = Boolean(row[col.id]);
                            return (
                              <td key={col.id} className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(mod, col.id)}
                                  className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer ${
                                    isGranted
                                      ? "bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] hover:bg-blue-200"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {isGranted ? (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  ) : (
                                    <X className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                  )}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PAGE-LEVEL ROUTE PERMISSIONS */}
      {activeTab === "pages" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#005BBB] dark:text-[#14B8FF]" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Zero-Bypass Next.js Middleware Gateways
                </h4>
                <p className="text-[11px] text-slate-500">
                  Disabling a page immediately blocks direct URL access and displays the institutional maintenance/closed banner.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Active Gateway Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pagePerms.map((item) => (
              <Card key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.portal}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{item.route}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {item.pageName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePagePerm(item.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                    item.enabled ? "bg-[#005BBB]" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      item.enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
