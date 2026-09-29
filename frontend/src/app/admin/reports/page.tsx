"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import { downloadCSV, downloadExcel, downloadPrintableReport } from "@/lib/exportUtils";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  CheckCircle2,
  Building2,
  Users,
  Award,
  GraduationCap
} from "lucide-react";

interface ReportType {
  id: string;
  name: string;
  category: string;
  description: string;
  recordCount: number;
  lastGenerated: string;
}

const REPORT_CATALOG: ReportType[] = [
  { id: "RPT-01", name: "Statewide Student Registration Master", category: "Candidate Pipeline", description: "Granular census of all registered candidates across VTU engineering colleges.", recordCount: 1240, lastGenerated: "2025-02-14" },
  { id: "RPT-02", name: "Technical Examination Performance Audit", category: "Assessments", description: "Score distributions, section-wise accuracy, and qualifying rates.", recordCount: 980, lastGenerated: "2025-02-14" },
  { id: "RPT-03", name: "Qualified Candidate Cohort Roster", category: "Assessments", description: "Students meeting or exceeding qualifying cutoffs eligible for interview rounds.", recordCount: 420, lastGenerated: "2025-02-13" },
  { id: "RPT-04", name: "Disqualified & Outlier Assessment Logs", category: "Assessments", description: "Audit trail of disqualified candidates and academic integrity flags.", recordCount: 160, lastGenerated: "2025-02-12" },
  { id: "RPT-05", name: "HR Selected Talent Master Directory", category: "Recruitment", description: "Complete roster of candidates recommended for corporate offer release.", recordCount: 215, lastGenerated: "2025-02-14" },
  { id: "RPT-06", name: "Offer Letter Dispatch & Acceptance Funnel", category: "Recruitment", description: "Status of LOIs issued, accepted, and joining dates confirmed.", recordCount: 185, lastGenerated: "2025-02-14" },
  { id: "RPT-07", name: "Institutional College Participation Breakdown", category: "Institutions", description: "College-by-college turnout, eligible strength, and placed percentage.", recordCount: 42, lastGenerated: "2025-02-11" },
  { id: "RPT-08", name: "Karnataka District-Wise Demographic Spread", category: "Demographics", description: "Talent penetration across 31 districts including Tier-2/Tier-3 clusters.", recordCount: 31, lastGenerated: "2025-02-10" },
  { id: "RPT-09", name: "Recruiter Velocity & Conversion Analytics", category: "Internal Ops", description: "Interviewer throughput, turnaround time, and decision variance.", recordCount: 8, lastGenerated: "2025-02-14" },
  { id: "RPT-10", name: "Omnichannel Communication & Delivery Report", category: "Messaging", description: "Delivery metrics for WhatsApp bots, email alerts, and SMS broadcasts.", recordCount: 8420, lastGenerated: "2025-02-14" },
];

export default function AdminReportCenterPage() {
  const [reports, setReports] = useState<ReportType[]>(REPORT_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = Array.from(new Set(reports.map((r) => r.category)));

  const filtered = reports.filter(
    (r) => selectedCategory === "all" || r.category === selectedCategory
  );

  const handleExport = (report: ReportType, format: "PDF" | "Excel" | "CSV") => {
    const safeBase = `GQT_${report.name.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const columns = ["Report Item ID", "Institutional Cluster", "Verified Census", "Compliance Index", "Window Range"];
    const rows = Array.from({ length: 20 }, (_, i) => ({
      "Report Item ID": `GQT-ADM-${2000 + i}`,
      "Institutional Cluster": ["VTU North Cluster", "Bengaluru Central Cluster", "Mysuru Regional Hub", "Dharwad Technical Hub"][i % 4],
      "Verified Census": 50 + (i * 12),
      "Compliance Index": `${(90 + (i % 9)).toFixed(1)}%`,
      "Window Range": `${startDate} to ${endDate}`,
    }));

    if (format === "CSV") {
      downloadCSV(safeBase, rows, columns);
    } else if (format === "Excel") {
      downloadExcel(safeBase, rows, columns);
    } else {
      downloadPrintableReport(
        safeBase,
        report.name,
        `GQT Platform Compliance & State Governance Audit • Range: ${startDate} to ${endDate} • Category: ${report.category}`,
        columns,
        rows
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Enterprise Reporting Center
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Audit & Compliance Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate and export board-level CSR audit files, academic turnouts, district heatmaps, and recruiter productivity indices.
          </p>
        </div>
      </div>

      {/* Date Filter & Scope Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Reports ({reports.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Timeframe:</span>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 text-xs w-32"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-8 text-xs w-32"
          />
        </div>
      </div>

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rpt) => (
          <Card key={rpt.id} className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">{rpt.id}</span>
                  <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded-full border">
                    {rpt.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-foreground">{rpt.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{rpt.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                <strong className="text-foreground">{rpt.recordCount.toLocaleString()}</strong> Records • Updated {rpt.lastGenerated}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport(rpt, "PDF")}
                  className="h-7 text-[11px] px-2.5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30"
                >
                  <FileText className="w-3 h-3 mr-1" /> PDF
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport(rpt, "Excel")}
                  className="h-7 text-[11px] px-2.5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                >
                  <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport(rpt, "CSV")}
                  className="h-7 text-[11px] px-2.5 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30"
                >
                  <Download className="w-3 h-3 mr-1" /> CSV
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
