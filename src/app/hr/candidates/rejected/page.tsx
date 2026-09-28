"use client";

import React, { useState } from "react";
import {
  XCircle,
  Search,
  Filter,
  Download,
  AlertTriangle,
  RotateCcw,
  Building2,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function RejectedCandidatesPage() {
  const { students } = useApp();
  const liveRejected = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter((c) => c.status === "Rejected");
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveRejected);

  React.useEffect(() => {
    setCandidates(liveRejected);
  }, [liveRejected]);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.usn.toLowerCase().includes(search.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(search.toLowerCase());

    const matchesStage =
      stageFilter === "all" ||
      (c.decision?.rejectionStage || "").toLowerCase().includes(stageFilter.toLowerCase());

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Audit & Archive
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Rejected Candidates Archive</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Complete audit trail of candidates disqualified through assessment benchmarks or panel calibration with permanent non-destructive feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => toast.success("Exported rejection log to CSV")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Rejection Log
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rejected candidates by name, USN, college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full sm:w-60 py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Rejection Stages</option>
            <option value="Technical Round 1">Technical Round 1</option>
            <option value="Exam Cutoff">Exam Cutoff</option>
            <option value="Pre-Interview Screening">Pre-Interview Screening</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">College</th>
                <th className="py-3 px-4 font-semibold">Exam Score</th>
                <th className="py-3 px-4 font-semibold">Disqualification Stage</th>
                <th className="py-3 px-4 font-semibold">Mandatory Rejection Feedback</th>
                <th className="py-3 px-4 font-semibold">Decided By</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={c.photoUrl} alt={c.fullName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-xs text-foreground">{c.fullName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{c.usn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-foreground">{c.collegeName}</td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-bold text-foreground">{c.exam.score}/100</span>
                    <span className="text-[11px] text-muted-foreground block">Cutoff {c.exam.cutoff}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {c.decision?.rejectionStage || "Interview Evaluation"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs">
                    <p className="line-clamp-2">{c.decision?.reason || "Did not meet technical minimum standard."}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                    {c.decision?.decidedBy || "HR Panel"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link href={`/hr/interviews/${c.id}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Audit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
