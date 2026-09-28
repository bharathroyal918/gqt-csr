"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Video,
  Download,
  Building2,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function HoldCandidatesPage() {
  const { students } = useApp();
  const liveHold = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter((c) => c.status === "Hold");
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveHold);

  React.useEffect(() => {
    setCandidates(liveHold);
  }, [liveHold]);

  const [search, setSearch] = useState("");

  const handleMoveToSelected = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    toast.success(`${name} moved to Selected Students!`, {
      description: "Candidate is now ready for Offer preparation.",
    });
  };

  const handleMoveToRejected = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    toast.error(`${name} marked as Rejected.`, {
      description: "Candidate archived into Rejected list.",
    });
  };

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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Pending Resolution
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">On-Hold Candidates</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates requiring secondary technical interviews, academic document verifications, or pending calibration consensus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/interviews/schedule">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <Calendar className="w-4 h-4" />
              Schedule 2nd Round
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search hold candidates..."
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
                <th className="py-3 px-4 font-semibold">Follow-Up Date</th>
                <th className="py-3 px-4 font-semibold">Hold Reason</th>
                <th className="py-3 px-4 font-semibold">Interviewer</th>
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
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 dark:text-yellow-400">
                      <Clock className="w-3.5 h-3.5" />
                      {c.decision?.followUpDate || "2026-09-30"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs">
                    <p className="line-clamp-2">{c.decision?.reason || "Awaiting secondary technical review."}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                    {c.decision?.decidedBy || "Priya Nair"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/hr/interviews/${c.id}`}>
                        <Button size="sm" variant="primary" className="text-xs">
                          <Video className="w-3.5 h-3.5 mr-1" />
                          Workspace
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        onClick={() => handleMoveToSelected(c.id, c.fullName)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
                        onClick={() => handleMoveToRejected(c.id, c.fullName)}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No candidates currently on hold.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
