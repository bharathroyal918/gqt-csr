"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  ShieldCheck,
  Search,
  Filter,
  FileText,
  HelpCircle,
  PhoneCall,
  ChevronRight,
  Award,
  Building2
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface CSRDriveDetail {
  id: string;
  name: string;
  driveCode: string;
  academicYear: string;
  category: string;
  mode: string;
  collegeName: string;
  location: string;
  regStart: string;
  regEnd: string;
  examDate: string;
  examTime: string;
  interviewDate: string;
  courses: string[];
  minPercentage: number;
  minCgpa: number;
  maxBacklogs: number;
  description: string;
  hrLead: {
    name: string;
    phone: string;
    email: string;
  };
}

const DRIVES_LIST: CSRDriveDetail[] = [
  {
    id: "DRV-2026-001",
    name: "CSR Flagship Campus Drive 2026",
    driveCode: "GQT-CSR-2026-01",
    academicYear: "2025-2026",
    category: "Corporate Campus Flagship",
    mode: "Hybrid",
    collegeName: "RV College of Engineering",
    location: "Bengaluru, Karnataka",
    regStart: "2026-09-01",
    regEnd: "2026-09-25",
    examDate: "2026-09-26",
    examTime: "10:00 AM - 11:30 AM IST",
    interviewDate: "2026-09-28",
    courses: ["Agentic AI Java Full Stack", "Software Testing Full Stack"],
    minPercentage: 60,
    minCgpa: 6.5,
    maxBacklogs: 0,
    description: "Premier state-wide CSR talent incubation drive providing 100% sponsored industry training and corporate placement with top tier product IT enterprises.",
    hrLead: {
      name: "Hitha, Kusuma",
      phone: "+91 98450 12891",
      email: "gqthr5@gmail.com",
    },
  },
  {
    id: "DRV-2026-002",
    name: "Women in Tech Empowerment Drive",
    driveCode: "GQT-CSR-2026-02",
    academicYear: "2025-2026",
    category: "Diversity & Inclusion",
    mode: "Virtual Live",
    collegeName: "National Institute of Engineering (NIE)",
    location: "Mysuru, Karnataka",
    regStart: "2026-09-10",
    regEnd: "2026-10-05",
    examDate: "2026-10-08",
    examTime: "02:00 PM - 03:30 PM IST",
    interviewDate: "2026-10-12",
    courses: ["Agentic AI Python Full Stack", "Data Analytics"],
    minPercentage: 60,
    minCgpa: 6.0,
    maxBacklogs: 1,
    description: "Dedicated CSR program providing full scholarship training and placement drives for women in computer science, AI, and information technology branches.",
    hrLead: {
      name: "Sneha Rao",
      phone: "+91 99160 44812",
      email: "sneha.rao@globalquesttechnologies.com",
    },
  },
  {
    id: "DRV-2026-003",
    name: "Rural Talent Outreach Drive 2026",
    driveCode: "GQT-CSR-2026-03",
    academicYear: "2025-2026",
    category: "Tier-2/3 Regional Uplift",
    mode: "Hybrid",
    collegeName: "KLE Technological University",
    location: "Hubballi / Dharwad, Karnataka",
    regStart: "2026-09-15",
    regEnd: "2026-10-15",
    examDate: "2026-10-20",
    examTime: "11:00 AM - 12:30 PM IST",
    interviewDate: "2026-10-25",
    courses: ["Agentic AI MERN Full Stack", "Data Science"],
    minPercentage: 55,
    minCgpa: 6.0,
    maxBacklogs: 1,
    description: "Empowering talented engineering graduates in northern and central Karnataka with direct placement pipelines and full stack software engineering curricula.",
    hrLead: {
      name: "Vikram Deshmukh",
      phone: "+91 94812 77034",
      email: "vikram.d@globalquesttechnologies.com",
    },
  },
];

