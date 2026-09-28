"use client";

import React, { useState, useMemo } from "react";
import { ManagementService } from "@/services/management.service";
import { CollegePerformanceStats } from "@/types";
import {
  Building2,
  TrendingUp,
  Download,
  Filter,
  Search,
  Award,
  CheckCircle2,
  Layers,
  ChevronRight,
  ArrowUpRight,
  School,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagementCollegesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"rank" | "registered" | "selected" | "acceptance">("rank");

  const districtsList = useMemo(() => {
    return ManagementService.getDistricts().map((d) => d.district);
  }, []);

  const colleges = useMemo(() => {
    return ManagementService.getCollegeLeaderboard({
      search: searchQuery,
      district: districtFilter,
      type: typeFilter,
      tier: tierFilter,
      sortBy: sortBy,
    });
  }, [searchQuery, districtFilter, typeFilter, tierFilter, sortBy]);

  const totalRegistered = colleges.reduce((sum, c) => sum + c.studentsRegistered, 0);
  const totalSelected = colleges.reduce((sum, c) => sum + c.currentYearSelected, 0);
  const avgAcceptance = (
    colleges.reduce((sum, c) => sum + c.offerAcceptanceRate, 0) / (colleges.length || 1)
  ).toFixed(1);

  const handleExportCSV = () => {
    ManagementService.exportToCSV(
      "GQT_College_Performance_Leaderboard_2026",
      colleges.map((c) => ({
        Rank: c.rank,
        College: c.collegeName,
        District: c.district,
        Tier: c.tier,
        Type: c.type,
        "Students Registered": c.studentsRegistered,
        "Exam Completion %": `${c.examCompletionRate}%`,
        "Selection Rate %": `${c.selectionRate}%`,
        "Current Year Selections": c.currentYearSelected,
        "Previous Year Selections": c.previousYearSelected,
        "YoY Growth %": `+${c.growthPct}%`,
        "Offer Acceptance %": `${c.offerAcceptanceRate}%`,
        "Joining Rate %": `${c.joiningRate}%`,
        "CSR Drives Count": c.drivesCount,
      }))
    );
    toast.success("College performance dataset exported", {
      description: `Downloaded ${colleges.length} institutional rows.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Institutional Intelligence
            </span>
            <span className="text-xs text-blue-200">Statewide Benchmark Leaderboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            College Performance & Conversion Leaderboard
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Comparative institutional rankings, exam completion rates, recruitment yield, and YoY placement growth across VTU, Autonomous, Deemed, and Government colleges.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Leaderboard
        </button>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Ranked Institutions
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {colleges.length}
          </span>
          <span className="text-xs text-blue-600 dark:text-cyan-400 mt-1 block font-medium">
            Active in 2026-27 drives
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Candidate Pipeline
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {totalRegistered.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Registered students
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Final Selections
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {totalSelected.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 block font-semibold">
            Placed candidates
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Acceptance
          </span>
          <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 mt-1 block">
            {avgAcceptance}%
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Statewide offer conversion
          </span>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search college, district, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            aria-label="Filter by District"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts (31 Total)</option>
            {districtsList.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Affiliation / Type"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Affiliations</option>
            <option value="Autonomous">Autonomous</option>
            <option value="VTU Affiliated">VTU Affiliated</option>
            <option value="Deemed University">Deemed University</option>
            <option value="Government Engineering College">Govt Engineering College</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort by metric"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="rank">Sort by Rank (#1 Top)</option>
            <option value="registered">Sort by Registrations (High)</option>
            <option value="selected">Sort by Selections (High)</option>
            <option value="acceptance">Sort by Acceptance % (High)</option>
          </select>
        </div>
      </div>

      {/* College Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            Ranked Institutional Directory ({colleges.length} Institutions)
          </h2>
          <span className="text-xs text-slate-500">Read-Only Executive View</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">College & Affiliation</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4 text-center">Tier</th>
                <th className="py-3 px-4 text-right">Registered</th>
                <th className="py-3 px-4 text-right">Exam Turnout</th>
                <th className="py-3 px-4 text-right">Selected (Yield)</th>
                <th className="py-3 px-4 text-right">YoY Growth</th>
                <th className="py-3 px-4 text-right">Offer Accept %</th>
                <th className="py-3 px-4 text-center">CSR Drives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {colleges.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-[11px] ${
                        c.rank === 1
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : c.rank === 2
                          ? "bg-slate-200 text-slate-800"
                          : c.rank === 3
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {c.rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {c.collegeName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.type}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {c.district}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.tier === "Tier-1"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-cyan-300"
                          : c.tier === "Tier-2"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900 dark:text-white">
                    {c.studentsRegistered.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                    {c.examCompletionRate}%
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {c.currentYearSelected}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ({c.selectionRate}%)
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center text-emerald-600 font-bold">
                      +{c.growthPct}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold text-[#005BBB] dark:text-cyan-400">
                    {c.offerAcceptanceRate}%
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300">
                      {c.drivesCount} Drives
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
