"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  Users,
  Search,
  Filter,
  Download,
  Building2,
  AlertTriangle,
  Archive,
  RotateCcw
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface RejectedStudent {
  id: string;
  studentId: string;
  name: string;
  photo: string;
  college: string;
  branch: string;
  score: number;
  rejectionStage: "Assessment Cutoff" | "Technical Round 1" | "Anti-Cheating Violation";
  reason: string;
  remarks: string;
  rejectedDate: string;
}

const INITIAL_REJECTED: RejectedStudent[] = [
  {
    id: "STU-8824",
    studentId: "GQT-2026-STU-8824",
    name: "Suresh Patil",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    college: "KLE Technological University",
    branch: "Electronics & Communication",
    score: 48,
    rejectionStage: "Assessment Cutoff",
    reason: "Score 48% fell below the mandatory 60% minimum cutoff.",
    remarks: "Theoretical aptitude solid, but scored low in SQL and Java coding exercises.",
    rejectedDate: "2026-09-24",
  },
  {
    id: "STU-8829",
    studentId: "GQT-2026-STU-8829",
    name: "Mohammed Farhan",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
    college: "Dayananda Sagar College",
    branch: "Computer Science",
    score: 0,
    rejectionStage: "Anti-Cheating Violation",
    reason: "Exceeded 6 tab switches during live proctored exam session.",
    remarks: "Auto-terminated by system proctor algorithm. Disqualified from current drive.",
    rejectedDate: "2026-09-24",
  },
  {
    id: "STU-8833",
    studentId: "GQT-2026-STU-8833",
    name: "Manoj Gowda",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    college: "BMS College of Engineering",
    branch: "Mechanical Engg",
    score: 62,
    rejectionStage: "Technical Round 1",
    reason: "Unable to explain data structure complexity in live coding interview.",
    remarks: "Cleared cutoff narrowly but struggled with basic OOP polymorphism principles.",
    rejectedDate: "2026-09-23",
  },
];

export default function HRRejectedStudentsPage() {
  const { colleges } = useApp();
  const [rejectedStudents, setRejectedStudents] = useState<RejectedStudent[]>(INITIAL_REJECTED);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filtered = rejectedStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || s.rejectionStage.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesStage;
  });

  const handleExport = () => {
    toast.success("Exporting Rejected Candidates Audit Ledger (.xlsx)...");
  };

  const handleArchive = (id: string) => {
    setRejectedStudents((prev) => prev.filter((s) => s.id !== id));
    toast.info("Candidate archived to long-term storage.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Elimination Audit Roster
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Rejected Candidates Audit Log</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Audit trail of students eliminated via cutoff thresholds, interview panel decisions, or proctoring anti-cheating flags.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="cyan" onClick={handleExport} className="flex items-center gap-2 shadow-lg">
            <Download className="w-4 h-4" />
            Export Audit Ledger
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Candidate Name, USN, Reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Rejection Stages</option>
              <option value="assessment cutoff">Assessment Cutoff</option>
              <option value="technical round 1">Technical Round 1</option>
              <option value="anti-cheating violation">Anti-Cheating Violation</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">College & Branch</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3">Rejection Stage</th>
                <th className="py-3 px-3">Elimination Reason</th>
                <th className="py-3 px-3">Confidential HR Remarks</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.studentId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700">
                    <div className="font-semibold text-slate-800">{item.college}</div>
                    <div className="text-[10px] text-slate-500">{item.branch}</div>
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-600">
                    {item.score}%
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.rejectionStage === "Anti-Cheating Violation"
                          ? "bg-rose-100 text-rose-800"
                          : item.rejectionStage === "Technical Round 1"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.rejectionStage}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {item.reason}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500 max-w-[200px] truncate" title={item.remarks}>
                    {item.remarks}
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 font-mono">
                    {item.rejectedDate}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                      title="Archive Record"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
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
