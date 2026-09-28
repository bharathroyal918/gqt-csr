"use client";

import React, { useState } from "react";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Building2,
  Briefcase
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function SelectedCandidatesPage() {
  const { students } = useApp();
  const liveSelected = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter((c) => c.status === "Selected" || c.status === "Offer Sent" || c.status === "Offer Accepted");
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveSelected);

  React.useEffect(() => {
    setCandidates(liveSelected);
  }, [liveSelected]);

  const [search, setSearch] = useState("");

  const totalSelected = candidates.length;
  const offerPending = candidates.filter(
    (c) => !c.offerData || c.offerData.offerStatus === "Pending Offer" || c.offerData.offerStatus === "Draft Offer"
  ).length;
  const offerSent = candidates.filter((c) => c.offerData?.offerStatus === "Offer Sent").length;
  const offerAccepted = candidates.filter((c) => c.offerData?.offerStatus === "Accepted").length;

  const filtered = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.usn.toLowerCase().includes(search.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Selection Roster & Offer Generation
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Selected Students Directory</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates who cleared both online assessment cutoff and technical panel evaluation. Ready for GQT Letter of Intent (LOI) offer issuance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/candidates/offer-queue">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <Award className="w-4 h-4" />
              Open Offer Preparation Queue
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => toast.success("Selected candidate roster exported to Excel")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Total Selected</span>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">{totalSelected}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Approved by Panels</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Offer Pending</span>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">{offerPending}</p>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting LOI issuance</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Offers Dispatched</span>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">{offerSent}</p>
          <span className="text-[10px] text-blue-600 font-medium">Digital LOI released</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Offers Accepted</span>
          <p className="text-2xl font-bold text-primary mt-0.5">{offerAccepted}</p>
          <span className="text-[10px] text-primary font-medium">Confirmed for joining</span>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search selected students by name, USN, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Selected Table */}
      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">College & Branch</th>
                <th className="py-3 px-4 font-semibold">Exam Score</th>
                <th className="py-3 px-4 font-semibold">Interview Rating</th>
                <th className="py-3 px-4 font-semibold">Assigned HR</th>
                <th className="py-3 px-4 font-semibold">Joining Batch</th>
                <th className="py-3 px-4 font-semibold">Offer Status</th>
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
                  <td className="py-3.5 px-4">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">{c.collegeName}</p>
                    <p className="text-[11px] text-muted-foreground">{c.branch}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-xs text-foreground">{c.exam.score}/100</span>
                    <span className="text-[11px] text-muted-foreground ml-1">({c.exam.percentage}%)</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {c.technicalEvaluation?.overallScore ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {c.technicalEvaluation.overallScore}/10
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-foreground">
                    {c.interviewSlot?.hrExecutive || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground">
                    {c.offerData?.batch || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {c.offerData?.offerStatus || "Pending Offer"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/hr/candidates/offer-queue?studentId=${c.id}`}>
                        <Button size="sm" variant="primary" className="text-xs">
                          Prepare Offer
                        </Button>
                      </Link>
                      <Link href={`/hr/interviews/${c.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Profile
                        </Button>
                      </Link>
                    </div>
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
