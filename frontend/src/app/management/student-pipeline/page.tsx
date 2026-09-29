"use client";

import React, { useState } from "react";
import { ManagementService } from "@/services/management.service";
import {
  Layers,
  TrendingDown,
  ArrowRight,
  Download,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BarChart3,
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

export default function ManagementStudentPipelinePage() {
  const [selectedCohort, setSelectedCohort] = useState("all");
  const pipeline = ManagementService.getPipelineFunnel();

  const totalRegistered = pipeline[0].count;
  const totalJoined = pipeline[pipeline.length - 1].count;
  const overallConversion = ((totalJoined / totalRegistered) * 100).toFixed(1);

  const handleExportFunnel = () => {
    ManagementService.exportToCSV("GQT_Statewide_Recruitment_Pipeline_Funnel", [
      ...pipeline.map((stage, idx) => {
        const next = pipeline[idx + 1];
        const drop = next ? stage.count - next.count : 0;
        const dropPct = next ? (((stage.count - next.count) / stage.count) * 100).toFixed(1) : "0.0";
        return {
          "Stage Order": idx + 1,
          "Funnel Stage": stage.stageName,
          "Candidate Count": stage.count,
          "Conversion Rate %": `${stage.conversionRate}%`,
          "Industry Benchmark %": `${stage.benchmarkRate}%`,
          "Stage Drop-off Count": drop,
          "Drop-off Rate %": `${dropPct}%`,
        };
      }),
    ]);
    toast.success("Recruitment pipeline funnel exported");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Statewide Candidate Funnel
            </span>
            <span className="text-xs text-blue-200">End-to-End Attrition & Conversion Telemetry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Student Recruitment Pipeline & Drop-off Funnel
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Visual recruitment funnel tracking candidate progression from registration, online assessment, HR evaluation, offer acceptance, to batch induction.
          </p>
        </div>

        <button
          onClick={handleExportFunnel}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Funnel Sheet
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Top of Funnel (Registered)
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {totalRegistered.toLocaleString()}
          </span>
          <span className="text-xs text-blue-600 dark:text-cyan-400 font-medium mt-1 block">
            Across 31 Karnataka Districts
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Qualified for Interview
          </span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            {pipeline[3].count.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            51.4% Cutoff Clearance
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Bottom of Funnel (Joined)
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {totalJoined.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-500 font-semibold mt-1 block">
            Confirmed for Training
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Net Pipeline Conversion
          </span>
          <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 mt-1 block">
            {overallConversion}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Benchmark: 14.0% (+1.9% uplift)
          </span>
        </div>
      </div>

      {/* Main Visual Funnel Diagram */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Recruitment Stage Drop-Off Funnel (Power BI Grade)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Stage width illustrates remaining candidate pool size; red pill badges indicate drop-off attrition between steps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Batch Filter:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              aria-label="Filter cohort"
              className="py-1 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Karnataka Candidates (2026 Batch)</option>
              <option value="autonomous">Tier-1 Autonomous Institutions</option>
              <option value="vtu">VTU Affiliated Colleges</option>
              <option value="rural">Tier-3 Rural District Colleges</option>
            </select>
          </div>
        </div>

        {/* Funnel Stage Bars */}
        <div className="space-y-3">
          {pipeline.map((stage, idx) => {
            const nextStage = pipeline[idx + 1];
            const dropCount = nextStage ? stage.count - nextStage.count : 0;
            const dropPct = nextStage
              ? (((stage.count - nextStage.count) / stage.count) * 100).toFixed(1)
              : 0;

            const widthPct = Math.max(18, (stage.count / totalRegistered) * 100);

            return (
              <div key={stage.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {stage.stageName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {stage.count.toLocaleString()} candidates
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400">
                      ({stage.conversionRate}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar representing funnel width */}
                <div className="h-9 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden p-1 flex items-center">
                  <div
                    style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
                    className="h-full rounded-lg transition-all flex items-center justify-between px-3 text-white text-[11px] font-bold shadow-sm"
                  >
                    <span>{stage.stageName}</span>
                    <span className="opacity-90">{stage.count.toLocaleString()}</span>
                  </div>
                </div>

                {/* Drop-off connector badge if there is a next stage */}
                {nextStage && (
                  <div className="flex items-center justify-center -my-0.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
                      <TrendingDown className="w-3 h-3" />
                      Attrition: -{dropCount.toLocaleString()} ({dropPct}%) drop-off to next stage
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Analysis Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Stage Yield vs Industry Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              GQT CSR conversion rate compared against standard IT campus hiring benchmarks.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#005BBB] dark:text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#005BBB]" />
              GQT Actual Rate
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
              Benchmark Target
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipeline}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="stageName" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#001B4D",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="conversionRate" fill="#005BBB" name="GQT Actual %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmarkRate" fill="#94A3B8" name="Industry Benchmark %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
