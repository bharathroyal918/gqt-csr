"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Building2,
  Calendar,
  FileCheck2,
  Video,
  Award,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface AuditHistoryEntry {
  id: string;
  candidateName: string;
  candidateUsn: string;
  collegeName: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  type: "info" | "success" | "warning" | "danger";
}

const SAMPLE_HISTORY_LOGS: AuditHistoryEntry[] = [
  {
    id: "hist-01",
    candidateName: "Aditya V. Kashyap",
    candidateUsn: "1RV22CS014",
    collegeName: "R.V. College of Engineering",
    timestamp: "2026-09-24 11:25:00",
    action: "CANDIDATE_SELECTED",
    actor: "Priya Nair (HR Lead)",
    details: "Marked candidate as Selected with 8.8 composite rubric score. Recommended package ₹ 6.5 LPA.",
    type: "success",
  },
  {
    id: "hist-02",
    candidateName: "Aditya V. Kashyap",
    candidateUsn: "1RV22CS014",
    collegeName: "R.V. College of Engineering",
    timestamp: "2026-09-24 10:30:00",
    action: "INTERVIEW_STARTED",
    actor: "Priya Nair & Lead Tech Panel",
    details: "Virtual Google Meet session initiated. Proctored video identity check verified.",
    type: "info",
  },
  {
    id: "hist-03",
    candidateName: "Rohan Gowda",
    candidateUsn: "1SI22CS132",
    collegeName: "SIT Tumakuru",
    timestamp: "2026-09-24 12:00:00",
    action: "CANDIDATE_REJECTED",
    actor: "Arun Menon (Technical Panel)",
    details: "Disqualified after Technical Round 1. Scored 3.5/10 on algorithmic depth and OOP fundamentals.",
    type: "danger",
  },
  {
    id: "hist-04",
    candidateName: "Nikhil B. Patil",
    candidateUsn: "2BL22CS045",
    collegeName: "BLDEA CET Vijayapura",
    timestamp: "2026-09-24 09:55:00",
    action: "CANDIDATE_NOT_ATTENDED",
    actor: "Priya Nair (HR)",
    details: "Candidate did not join scheduled 09:00 AM interview slot. Reschedule requested due to power grid outage.",
    type: "warning",
  },
  {
    id: "hist-05",
    candidateName: "Pooja Hegde",
    candidateUsn: "4NI22CS078",
    collegeName: "NIE Mysuru",
    timestamp: "2026-09-23 16:00:00",
    action: "CANDIDATE_PLACED_ON_HOLD",
    actor: "Priya Nair (HR)",
    details: "Placed on hold pending secondary technical review on SQL concurrency scheduled for Sep 30.",
    type: "warning",
  },
  {
    id: "hist-06",
    candidateName: "Sneha Ramachandra Rao",
    candidateUsn: "1BM22IS089",
    collegeName: "BMS College of Engineering",
    timestamp: "2026-09-20 10:45:00",
    action: "EXAM_QUALIFIED",
    actor: "Evaluation Engine (Automatic)",
    details: "Scored 91/100 (Statewide Rank #5, 99.2th percentile). Passed cutoff of 50%. Clean proctoring verified.",
    type: "success",
  },
];

export default function CandidateHistoryPage() {
  const { auditLogs, students } = useApp();

  const dynamicLogs = React.useMemo(() => {
    const list: AuditHistoryEntry[] = [];
    // Include student event transitions
    students.forEach((s) => {
      list.push({
        id: `reg-${s.id}`,
        candidateName: s.fullName,
        candidateUsn: s.usn || "N/A",
        collegeName: s.collegeName || "Institution",
        timestamp: s.registeredAt || new Date().toISOString(),
        action: `CANDIDATE_${s.status.toUpperCase().replace(/\s+/g, "_")}`,
        actor: "Admissions Engine (Live DB)",
        details: `Student profile synchronized with status "${s.status}" for ${s.driveName || "CSR 2026 Drive"}.`,
        type: (s.status.includes("Selected") || s.status.includes("Offer")) ? "success" : (s.status.includes("Reject") || s.status.includes("Disqualified")) ? "danger" : "info",
      });
    });

    // Merge system audit logs
    auditLogs.forEach((a) => {
      list.push({
        id: a.id,
        candidateName: a.entityType || "System Entity",
        candidateUsn: "N/A",
        collegeName: "System",
        timestamp: a.timestamp,
        action: a.action,
        actor: `${a.user} (${a.userRole})`,
        details: a.details,
        type: a.action.includes("DELETE") || a.action.includes("REJECT") ? "danger" : "info",
      });
    });

    return list.length > 0 ? list : SAMPLE_HISTORY_LOGS;
  }, [auditLogs, students]);

  const [logs, setLogs] = useState<AuditHistoryEntry[]>(dynamicLogs);

  React.useEffect(() => {
    setLogs(dynamicLogs);
  }, [dynamicLogs]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      log.candidateUsn.toLowerCase().includes(search.toLowerCase()) ||
      log.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Forensic Audit & Event Ledger
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Candidate Lifecycle Audit Trail</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Immutable log of all recruiter actions, evaluation scores, attendance events, status transitions, and offer dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() => toast.success("Exported cryptographic audit ledger to CSV")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Audit Ledger
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audit trail by candidate, USN, actor, or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-60 py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Event Types</option>
            <option value="success">Success / Selections</option>
            <option value="warning">Warnings / Holds / Absences</option>
            <option value="danger">Rejections / Disqualifications</option>
            <option value="info">Informational Operations</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Actor / Authority</th>
                <th className="py-3 px-4 font-semibold">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-xs text-foreground">{log.candidateName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{log.candidateUsn}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        log.type === "success"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : log.type === "danger"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : log.type === "warning"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-md">
                    {log.details}
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
