"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Plus,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Building2,
  FileCheck2,
  Sparkles,
  Award
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

interface InterviewSession {
  id: string;
  studentId: string;
  studentName: string;
  photo: string;
  college: string;
  branch: string;
  course: string;
  date: string;
  timeSlot: string;
  mode: "Online" | "Offline";
  meetingLink?: string;
  venue?: string;
  panelMember: string;
  status: "Today" | "Upcoming" | "Completed" | "Pending" | "Selected" | "Rejected";
  feedback?: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    confidence: number;
    projectExplanation: number;
    codingSkills: number;
    overallRating: number;
    recommendation: "Selected" | "Rejected" | "Hold";
    remarks: string;
  };
}

const INITIAL_INTERVIEWS: InterviewSession[] = [
  {
    id: "INT-801",
    studentId: "GQT-2026-STU-8821",
    studentName: "Rahul Verma",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120",
    college: "RV College of Engineering",
    branch: "Computer Science & Engg",
    course: "Agentic AI Java Full Stack",
    date: "2026-09-24",
    timeSlot: "10:30 AM - 11:15 AM",
    mode: "Online",
    meetingLink: "https://meet.google.com/rvc-java-panel",
    panelMember: "Priya Nair & Lead Tech Panel",
    status: "Completed",
    feedback: {
      communication: 5,
      technicalKnowledge: 5,
      problemSolving: 5,
      confidence: 4,
      projectExplanation: 5,
      codingSkills: 5,
      overallRating: 4.8,
      recommendation: "Selected",
      remarks: "Outstanding understanding of multi-agent LangGraph orchestrator and microservice bounded contexts.",
    },
  },
  {
    id: "INT-802",
    studentId: "GQT-2026-STU-8822",
    studentName: "Pooja Kulkarni",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    college: "BMS College of Engineering",
    branch: "Information Science & Engg",
    course: "Agentic AI Python Full Stack",
    date: "2026-09-24",
    timeSlot: "02:30 PM - 03:15 PM",
    mode: "Online",
    meetingLink: "https://meet.google.com/bms-py-panel",
    panelMember: "Arun Menon",
    status: "Today",
  },
  {
    id: "INT-803",
    studentId: "GQT-2026-STU-8823",
    studentName: "Deepa Joshi",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120",
    college: "National Institute of Engineering (NIE)",
    branch: "Computer Science",
    course: "Agentic AI Java Full Stack",
    date: "2026-09-25",
    timeSlot: "11:00 AM - 11:45 AM",
    mode: "Online",
    meetingLink: "https://meet.google.com/nie-java-panel",
    panelMember: "Priya Nair",
    status: "Upcoming",
  },
  {
    id: "INT-804",
    studentId: "GQT-2026-STU-8825",
    studentName: "Anand Deshpande",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    college: "RV College of Engineering",
    branch: "AI & Data Science",
    course: "Agentic AI Java Full Stack",
    date: "2026-09-25",
    timeSlot: "04:00 PM - 04:45 PM",
    mode: "Online",
    meetingLink: "https://meet.google.com/rvc-aids-panel",
    panelMember: "Arun Menon",
    status: "Upcoming",
  },
];