export default function StudentCSRExplorerPage() {
  const { students, currentUser } = useApp();
  const [drives] = useState<CSRDriveDetail[]>(DRIVES_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrive, setSelectedDrive] = useState<CSRDriveDetail | null>(null);
  const [detailTab, setDetailTab] = useState<
    "Overview" | "Eligibility" | "Schedule" | "Documents Required" | "Instructions" | "FAQ" | "Contact HR"
  >("Overview");

  const filteredDrives = drives.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driveCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Campus Placement Drives
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Active CSR Campus Drives</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Explore active recruitment drives sponsored through Global Quest Technologies. Register for accredited assessments, track exam countdowns, and secure placement offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/student/my-registration">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4" />
              My Registered Drive
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
              placeholder="Search by Drive Name, Code, or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredDrives.length} Drives</strong> open for registration
          </div>
        </div>
      </Card>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => {
          const isEnrolled = drive.id === "DRV-2026-001"; // Default candidate enrollment

          return (
            <Card
              key={drive.id}
              className="p-6 bg-white border border-slate-200 hover:border-[#005BBB]/50 transition-all shadow-sm rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#005BBB] border border-blue-200">
                    {drive.driveCode}
                  </span>
                  {isEnrolled ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Enrolled
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      Open for Entry
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{drive.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {drive.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{drive.collegeName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Online Exam: <strong>{drive.examDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Cutoff: ≥ {drive.minPercentage}% or {drive.minCgpa} CGPA</span>
                  </div>
                </div>

                {/* Course Track Pills */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {drive.courses.map((c, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedDrive(drive)}
                >
                  View Details
                </Button>

                {isEnrolled ? (
                  <Link href="/student/exam">
                    <Button variant="cyan" size="sm" className="text-xs">
                      Exam Portal
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/student/register-drive/${drive.id}`}>
                    <Button variant="cyan" size="sm" className="text-xs">
                      Register Now
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* CSR Drive Details Modal (Tabs: Overview, Eligibility, Schedule, Documents Required, Instructions, FAQ, Contact HR) */}
      {selectedDrive && (
        <Modal
          isOpen={!!selectedDrive}
          onClose={() => setSelectedDrive(null)}
          title={`Drive Information: ${selectedDrive.name}`}
          subtitle={`${selectedDrive.driveCode} • ${selectedDrive.academicYear}`}
          size="lg"
        >
          <div className="space-y-4 text-xs text-slate-800">
            {/* Tabs Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
              {(
                [
                  "Overview",
                  "Eligibility",
                  "Schedule",
                  "Documents Required",
                  "Instructions",
                  "FAQ",
                  "Contact HR",
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${detailTab === tab
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
              <div className="space-y-3">
                <p className="leading-relaxed text-slate-700">{selectedDrive.description}</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Host Campus:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedDrive.collegeName}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Training Mode:</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedDrive.mode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Eligibility */}
            {detailTab === "Eligibility" && (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Graduation Degrees:</span>
                    <strong className="text-slate-800">B.E. / B.Tech / MCA / BCA / B.Sc</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passing Batch:</span>
                    <strong className="text-slate-800">{selectedDrive.academicYear}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Minimum Academic Cutoff:</span>
                    <strong className="text-emerald-700 font-bold">≥ {selectedDrive.minPercentage}% or {selectedDrive.minCgpa} CGPA</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Backlogs Allowed:</span>
                    <strong className="text-slate-800">{selectedDrive.maxBacklogs === 0 ? "Strictly 0 Active Backlogs" : "Up to 1 Backlog Allowed"}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Schedule */}
            {detailTab === "Schedule" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Registration Closes:</span>
                    <p className="font-bold text-rose-600 mt-0.5">{selectedDrive.regEnd}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Online Examination:</span>
                    <p className="font-bold text-[#005BBB] mt-0.5">{selectedDrive.examDate} ({selectedDrive.examTime})</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Technical Interview Window:</span>
                    <p className="font-bold text-purple-600 mt-0.5">{selectedDrive.interviewDate}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">Batch Onboarding:</span>
                    <p className="font-bold text-emerald-600 mt-0.5">November 2026</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Documents Required */}
            {detailTab === "Documents Required" && (
              <ul className="space-y-2 list-disc list-inside text-slate-700">
                <li>Updated PDF Resume (under 5 MB)</li>
                <li>Recent Passport Size Photograph</li>
                <li>Valid College Identity Card</li>
                <li>Marksheets of 10th, 12th/Diploma, and Engineering semesters</li>
                <li>Aadhaar Card (identity verification)</li>
              </ul>
            )}

            {/* Tab 5: Instructions */}
            {detailTab === "Instructions" && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 space-y-1">
                <p>• The exam is conducted under strict automated video and tab-switch proctoring.</p>
                <p>• You are permitted up to 3 tab switch warnings before automatic session termination.</p>
                <p>• Ensure a quiet room with a functioning webcam and microphone.</p>
              </div>
            )}

            {/* Tab 6: FAQ */}
            {detailTab === "FAQ" && (
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900">Is there any training fee?</span>
                  <p className="text-slate-600 mt-0.5">No, the entire training and placement process is 100% sponsored under GQT CSR.</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900">What are the employment CTC packages offered?</span>
                  <p className="text-slate-600 mt-0.5">Starting packages range from INR 4.5 LPA up to INR 7.5 LPA based on evaluation percentiles.</p>
                </div>
              </div>
            )}

            {/* Tab 7: Contact HR */}
            {detailTab === "Contact HR" && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Assigned GQT Campus Lead</h4>
                <p className="text-slate-700">Lead Recruiter: <strong>{selectedDrive.hrLead.name}</strong></p>
                <p className="text-slate-700">Helpline: <strong className="font-mono">{selectedDrive.hrLead.phone}</strong></p>
                <p className="text-slate-700">Email: <strong className="font-mono">{selectedDrive.hrLead.email}</strong></p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedDrive(null)}>
                Close
              </Button>
              <Link href={`/student/register-drive/${selectedDrive.id}`}>
                <Button variant="cyan">
                  Proceed to Register
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
