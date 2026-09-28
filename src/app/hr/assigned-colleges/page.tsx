"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Award,
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Mail,
  Phone,
  FileText,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  FolderLock,
  UserCheck,
  X
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface AssignedCollegeCard {
  id: string;
  name: string;
  code: string;
  district: string;
  tier: string;
  placementOfficer: {
    name: string;
    email: string;
    mobile: string;
  };
  facultyCoordinator: {
    name: string;
    department: string;
    email: string;
  };
  principal: {
    name: string;
    email: string;
  };
  stats: {
    registered: number;
    examCompleted: number;
    qualified: number;
    pendingReview: number;
    selected: number;
  };
  mouStatus: "Signed" | "In Discussion" | "Pending";
  driveName: string;
}

const INITIAL_ASSIGNED_COLLEGES: AssignedCollegeCard[] = [
  {
    id: "COL-001",
    name: "RV College of Engineering",
    code: "1RV",
    district: "Bengaluru Urban",
    tier: "Tier-1",
    placementOfficer: {
      name: "Dr. K. S. Badrinarayan",
      email: "placement@rvce.edu.in",
      mobile: "+91 98450 11928",
    },
    facultyCoordinator: {
      name: "Prof. Anitha Murthy",
      department: "Computer Science & Engg",
      email: "anitham@rvce.edu.in",
    },
    principal: {
      name: "Dr. K. N. Subramanya",
      email: "principal@rvce.edu.in",
    },
    stats: {
      registered: 480,
      examCompleted: 432,
      qualified: 218,
      pendingReview: 6,
      selected: 24,
    },
    mouStatus: "Signed",
    driveName: "CSR Flagship Campus Drive 2026",
  },
  {
    id: "COL-002",
    name: "BMS College of Engineering",
    code: "1BM",
    district: "Bengaluru Urban",
    tier: "Tier-1",
    placementOfficer: {
      name: "Prof. Pradeep S.",
      email: "placements@bmsce.ac.in",
      mobile: "+91 97401 22394",
    },
    facultyCoordinator: {
      name: "Dr. Harish Kumar",
      department: "Information Science",
      email: "harishk@bmsce.ac.in",
    },
    principal: {
      name: "Dr. S. Muralidhara",
      email: "principal@bmsce.ac.in",
    },
    stats: {
      registered: 360,
      examCompleted: 310,
      qualified: 164,
      pendingReview: 2,
      selected: 12,
    },
    mouStatus: "Signed",
    driveName: "CSR Flagship Campus Drive 2026",
  },
  {
    id: "COL-003",
    name: "National Institute of Engineering (NIE)",
    code: "4NI",
    district: "Mysuru",
    tier: "Tier-2",
    placementOfficer: {
      name: "Dr. Harshavardhana",
      email: "placement@nie.ac.in",
      mobile: "+91 99160 88219",
    },
    facultyCoordinator: {
      name: "Prof. Sunita Patil",
      department: "CSE & AI",
      email: "sunitap@nie.ac.in",
    },
    principal: {
      name: "Dr. Rohini Nagapadma",
      email: "principal@nie.ac.in",
    },
    stats: {
      registered: 260,
      examCompleted: 230,
      qualified: 110,
      pendingReview: 4,
      selected: 8,
    },
    mouStatus: "Signed",
    driveName: "Women in Tech Empowerment Drive",
  },
  {
    id: "COL-004",
    name: "KLE Technological University",
    code: "2KL",
    district: "Dharwad (Hubballi)",
    tier: "Tier-2",
    placementOfficer: {
      name: "Prof. Arun Patil",
      email: "placements@kletech.ac.in",
      mobile: "+91 94812 33410",
    },
    facultyCoordinator: {
      name: "Dr. Ramesh B.",
      department: "School of Computing",
      email: "rameshb@kletech.ac.in",
    },
    principal: {
      name: "Dr. Ashok Shettar",
      email: "vicechancellor@kletech.ac.in",
    },
    stats: {
      registered: 220,
      examCompleted: 180,
      qualified: 72,
      pendingReview: 2,
      selected: 4,
    },
    mouStatus: "In Discussion",
    driveName: "Rural Talent Outreach Drive 2026",
  },
];

