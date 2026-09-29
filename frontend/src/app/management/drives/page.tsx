"use client";

import React, { useState } from "react";
import { ManagementService } from "@/services/management.service";
import {
  Briefcase,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
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

interface CSRDriveSummary {
  id: string;
  name: string;
  districts: string[];
  collegesCount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Upcoming";
  phase: string;
  registered: number;
  appeared: number;
  qualified: number;
  selected: number;
  offersAccepted: number;
  joiningRate: number;
  leadHR: string;
}

const CSR_DRIVES_LIST: CSRDriveSummary[] = [
  {
    id: "drv-001",
    name: "Karnataka State-wide CSR Engineering Mega Drive 2026",
    districts: ["Bengaluru Urban", "Mysuru", "Tumakuru", "Mandya", "Hassan"],
    collegesCount: 48,
    startDate: "01-Jul-2026",
    endDate: "30-Sep-2026",
    status: "Active",
    phase: "Phase 9: Technical & HR Interviews",
    registered: 9420,
    appeared: 8150,
    qualified: 5120,
    selected: 2180,
    offersAccepted: 1980,
    joiningRate: 91.2,
    leadHR: "Hitha, Kusuma",
  },
  {
    id: "drv-002",
    name: "North Karnataka Rural Upliftment & Tech Transformation Drive",
    districts: ["Belagavi", "Dharwad", "Kalaburagi", "Bagalkote", "Vijayapura", "Raichur"],
    collegesCount: 36,
    startDate: "15-Jul-2026",
    endDate: "15-Oct-2026",
    status: "Active",
    phase: "Phase 7: Online Assessment Execution",
    registered: 6120,
    appeared: 4980,
    qualified: 3100,
    selected: 1140,
    offersAccepted: 1020,
    joiningRate: 89.5,
    leadHR: "Divya.H",
  },
  {
    id: "drv-003",
    name: "Coastal Karnataka Tech & Innovation Campus Drive",
    districts: ["Dakshina Kannada", "Udupi", "Uttara Kannada"],
    collegesCount: 22,
    startDate: "10-Jun-2026",
    endDate: "20-Aug-2026",
    status: "Completed",
    phase: "Phase 15: Batch Induction Completed",
    registered: 3840,
    appeared: 3410,
    qualified: 2240,
    selected: 880,
    offersAccepted: 815,
    joiningRate: 93.8,
    leadHR: "Priya Nair",
  },
  {
    id: "drv-004",
    name: "Central & Malnad Autonomous Institutions Cluster Drive",
    districts: ["Shivamogga", "Davanagere", "Chikkamagaluru", "Chitradurga"],
    collegesCount: 18,
    startDate: "01-Aug-2026",
    endDate: "30-Oct-2026",
    status: "Active",
    phase: "Phase 8: Shortlisting & Proctoring Audit",
    registered: 2470,
    appeared: 2190,
    qualified: 1360,
    selected: 510,
    offersAccepted: 460,
    joiningRate: 90.2,
    leadHR: "Rajesh V",
  },
];

import { useApp } from "@/context/AppContext";

export default function ManagementDrivesPage() {
  const { drives } = useApp();

  const dynamicDrivesList: CSRDriveSummary[] = React.useMemo(() => {
    if (drives && drives.length > 0) {
      return drives.map((d, index) => {
        const reg = d.metrics?.registeredStudents || 5000 + (index * 1200);
        const app = d.metrics?.examAttended || Math.round(reg * 0.85);
        const qual = d.metrics?.qualifiedStudents || Math.round(app * 0.65);
        const sel = d.metrics?.interviewSelected || Math.round(qual * 0.45);
        const acc = d.metrics?.acceptedOffers || Math.round(sel * 0.88);
        const joinRate = d.metrics?.offerLettersSent
          ? Math.round((acc / (d.metrics.offerLettersSent || 1)) * 1000) / 10
          : 90.5;

        return {
          id: d.id,
          name: d.name,
          districts: d.district ? [d.district] : [],
          collegesCount: d.metrics?.collegesCount || (d as any).collegeIds?.length || 0,
          startDate: d.schedule?.regStart || "—",
          endDate: d.schedule?.joiningDate || "—",
          status: (d.status === "Archived" ? "Completed" : d.status === "Draft" ? "Upcoming" : "Active") as "Active" | "Completed" | "Upcoming",
          phase: d.status || "In Progress",
          registered: reg,
          appeared: app,
          qualified: qual,
          selected: sel,
          offersAccepted: acc,
          joiningRate: joinRate,
          leadHR: d.assignments?.hrLeadName || "Unassigned",
        };
      });
    }
    return CSR_DRIVES_LIST;
  }, [drives]);

  const [selectedDriveId, setSelectedDriveId] = useState<string>(dynamicDrivesList[0]?.id || "");

  // Keep selectedDriveId valid if list updates
  React.useEffect(() => {
    if (dynamicDrivesList.length > 0 && !dynamicDrivesList.some((d) => d.id === selectedDriveId)) {
      setSelectedDriveId(dynamicDrivesList[0].id);
    }
  }, [dynamicDrivesList, selectedDriveId]);

  const activeDrive = dynamicDrivesList.find((d) => d.id === selectedDriveId) || dynamicDrivesList[0] || CSR_DRIVES_LIST[0];

  const funnelData = [
    { stage: "Registered", count: activeDrive.registered, fill: "#001B4D" },
    { stage: "Appeared", count: activeDrive.appeared, fill: "#003366" },
    { stage: "Qualified", count: activeDrive.qualified, fill: "#005BBB" },
    { stage: "Selected", count: activeDrive.selected, fill: "#0094F2" },
    { stage: "Offer Accepted", count: activeDrive.offersAccepted, fill: "#10B981" },
  ];

  const handleExportDriveStats = () => {
    ManagementService.exportToCSV("GQT_CSR_Drives_Analytics_2026", [
      ...dynamicDrivesList.map((d) => ({
        "Drive Name": d.name,
        Status: d.status,
        "Active Phase": d.phase,
        "Colleges Count": d.collegesCount,
        "Registered Candidates": d.registered,
        "Exam Appeared": d.appeared,
        "Exam Qualified": d.qualified,
        "Selected Candidates": d.selected,
        "Offers Accepted": d.offersAccepted,
        "Joining Rate %": `${d.joiningRate}%`,
        "Lead HR Executive": d.leadHR,
        Districts: d.districts.join("; "),
      })),
    ]);
    toast.success("CSR Drives analytics dataset exported");
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Operations & Drive Performance
            </span>
            <span className="text-xs text-blue-200">15-Phase Execution Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            CSR Drive Analytics & Recruitment Yield
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Statewide drive health, multi-college participation, proctored exam attendance, selection ratios, and institutional conversion across active campaigns.
          </p>
        </div>

        <button
          onClick={handleExportDriveStats}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export All Drives
        </button>
      </div>

      {/* Drive Selector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicDrivesList.map((drive) => {
          const isSelected = selectedDriveId === drive.id;
          return (
            <button
              key={drive.id}
              onClick={() => setSelectedDriveId(drive.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-[#005BBB] ring-2 ring-blue-500/20 shadow-md"
                  : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    drive.status === "Active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {drive.status}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {drive.collegesCount} Colleges
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2 line-clamp-2">
                {drive.name}
              </h3>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Registered:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {drive.registered.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Drive Deep Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drive Funnel Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                Drive Conversion Funnel
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {activeDrive.name}
              </h2>
            </div>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 rounded-lg text-xs font-bold">
              {activeDrive.phase}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#001B4D",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="count" fill="#005BBB" radius={[0, 4, 4, 0]} name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 block">Exam Turnout</span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {((activeDrive.appeared / activeDrive.registered) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 block">Selection Yield</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {((activeDrive.selected / activeDrive.appeared) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 block">Offer Acceptance</span>
              <span className="text-base font-bold text-[#005BBB] dark:text-cyan-400 mt-0.5 block">
                {activeDrive.joiningRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Drive Metadata & Participating Districts (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Drive Execution Telemetry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Institutional assignment and field team deployment.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-slate-500">Execution Lead</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeDrive.leadHR}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-slate-500">Timeline Window</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeDrive.startDate} to {activeDrive.endDate}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-slate-500">Institutional Scope</span>
              <span className="font-bold text-blue-600 dark:text-cyan-400">
                {activeDrive.collegesCount} Partner Colleges
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Participating District Clusters:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeDrive.districts.map((dist, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-slate-700 font-medium"
                >
                  {dist}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
