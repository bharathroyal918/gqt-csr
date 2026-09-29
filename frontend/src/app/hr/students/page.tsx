"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  ChevronRight,
  ExternalLink,
  Sliders,
  MoreVertical,
  CheckCheck,
  FileCheck2
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

type PipelineStage =
  | "All"
  | "Registered"
  | "Exam Completed"
  | "Pending Review"
  | "Qualified"
  | "Selected"
  | "Rejected"
  | "Hold"
  | "Not Attended";

interface CandidatePipelineItem {
  id: string;
  studentId: string;
  usn: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  course: string;
  registrationStatus: "Approved" | "Pending Verification";
  examScore: number;
  maxScore: number;
  percentage: number;
  qualificationStatus: "Qualified" | "Below Cutoff" | "Pending Review";
  interviewStatus: "Scheduled" | "Completed" | "Pending Slot" | "Not Attended";
  hrDecision: "Selected" | "Rejected" | "Hold" | "Pending Review" | "Not Attended";
  offerStatus: "Offered" | "Signed" | "Pending" | "Not Applicable";
  photo: string;
  cgpa: number;
}

const INITIAL_PIPELINE_STUDENTS: CandidatePipelineItem[] = [
  {
    id: "STU-8821",
    studentId: "GQT-2026-STU-8821",
    usn: "1RV22CS101",
    name: "Rahul Verma",
    email: "rahul.verma@rvce.edu.in",
    phone: "+91 98450 12891",
    college: "RV College of Engineering",
    branch: "Computer Science & Engg",
    course: "Agentic AI Java Full Stack",
    registrationStatus: "Approved",
    examScore: 94,
    maxScore: 100,
    percentage: 94,
    qualificationStatus: "Qualified",
    interviewStatus: "Completed",
    hrDecision: "Selected",
    offerStatus: "Offered",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120",
    cgpa: 8.9,
  },
  {
    id: "STU-8822",
    studentId: "GQT-2026-STU-8822",
    usn: "1BM22IS045",
    name: "Pooja Kulkarni",
    email: "pooja.k@bmsce.ac.in",
    phone: "+91 97401 55219",
    college: "BMS College of Engineering",
    branch: "Information Science & Engg",
    course: "Agentic AI Python Full Stack",
    registrationStatus: "Approved",
    examScore: 91,
    maxScore: 100,
    percentage: 91,
    qualificationStatus: "Qualified",
    interviewStatus: "Scheduled",
    hrDecision: "Pending Review",
    offerStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    cgpa: 9.1,
  },
  {
    id: "STU-8823",
    studentId: "GQT-2026-STU-8823",
    usn: "4NI22CS089",
    name: "Deepa Joshi",
    email: "deepa.j@nie.ac.in",
    phone: "+91 99160 44812",
    college: "National Institute of Engineering (NIE)",
    branch: "Computer Science & Engg",
    course: "Agentic AI Java Full Stack",
    registrationStatus: "Approved",
    examScore: 86,
    maxScore: 100,
    percentage: 86,
    qualificationStatus: "Qualified",
    interviewStatus: "Completed",
    hrDecision: "Hold",
    offerStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    cgpa: 8.4,
  },
  {
    id: "STU-8824",
    studentId: "GQT-2026-STU-8824",
    usn: "2KL22EC014",
    name: "Suresh Patil",
    email: "suresh.p@kletech.ac.in",
    phone: "+91 94812 77034",
    college: "KLE Technological University",
    branch: "Electronics & Communication",
    course: "Software Testing Full Stack",
    registrationStatus: "Approved",
    examScore: 54,
    maxScore: 100,
    percentage: 54,
    qualificationStatus: "Below Cutoff",
    interviewStatus: "Pending Slot",
    hrDecision: "Rejected",
    offerStatus: "Not Applicable",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    cgpa: 7.2,
  },
  {
    id: "STU-8825",
    studentId: "GQT-2026-STU-8825",
    usn: "1RV22AI032",
    name: "Anand Deshpande",
    email: "anand.d@rvce.edu.in",
    phone: "+91 98452 99102",
    college: "RV College of Engineering",
    branch: "Artificial Intelligence & Data Science",
    course: "Agentic AI Java Full Stack",
    registrationStatus: "Approved",
    examScore: 78,
    maxScore: 100,
    percentage: 78,
    qualificationStatus: "Pending Review",
    interviewStatus: "Pending Slot",
    hrDecision: "Pending Review",
    offerStatus: "Pending",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    cgpa: 8.6,
  },
  {
    id: "STU-8826",
    studentId: "GQT-2026-STU-8826",
    usn: "1BM22ME050",
    name: "Vikram Rathi",
    email: "vikram.r@bmsce.ac.in",
    phone: "+91 96112 33499",
    college: "BMS College of Engineering",
    branch: "Mechanical Engg",
    course: "Data Analytics",
    registrationStatus: "Approved",
    examScore: 0,
    maxScore: 100,
    percentage: 0,
    qualificationStatus: "Below Cutoff",
    interviewStatus: "Not Attended",
    hrDecision: "Not Attended",
    offerStatus: "Not Applicable",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120",
    cgpa: 7.5,
  },
];

const STAGES: PipelineStage[] = [
  "All",
  "Registered",
  "Exam Completed",
  "Pending Review",
  "Qualified",
  "Selected",
  "Rejected",
  "Hold",
  "Not Attended",
];

