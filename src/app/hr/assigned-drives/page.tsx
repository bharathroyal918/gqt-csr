"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Building2,
  Users,
  Award,
  FileCheck2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  X,
  PhoneCall,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface AssignedDrive {
  id: string;
  name: string;
  driveCode: string;
  academicYear: string;
  registrationStatus: "Open" | "Closing Soon" | "Closed";
  examStatus: "Published" | "In Progress" | "Completed";
  registeredCount: number;
  qualifiedCount: number;
  selectedCount: number;
  pendingReviewCount: number;
  collegesCount: number;
  regStart: string;
  regEnd: string;
  examDate: string;
  interviewDate: string;
  courses: string[];
}

const INITIAL_ASSIGNED_DRIVES: AssignedDrive[] = [
  {
    id: "DRV-2026-001",
    name: "CSR Flagship Campus Drive 2026",
    driveCode: "GQT-CSR-2026-01",
    academicYear: "2025-2026",
    registrationStatus: "Closing Soon",
    examStatus: "In Progress",
    registeredCount: 840,
    qualifiedCount: 382,
    selectedCount: 36,
    pendingReviewCount: 8,
    collegesCount: 3,
    regStart: "2026-09-01",
    regEnd: "2026-09-25",
    examDate: "2026-09-26",
    interviewDate: "2026-09-28",
    courses: ["Agentic AI Java Full Stack", "Software Testing Full Stack"],
  },
  {
    id: "DRV-2026-002",
    name: "Women in Tech Empowerment Drive",
    driveCode: "GQT-CSR-2026-02",
    academicYear: "2025-2026",
    registrationStatus: "Open",
    examStatus: "Published",
    registeredCount: 420,
    qualifiedCount: 194,
    selectedCount: 12,
    pendingReviewCount: 4,
    collegesCount: 2,
    regStart: "2026-09-10",
    regEnd: "2026-10-05",
    examDate: "2026-10-08",
    interviewDate: "2026-10-12",
    courses: ["Agentic AI Python Full Stack", "Data Analytics"],
  },
  {
    id: "DRV-2026-003",
    name: "Rural Talent Outreach Drive 2026",
    driveCode: "GQT-CSR-2026-03",
    academicYear: "2025-2026",
    registrationStatus: "Open",
    examStatus: "Published",
    registeredCount: 260,
    qualifiedCount: 96,
    selectedCount: 0,
    pendingReviewCount: 2,
    collegesCount: 2,
    regStart: "2026-09-15",
    regEnd: "2026-10-15",
    examDate: "2026-10-20",
    interviewDate: "2026-10-25",
    courses: ["Agentic AI MERN Full Stack", "Data Science"],
  },
];

