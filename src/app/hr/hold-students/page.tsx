"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Building2,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface HoldStudent {
  id: string;
  studentId: string;
  name: string;
  photo: string;
  college: string;
  branch: string;
  score: number;
  holdReason: string;
  followUpDate: string;
  hrLead: string;
}

const INITIAL_HOLD: HoldStudent[] = [
  {
    id: "STU-8823",
    studentId: "GQT-2026-STU-8823",
    name: "Deepa Joshi",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    college: "National Institute of Engineering (NIE)",
    branch: "Computer Science & Engg",
    score: 86,
    holdReason: "Awaiting academic verification of 6th semester CGPA marksheet from college placement office.",
    followUpDate: "2026-09-28",
    hrLead: "Priya Nair",
  },
  {
    id: "STU-8825",
    studentId: "GQT-2026-STU-8825",
    name: "Anand Deshpande",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    college: "RV College of Engineering",
    branch: "AI & Data Science",
    score: 78,
    holdReason: "Secondary technical interview round needed for LangChain project architecture verification.",
    followUpDate: "2026-09-27",
    hrLead: "Arun Menon",
  },
];

export default function HRHoldStudentsPage() {
  const [holdStudents, setHoldStudents] = useState<HoldStudent[]>(INITIAL_HOLD);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = holdStudents.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.holdReason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePromoteToSelected = (id: string, name: string) => {
    setHoldStudents((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Promoted ${name} from Hold to Selected status!`);
  };

  const handleMoveToRejected = (id: string, name: string) => {
    setHoldStudents((prev) => prev.filter((s) => s.id !== id));
    toast.error(`Moved ${name} to Rejected archive.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Secondary Review Queue
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Hold Candidates Roster</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Students whose evaluations require secondary technical calibration, academic document checks, or portfolio code inspection.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hold candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
          />
        </div>
      </Card>

      {/* Grid of Hold Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 bg-white border border-amber-200 shadow-sm rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{item.studentId}</p>
                    <p className="text-xs text-slate-700 font-semibold">{item.college}</p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Score: {item.score}%
                </span>
              </div>

              <div className="mt-4 p-3 bg-amber-50/60 rounded-lg border border-amber-100 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">Hold Reason:</span>
                <p className="text-amber-800">{item.holdReason}</p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Assigned HR: <strong className="text-slate-800">{item.hrLead}</strong></span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  Follow-Up: {item.followUpDate}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link href={`/hr/students/${item.studentId}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Full Dossier
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => handleMoveToRejected(item.id, item.name)}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
                <Button
                  variant="cyan"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handlePromoteToSelected(item.id, item.name)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Select Candidate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
