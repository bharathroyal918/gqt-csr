"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Drawer } from "@/components/common/Drawer";
import { toast } from "sonner";
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Download,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Eye,
  FileCheck2,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  ExternalLink,
  Sparkles,
  BookOpen
} from "lucide-react";
import { Student, StudentStatus } from "@/types";

export default function CSRManagerCandidatesPage() {
  const { students, drives, colleges, updateStudent } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriveId, setSelectedDriveId] = useState("all");
  const [selectedCollegeId, setSelectedCollegeId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Distinct branches for filter
  const branchList = useMemo(() => {
    const branches = new Set<string>();
    students.forEach((s) => {
      if (s.branch) branches.add(s.branch);
    });
    return Array.from(branches).sort();
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile.includes(searchTerm);

      const matchesDrive =
        selectedDriveId === "all" ||
        s.driveId === selectedDriveId ||
        s.driveName?.toLowerCase().includes(selectedDriveId.toLowerCase());

      const matchesCollege =
        selectedCollegeId === "all" ||
        s.collegeId === selectedCollegeId ||
        s.collegeName?.toLowerCase().includes(selectedCollegeId.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || s.status.toLowerCase() === selectedStatus.toLowerCase();

      const matchesBranch =
        selectedBranch === "all" || s.branch?.toLowerCase() === selectedBranch.toLowerCase();

      return matchesSearch && matchesDrive && matchesCollege && matchesStatus && matchesBranch;
    });
  }, [students, searchTerm, selectedDriveId, selectedCollegeId, selectedStatus, selectedBranch]);

  // Aggregate Funnel Metrics
  const totalRegistered = students.length;
  const examCleared = students.filter((s) => s.status.includes("Qualified") || s.status.includes("Interview") || s.status.includes("Offer") || s.status.includes("Selected")).length;
  const interviewed = students.filter((s) => s.status.includes("Interview") || s.status.includes("Offer") || s.status.includes("Selected")).length;
  const offered = students.filter((s) => s.status.includes("Offer") || s.status.includes("Selected")).length;

  // Handle direct database status update
  const handleStatusChange = async (newStatus: StudentStatus) => {
    if (!selectedStudent) return;
    setIsUpdatingStatus(true);
    try {
      const res = await updateStudent(selectedStudent.id, { status: newStatus });
      if (res.success) {
        setSelectedStudent((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success(`Candidate status updated to "${newStatus}" in database.`);
      } else {
        toast.error("Failed to update status in database", { description: res.error });
      }
    } catch (err: unknown) {
      toast.error("Error updating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // CSV Export for CSR Audit
  const exportToCSV = () => {
    const headers = [
      "Student ID",
      "Full Name",
      "USN",
      "Email",
      "Mobile",
      "College",
      "Branch",
      "CGPA",
      "Drive",
      "Status",
      "Registered At",
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.studentId || s.id}"`,
      `"${s.fullName}"`,
      `"${s.usn}"`,
      `"${s.email}"`,
      `"${s.mobile}"`,
      `"${s.collegeName}"`,
      `"${s.branch}"`,
      s.cgpa || "",
      `"${s.driveName || s.driveId}"`,
      `"${s.status}"`,
      `"${s.registeredAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `GQT_CSR_Candidates_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredStudents.length} candidate records to CSV.`);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("offer") || s.includes("selected")) {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
    if (s.includes("interview") || s.includes("qualified")) {
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
    if (s.includes("exam") || s.includes("scheduled")) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
    if (s.includes("reject") || s.includes("disqualified")) {
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Statewide Candidate Master Pipeline
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live PostgreSQL Feed
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Candidate Pipeline & Screening
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor verified candidate volumes, proctored exam clearances, recruiter interview allocations, and offer distribution across CSR drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="border-border hover:bg-muted gap-2 text-xs"
          >
            <Download className="w-4 h-4" /> Export CSV Roster
          </Button>
        </div>
      </div>

      {/* KPI Funnel Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Total Registered</p>
          <p className="text-2xl font-bold text-foreground mt-1" suppressHydrationWarning>
            {isMounted ? totalRegistered.toLocaleString() : "..."}
          </p>
          <span className="text-[10px] text-blue-400">All States & Districts</span>
        </Card>

        <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Exam Qualified</p>
          <p className="text-2xl font-bold text-purple-400 mt-1" suppressHydrationWarning>
            {isMounted ? examCleared.toLocaleString() : "..."}
          </p>
          <span className="text-[10px] text-purple-400">Cleared Proctored Cutoff</span>
        </Card>

        <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Interview Shortlisted</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1" suppressHydrationWarning>
            {isMounted ? interviewed.toLocaleString() : "..."}
          </p>
          <span className="text-[10px] text-indigo-400">Recruiter Panels Assigned</span>
        </Card>

        <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Offers Awarded</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1" suppressHydrationWarning>
            {isMounted ? offered.toLocaleString() : "..."}
          </p>
          <span className="text-[10px] text-emerald-400">CSR Placements</span>
        </Card>
      </div>

      {/* Multi-Parameter Filter Matrix */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md p-4 rounded-3xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, USN, email, mobile..."
              className="pl-10 h-10 bg-background/80"
            />
          </div>

          {/* Drive Filter */}
          <select
            suppressHydrationWarning
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
          >
            <option value="all">All CSR Drives</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id} suppressHydrationWarning>
                {d.name}
              </option>
            ))}
          </select>

          {/* College Filter */}
          <select
            suppressHydrationWarning
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
          >
            <option value="all">All Partner Colleges</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.name} suppressHydrationWarning>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            suppressHydrationWarning
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
          >
            <option value="all">All Screening Statuses</option>
            <option value="Registered">Registered</option>
            <option value="Exam Scheduled">Exam Scheduled</option>
            <option value="Qualified">Qualified / Exam Passed</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected / Offer Issued</option>
            <option value="Disqualified">Disqualified</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span suppressHydrationWarning>
            Showing{" "}
            <strong className="text-foreground" suppressHydrationWarning>
              {isMounted ? filteredStudents.length : "..."}
            </strong>{" "}
            of{" "}
            <strong suppressHydrationWarning>
              {isMounted ? students.length : "..."}
            </strong>{" "}
            candidates
          </span>
          {(searchTerm ||
            selectedDriveId !== "all" ||
            selectedCollegeId !== "all" ||
            selectedStatus !== "all" ||
            selectedBranch !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDriveId("all");
                  setSelectedCollegeId("all");
                  setSelectedStatus("all");
                  setSelectedBranch("all");
                }}
                className="text-primary hover:underline text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
        </div>
      </Card>

      {/* Candidates Table */}
      <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Candidate & USN</th>
                <th className="py-3.5 px-4">College & Branch</th>
                <th className="py-3.5 px-4">CSR Drive</th>
                <th className="py-3.5 px-4">Academic CGPA</th>
                <th className="py-3.5 px-4">Screening Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No candidates match the specified criteria</p>
                    <p className="text-[11px] mt-0.5">Try clearing your filters or search term</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                          {s.fullName ? s.fullName.charAt(0) : "S"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm leading-tight">{s.fullName}</p>
                          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                            {s.usn} • {s.mobile}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground line-clamp-1">{s.collegeName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {s.branch} • Batch {s.passingYear || "2027"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground line-clamp-1">
                        {s.driveName || s.driveId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground">{s.cgpa ? `${s.cgpa} CGPA` : "N/A"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          s.status
                        )}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(s);
                        }}
                        className="h-8 px-2 text-primary hover:bg-primary/10 gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Candidate Profile Details Drawer */}
      <Drawer
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent?.fullName || "Candidate Details"}
      >
        {selectedStudent && (
          <div className="space-y-6 pt-2 text-xs">
            {/* Header Card */}
            <div className="p-4 bg-muted/40 rounded-2xl border border-border flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#005BBB] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {selectedStudent.fullName.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-foreground">{selectedStudent.fullName}</h3>
                <p className="font-mono text-muted-foreground">
                  USN: <strong className="text-foreground">{selectedStudent.usn}</strong>
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                      selectedStudent.status
                    )}`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Contact & Personal Data
              </h4>
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address
                  </p>
                  <p className="font-semibold text-foreground truncate">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Mobile Number
                  </p>
                  <p className="font-semibold text-foreground">{selectedStudent.mobile}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">District & State</p>
                  <p className="font-semibold text-foreground">
                    {selectedStudent.district}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-semibold text-foreground">{selectedStudent.gender || "All"}</p>
                </div>
              </div>
            </div>

            {/* Academic Credentials */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Academic Qualifications
              </h4>
              <div className="space-y-2 p-3 bg-muted/20 rounded-xl border border-border/40">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground">Institution</p>
                    <p className="font-bold text-foreground">{selectedStudent.collegeName}</p>
                  </div>
                  <span className="font-mono font-bold text-primary text-sm">
                    {selectedStudent.cgpa ? `${selectedStudent.cgpa} CGPA` : "60%"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
                  <div>
                    <p className="text-muted-foreground">Branch</p>
                    <p className="font-semibold text-foreground">{selectedStudent.branch}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Graduation Year</p>
                    <p className="font-semibold text-foreground">
                      {selectedStudent.passingYear}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign & Course */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Enrolled CSR Program
              </h4>
              <div className="p-3 bg-muted/20 rounded-xl border border-border/40 space-y-1">
                <p className="text-muted-foreground">CSR Campaign</p>
                <p className="font-bold text-foreground">
                  {selectedStudent.driveName || selectedStudent.driveId}
                </p>
                {selectedStudent.selectedCourse && (
                  <p className="text-muted-foreground pt-1">
                    Course:{" "}
                    <strong className="text-foreground">{selectedStudent.selectedCourse}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Status Control (Writes Directly to Database) */}
            <div className="space-y-2 pt-2 border-t border-border">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Manager Screening Decision
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  disabled={isUpdatingStatus || selectedStudent.status === "Qualified"}
                  onClick={() => handleStatusChange("Qualified")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Qualify Candidate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdatingStatus || selectedStudent.status === "Disqualified"}
                  onClick={() => handleStatusChange("Disqualified")}
                  className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 gap-1 text-xs"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Disqualify
                </Button>
                <Button
                  size="sm"
                  disabled={isUpdatingStatus || selectedStudent.status === "HR Interview Scheduled"}
                  onClick={() => handleStatusChange("HR Interview Scheduled")}
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs"
                >
                  <Users className="w-3.5 h-3.5" /> Slot for Interview
                </Button>
                <Button
                  size="sm"
                  disabled={isUpdatingStatus || selectedStudent.status === "HR Selected"}
                  onClick={() => handleStatusChange("HR Selected")}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs"
                >
                  <Award className="w-3.5 h-3.5" /> Issue Offer
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
