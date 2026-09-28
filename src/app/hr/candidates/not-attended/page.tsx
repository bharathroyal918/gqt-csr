"use client";

import React, { useState } from "react";
import {
  Clock,
  RotateCcw,
  Search,
  Calendar,
  Building2,
  AlertTriangle,
  Download,
  Video,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function NotAttendedCandidatesPage() {
  const { students } = useApp();
  const liveNotAttended = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter((c) => c.status === "Not Attended");
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveNotAttended);

  React.useEffect(() => {
    setCandidates(liveNotAttended);
  }, [liveNotAttended]);

  const [search, setSearch] = useState("");
  const [reschedulingCandidate, setReschedulingCandidate] = useState<CandidateFullProfile | null>(null);
  const [newDate, setNewDate] = useState("2026-09-28");
  const [newTime, setNewTime] = useState("11:30 AM - 12:15 PM");

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingCandidate) return;

    setCandidates((prev) => prev.filter((c) => c.id !== reschedulingCandidate.id));
    toast.success(`Rescheduled interview for ${reschedulingCandidate.fullName}!`, {
      description: `New slot confirmed for ${newDate} at ${newTime}. Notification dispatched to candidate.`,
    });
    setReschedulingCandidate(null);
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Absence Tracking & Rescheduling
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Not Attended Candidates</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates who were absent during their scheduled technical interview window. Review reported outage reasons and reschedule slots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => toast.success("Exported absentee roster")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Absentees
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search absent candidates..."
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
                <th className="py-3 px-4 font-semibold">Missed Slot</th>
                <th className="py-3 px-4 font-semibold">Reported Absence Reason</th>
                <th className="py-3 px-4 font-semibold">Logged By</th>
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
                    <span className="font-semibold text-foreground">{c.interviewSlot?.date || "—"}</span>
                    <span className="text-[11px] text-muted-foreground block">{c.interviewSlot?.time || "—"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-xs">
                    <p className="line-clamp-2">{c.decision?.reason || "Candidate did not attend scheduled interview."}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                    {c.decision?.decidedBy || "HR Panel"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs"
                        onClick={() => setReschedulingCandidate(c)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Reschedule
                      </Button>
                      <Link href={`/hr/interviews/${c.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Profile
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No candidates flagged as not attended.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reschedule Modal */}
      {reschedulingCandidate && (
        <Modal
          isOpen={!!reschedulingCandidate}
          onClose={() => setReschedulingCandidate(null)}
          title={`Reschedule Slot: ${reschedulingCandidate.fullName}`}
        >
          <form onSubmit={handleConfirmReschedule} className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Assign a new interview window for <strong>{reschedulingCandidate.fullName}</strong>. An email and WhatsApp notification with the updated meeting link will be sent automatically.
            </p>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">New Interview Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">New Time Slot</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                placeholder="e.g. 11:30 AM - 12:15 PM"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setReschedulingCandidate(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm & Re-dispatch
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