export default function HRAssignedDrivesPage() {
  const { drives } = useApp();
  const [assignedDrives, setAssignedDrives] = useState<AssignedDrive[]>(INITIAL_ASSIGNED_DRIVES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriveForWorkspace, setSelectedDriveForWorkspace] = useState<AssignedDrive | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<
    "Overview" | "Students" | "CRM" | "Exam Review" | "Interview" | "Offer Letters" | "Reports" | "Timeline"
  >("Overview");

  const filteredDrives = assignedDrives.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driveCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.academicYear.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Allocated CSR Operations
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">My Assigned CSR Drives</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Monitor drives under your direct recruitment jurisdiction. Access candidate pools, calibrate interview panels, and issue employment LOIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/exam-review">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <FileCheck2 className="w-4 h-4" />
              Pending Evaluations
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Drive Name, Code, or Academic Year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Total Assigned: </span>
            <strong className="text-slate-900 font-bold">{assignedDrives.length} Drives</strong>
          </div>
        </div>
      </Card>

      {/* Table of Assigned Drives */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">CSR Drive Name</th>
                <th className="py-3 px-3">Academic Year</th>
                <th className="py-3 px-3">Registration Status</th>
                <th className="py-3 px-3">Exam Status</th>
                <th className="py-3 px-3 text-center">Registered</th>
                <th className="py-3 px-3 text-center">Qualified</th>
                <th className="py-3 px-3 text-center">Selected</th>
                <th className="py-3 px-3 text-center">Pending Review</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#005BBB] shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 hover:text-[#005BBB] cursor-pointer" onClick={() => setSelectedDriveForWorkspace(drive)}>
                          {drive.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">{drive.driveCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-600">
                    {drive.academicYear}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drive.registrationStatus === "Open"
                          ? "bg-emerald-100 text-emerald-800"
                          : drive.registrationStatus === "Closing Soon"
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {drive.registrationStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        drive.examStatus === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {drive.examStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                    {drive.registeredCount}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-teal-600">
                    {drive.qualifiedCount}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                    {drive.selectedCount}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        drive.pendingReviewCount > 0
                          ? "bg-rose-100 text-rose-700 font-bold"
                          : "text-slate-400"
                      }`}
                    >
                      {drive.pendingReviewCount}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="cyan"
                      size="sm"
                      className="text-xs h-7 px-2.5"
                      onClick={() => setSelectedDriveForWorkspace(drive)}
                    >
                      Open Workspace
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drive Workspace Modal / Drawer */}
      {selectedDriveForWorkspace && (
        <Modal
          isOpen={!!selectedDriveForWorkspace}
          onClose={() => setSelectedDriveForWorkspace(null)}
          title={`Drive Workspace: ${selectedDriveForWorkspace.name}`}
          subtitle={`${selectedDriveForWorkspace.driveCode} • Academic Year ${selectedDriveForWorkspace.academicYear}`}
          size="xl"
        >
          <div className="space-y-4">
            {/* Workspace Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
              {(
                [
                  "Overview",
                  "Students",
                  "CRM",
                  "Exam Review",
                  "Interview",
                  "Offer Letters",
                  "Reports",
                  "Timeline",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setWorkspaceTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    workspaceTab === tab
                      ? "bg-[#005BBB] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Workspace Tab Contents */}
            {workspaceTab === "Overview" && (
              <div className="space-y-4 text-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Registered Students</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">{selectedDriveForWorkspace.registeredCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Qualified</span>
                    <p className="text-xl font-bold text-teal-600 mt-1">{selectedDriveForWorkspace.qualifiedCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Selected in Interview</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{selectedDriveForWorkspace.selectedCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500">Awaiting HR Review</span>
                    <p className="text-xl font-bold text-rose-600 mt-1">{selectedDriveForWorkspace.pendingReviewCount}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Drive Schedule</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-500">Registration Period:</span>
                      <p className="font-semibold text-slate-800">{selectedDriveForWorkspace.regStart} → {selectedDriveForWorkspace.regEnd}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Assessment Date:</span>
                      <p className="font-semibold text-slate-800">{selectedDriveForWorkspace.examDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Interview Window:</span>
                      <p className="font-semibold text-slate-800">{selectedDriveForWorkspace.interviewDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Colleges Attached:</span>
                      <p className="font-semibold text-slate-800">{selectedDriveForWorkspace.collegesCount} Institutions</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Enrolled GQT Curriculum Tracks</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriveForWorkspace.courses.map((c, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {workspaceTab === "Students" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Enrolled Student Pool for this Drive</span>
                  <Link href="/hr/students">
                    <Button variant="outline" size="sm" className="text-xs">
                      Open Full Candidate Directory
                    </Button>
                  </Link>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <p>Displaying top candidates registered under {selectedDriveForWorkspace.name}:</p>
                  <ul className="mt-2 space-y-1.5 list-disc list-inside">
                    <li>Rahul Verma — RVCE (Score: 94% • Qualified)</li>
                    <li>Pooja Kulkarni — BMSCE (Score: 91% • Qualified)</li>
                    <li>Siddharth S — PESIT (Score: 88% • Qualified)</li>
                    <li>Deepa Joshi — NIE Mysore (Score: 85% • Qualified)</li>
                  </ul>
                </div>
              </div>
            )}

            {workspaceTab === "CRM" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Institutional Outreach Timeline</span>
                  <Link href="/hr/crm">
                    <Button variant="cyan" size="sm" className="text-xs">
                      Log New Call
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-600">
                  3 placement officers contacted this week. Hall booking confirmation pending with BMSCE.
                </p>
              </div>
            )}

            {workspaceTab === "Exam Review" && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-amber-900">8 Candidates in Pending Review Queue</h4>
                    <p className="text-amber-800">Auto-grading finished. Human verification needed on coding tests and webcam proctoring flags.</p>
                  </div>
                  <Link href="/hr/exam-review">
                    <Button variant="cyan" size="sm">
                      Review Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {workspaceTab === "Interview" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">Technical rounds scheduled for this drive starting {selectedDriveForWorkspace.interviewDate}.</p>
                <Link href="/hr/interviews">
                  <Button variant="primary" size="sm">
                    Open Interview Scheduler
                  </Button>
                </Link>
              </div>
            )}

            {workspaceTab === "Offer Letters" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">{selectedDriveForWorkspace.selectedCount} candidates approved for offer letter issuance.</p>
                <Link href="/hr/offer-letters">
                  <Button variant="cyan" size="sm">
                    Generate Offer Letters
                  </Button>
                </Link>
              </div>
            )}

            {workspaceTab === "Reports" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">Download executive census reports, scorecard summaries, and college qualification stats.</p>
                <Link href="/hr/reports">
                  <Button variant="outline" size="sm">
                    Go to Reports Center
                  </Button>
                </Link>
              </div>
            )}

            {workspaceTab === "Timeline" && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Drive Created & Published ({selectedDriveForWorkspace.regStart})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Participating Colleges Onboarded & MoUs Signed</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Registrations Open ({selectedDriveForWorkspace.registeredCount} applicants)</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Exam Assessments Active</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedDriveForWorkspace(null)}>
                Close Workspace
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