export default function HRStudentsPipelinePage() {
  const { colleges } = useApp();
  const [candidates, setCandidates] = useState<CandidatePipelineItem[]>(INITIAL_PIPELINE_STUDENTS);
  const [activeStage, setActiveStage] = useState<PipelineStage>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: "Selected" | "Rejected" | "Hold" | "Interview") => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one candidate first.");
      return;
    }

    if (action === "Interview") {
      toast.success(`Scheduled technical interview slots for ${selectedIds.length} candidate(s)!`);
      setSelectedIds([]);
      return;
    }

    setCandidates((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, hrDecision: action } : c))
    );
    toast.success(`Updated HR Decision to '${action}' for ${selectedIds.length} candidate(s)!`);
    setSelectedIds([]);
  };

  const filteredCandidates = candidates.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCollege = collegeFilter === "all" || item.college.toLowerCase() === collegeFilter.toLowerCase();

    let matchesStage = true;
    if (activeStage === "Registered") matchesStage = true;
    else if (activeStage === "Exam Completed") matchesStage = item.percentage > 0;
    else if (activeStage === "Pending Review") matchesStage = item.hrDecision === "Pending Review";
    else if (activeStage === "Qualified") matchesStage = item.qualificationStatus === "Qualified";
    else if (activeStage === "Selected") matchesStage = item.hrDecision === "Selected";
    else if (activeStage === "Rejected") matchesStage = item.hrDecision === "Rejected";
    else if (activeStage === "Hold") matchesStage = item.hrDecision === "Hold";
    else if (activeStage === "Not Attended") matchesStage = item.hrDecision === "Not Attended";

    return matchesSearch && matchesCollege && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Candidate Evaluation Funnel
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Candidate Recruitment Pipeline</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Directory of enrolled students across partner campuses. Transition candidates automatically across assessment, technical interviews, and final LOIs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/exam-review">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <FileCheck2 className="w-4 h-4" />
              Live Exam Review Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {STAGES.map((stage) => {
          const count =
            stage === "All"
              ? candidates.length
              : stage === "Registered"
              ? candidates.length
              : stage === "Exam Completed"
              ? candidates.filter((c) => c.percentage > 0).length
              : stage === "Pending Review"
              ? candidates.filter((c) => c.hrDecision === "Pending Review").length
              : stage === "Qualified"
              ? candidates.filter((c) => c.qualificationStatus === "Qualified").length
              : stage === "Selected"
              ? candidates.filter((c) => c.hrDecision === "Selected").length
              : stage === "Rejected"
              ? candidates.filter((c) => c.hrDecision === "Rejected").length
              : stage === "Hold"
              ? candidates.filter((c) => c.hrDecision === "Hold").length
              : candidates.filter((c) => c.hrDecision === "Not Attended").length;

          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeStage === stage
                  ? "bg-[#005BBB] text-white shadow-md shadow-[#005BBB]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{stage}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeStage === stage ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Bulk Actions Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by USN, Name, Email, Student ID, Branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Partner Colleges</option>
              {colleges.map((col: any) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>

            {/* Bulk Action Controls */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                <span className="text-[11px] font-bold text-[#005BBB] mr-1">{selectedIds.length} Selected</span>
                <Button
                  variant="cyan"
                  size="sm"
                  className="text-[11px] h-7 px-2"
                  onClick={() => handleBulkAction("Selected")}
                >
                  Bulk Select
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] h-7 px-2 text-amber-700"
                  onClick={() => handleBulkAction("Hold")}
                >
                  Bulk Hold
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px] h-7 px-2 text-rose-700"
                  onClick={() => handleBulkAction("Rejected")}
                >
                  Bulk Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-[11px] h-7 px-2"
                  onClick={() => handleBulkAction("Interview")}
                >
                  Schedule Meet
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Candidate Pipeline Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider sticky top-0 z-10">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-[#005BBB] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">USN / ID</th>
                <th className="py-3 px-3">College & Branch</th>
                <th className="py-3 px-3">Enrolled Course</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-center">Qualification</th>
                <th className="py-3 px-3 text-center">Interview</th>
                <th className="py-3 px-3 text-center">HR Decision</th>
                <th className="py-3 px-3 text-center">Offer Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cand.id)}
                      onChange={() => handleToggleSelect(cand.id)}
                      className="rounded text-[#005BBB] cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cand.photo}
                        alt={cand.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <Link
                          href={`/hr/students/${cand.id}`}
                          className="font-bold text-slate-900 hover:text-[#005BBB] transition-colors"
                        >
                          {cand.name}
                        </Link>
                        <div className="text-[10px] text-slate-400">{cand.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono font-medium text-slate-700">
                    <div>{cand.usn}</div>
                    <div className="text-[9px] text-slate-400">{cand.studentId}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    <div className="font-semibold text-slate-800">{cand.college}</div>
                    <div className="text-[10px] text-slate-500">{cand.branch}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">
                    <span className="line-clamp-1">{cand.course}</span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {cand.percentage > 0 ? (
                      <span className="font-bold text-slate-900">{cand.percentage}%</span>
                    ) : (
                      <span className="text-slate-400 italic">Not taken</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.qualificationStatus === "Qualified"
                          ? "bg-teal-100 text-teal-800"
                          : cand.qualificationStatus === "Pending Review"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cand.qualificationStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.interviewStatus === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : cand.interviewStatus === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : cand.interviewStatus === "Not Attended"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cand.interviewStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.hrDecision === "Selected"
                          ? "bg-emerald-100 text-emerald-800"
                          : cand.hrDecision === "Hold"
                          ? "bg-amber-100 text-amber-800"
                          : cand.hrDecision === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : cand.hrDecision === "Not Attended"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {cand.hrDecision}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.offerStatus === "Offered" || cand.offerStatus === "Signed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "text-slate-400"
                      }`}
                    >
                      {cand.offerStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Link href={`/hr/students/${cand.id}`}>
                      <Button variant="cyan" size="sm" className="text-xs h-7 px-2.5">
                        Review Candidate
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
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