export default function HRAssignedCollegesPage() {
  const [colleges, setColleges] = useState<AssignedCollegeCard[]>(INITIAL_ASSIGNED_COLLEGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [selectedCollege, setSelectedCollege] = useState<AssignedCollegeCard | null>(null);
  const [detailTab, setDetailTab] = useState<
    "Overview" | "Placement Officer" | "Faculty" | "Communication Timeline" | "Follow-Ups" | "Students" | "Interview Progress" | "Documents"
  >("Overview");

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.placementOfficer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === "all" || c.district.toLowerCase() === districtFilter.toLowerCase();
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Campus Partnership Network
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Assigned Partner Colleges</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Coordinate campus drives, liaison with institutional placement heads, track MoU authorizations, and oversee applicant pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/crm">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <PhoneCall className="w-4 h-4" />
              Log Outreach Call
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
              placeholder="Search by College Name, Code, or Placement Officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Districts</option>
              <option value="bengaluru urban">Bengaluru Urban</option>
              <option value="mysuru">Mysuru</option>
              <option value="dharwad (hubballi)">Dharwad (Hubballi)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cards Grid for Every Assigned College */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredColleges.map((college) => (
          <Card
            key={college.id}
            className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl cursor-pointer"
            onClick={() => setSelectedCollege(college)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#005BBB]/10 text-[#005BBB] flex items-center justify-center font-bold text-base shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {college.code}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {college.tier}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{college.name}</h3>
                  <p className="text-xs text-slate-500">{college.district}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  college.mouStatus === "Signed"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                MoU {college.mouStatus}
              </span>
            </div>

            {/* Placement Officer Info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Placement Officer</span>
                <span className="font-semibold text-slate-800">{college.placementOfficer.name}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-mono">{college.placementOfficer.mobile}</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Registered</div>
                <div className="text-sm font-bold text-slate-800">{college.stats.registered}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Exam Taken</div>
                <div className="text-sm font-bold text-blue-600">{college.stats.examCompleted}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Qualified</div>
                <div className="text-sm font-bold text-teal-600">{college.stats.qualified}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Review</div>
                <div className="text-sm font-bold text-rose-600">{college.stats.pendingReview}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-400">Selected</div>
                <div className="text-sm font-bold text-emerald-600">{college.stats.selected}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#005BBB] font-semibold">
              <span>View Comprehensive College Dossier</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Card>
        ))}
      </div>

      {/* College Details Modal / Drawer */}
      {selectedCollege && (
        <Modal
          isOpen={!!selectedCollege}
          onClose={() => setSelectedCollege(null)}
          title={`College Dossier: ${selectedCollege.name}`}
          subtitle={`Institution Code: ${selectedCollege.code} • ${selectedCollege.district} • ${selectedCollege.tier}`}
          size="xl"
        >
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
              {(
                [
                  "Overview",
                  "Placement Officer",
                  "Faculty",
                  "Communication Timeline",
                  "Follow-Ups",
                  "Students",
                  "Interview Progress",
                  "Documents",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    detailTab === tab
                      ? "bg-[#005BBB] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {detailTab === "Overview" && (
              <div className="space-y-4 text-slate-800 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400">Registered</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">{selectedCollege.stats.registered}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400">Exam Taken</span>
                    <p className="text-xl font-bold text-blue-600 mt-1">{selectedCollege.stats.examCompleted}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400">Qualified</span>
                    <p className="text-xl font-bold text-teal-600 mt-1">{selectedCollege.stats.qualified}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400">Pending Review</span>
                    <p className="text-xl font-bold text-rose-600 mt-1">{selectedCollege.stats.pendingReview}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400">Selected</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{selectedCollege.stats.selected}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Campaign Allocation</h4>
                  <p>
                    <strong>Assigned Campaign: </strong> {selectedCollege.driveName}
                  </p>
                  <p className="mt-1">
                    <strong>MoU Legal Status: </strong>{" "}
                    <span className="text-emerald-700 font-semibold">{selectedCollege.mouStatus}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Placement Officer */}
            {detailTab === "Placement Officer" && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#005BBB] text-white flex items-center justify-center font-bold">
                      PO
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{selectedCollege.placementOfficer.name}</h4>
                      <p className="text-slate-500">Head of Training & Placement Cell</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-slate-400">Email Address:</span>
                      <p className="font-semibold text-slate-800">{selectedCollege.placementOfficer.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Direct Mobile:</span>
                      <p className="font-semibold text-slate-800">{selectedCollege.placementOfficer.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Faculty */}
            {detailTab === "Faculty" && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900">{selectedCollege.facultyCoordinator.name}</h4>
                  <p className="text-slate-500">{selectedCollege.facultyCoordinator.department}</p>
                  <p className="font-mono text-slate-700">{selectedCollege.facultyCoordinator.email}</p>
                </div>
              </div>
            )}

            {/* Tab 4: Communication Timeline */}
            {detailTab === "Communication Timeline" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-[#005BBB]">Outgoing Phone Call</span>
                    <span>Yesterday, 03:30 PM</span>
                  </div>
                  <p className="text-slate-700">Discussed online exam laboratory setup and student turnout with Dr. Badrinarayan.</p>
                </div>
              </div>
            )}

            {/* Tab 5: Follow-Ups */}
            {detailTab === "Follow-Ups" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900">Upcoming Follow-Up: Tomorrow 11:00 AM</span>
                  <p className="text-amber-800 mt-1">Receive physical signed attendance log for Batch 1 students.</p>
                </div>
              </div>
            )}

            {/* Tab 6: Students */}
            {detailTab === "Students" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">Showing applicants registered from {selectedCollege.name}:</p>
                <Link href="/hr/students">
                  <Button variant="outline" size="sm">
                    Open Filtered Student Pipeline
                  </Button>
                </Link>
              </div>
            )}

            {/* Tab 7: Interview Progress */}
            {detailTab === "Interview Progress" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">{selectedCollege.stats.selected} candidates selected; 18 interviews scheduled this week.</p>
              </div>
            )}

            {/* Tab 8: Documents */}
            {detailTab === "Documents" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">CSR Institution MoU Agreement.pdf</span>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Downloading MoU...")}>
                    Download
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedCollege(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
