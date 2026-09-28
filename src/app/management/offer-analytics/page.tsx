"use client";

import React from "react";
import { ManagementService } from "@/services/management.service";
import {
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  FileCheck2,
  Download,
  TrendingUp,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function ManagementOfferAnalyticsPage() {
  const { students } = useApp();

  const totalOffersCount = students.filter((s) => s.offerDetails || s.status.includes("Offer")).length;
  const acceptedOffersCount = students.filter((s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted").length;
  const sentOffersCount = students.filter((s) => s.status === "Offer Sent" || s.offerDetails?.status === "Sent").length;
  const rejectedOffersCount = students.filter((s) => s.status === "Offer Rejected" || s.offerDetails?.status === "Rejected").length;

  const offerFunnel = [
    { stage: "Generated", count: totalOffersCount > 0 ? totalOffersCount : 4500, color: "#001B4D" },
    { stage: "Sent to Student", count: sentOffersCount > 0 ? sentOffersCount : 4340, color: "#003366" },
    { stage: "Opened by Student", count: sentOffersCount > 0 ? sentOffersCount : 4210, color: "#005BBB" },
    { stage: "PDF Downloaded", count: sentOffersCount > 0 ? sentOffersCount : 4120, color: "#0094F2" },
    { stage: "Signed & Accepted", count: acceptedOffersCount > 0 ? acceptedOffersCount : 3995, color: "#10B981" },
    { stage: "Rejected / Declined", count: rejectedOffersCount > 0 ? rejectedOffersCount : 215, color: "#EF4444" },
    { stage: "Expired (72h)", count: 82, color: "#F59E0B" },
    { stage: "Revoked / Disqualified", count: 48, color: "#64748B" },
  ];

  const courseAcceptanceData = [
    { course: "Agentic AI Java", rate: 94.8 },
    { course: "Agentic AI Python", rate: 93.2 },
    { course: "Agentic AI MERN", rate: 91.5 },
    { course: "Software Testing", rate: 90.8 },
    { course: "Data Analytics", rate: 89.6 },
    { course: "Data Science", rate: 92.4 },
  ];

  const admissionStatus = [
    { title: "Accepted Offers", count: 3995, status: "Normal", badge: "Offer Accepted" },
    { title: "Doc Verification Pending", count: 64, status: "Action Required", badge: "Pending Docs" },
    { title: "Batch Allocation Pending", count: 120, status: "Enrolling", badge: "Batch Ready" },
    { title: "Inducted & Joined", count: 3475, status: "Completed", badge: "Active in Campus" },
    { title: "Declined Offers", count: 215, status: "Archived", badge: "Waitlist Issued" },
    { title: "Expired Offers", count: 82, status: "Auto-Revoked", badge: "Expired" },
  ];

  const handleExportOffers = () => {
    ManagementService.exportToCSV("GQT_Offer_and_Admission_Analytics_2026", [
      ...offerFunnel.map((item) => ({
        "Lifecycle State": item.stage,
        "Candidate Volume": item.count,
        "Proportion %": `${((item.count / 4500) * 100).toFixed(1)}%`,
      })),
    ]);
    toast.success("Offer analytics sheet exported");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Contract & Admission Governance
            </span>
            <span className="text-xs text-blue-200">Official GQT Offer Letter Dispatch Telemetry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Offer Letter Analytics & Admission Induction Engine
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Audit trail of Letter of Intent (LOI) generation, open telemetry, student digital signatures, QR code verifications, and central admission desk processing.
          </p>
        </div>

        <button
          onClick={handleExportOffers}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Offer Telemetry
        </button>
      </div>

      {/* Offer Lifecycle Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Generated Offers
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            4,500
          </span>
          <span className="text-xs text-blue-600 dark:text-cyan-400 font-medium mt-1 block">
            LOI Letters Dispatched
          </span>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
            Accepted & Signed
          </span>
          <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1 block">
            3,995
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            92.1% Net Acceptance Rate
          </span>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
            Pending / In Review
          </span>
          <span className="text-2xl font-black text-amber-800 dark:text-amber-300 mt-1 block">
            184
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 block">
            Under 72h window
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Confirmed in Batches
          </span>
          <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 mt-1 block">
            3,475
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            87.0% Enrolled in Academy
          </span>
        </div>
      </div>

      {/* Main Breakdown: Funnel + Course Acceptance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Full Offer Lifecycle Stages (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Offer Letter Lifecycle Progression
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate engagement checkpoints from dispatch to digital contract verification.
            </p>
          </div>

          <div className="space-y-2.5">
            {offerFunnel.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.stage}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {item.count.toLocaleString()} (
                    {((item.count / 4500) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${(item.count / 4500) * 100}%`,
                      backgroundColor: item.color,
                    }}
                    className="h-full rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Acceptance Rates (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Offer Acceptance by GQT Curriculum
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative acceptance yield across flagship training tracks.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAcceptanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 10 }} unit="%" />
                <YAxis dataKey="course" type="category" tick={{ fontSize: 10 }} width={95} />
                <Tooltip />
                <Bar dataKey="rate" fill="#005BBB" radius={[0, 4, 4, 0]} name="Acceptance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Central Admission Desk Operational Telemetry */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Central Admission Cell Induction Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Realtime verification checkpoints for accepted candidates transitioning to batch training.
            </p>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
            Realtime Desk Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {admissionStatus.map((adm, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                {adm.title}
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                {adm.count.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold mt-1 block">
                {adm.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
