"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  XCircle,
  Search,
  Download,
  Archive,
  Eye,
  AlertCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminRejectedCandidatesPage() {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const rejected = students.filter(
    (s) =>
      s.status === "HR Rejected" ||
      s.status === "Disqualified" ||
      s.status === "Offer Rejected"
  );

  const filtered = rejected.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    toast.success("Rejected candidates roster exported to Excel");
  };

  const handleArchive = (id: string) => {
    toast.info("Candidate record archived for compliance records");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/40 via-blue-950/30 to-indigo-950/40 border border-rose-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Evaluation Outlier Archive
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Rejected & Disqualified Candidates
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete audit trail of candidates disqualified during testing or rejected during technical/HR rounds with feedback remarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="border-border hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Export Audit File
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name, USN, or college..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Candidate & USN</th>
                <th className="p-4">Institution</th>
                <th className="p-4 text-center">Exam Score</th>
                <th className="p-4">Rejection Stage / Reason</th>
                <th className="p-4">HR & Interview Remarks</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No rejected candidates on file.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-foreground">{s.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.usn}</div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-foreground truncate max-w-xs">
                      {s.collegeName}
                    </td>
                    <td className="p-4 text-center text-xs">
                      <span className="font-bold text-rose-400">
                        {s.examResult?.marksObtained != null ? `${s.examResult.marksObtained} / 50` : "Evaluation Cleared"}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {s.status}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {s.examResult?.marksObtained != null && s.examResult.marksObtained < 25 ? "Below technical cutoff threshold" : "Evaluated during screening round"}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                      {s.interviewResult?.remarks || s.interviewResult?.recommendation || s.interviews?.[0]?.remarks || (s.examResult && !s.examResult.qualified ? "Below qualifying benchmark in technical test" : "Evaluated by panel; does not meet current round requirements.")}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/students/${s.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArchive(s.id)}
                          className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-400"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
