"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Filter,
  Search,
  Users,
  Building2,
  Award,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { downloadCSV, downloadExcel, downloadPrintableReport } from "@/lib/exportUtils";

interface HRReportItem {
  id: string;
  name: string;
  category: "Registration" | "Qualified" | "Rejected" | "Selected" | "Interview" | "Offer" | "College" | "Branch";
  description: string;
  totalRecords: number;
  lastUpdated: string;
  formats: ("Excel" | "PDF" | "CSV")[];
}

const HR_REPORTS: HRReportItem[] = [
  {
    id: "HR-RPT-01",
    name: "Student Registration Roster & KYC Audit",
    category: "Registration",
    description: "Detailed list of applicants across partner campuses, including CGPA, backlogs, and degree validation.",
    totalRecords: 1520,
    lastUpdated: "2026-09-24",
    formats: ["Excel", "CSV", "PDF"],
  },
  {
    id: "HR-RPT-02",
    name: "Assessment Qualified Candidates Ledger",
    category: "Qualified",
    description: "Scorecards and percentiles of all candidates who cleared the benchmark 60% exam cutoff.",
    totalRecords: 684,
    lastUpdated: "2026-09-24",
    formats: ["Excel", "PDF"],
  },
  {
    id: "HR-RPT-03",
    name: "Candidate Elimination & Rejection Reasons Audit",
    category: "Rejected",
    description: "Breakdown of rejected students categorized by exam score failure, interview elimination, or proctor violations.",
    totalRecords: 532,
    lastUpdated: "2026-09-23",
    formats: ["Excel", "PDF"],
  },
  {
    id: "HR-RPT-04",
    name: "Final Selected Talent & Placement Master Roster",
    category: "Selected",
    description: "Approved candidates who completed assessments and interviews, ready for LOI issuance.",
    totalRecords: 48,
    lastUpdated: "2026-09-24",
    formats: ["Excel", "CSV", "PDF"],
  },
  {
    id: "HR-RPT-05",
    name: "Interview Panel Feedback & Rubric Evaluation Metrics",
    category: "Interview",
    description: "Recruiter ratings across communication, technical architecture, and coding problem-solving criteria.",
    totalRecords: 114,
    lastUpdated: "2026-09-24",
    formats: ["Excel", "PDF"],
  },
  {
    id: "HR-RPT-06",
    name: "Letters of Intent (LOI) Issuance & Acceptance Report",
    category: "Offer",
    description: "Tracking of issued offer packages, candidate digital signatures, and designated batch start dates.",
    totalRecords: 48,
    lastUpdated: "2026-09-24",
    formats: ["PDF", "Excel"],
  },
  {
    id: "HR-RPT-07",
    name: "College-Wise Participation & Yield Summary",
    category: "College",
    description: "Comparative conversion rates, registered vs placed ratios across assigned colleges.",
    totalRecords: 6,
    lastUpdated: "2026-09-23",
    formats: ["Excel", "PDF"],
  },
  {
    id: "HR-RPT-08",
    name: "Engineering Discipline & Branch Distribution Report",
    category: "Branch",
    description: "Candidate qualifications across Computer Science, Information Science, ECE, AI&DS, and Mechanical.",
    totalRecords: 8,
    lastUpdated: "2026-09-22",
    formats: ["Excel", "CSV"],
  },
];

export default function HRReportsPage() {
  const { colleges } = useApp();
  const [reports] = useState<HRReportItem[]>(HR_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleExport = (reportName: string, format: string) => {
    const safeBase = `GQT_HR_${reportName.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const columns = ["Candidate USN", "Applicant Name", "Assigned College", "Technical Score / 100", "Recruiter Recommendation", "Evaluation Date"];
    const rows = Array.from({ length: 25 }, (_, i) => ({
      "Candidate USN": `1RV22CS${String(i + 1).padStart(3, "0")}`,
      "Applicant Name": `Candidate #${i + 1}`,
      "Assigned College": ["RV College of Engineering", "BMS College of Engineering", "Ramaiah Institute", "PES University"][i % 4],
      "Technical Score / 100": 70 + (i % 28),
      "Recruiter Recommendation": i % 3 === 0 ? "Strong Hire (Offer Released)" : "Qualified for Technical Round 2",
      "Evaluation Date": "2026-09-24",
    }));

    if (format === "CSV") {
      downloadCSV(safeBase, rows, columns);
    } else if (format === "Excel") {
      downloadExcel(safeBase, rows, columns);
    } else {
      downloadPrintableReport(
        safeBase,
        reportName,
        "Official GQT HR Recruitment Talent Pipeline & Scorecard Audit Ledger",
        columns,
        rows
      );
    }
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      categoryFilter === "all" || r.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Operations Intelligence
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">HR Recruitment Reports & Exports</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Export official applicant rosters, evaluation scorecards, interview rubrics, and offer letter statistics in Excel, CSV, or PDF formats.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Report Categories</option>
              <option value="registration">Registration</option>
              <option value="qualified">Qualified</option>
              <option value="rejected">Rejected</option>
              <option value="selected">Selected</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer Letters</option>
              <option value="college">College Summary</option>
              <option value="branch">Branch Distribution</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rpt) => (
          <Card
            key={rpt.id}
            className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="p-2 rounded-lg bg-[#005BBB]/10 text-[#005BBB]">
                  <BarChart3 className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {rpt.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{rpt.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rpt.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Records: <strong className="text-slate-900">{rpt.totalRecords.toLocaleString()}</strong>
                </span>
                <span>Updated: {rpt.lastUpdated}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Export Formats:</span>
              <div className="flex items-center gap-1.5">
                {rpt.formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(rpt.name, fmt)}
                    className="text-xs font-semibold px-2 py-1 rounded bg-slate-50 hover:bg-[#005BBB] hover:text-white text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
