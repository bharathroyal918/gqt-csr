"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Download,
  Eye,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminCandidatesHubPage() {
  const { students } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [collegeFilter, setCollegeFilter] = useState("all");

  const selectedStudents = useMemo(
    () => students.filter((s) => s.status === "HR Selected" || s.status.includes("Offer")),
    [students]
  );

  const holdStudents = useMemo(
    () => students.filter((s) => s.status === "HR On Hold" || s.status === "HR Interview Scheduled"),
    [students]
  );

  const rejectedStudents = useMemo(
    () => students.filter((s) => s.status === "HR Rejected" || s.status === "Disqualified" || s.status === "Offer Rejected"),
    [students]
  );

  const colleges = useMemo(
    () => Array.from(new Set(students.map((s) => s.collegeName))).filter(Boolean),
    [students]
  );

  const filteredCandidates = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.collegeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCollege = collegeFilter === "all" || s.collegeName === collegeFilter;

      let matchesStage = true;
      if (stageFilter === "selected") {
        matchesStage = s.status === "HR Selected" || s.status.includes("Offer");
      } else if (stageFilter === "hold") {
        matchesStage = s.status === "HR On Hold" || s.status === "HR Interview Scheduled";
      } else if (stageFilter === "rejected") {
        matchesStage = s.status === "HR Rejected" || s.status === "Disqualified" || s.status === "Offer Rejected";
      } else if (stageFilter === "exam_cleared") {
        matchesStage = s.status.includes("Qualified") || s.status.includes("HR") || s.status.includes("Offer");
      }

      return matchesSearch && matchesCollege && matchesStage;
    });
  }, [students, searchTerm, collegeFilter, stageFilter]);

  const handleExportCSV = () => {
    const csv = "ID,Name,USN,College,Branch,District,Status,CGPA,ExamScore\n" +
      filteredCandidates.map(s => `"${s.studentId}","${s.fullName}","${s.usn}","${s.collegeName}","${s.branch}","${s.district}","${s.status}",${s.cgpa ?? "N/A"},${s.examResult?.marksObtained ?? "N/A"}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GQT_Candidate_Master_${Date.now()}.csv`;
    a.click();
    toast.success(`Exported ${filteredCandidates.length} candidate records`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Talent Pipelines & Decision Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Candidate Pipeline Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete centralized oversight of all student candidates across examination, shortlist, hold review, and rejection stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="border-border hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Export Candidate Roster
          </Button>
        </div>
      </div>

      {/* Stage Hub Cards with direct links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/candidates/selected" className="group">
          <Card className="border border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/20 transition-all rounded-3xl p-5 relative overflow-hidden shadow-lg hover:shadow-emerald-500/5">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Shortlisted & Hired
                </span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-3">{selectedStudents.length}</p>
                <p className="text-sm font-semibold text-foreground mt-1">Selected Candidates</p>
                <p className="text-xs text-muted-foreground mt-0.5">Cleared technical + HR interviews. Ready for offer issuance.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/candidates/hold" className="group">
          <Card className="border border-amber-500/30 bg-amber-950/10 hover:bg-amber-950/20 transition-all rounded-3xl p-5 relative overflow-hidden shadow-lg hover:shadow-amber-500/5">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5" /> Pending Review
                </span>
                <p className="text-3xl font-extrabold text-amber-400 mt-3">{holdStudents.length}</p>
                <p className="text-sm font-semibold text-foreground mt-1">On-Hold Candidates</p>
                <p className="text-xs text-muted-foreground mt-0.5">Under evaluation committee hold, re-testing, or backlog review.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/candidates/rejected" className="group">
          <Card className="border border-rose-500/30 bg-rose-950/10 hover:bg-rose-950/20 transition-all rounded-3xl p-5 relative overflow-hidden shadow-lg hover:shadow-rose-500/5">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <XCircle className="w-3.5 h-3.5" /> Compliance Archive
                </span>
                <p className="text-3xl font-extrabold text-rose-400 mt-3">{rejectedStudents.length}</p>
                <p className="text-sm font-semibold text-foreground mt-1">Rejected Candidates</p>
                <p className="text-xs text-muted-foreground mt-0.5">Disqualified or did not meet benchmark cutoff requirements.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate by full name, USN, student ID, or college..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Stages ({students.length})</option>
          <option value="selected">Selected ({selectedStudents.length})</option>
          <option value="hold">On Hold ({holdStudents.length})</option>
          <option value="rejected">Rejected ({rejectedStudents.length})</option>
        </select>

        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Partner Colleges</option>
          {colleges.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Candidate Data Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Candidate & USN</th>
                <th className="p-4">Institution & District</th>
                <th className="p-4">Department & CGPA</th>
                <th className="p-4 text-center">Exam Score</th>
                <th className="p-4 text-center">Current Status</th>
                <th className="p-4 pr-6 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No candidates match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((s) => {
                  const isSel = s.status === "HR Selected" || s.status.includes("Offer");
                  const isHld = s.status === "HR On Hold" || s.status === "HR Interview Scheduled";
                  const isRej = s.status === "HR Rejected" || s.status === "Disqualified" || s.status === "Offer Rejected";

                  const badgeClass = isSel
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : isHld
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : isRej
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20";

                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-foreground">{s.fullName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.usn} • {s.studentId}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-foreground">{s.collegeName}</div>
                        <div className="text-muted-foreground">{s.district}</div>
                      </td>
                      <td className="p-4 text-xs">
                        <div className="text-primary font-medium">{s.branch}</div>
                        <div className="text-muted-foreground">{s.cgpa != null ? `${s.cgpa} CGPA` : "CGPA Pending"} {s.percentage ? `(${s.percentage}%)` : ""}</div>
                      </td>
                      <td className="p-4 text-center font-bold text-foreground text-xs">
                        {s.examResult?.marksObtained != null ? `${s.examResult.marksObtained} / 50` : "Score Pending"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${badgeClass}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link href={`/admin/students/${s.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 px-2.5 text-xs hover:bg-primary/10 hover:text-primary gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
