"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Video,
  CheckCircle2,
  XCircle,
  Building2
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function PendingReviewPage() {
  const { students } = useApp();
  const livePending = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter(
      (c) => c.status === "Qualified" || (c.status as string) === "Under Review" || (c as any).exam?.violationsCount > 0
    );
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(livePending);

  React.useEffect(() => {
    setCandidates(livePending);
  }, [livePending]);

  const [search, setSearch] = useState("");

  const filtered = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.usn.toLowerCase().includes(search.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
            Audit & Decision Pipeline
          </span>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1">Pending Candidate Review</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates awaiting HR evaluation clearance, flagged proctoring review, or manual score confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/candidates/qualified">
            <Button variant="cyan" className="text-xs">
              Go to Qualified Queue
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pending reviews by name, USN, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">College</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Proctoring Telemetry</th>
                <th className="py-3 px-4 font-semibold">Review Reason</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={c.photoUrl} alt={c.fullName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-foreground text-xs">{c.fullName}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{c.usn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-foreground">{c.collegeName}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-xs text-foreground">{c.exam.score}/100</span>
                    <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">({c.exam.percentage}%)</span>
                  </td>
                  <td className="py-3 px-4">
                    {c.exam.violationsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {c.exam.violationsCount} Flagged
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-medium">Zero Violations</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {c.exam.violationsCount > 0 ? "Proctoring telemetry audit required" : "Awaiting interview scheduling"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link href={`/hr/interviews/${c.id}`}>
                      <Button size="sm" variant="primary" className="text-xs">
                        Open Workspace
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
