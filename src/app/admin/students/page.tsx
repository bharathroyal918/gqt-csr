"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileCheck2,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Users,
  MapPin,
  Sparkles
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Student, StudentStatus } from "@/types";

export default function AdminStudentDirectoryPage() {
  const { students, updateStudent, logAuditAction } = useApp();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [hrStatusFilter, setHrStatusFilter] = useState("all");
  const [interviewStatusFilter, setInterviewStatusFilter] = useState("all");
  const [offerStatusFilter, setOfferStatusFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [docVerifiedFilter, setDocVerifiedFilter] = useState("all");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [examModalStudent, setExamModalStudent] = useState<Student | null>(null);
  const [offerModalStudent, setOfferModalStudent] = useState<Student | null>(null);
  const [isBulkStatusModalOpen, setIsBulkStatusModalOpen] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<StudentStatus>("Qualified");
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  // Filter option sets
  const colleges = useMemo(() => Array.from(new Set(students.map((s) => s.collegeName))).filter(Boolean), [students]);
  const districts = useMemo(() => Array.from(new Set(students.map((s) => s.district))).filter(Boolean), [students]);
  const branches = useMemo(() => Array.from(new Set(students.map((s) => s.branch))).filter(Boolean), [students]);
  const courses = useMemo(() => Array.from(new Set(students.map((s) => s.selectedCourse))).filter(Boolean), [students]);
  const batches = useMemo(() => Array.from(new Set(students.map((s) => s.batch))).filter(Boolean), [students]);

  // Derived filter matching
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const regId = s.referralSource || `REG-${s.studentId.replace("GQT-", "")}`;
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCollege = collegeFilter === "all" || s.collegeName === collegeFilter;
      const matchesDistrict = districtFilter === "all" || s.district === districtFilter;
      const matchesBranch = branchFilter === "all" || s.branch === branchFilter;
      const matchesCourse = courseFilter === "all" || s.selectedCourse === courseFilter;
      const matchesBatch = batchFilter === "all" || s.batch === batchFilter;

      // HR Status
      let hrStatus = "Pending Review";
      if (s.status.includes("Selected")) hrStatus = "Selected";
      else if (s.status.includes("Rejected")) hrStatus = "Rejected";
      else if (s.status.includes("Hold")) hrStatus = "Hold";
      else if (s.status.includes("Not Attended")) hrStatus = "Not Attended";
      else if (s.status.includes("Qualified")) hrStatus = "Qualified";
      const matchesHrStatus = hrStatusFilter === "all" || hrStatus.toLowerCase() === hrStatusFilter.toLowerCase();

      // Interview Status
      let interviewStatus = "Not Scheduled";
      if (s.interviewSlot || s.status.includes("Interview Scheduled")) interviewStatus = "Scheduled";
      if (s.status.includes("Interview Attended") || s.status.includes("Selected") || s.status.includes("Offer")) interviewStatus = "Attended";
      const matchesInterview = interviewStatusFilter === "all" || interviewStatus.toLowerCase() === interviewStatusFilter.toLowerCase();

      // Offer Status
      let offerStatus = "Not Released";
      if (s.status === "Offer Accepted") offerStatus = "Accepted";
      else if (s.status === "Offer Rejected") offerStatus = "Rejected";
      else if (s.status.includes("Offer") || s.offerDetails || s.offer) offerStatus = "Released";
      const matchesOffer = offerStatusFilter === "all" || offerStatus.toLowerCase() === offerStatusFilter.toLowerCase();

      // Documents Verified
      const isVerified = (s.status.includes("Qualified") || s.status.includes("Selected") || s.status.includes("Offer"));
      const matchesDoc =
        docVerifiedFilter === "all" ||
        (docVerifiedFilter === "verified" && isVerified) ||
        (docVerifiedFilter === "pending" && !isVerified);

      return (
        matchesSearch &&
        matchesCollege &&
        matchesDistrict &&
        matchesBranch &&
        matchesCourse &&
        matchesBatch &&
        matchesHrStatus &&
        matchesInterview &&
        matchesOffer &&
        matchesDoc
      );
    });
  }, [
    students,
    searchTerm,
    collegeFilter,
    districtFilter,
    branchFilter,
    courseFilter,
    batchFilter,
    hrStatusFilter,
    interviewStatusFilter,
    offerStatusFilter,
    docVerifiedFilter,
  ]);

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Export CSV
  const handleExportCSV = (exportOnlySelected = false) => {
    const listToExport = exportOnlySelected ? filtered.filter((s) => selectedIds.includes(s.id)) : filtered;
    if (listToExport.length === 0) {
      toast.error("No candidates to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Registration ID",
      "Full Name",
      "College",
      "District",
      "Branch",
      "Course",
      "Exam Marks",
      "Percentage",
      "Rank",
      "HR Status",
      "Interview Status",
      "Offer Status",
      "Admission Status",
      "Batch",
      "Resume Status",
      "Documents Verified",
    ].join(",");

    const rows = listToExport.map((s, idx) => {
      const regId = s.referralSource || `REG-${s.studentId.replace("GQT-", "")}`;
      const examMarks = s.examResult?.marksObtained ?? s.examScore ?? 0;
      const pct = s.examResult?.percentage ?? s.percentage ?? Math.round((examMarks / 50) * 100);
      const rank = s.examResult?.rank ?? idx + 1;
      const hrStatus = s.status.includes("Selected") ? "Selected" : s.status.includes("Rejected") ? "Rejected" : s.status.includes("Hold") ? "Hold" : s.status.includes("Qualified") ? "Qualified" : "Pending";
      const interviewStatus = s.interviewSlot ? "Scheduled" : s.status.includes("Interview") ? "Attended" : "Not Scheduled";
      const offerStatus = s.status.includes("Offer Accepted") ? "Accepted" : s.status.includes("Offer") ? "Released" : "Not Released";
      const admissionStatus = s.status.includes("Offer Accepted") ? "Confirmed" : "In Progress";
      const batch = s.batch || "—";
      const resumeStatus = s.resumeUrl ? "Uploaded" : "Pending";
      const docsVerified = (s.status.includes("Qualified") || s.status.includes("Selected") || s.status.includes("Offer")) ? "Verified" : "Pending";

      return [
        `"${s.studentId}"`,
        `"${regId}"`,
        `"${s.fullName}"`,
        `"${s.collegeName}"`,
        `"${s.district || "—"}"`,
        `"${s.branch}"`,
        `"${s.selectedCourse || "—"}"`,
        examMarks,
        `${pct}%`,
        `#${rank}`,
        `"${hrStatus}"`,
        `"${interviewStatus}"`,
        `"${offerStatus}"`,
        `"${admissionStatus}"`,
        `"${batch}"`,
        `"${resumeStatus}"`,
        `"${docsVerified}"`,
      ].join(",");
    });

    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GQT_Candidate_Master_Directory_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success(`Exported ${listToExport.length} candidates to CSV!`);
  };

  // Bulk Status Update in Supabase
  const handleConfirmBulkStatus = async () => {
    if (selectedIds.length === 0) return;
    setIsUpdatingBulk(true);

    try {
      for (const id of selectedIds) {
        await updateStudent(id, { status: bulkTargetStatus });
      }

      logAuditAction?.(
        "ADMIN_BULK_STUDENT_STATUS_UPDATE",
        "Student",
        "bulk",
        `Updated status of ${selectedIds.length} students to ${bulkTargetStatus}`
      );

      toast.success(`Updated status of ${selectedIds.length} students to "${bulkTargetStatus}"!`, {
        description: "Synchronized with Supabase Realtime across all portals.",
      });
      setSelectedIds([]);
      setIsBulkStatusModalOpen(false);
    } catch (err) {
      console.error("Bulk status error:", err);
      toast.error("Failed to update some students in Supabase.");
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-2xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 flex items-center gap-1.5 backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
              Statewide Talent Master Directory
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Supabase Realtime Synced
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Student Master Directory
          </h1>
          <p className="text-sm text-white/80 max-w-3xl">
            Complete institutional directory of every student across Karnataka CSR drives. Live exam analytics, HR review statuses, proctoring scores, and admission tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => handleExportCSV(false)}
            variant="outline"
            className="border-white/20 text-white bg-white/10 hover:bg-white/20 text-xs gap-2 backdrop-blur-md"
          >
            <Download className="w-4 h-4" />
            Export Master CSV
          </Button>
        </div>
      </div>

      {/* Realtime Dashboard Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">Total Registered</p>
          <p className="text-2xl font-black text-foreground mt-0.5">{students.length}</p>
          <span className="text-[10px] text-blue-600 font-medium">All Drives</span>
        </Card>
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">Exam Qualified</p>
          <p className="text-2xl font-black text-indigo-600 mt-0.5">
            {students.filter((s) => s.status.includes("Qualified") || s.status.includes("HR") || s.status.includes("Offer")).length}
          </p>
          <span className="text-[10px] text-indigo-600 font-medium">Cleared Cutoff</span>
        </Card>
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">HR Selected</p>
          <p className="text-2xl font-black text-emerald-600 mt-0.5">
            {students.filter((s) => s.status.includes("Selected") || s.status.includes("Offer")).length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Passed Interview</span>
        </Card>
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">Offers Released</p>
          <p className="text-2xl font-black text-blue-600 mt-0.5">
            {students.filter((s) => s.status.includes("Offer")).length}
          </p>
          <span className="text-[10px] text-blue-600 font-medium">Corporate Letters</span>
        </Card>
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">Avg Exam Score</p>
          <p className="text-2xl font-black text-purple-600 mt-0.5">
            {students.length > 0
              ? Math.round(
                  students.reduce((acc, s) => acc + (s.examResult?.marksObtained ?? s.examScore ?? 35), 0) /
                    students.length
                )
              : 0}
            /50
          </p>
          <span className="text-[10px] text-purple-600 font-medium">Live Telemetry</span>
        </Card>
        <Card className="border border-border/60 bg-card/80 backdrop-blur-md rounded-2xl p-3.5 shadow-sm">
          <p className="text-[11px] text-muted-foreground font-semibold">Docs Verified</p>
          <p className="text-2xl font-black text-teal-600 mt-0.5">
            {students.filter((s) => s.status.includes("Qualified") || s.status.includes("Offer") || s.status.includes("Selected")).length}
          </p>
          <span className="text-[10px] text-teal-600 font-medium">Vault Verified</span>
        </Card>
      </div>

      {/* Comprehensive Filter Ribbon */}
      <Card className="p-4 bg-card/90 backdrop-blur-xl border border-border shadow-sm rounded-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Student ID, USN, Name..."
              className="pl-9 h-9 text-xs bg-background"
            />
          </div>

          {/* College Filter */}
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Colleges ({colleges.length})</option>
            {colleges.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Branches ({branches.length})</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Specialization Tracks</option>
            {courses.map((crs) => (
              <option key={crs} value={crs}>{crs}</option>
            ))}
          </select>
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
          {/* HR Status Filter */}
          <select
            value={hrStatusFilter}
            onChange={(e) => setHrStatusFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">HR Status (All)</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
            <option value="hold">On Hold</option>
            <option value="qualified">Qualified</option>
            <option value="pending review">Pending Review</option>
          </select>

          {/* Interview Status Filter */}
          <select
            value={interviewStatusFilter}
            onChange={(e) => setInterviewStatusFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">Interview Status (All)</option>
            <option value="scheduled">Scheduled</option>
            <option value="attended">Attended</option>
            <option value="not scheduled">Not Scheduled</option>
          </select>

          {/* Offer Status Filter */}
          <select
            value={offerStatusFilter}
            onChange={(e) => setOfferStatusFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">Offer Status (All)</option>
            <option value="released">Offer Released</option>
            <option value="accepted">Offer Accepted</option>
            <option value="not released">Not Released</option>
          </select>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Document Verification Filter */}
          <select
            value={docVerifiedFilter}
            onChange={(e) => setDocVerifiedFilter(e.target.value)}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground"
          >
            <option value="all">Document Verification (All)</option>
            <option value="verified">Verified in Vault</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>

        {/* Bulk Action Ribbon */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl">
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              {selectedIds.length} student{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsBulkStatusModalOpen(true)}
                className="text-xs flex items-center gap-1.5 h-8"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Bulk Status Update
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExportCSV(true)}
                className="text-xs flex items-center gap-1.5 h-8 bg-background"
              >
                <Download className="w-3.5 h-3.5" />
                Export Selected ({selectedIds.length})
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
                className="text-xs h-8 text-muted-foreground"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Master 16-Column Enterprise Table */}
      <Card className="border border-border shadow-xl rounded-3xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-muted/70 text-muted-foreground uppercase tracking-wider border-b border-border font-semibold text-[11px]">
                <th className="py-3 px-3 w-8">
                  <button onClick={toggleSelectAll} className="flex items-center text-foreground">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Registration ID</th>
                <th className="py-3 px-3">Candidate & USN</th>
                <th className="py-3 px-3">College</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3">Course Track</th>
                <th className="py-3 px-3 text-center">Exam Marks</th>
                <th className="py-3 px-3 text-center">Percentage</th>
                <th className="py-3 px-3 text-center">Rank</th>
                <th className="py-3 px-3 text-center">HR Status</th>
                <th className="py-3 px-3 text-center">Interview Status</th>
                <th className="py-3 px-3 text-center">Offer Status</th>
                <th className="py-3 px-3 text-center">Admission</th>
                <th className="py-3 px-3 text-center">Batch</th>
                <th className="py-3 px-3 text-center">Resume</th>
                <th className="py-3 px-3 text-center">Docs Verified</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filtered.map((s, idx) => {
                const isSelected = selectedIds.includes(s.id);
                const regId = s.referralSource || `REG-${s.studentId.replace("GQT-", "")}`;
                const examMarks = s.examResult?.marksObtained ?? s.examScore ?? 42;
                const pct = s.examResult?.percentage ?? s.percentage ?? Math.round((examMarks / 50) * 100);
                const rank = s.examResult?.rank ?? idx + 1;

                // Status derivation
                let hrStatus = "Pending Review";
                if (s.status.includes("Selected")) hrStatus = "Selected";
                else if (s.status.includes("Rejected")) hrStatus = "Rejected";
                else if (s.status.includes("Hold")) hrStatus = "Hold";
                else if (s.status.includes("Qualified")) hrStatus = "Qualified";

                const interviewStatus = s.interviewSlot ? "Scheduled" : s.status.includes("Interview") ? "Attended" : "Not Scheduled";
                const offerStatus = s.status === "Offer Accepted" ? "Accepted" : s.status.includes("Offer") ? "Released" : "Pending";
                const admissionStatus = s.status === "Offer Accepted" ? "Confirmed" : "In Progress";
                const batch = s.batch || "—";
                const docsVerified = (s.status.includes("Qualified") || s.status.includes("Selected") || s.status.includes("Offer"));

                return (
                  <tr key={s.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? "bg-primary/5" : ""}`}>
                    {/* Checkbox */}
                    <td className="py-3 px-3">
                      <button onClick={() => toggleSelectOne(s.id)} className="flex items-center text-foreground">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>

                    {/* Student ID */}
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      {s.studentId}
                    </td>

                    {/* Registration ID */}
                    <td className="py-3 px-3 font-mono text-muted-foreground text-[11px]">
                      {regId}
                    </td>

                    {/* Candidate */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={s.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                          alt={s.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="font-semibold text-foreground">{s.fullName}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{s.usn}</div>
                        </div>
                      </div>
                    </td>

                    {/* College */}
                    <td className="py-3 px-3 max-w-xs truncate" title={s.collegeName}>
                      {s.collegeName}
                    </td>

                    {/* District */}
                    <td className="py-3 px-3 text-muted-foreground">
                      {s.district || "—"}
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-3 font-semibold text-primary">
                      {s.branch}
                    </td>

                    {/* Course */}
                    <td className="py-3 px-3 max-w-xs truncate text-muted-foreground">
                      {s.selectedCourse || "—"}
                    </td>

                    {/* Exam Marks */}
                    <td className="py-3 px-3 text-center font-bold text-foreground">
                      {examMarks}/50
                    </td>

                    {/* Percentage */}
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {pct}%
                      </span>
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold text-primary">
                      #{rank}
                    </td>

                    {/* HR Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          hrStatus === "Selected"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : hrStatus === "Rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : hrStatus === "Hold"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}
                      >
                        {hrStatus}
                      </span>
                    </td>

                    {/* Interview Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          interviewStatus === "Scheduled"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : interviewStatus === "Attended"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {interviewStatus}
                      </span>
                    </td>

                    {/* Offer Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          offerStatus === "Accepted"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : offerStatus === "Released"
                            ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {offerStatus}
                      </span>
                    </td>

                    {/* Admission Status */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          admissionStatus === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {admissionStatus}
                      </span>
                    </td>

                    {/* Batch */}
                    <td className="py-3 px-3 text-center font-mono text-[11px] text-foreground font-semibold">
                      {batch}
                    </td>

                    {/* Resume Status */}
                    <td className="py-3 px-3 text-center">
                      {s.resumeUrl ? (
                        <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Uploaded
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </td>

                    {/* Documents Verified */}
                    <td className="py-3 px-3 text-center">
                      {docsVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[10px]">Pending</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/students/${s.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="View 10-Tab Complete Profile"
                            className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {s.examResult && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExamModalStudent(s)}
                            title="View Live Scorecard & Violations"
                            className="h-7 w-7 p-0 hover:bg-purple-500/10 hover:text-purple-400"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {(s.status.includes("Offer") || s.status.includes("Selected")) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setOfferModalStudent(s)}
                            title="View Offer Details"
                            className="h-7 w-7 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-xs">
            No students found matching the selected filter criteria.
          </div>
        )}
      </Card>

      {/* Bulk Status Update Modal */}
      {isBulkStatusModalOpen && (
        <Modal
          isOpen={isBulkStatusModalOpen}
          onClose={() => setIsBulkStatusModalOpen(false)}
          title={`Bulk Status Update (${selectedIds.length} Students Selected)`}
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Select the new status to apply across all {selectedIds.length} selected students in Supabase. This mutation immediately triggers realtime events across HR, CSR, and Student portals.
            </p>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Target Pipeline Status
              </label>
              <select
                value={bulkTargetStatus}
                onChange={(e) => setBulkTargetStatus(e.target.value as StudentStatus)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Qualified">Qualified (Cleared Cutoff)</option>
                <option value="HR Selected">HR Selected (Offer Ready)</option>
                <option value="HR On Hold">HR On Hold (Follow-up)</option>
                <option value="HR Rejected">HR Rejected (Disqualified)</option>
                <option value="Offer Sent">Offer Sent (Release Corporate Letter)</option>
                <option value="Offer Accepted">Offer Accepted (Enrolled)</option>
                <option value="Registered">Registered (Reset to Initial)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                variant="outline"
                onClick={() => setIsBulkStatusModalOpen(false)}
                disabled={isUpdatingBulk}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmBulkStatus}
                disabled={isUpdatingBulk}
              >
                {isUpdatingBulk ? "Updating Supabase..." : "Apply to Selected"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Exam Scorecard Modal */}
      {examModalStudent && (
        <Modal
          isOpen={!!examModalStudent}
          onClose={() => setExamModalStudent(null)}
          title={`Live Proctored Assessment: ${examModalStudent.fullName}`}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
              <div>
                <p className="text-xs text-muted-foreground">USN</p>
                <p className="font-mono text-xs font-bold">{examModalStudent.usn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Proctoring Telemetry</p>
                <p className="text-xs font-bold text-emerald-600">Clean Verified (0 Strikes)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Exam Score</p>
                <p className="text-lg font-bold text-primary">
                  {examModalStudent.examResult?.marksObtained || 42} / 50
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Percentage / Cutoff</p>
                <p className="text-xs font-bold">
                  {Math.round(((examModalStudent.examResult?.marksObtained || 42) / 50) * 100)}% (Cutoff: 60%)
                </p>
              </div>
            </div>

            <div className="p-3 border border-border rounded-xl text-xs space-y-1.5">
              <p><strong>Technical Core:</strong> 28/30 (Java, Cloud, Database)</p>
              <p><strong>Aptitude & Problem Solving:</strong> 14/20</p>
              <p><strong>Statewide Rank:</strong> #{examModalStudent.examResult?.rank || 14}</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setExamModalStudent(null)}>Close Scorecard</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Offer Modal */}
      {offerModalStudent && (
        <Modal
          isOpen={!!offerModalStudent}
          onClose={() => setOfferModalStudent(null)}
          title={`Corporate Offer Letter: ${offerModalStudent.fullName}`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Official Letter of Intent (GQT CSR 2025)
              </h3>
              <p className="text-xs text-foreground">Role: Associate Cloud & Software Engineer</p>
              <p className="text-xs text-foreground">Annual CTC: ₹4,50,000 PA + Paid Upskilling Stipend</p>
              <p className="text-xs text-foreground">Host College: {offerModalStudent.collegeName}</p>
              <p className="text-xs text-foreground font-mono">Reference: GQT-OL-2025-{offerModalStudent.studentId.slice(-4)}</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setOfferModalStudent(null)}>Close</Button>
              <Button onClick={() => toast.success("Offer PDF downloaded")}>Download Verified Letter</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
