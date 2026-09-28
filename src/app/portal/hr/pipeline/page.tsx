"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Student, HRInterview } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Drawer } from "@/components/common/Drawer";
import {
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Star,
  ExternalLink,
  Award,
  CheckCircle2,
  XCircle,
  PauseCircle,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Send,
  Video,
} from "lucide-react";
import { toast } from "sonner";

export default function HRPipelinePage() {
  const { students, submitInterviewFeedback, sendOfferLetter, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentForFeedback, setSelectedStudentForFeedback] = useState<Student | null>(null);
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);

  // Rubric Feedback Form
  const [rubric, setRubric] = useState({
    technicalSkills: 5,
    problemSolving: 5,
    communication: 4,
    culturalFit: 5,
    overall: 5,
    status: "Selected" as HRInterview["status"],
    remarks: "Strong architectural thinking in Java & Agentic AI. Clear communication and collaborative attitude.",
    recommendation: "Selected for Full-time CSR Offer",
  });

  const kanbanColumns = [
    { id: "Qualified", title: "Qualified (Exam Passed)", statusKey: ["Qualified", "Exam Completed"] },
    { id: "HR Scheduled", title: "Interview Scheduled", statusKey: ["HR Scheduled", "Interview Scheduled"] },
    { id: "Technical Cleared", title: "Technical Cleared", statusKey: ["Technical Cleared"] },
    { id: "HR Cleared", title: "HR Cleared", statusKey: ["HR Cleared"] },
    { id: "Offer Pending", title: "Offer Pending Approval", statusKey: ["Offer Pending"] },
    { id: "Offer Released", title: "Offer Released", statusKey: ["Offer Released", "Offer Accepted", "Joined"] },
  ];

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.usn.toLowerCase().includes(q) ||
      s.collegeName.toLowerCase().includes(q)
    );
  });

  const handleOpenFeedback = (student: Student) => {
    setSelectedStudentForFeedback(student);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForFeedback) return;

    const interviewData: HRInterview = {
      id: `int-${Date.now().toString().slice(-4)}`,
      studentId: selectedStudentForFeedback.id,
      studentName: selectedStudentForFeedback.fullName,
      collegeName: selectedStudentForFeedback.collegeName,
      branch: selectedStudentForFeedback.branch,
      driveId: selectedStudentForFeedback.driveId,
      scheduledSlot: new Date().toISOString(),
      meetingLink: "https://meet.google.com/gqt-csr-live",
      interviewerName: `${currentUser?.name} (${currentUser?.role})`,
      interviewerRole: currentUser?.role,
      status: rubric.status,
      ratings: {
        technicalSkills: rubric.technicalSkills,
        problemSolving: rubric.problemSolving,
        communication: rubric.communication,
        culturalFit: rubric.culturalFit,
        overall: rubric.overall,
      },
      remarks: rubric.remarks,
      recommendation: rubric.recommendation,
      conductedAt: new Date().toISOString(),
    };

    submitInterviewFeedback(interviewData);
    setSelectedStudentForFeedback(null);
  };

  const handleQuickOfferIssue = (student: Student) => {
    sendOfferLetter({
      offerNumber: `GQT/OFFER/2026/${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentPhone: student.mobile,
      collegeName: student.collegeName,
      driveName: student.driveName,
      roleTitle: "Associate Software Engineer - Full Stack & AI",
      course: student.selectedCourse,
      batch: student.batch,
      ctc: "₹ 6,50,000 / annum",
      stipendDuringInternship: "₹ 20,000 / month",
      location: "Bengaluru Innovation Center, Karnataka",
      joiningDate: "2026-11-01",
      validUntil: "2026-10-15",
      status: "Sent",
      qrVerificationCode: `GQT-VERIFY-2026-${student.id.toUpperCase()}`,
      digitalSignatureUrl: "/images/signatures/director-signature.png",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            HR Interview Automation & Kanban
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Conduct technical panels, log 5-star rubric evaluations, and release digital offer letters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/hr/schedule"
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#005BBB]" />
            <span>Interview Schedule Calendar</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, USN, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <span className="text-xs font-bold text-slate-500">
          Total Candidates in Pipeline: <span className="text-[#005BBB]">{students.length}</span>
        </span>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kanbanColumns.map((col) => {
          const colCandidates = filteredStudents.filter((s) => col.statusKey.includes(s.status));

          return (
            <div
              key={col.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 flex flex-col min-h-[550px] shadow-xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-xs text-[#0F172A] dark:text-white uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold flex items-center justify-center">
                  {colCandidates.length}
                </span>
              </div>

              {/* Candidate Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colCandidates.length === 0 ? (
                  <p className="text-[11px] text-slate-400 py-10 text-center italic">
                    No candidates in this stage
                  </p>
                ) : (
                  colCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 group hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                    >
                      {/* Candidate Header */}
                      <div className="flex items-start gap-3">
                        {cand.photoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={cand.photoUrl}
                            alt={cand.fullName}
                            className="w-10 h-10 rounded-xl object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#005BBB] dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                            {cand.fullName?.charAt(0) || "C"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => setSelectedStudentForDrawer(cand)}
                            className="font-bold text-xs text-[#0F172A] dark:text-white hover:text-[#005BBB] cursor-pointer truncate"
                          >
                            {cand.fullName}
                          </h4>
                          <span className="text-[10px] font-mono font-semibold text-[#005BBB] block">
                            {cand.usn}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {cand.collegeName ? cand.collegeName.split("(")[0] : "College"}
                          </span>
                        </div>
                      </div>

                      {/* Marks / Performance pill */}
                      {cand.examResult && (
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[11px] flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Exam Score:</span>
                          <span className="font-extrabold text-[#005BBB] dark:text-blue-400">
                            {cand.examResult.marksObtained}/100 ({cand.examResult.percentage}%)
                          </span>
                        </div>
                      )}

                      {/* Interview Ratings pill if conducted */}
                      {cand.interviewResult?.ratings && (
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[11px] flex items-center justify-between">
                          <span className="text-slate-500 font-medium">HR Rating:</span>
                          <span className="font-extrabold text-purple-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {cand.interviewResult.ratings.overall}/5
                          </span>
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="space-y-1.5 pt-1">
                        {/* Evaluate Rubric button */}
                        <button
                          onClick={() => handleOpenFeedback(cand)}
                          className="w-full py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] dark:text-blue-300 text-[11px] font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <Award className="w-3 h-3" /> Evaluate Candidate
                        </button>

                        {/* Issue Offer Letter Button if Selected */}
                        {cand.status === "HR Selected" && (
                          <button
                            onClick={() => handleQuickOfferIssue(cand)}
                            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-[11px] font-extrabold shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Issue Offer Letter
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Profile Drawer */}
      <Drawer
        isOpen={!!selectedStudentForDrawer}
        onClose={() => setSelectedStudentForDrawer(null)}
        title={selectedStudentForDrawer?.fullName}
        subtitle={`USN: ${selectedStudentForDrawer?.usn} • ${selectedStudentForDrawer?.collegeName}`}
        width="lg"
      >
        {selectedStudentForDrawer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {selectedStudentForDrawer.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedStudentForDrawer.photoUrl}
                  alt={selectedStudentForDrawer.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-[#005BBB] dark:text-blue-300 font-bold flex items-center justify-center text-lg">
                  {selectedStudentForDrawer.fullName?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <h4 className="font-extrabold text-base text-[#0F172A] dark:text-white">
                  {selectedStudentForDrawer.fullName}
                </h4>
                <p className="text-xs text-[#005BBB] font-mono font-bold">{selectedStudentForDrawer.usn}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStudentForDrawer.branch} ({selectedStudentForDrawer.passingYear})</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-slate-400">Academic & Contact</h5>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[#0F172A] dark:text-slate-200">
                <p>• Email: <span className="font-bold">{selectedStudentForDrawer.email}</span></p>
                <p>• Mobile: <span className="font-bold">{selectedStudentForDrawer.mobile}</span></p>
                <p>• CGPA: <span className="font-bold text-[#005BBB]">{selectedStudentForDrawer.cgpa}</span></p>
                <p>• Preferred Training Mode: <span className="font-bold">{selectedStudentForDrawer.preferredTrainingMode}</span></p>
              </div>
            </div>

            {selectedStudentForDrawer.examResult && (
              <div className="space-y-2 text-xs">
                <h5 className="font-bold uppercase tracking-wider text-slate-400">Online Exam Performance</h5>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 space-y-1">
                  <p>• Score: <strong>{selectedStudentForDrawer.examResult.marksObtained}/100 Marks</strong></p>
                  <p>• State Percentile: <strong>{selectedStudentForDrawer.examResult.percentile}% (Rank #{selectedStudentForDrawer.examResult.rank})</strong></p>
                  <p>• Proctor Violations: <strong>{selectedStudentForDrawer.examResult.violations.length}</strong></p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => {
                  const s = selectedStudentForDrawer;
                  setSelectedStudentForDrawer(null);
                  handleOpenFeedback(s);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Open Evaluation Rubric
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* HR Evaluation Rubric Modal */}
      <Modal
        isOpen={!!selectedStudentForFeedback}
        onClose={() => setSelectedStudentForFeedback(null)}
        title={`Interview Evaluation: ${selectedStudentForFeedback?.fullName}`}
        subtitle={`Candidate USN: ${selectedStudentForFeedback?.usn} • ${selectedStudentForFeedback?.branch}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          {/* 5-Star Criteria Grid */}
          <div className="space-y-3">
            {[
              { key: "technicalSkills", label: "1. Technical Competency & Coding" },
              { key: "problemSolving", label: "2. Algorithmic & Problem Solving" },
              { key: "communication", label: "3. Professional Communication" },
              { key: "culturalFit", label: "4. Cultural & Team Collaboration" },
              { key: "overall", label: "5. Overall Interview Recommendation" },
            ].map((crit) => {
              const currentVal = rubric[crit.key as keyof typeof rubric] as number;

              return (
                <div key={crit.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                    {crit.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRubric({ ...rubric, [crit.key]: star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= currentVal ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-1.5">{currentVal}/5</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Final Decision
            </label>
            <select
              value={rubric.status}
              onChange={(e) => setRubric({ ...rubric, status: e.target.value as HRInterview["status"] })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="Selected" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Selected - Recommend Full-time CSR Offer</option>
              <option value="Hold" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Hold - Second Panel Round Needed</option>
              <option value="Rejected" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Rejected - Does not meet baseline</option>
              <option value="Not Attended" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Not Attended / Absent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Interviewer Remarks
            </label>
            <textarea
              rows={3}
              value={rubric.remarks}
              onChange={(e) => setRubric({ ...rubric, remarks: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedStudentForFeedback(null)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Log Interview Evaluation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