export default function HRInterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewSession[]>(INITIAL_INTERVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Feedback Form Modal State
  const [evaluatingSession, setEvaluatingSession] = useState<InterviewSession | null>(null);
  const [commRating, setCommRating] = useState(4);
  const [techRating, setTechRating] = useState(4);
  const [problemRating, setProblemRating] = useState(4);
  const [confRating, setConfRating] = useState(4);
  const [projRating, setProjRating] = useState(4);
  const [codeRating, setCodeRating] = useState(4);
  const [recommendation, setRecommendation] = useState<"Selected" | "Rejected" | "Hold">("Selected");
  const [feedbackRemarks, setFeedbackRemarks] = useState("");

  // Schedule Interview Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newCollege, setNewCollege] = useState("RV College of Engineering");
  const [newDate, setNewDate] = useState("2026-09-26");
  const [newTime, setNewTime] = useState("10:00 AM - 10:45 AM");
  const [newMode, setNewMode] = useState<"Online" | "Offline">("Online");
  const [newMeetLink, setNewMeetLink] = useState("https://meet.google.com/gqt-eval-panel");
  const [newPanel, setNewPanel] = useState("Priya Nair");

  // KPI counts
  const pendingCount = interviews.filter((i) => i.status === "Pending" || i.status === "Upcoming").length;
  const completedCount = interviews.filter((i) => i.status === "Completed").length;
  const todayCount = interviews.filter((i) => i.status === "Today").length;
  const selectedCount = interviews.filter((i) => i.feedback?.recommendation === "Selected").length;
  const rejectedCount = interviews.filter((i) => i.feedback?.recommendation === "Rejected").length;

  const handleOpenEvaluation = (session: InterviewSession) => {
    setEvaluatingSession(session);
    setCommRating(session.feedback?.communication || 4);
    setTechRating(session.feedback?.technicalKnowledge || 4);
    setProblemRating(session.feedback?.problemSolving || 4);
    setConfRating(session.feedback?.confidence || 4);
    setProjRating(session.feedback?.projectExplanation || 4);
    setCodeRating(session.feedback?.codingSkills || 4);
    setRecommendation(session.feedback?.recommendation || "Selected");
    setFeedbackRemarks(session.feedback?.remarks || "");
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRemarks) {
      toast.error("Please enter interview feedback remarks.");
      return;
    }

    if (evaluatingSession) {
      const overall = Number(
        ((commRating + techRating + problemRating + confRating + projRating + codeRating) / 6).toFixed(1)
      );

      const updated = interviews.map((item) => {
        if (item.id === evaluatingSession.id) {
          return {
            ...item,
            status: "Completed" as const,
            feedback: {
              communication: commRating,
              technicalKnowledge: techRating,
              problemSolving: problemRating,
              confidence: confRating,
              projectExplanation: projRating,
              codingSkills: codeRating,
              overallRating: overall,
              recommendation,
              remarks: feedbackRemarks,
            },
          };
        }
        return item;
      });

      setInterviews(updated);
      setEvaluatingSession(null);
      toast.success(
        `Interview feedback submitted! Candidate marked as '${recommendation}' with ${overall}/5.0 score.`
      );
    }
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) {
      toast.error("Please enter student name.");
      return;
    }

    const created: InterviewSession = {
      id: `INT-${Date.now().toString().slice(-3)}`,
      studentId: `GQT-2026-STU-${Date.now().toString().slice(-4)}`,
      studentName: newStudentName,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
      college: newCollege,
      branch: "Computer Science",
      course: "Agentic AI Java Full Stack",
      date: newDate,
      timeSlot: newTime,
      mode: newMode,
      meetingLink: newMeetLink,
      panelMember: newPanel,
      status: "Upcoming",
    };

    setInterviews([created, ...interviews]);
    setIsScheduleModalOpen(false);
    toast.success(`Technical interview slot scheduled for ${newStudentName}!`);
    setNewStudentName("");
  };

  const filteredInterviews = interviews.filter((i) => {
    const matchesSearch =
      i.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.panelMember.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || i.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Technical Calibration & Panels
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Interview Management & Rubric Scoring</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Conduct 1-on-1 video interviews, evaluate technical depth across 6-point standardized rubrics, and lock immediate hiring decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/hr/interviews/schedule">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Auto-Scheduler
            </Button>
          </Link>
          <Link href="/hr/interviews/calendar">
            <Button variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <Clock className="w-3.5 h-3.5" />
              Calendar
            </Button>
          </Link>
          <Link href="/hr/candidates/qualified">
            <Button variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Qualified Queue
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            Quick Slot
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">Today&apos;s Interviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{todayCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Slots allocated</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">Pending Interviews</span>
            <Calendar className="w-4 h-4 text-[#005BBB]" />
          </div>
          <p className="text-2xl font-bold text-[#005BBB]">{pendingCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">In pipeline queue</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Feedback scored</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">Interview Selected</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-600">{selectedCount}</p>
          <span className="text-[10px] text-teal-600 font-medium">Approved for LOI</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium">Interview Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{rejectedCount}</p>
          <span className="text-[10px] text-rose-600 font-medium">Below standard</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Student Name, ID, College, or Panel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Sessions</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Interviews Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">College & Course</th>
                <th className="py-3 px-3">Slot Date & Time</th>
                <th className="py-3 px-3">Interview Mode</th>
                <th className="py-3 px-3">Panel Lead</th>
                <th className="py-3 px-3 text-center">Evaluation Rating</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterviews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.photo}
                        alt={item.studentName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.studentName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.studentId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700">
                    <div className="font-semibold text-slate-800">{item.college}</div>
                    <div className="text-[10px] text-slate-500">{item.course}</div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-mono">
                    <div className="font-semibold">{item.date}</div>
                    <div className="text-[10px] text-slate-500">{item.timeSlot}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    {item.mode === "Online" ? (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#005BBB] hover:underline font-semibold bg-blue-50 px-2 py-0.5 rounded"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Google Meet
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        On-Campus Venue
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {item.panelMember}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {item.feedback ? (
                      <div className="inline-flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.feedback.overallRating} / 5.0</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not evaluated</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Today"
                          ? "bg-amber-100 text-amber-800 animate-pulse"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/hr/interviews/stu-001`}>
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs h-7 px-2.5 flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          Live Workspace
                        </Button>
                      </Link>
                      <Button
                        variant="cyan"
                        size="sm"
                        className="text-xs h-7 px-2.5"
                        onClick={() => handleOpenEvaluation(item)}
                      >
                        {item.status === "Completed" ? "Rubric" : "Quick Score"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6-Point Interview Feedback Form Modal */}
      {evaluatingSession && (
        <Modal
          isOpen={!!evaluatingSession}
          onClose={() => setEvaluatingSession(null)}
          title={`Standardized Interview Feedback Form`}
          subtitle={`Candidate: ${evaluatingSession.studentName} (${evaluatingSession.studentId}) • ${evaluatingSession.college}`}
          size="lg"
        >
          <form onSubmit={handleSaveFeedback} className="space-y-4 text-slate-800 text-xs">
            <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200">
              <span className="font-bold text-[#005BBB]">6-Point Standardized Assessment Rubric</span>
              <p className="text-slate-600 mt-0.5">
                Rate each candidate competency from 1 (Novice) to 5 (Expert). All criteria contribute directly to the candidate scorecard.
              </p>
            </div>

            {/* Rubric Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "1. Communication & Articulation", val: commRating, set: setCommRating },
                { label: "2. Core Technical Knowledge", val: techRating, set: setTechRating },
                { label: "3. Algorithmic Problem Solving", val: problemRating, set: setProblemRating },
                { label: "4. Professional Confidence", val: confRating, set: setConfRating },
                { label: "5. Capstone Project Explanation", val: projRating, set: setProjRating },
                { label: "6. Clean Coding & Architecture", val: codeRating, set: setCodeRating },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <span className="font-bold text-[#005BBB]">{item.val} / 5</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => item.set(s)}
                        className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                          s <= item.val
                            ? "bg-[#005BBB] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Recommendation *</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "Selected", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
                  { key: "Hold", color: "bg-amber-50 text-amber-800 border-amber-300" },
                  { key: "Rejected", color: "bg-rose-50 text-rose-800 border-rose-300" },
                ].map((rec) => (
                  <button
                    key={rec.key}
                    type="button"
                    onClick={() => setRecommendation(rec.key as any)}
                    className={`py-2 rounded-lg font-bold text-xs border transition-all ${
                      recommendation === rec.key
                        ? `${rec.color} ring-2 ring-[#005BBB]`
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {rec.key.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Technical Feedback & Recommendation Remarks *
              </label>
              <textarea
                rows={3}
                placeholder="Highlight strengths, code quality, and specific justification for hiring recommendation..."
                value={feedbackRemarks}
                onChange={(e) => setFeedbackRemarks(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" type="button" onClick={() => setEvaluatingSession(null)}>
                Cancel
              </Button>
              <Button variant="cyan" type="submit">
                Lock Rubric & Submit Decision
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Technical Interview Session"
        subtitle="Book online Google Meet or on-campus technical panel slots."
        size="md"
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Candidate Name *</label>
            <input
              type="text"
              placeholder="e.g. Bharath Royal"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Window</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 02:00 PM - 02:45 PM"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom)</label>
            <input
              type="text"
              value={newMeetLink}
              onChange={(e) => setNewMeetLink(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Confirm & Book Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
