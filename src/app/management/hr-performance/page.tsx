"use client";

import React, { useState } from "react";
import { ManagementService } from "@/services/management.service";
import {
  Users,
  Award,
  PhoneCall,
  CalendarCheck,
  Download,
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
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

export default function ManagementHRPerformancePage() {
  const hrList = ManagementService.getHrPerformance();
  const [selectedHrId, setSelectedHrId] = useState<string>(hrList[0]?.hrId || "");

  const selectedHr = hrList.find((h) => h.hrId === selectedHrId) || hrList[0];

  const handleExportHrCSV = () => {
    ManagementService.exportToCSV("GQT_HR_Performance_Leaderboard_2026", [
      ...hrList.map((hr, idx) => ({
        Rank: idx + 1,
        "Recruiter Name": hr.hrName,
        Email: hr.email,
        "Assigned Colleges": hr.assignedColleges,
        "Calls Completed": hr.callsCompleted,
        "Follow-ups Completed": hr.followUpsCompleted,
        "Students Reviewed": hr.studentsReviewed,
        "Interviews Conducted": hr.interviewsConducted,
        "Selections Made": hr.selectedCount,
        "Selection Rate %": `${hr.selectionRate}%`,
        "Offer Acceptance %": `${hr.offerAcceptanceRate}%`,
        "Avg Turnaround Hours": `${hr.avgResponseTimeHours} hrs`,
        "Avg Interview Rating": hr.avgInterviewRating,
        "Active Escalations": hr.escalations,
      })),
    ]);
    toast.success("HR Recruiter Performance dataset exported");
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Talent Acquisition Intelligence
            </span>
            <span className="text-xs text-blue-200">Field Productivity & Interview Ratings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            HR Recruiter Performance & Productivity Dashboard
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Individual and aggregate telemetry tracking institutional calls, interview ratings, candidate yields, offer acceptance rates, and SLA turnaround times.
          </p>
        </div>

        <button
          onClick={handleExportHrCSV}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export HR Metrics
        </button>
      </div>

      {/* Aggregate Productivity Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Total Recruiter Interviews
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {hrList.reduce((sum, h) => sum + h.interviewsConducted, 0).toLocaleString()}
          </span>
          <span className="text-xs text-blue-600 dark:text-cyan-400 mt-1 block font-medium">
            Conducted statewide
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Institutional Calls Logged
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {hrList.reduce((sum, h) => sum + h.callsCompleted, 0).toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            TPO & Principal interactions
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Avg Turnaround Time
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            1.8 Hours
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-500 mt-1 block font-semibold">
            SLA Benchmark: &lt;4h
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Mean Interview Rating
          </span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            4.6 / 5.0
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            Standardized rubric rating
          </span>
        </div>
      </div>

      {/* HR Recruiter Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Executive Recruiter Leaderboard
          </h2>
          <span className="text-xs text-slate-500">Sorted by Final Selections</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Recruiter Profile</th>
                <th className="py-3 px-4 text-center">Colleges</th>
                <th className="py-3 px-4 text-right">Calls Logged</th>
                <th className="py-3 px-4 text-right">Follow-ups</th>
                <th className="py-3 px-4 text-right">Interviews</th>
                <th className="py-3 px-4 text-right">Selections (Yield)</th>
                <th className="py-3 px-4 text-right">Offer Accept %</th>
                <th className="py-3 px-4 text-center">Response SLA</th>
                <th className="py-3 px-4 text-center">Audit Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hrList.map((hr, idx) => {
                const isSelected = selectedHrId === hr.hrId;
                return (
                  <tr
                    key={hr.id}
                    onClick={() => setSelectedHrId(hr.hrId)}
                    className={`cursor-pointer transition-colors ${isSelected
                      ? "bg-blue-50/70 dark:bg-slate-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={hr.avatar}
                          alt={hr.hrName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {hr.hrName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{hr.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                      {hr.assignedColleges}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                      {hr.callsCompleted}
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700 dark:text-slate-300">
                      {hr.followUpsCompleted}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {hr.interviewsConducted}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {hr.selectedCount}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({hr.selectionRate}%)
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[#005BBB] dark:text-cyan-400">
                      {hr.offerAcceptanceRate}%
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300">
                      {hr.avgResponseTimeHours} hrs
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {hr.avgInterviewRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected HR Deep Weekly Productivity Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
              Recruiter Weekly Output Audit
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {selectedHr.hrName} • 4-Week Activity Cadence
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Assigned: {selectedHr.assignedColleges} Institutions
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={selectedHr.weeklyProductivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#001B4D",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="calls" fill="#64748B" name="Calls Logged" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interviews" fill="#005BBB" name="Interviews Conducted" radius={[4, 4, 0, 0]} />
              <Bar dataKey="selections" fill="#10B981" name="Final Selections" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
