"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Award,
  Calendar,
  Building2,
  ChevronRight,
  ExternalLink,
  Plus,
  Download,
  Video,
  FileCheck2,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  ListFilter,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

export default function HRCandidatesHubPage() {
  const { drives, students } = useApp();
  const liveCandidates = React.useMemo(() => getLiveCandidateProfiles(students), [students]);
  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveCandidates);

  React.useEffect(() => {
    if (liveCandidates.length > 0) {
      setCandidates(liveCandidates);
    }
  }, [liveCandidates]);

  const [selectedDrive, setSelectedDrive] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStage, setActiveStage] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("table");

  // KPI calculations
  const totalCount = candidates.length;
  const qualifiedCount = candidates.filter((c) => c.status === "Qualified").length;
  const scheduledCount = candidates.filter((c) => c.status === "Interview Scheduled").length;
  const selectedCount = candidates.filter((c) => c.status === "Selected").length;
  const holdCount = candidates.filter((c) => c.status === "Hold").length;
  const rejectedCount = candidates.filter((c) => c.status === "Rejected").length;
  const notAttendedCount = candidates.filter((c) => c.status === "Not Attended").length;
  const offerPendingCount = candidates.filter((c) => c.status === "Selected" && (!c.offerData || c.offerData.offerStatus === "Draft Offer" || c.offerData.offerStatus === "Pending Offer")).length;

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = activeStage === "all" || c.status.toLowerCase() === activeStage.toLowerCase();
    const matchesDrive = selectedDrive === "all" || c.driveId === selectedDrive;

    return matchesSearch && matchesStage && matchesDrive;
  });

  const stagesList = [
    { key: "all", label: "All Candidates", count: totalCount, color: "border-slate-300 text-slate-700 bg-slate-50" },
    { key: "Qualified", label: "Qualified (Exam)", count: qualifiedCount, color: "border-blue-300 text-blue-700 bg-blue-50" },
    { key: "Interview Scheduled", label: "Scheduled", count: scheduledCount, color: "border-amber-300 text-amber-700 bg-amber-50" },
    { key: "Selected", label: "Selected", count: selectedCount, color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
    { key: "Hold", label: "On Hold", count: holdCount, color: "border-yellow-300 text-yellow-700 bg-yellow-50" },
    { key: "Rejected", label: "Rejected", count: rejectedCount, color: "border-rose-300 text-rose-700 bg-rose-50" },
    { key: "Not Attended", label: "Not Attended", count: notAttendedCount, color: "border-purple-300 text-purple-700 bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Recruitment Lifecycle Pipeline
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Realtime Sync
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Candidate Master Pipeline</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Central recruitment command for screening exam-qualified students, conducting technical panel interviews, managing decisions, and issuing official GQT offer letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/hr/candidates/qualified">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <Sparkles className="w-4 h-4" />
              Qualified Queue ({qualifiedCount})
            </Button>
          </Link>
          <Link href="/hr/interviews/schedule">
            <Button variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Calendar className="w-4 h-4" />
              Auto-Scheduler
            </Button>
          </Link>
          <Link href="/hr/candidates/offer-queue">
            <Button variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Award className="w-4 h-4" />
              Offer Queue ({offerPendingCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          onClick={() => setActiveStage("all")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "all" ? "ring-2 ring-[#005BBB] border-[#005BBB]" : "hover:border-primary/40"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold">Total Roster</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          <span className="text-[10px] text-muted-foreground">All applicants</span>
        </div>

        <div
          onClick={() => setActiveStage("Qualified")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Qualified" ? "ring-2 ring-blue-500 border-blue-500" : "hover:border-blue-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Qualified</span>
            <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{qualifiedCount}</p>
          <span className="text-[10px] text-muted-foreground">Passed Exam Cutoff</span>
        </div>

        <div
          onClick={() => setActiveStage("Interview Scheduled")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Interview Scheduled" ? "ring-2 ring-amber-500 border-amber-500" : "hover:border-amber-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Scheduled</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{scheduledCount}</p>
          <span className="text-[10px] text-muted-foreground">Interviews slotted</span>
        </div>

        <div
          onClick={() => setActiveStage("Selected")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Selected" ? "ring-2 ring-emerald-500 border-emerald-500" : "hover:border-emerald-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Selected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Ready for LOI</span>
        </div>

        <div
          onClick={() => setActiveStage("Hold")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Hold" ? "ring-2 ring-yellow-500 border-yellow-500" : "hover:border-yellow-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">On Hold</span>
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{holdCount}</p>
          <span className="text-[10px] text-muted-foreground">Review pending</span>
        </div>

        <div
          onClick={() => setActiveStage("Rejected")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Rejected" ? "ring-2 ring-rose-500 border-rose-500" : "hover:border-rose-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{rejectedCount}</p>
          <span className="text-[10px] text-muted-foreground">Below criteria</span>
        </div>

        <div
          onClick={() => setActiveStage("Not Attended")}
          className={`cursor-pointer p-3.5 bg-card border rounded-xl transition-all shadow-sm ${
            activeStage === "Not Attended" ? "ring-2 ring-purple-500 border-purple-500" : "hover:border-purple-400"
          }`}
        >
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Not Attended</span>
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{notAttendedCount}</p>
          <span className="text-[10px] text-muted-foreground">Absent candidate</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-card border shadow-sm rounded-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Candidate Name, USN, ID, or College..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="w-full sm:w-64">
              <select
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
                className="w-full py-2 px-3 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All CSR Drives</option>
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden bg-background">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "table" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === "kanban" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Kanban
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
              onClick={() => {
                toast.success("Candidate export generated (CSV / Excel format)");
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stage Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-border mt-3 scrollbar-none">
          {stagesList.map((st) => (
            <button
              key={st.key}
              onClick={() => setActiveStage(st.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeStage === st.key
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{st.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeStage === st.key ? "bg-white/20 text-white" : "bg-background text-foreground"
                }`}
              >
                {st.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Content View (Table or Kanban) */}
      {viewMode === "table" ? (
        <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                  <th className="py-3 px-4 font-semibold">Candidate Profile</th>
                  <th className="py-3 px-4 font-semibold">College & Degree</th>
                  <th className="py-3 px-4 font-semibold">Assessment Score</th>
                  <th className="py-3 px-4 font-semibold">Rank & Percentile</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Interview / Panel</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/30 transition-colors">
                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.photoUrl}
                          alt={candidate.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-border shadow-sm"
                        />
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            {candidate.fullName}
                            {candidate.exam.violationsCount === 0 && (
                              <span title="Clean Proctoring" className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{candidate.studentId}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">{candidate.usn}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* College & Degree */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-foreground line-clamp-1">{candidate.collegeName}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {candidate.branch} ({candidate.selectedCourse})
                      </div>
                    </td>

                    {/* Exam Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{candidate.exam.score}/100</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                          {candidate.exam.percentage}%
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Cutoff: {candidate.exam.cutoff}%</span>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground text-xs">State #{candidate.exam.statewideRank}</div>
                      <div className="text-[11px] text-muted-foreground">College #{candidate.exam.collegeRank} • {candidate.exam.percentile}th %ile</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          candidate.status === "Selected"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : candidate.status === "Qualified"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : candidate.status === "Interview Scheduled"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : candidate.status === "Hold"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                            : candidate.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </td>

                    {/* Interview / Panel */}
                    <td className="py-3.5 px-4 text-xs">
                      {candidate.interviewSlot ? (
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {candidate.interviewSlot.date} ({candidate.interviewSlot.time.split("-")[0].trim()})
                          </div>
                          <div className="text-muted-foreground text-[11px]">
                            {candidate.interviewSlot.panelMembers[0] || "Assigned Panel"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">No slot scheduled</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/hr/interviews/${candidate.id}`}>
                          <Button size="sm" variant="primary" className="text-xs flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" />
                            Live Workspace
                          </Button>
                        </Link>
                        {candidate.status === "Selected" && (
                          <Link href={`/hr/candidates/offer-queue?studentId=${candidate.id}`}>
                            <Button size="sm" variant="outline" className="text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                              Offer
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Qualified", "Interview Scheduled", "Hold", "Selected"].map((columnStage) => {
            const colCandidates = candidates.filter((c) => c.status === columnStage);
            return (
              <div key={columnStage} className="bg-muted/40 border border-border rounded-xl p-3 flex flex-col min-h-[420px]">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-foreground">{columnStage}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-background border border-border text-foreground">
                      {colCandidates.length}
                    </span>
                  </div>
                  {columnStage === "Qualified" && (
                    <Link href="/hr/candidates/qualified">
                      <span className="text-[11px] text-primary hover:underline">View All</span>
                    </Link>
                  )}
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colCandidates.map((c) => (
                    <Card key={c.id} className="p-3 bg-card border border-border shadow-sm rounded-lg hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-2.5 mb-2">
                        <img src={c.photoUrl} alt={c.fullName} className="w-8 h-8 rounded-full object-cover" />
                        <div className="overflow-hidden">
                          <p className="font-semibold text-xs text-foreground truncate">{c.fullName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{c.usn} • {c.collegeName.split(" ")[0]}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] py-1 border-t border-border mt-1">
                        <span className="text-muted-foreground">Exam:</span>
                        <span className="font-bold text-foreground">{c.exam.score}/100 ({c.exam.percentage}%)</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] py-1 border-b border-border mb-2">
                        <span className="text-muted-foreground">State Rank:</span>
                        <span className="font-bold text-primary">#{c.exam.statewideRank}</span>
                      </div>

                      <Link href={`/hr/interviews/${c.id}`} className="block">
                        <Button size="sm" variant="outline" className="w-full text-[11px] py-1 h-7">
                          Open Workspace
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </Card>
                  ))}

                  {colCandidates.length === 0 && (
                    <div className="text-center py-10 text-xs text-muted-foreground">
                      No candidates in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
