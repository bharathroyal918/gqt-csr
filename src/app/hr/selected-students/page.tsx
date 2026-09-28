"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  Award,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  Mail,
  Send,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface SelectedStudent {
  id: string;
  studentId: string;
  name: string;
  photo: string;
  college: string;
  branch: string;
  score: number;
  hrLead: string;
  interviewDate: string;
  offerStatus: "Offered" | "Signed" | "Pending Release";
  packageCtc: string;
  remarks: string;
}

const INITIAL_SELECTED: SelectedStudent[] = [
  {
    id: "STU-8821",
    studentId: "GQT-2026-STU-8821",
    name: "Rahul Verma",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120",
    college: "RV College of Engineering",
    branch: "Computer Science & Engg",
    score: 94,
    hrLead: "Priya Nair",
    interviewDate: "2026-09-22",
    offerStatus: "Signed",
    packageCtc: "INR 6.5 LPA",
    remarks: "Top score in Java full stack. Excellent system architecture understanding.",
  },
  {
    id: "STU-8830",
    studentId: "GQT-2026-STU-8830",
    name: "Ananya Hegde",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    college: "BMS College of Engineering",
    branch: "Information Science & Engg",
    score: 92,
    hrLead: "Priya Nair",
    interviewDate: "2026-09-23",
    offerStatus: "Offered",
    packageCtc: "INR 6.0 LPA",
    remarks: "Proficient in Python & PyTorch multi-agent frameworks.",
  },
  {
    id: "STU-8835",
    studentId: "GQT-2026-STU-8835",
    name: "Siddharth Shetty",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    college: "National Institute of Engineering (NIE)",
    branch: "Computer Science",
    score: 89,
    hrLead: "Arun Menon",
    interviewDate: "2026-09-23",
    offerStatus: "Pending Release",
    packageCtc: "INR 5.5 LPA",
    remarks: "Solid algorithmic problem solving and clean coding conventions.",
  },
  {
    id: "STU-8842",
    studentId: "GQT-2026-STU-8842",
    name: "Meera Nair",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    college: "RV College of Engineering",
    branch: "AI & Data Science",
    score: 95,
    hrLead: "Priya Nair",
    interviewDate: "2026-09-24",
    offerStatus: "Pending Release",
    packageCtc: "INR 7.0 LPA",
    remarks: "Exceptional candidate. Top percentile in both MCQ and Coding round.",
  },
];

export default function HRSelectedStudentsPage() {
  const { colleges } = useApp();
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>(INITIAL_SELECTED);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collegeFilter, setCollegeFilter] = useState("all");

  const filtered = selectedStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = collegeFilter === "all" || s.college.toLowerCase() === collegeFilter.toLowerCase();
    return matchesSearch && matchesCollege;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportExcel = () => {
    toast.success("Exporting Selected Candidates Master Roster (.xlsx)...");
  };

  const handleBulkNotification = () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one candidate for bulk notification.");
      return;
    }
    toast.success(`Dispatched congratulatory WhatsApp/Email broadcast to ${selectedIds.length} candidate(s)!`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Approved Talent Pool
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Selected Candidates Roster</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates who cleared both online proctored assessments and technical interviews. Ready for employment Letters of Intent (LOI).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="cyan" onClick={handleExportExcel} className="flex items-center gap-2 shadow-lg">
            <Download className="w-4 h-4" />
            Export Selected (Excel)
          </Button>
          <Link href="/hr/offer-letters">
            <Button variant="secondary" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Award className="w-4 h-4" />
              Generate Offer Batch
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Bulk Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Candidate Name, Student ID, College..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Partner Colleges</option>
              {colleges.map((c: any) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="cyan" size="sm" onClick={handleBulkNotification}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Notify ({selectedIds.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-[#005BBB] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">College & Branch</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3">Interview Lead</th>
                <th className="py-3 px-3">Interview Date</th>
                <th className="py-3 px-3 text-center">Package CTC</th>
                <th className="py-3 px-3 text-center">Offer Status</th>
                <th className="py-3 px-3">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleToggleSelect(item.id)}
                      className="rounded text-[#005BBB] cursor-pointer"
                    />
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-900">
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

                  <td className="py-3 px-3 text-slate-700">
                    <div className="font-semibold text-slate-800">{item.college}</div>
                    <div className="text-[10px] text-slate-500">{item.branch}</div>
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-teal-600">
                    {item.score}%
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {item.hrLead}
                  </td>

                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {item.interviewDate}
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {item.packageCtc}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.offerStatus === "Signed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.offerStatus === "Offered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.offerStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 max-w-[200px] truncate" title={item.remarks}>
                    {item.remarks}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Link href="/hr/offer-letters">
                      <Button variant="cyan" size="sm" className="text-xs h-7 px-2">
                        Generate Offer
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
