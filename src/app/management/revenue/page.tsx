"use client";

import React from "react";
import { ManagementService } from "@/services/management.service";
import {
  DollarSign,
  TrendingUp,
  Download,
  Users,
  Award,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  PieChart as PieIcon,
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

export default function ManagementRevenuePage() {
  const batches = ManagementService.getTrainingBatches();

  const sponsorshipSummary = [
    { title: "CSR 100% Sponsored", value: "3,120", sub: "Fully funded by GQT CSR Foundation", color: "#005BBB" },
    { title: "Merit Scholarships", value: "875", sub: "Corporate partner grants", color: "#14B8FF" },
    { title: "Specialization Upgrades", value: "245", sub: "Cloud & Agentic AI advanced lab", color: "#7C3AED" },
    { title: "Social Impact Value Created", value: "₹ 18.4 Cr", sub: "Tuition waiver equivalent", color: "#10B981" },
  ];

  const deliveryModes = [
    { name: "Offline (Tech Park Campus)", count: 1850, color: "#001B4D" },
    { name: "Hybrid (Institutional Hubs)", count: 1240, color: "#005BBB" },
    { name: "Online Interactive", count: 385, color: "#10B981" },
  ];

  const handleExportRevenueSheet = () => {
    ManagementService.exportToCSV("GQT_CSR_Sponsorship_and_Batch_Allocation_2026", [
      ...batches.map((b) => ({
        "Batch Name": b.batchName,
        Curriculum: b.course,
        "Seat Capacity": b.capacity,
        "Enrolled Candidates": b.filled,
        "Seats Available": b.available,
        "Attendance / Joining %": `${b.joiningRate}%`,
        "Lead Trainer / Architect": b.trainer,
        "Campus Location": b.location,
        "Training Mode": b.mode,
        "Progress %": `${b.progressPct}%`,
        "Batch Status": b.status,
      })),
    ]);
    toast.success("Sponsorship & batch analytics exported");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              CSR Grant & Academy Economics
            </span>
            <span className="text-xs text-blue-200">Social Mobility & Student Empowerment</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Revenue, CSR Sponsorship & Batch Allocation
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Financial stewardship tracking corporate CSR scholarship grants, training seat allocations, learning centers across Karnataka, and batch progression.
          </p>
        </div>

        <button
          onClick={handleExportRevenueSheet}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Batch Allocation
        </button>
      </div>

      {/* Sponsorship Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sponsorshipSummary.map((item, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
          >
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {item.title}
            </span>
            <span
              style={{ color: item.color }}
              className="text-2xl md:text-3xl font-black block tracking-tight"
            >
              {item.value}
            </span>
            <span className="text-xs text-slate-500 block">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Delivery Mode Distribution & Training Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Delivery Modes (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Delivery Mode Breakdown
          </h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryModes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="count"
                >
                  {deliveryModes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {deliveryModes.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{m.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{m.count.toLocaleString()} students</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training Hub Batches Directory (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Academy Batches & Seat Occupancy
              </h2>
              <span className="text-xs text-slate-500">Karnataka Academy Center Roster</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              94.2% Total Occupancy
            </span>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {batch.batchName}
                    </h3>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      {batch.course} • Mentor: {batch.trainer}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      batch.status === "In Progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-cyan-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                      {batch.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Occupancy</span>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {batch.filled} / {batch.capacity} ({((batch.filled / batch.capacity) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Joining %</span>
                    <span className="font-bold text-emerald-600 block">
                      {batch.joiningRate}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Curriculum Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white">{batch.progressPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${batch.progressPct}%` }}
                      className="h-full bg-[#005BBB] rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
