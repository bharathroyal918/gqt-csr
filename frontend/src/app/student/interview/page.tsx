"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Award,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileCheck,
  MapPin,
  HelpCircle,
  RefreshCw,
  Send,
  Building,
  Star,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentInterviewPage() {
  const { student, examResult } = useStudentSession();

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const interview = student?.interviewResult;
  const isExamAttempted = !!examResult || student?.status === "Exam Completed";
  const isExamQualified = examResult?.qualified ?? true;

  const isSelected =
    student?.status === "HR Selected" ||
    student?.status === "Offer Sent" ||
    student?.status === "Offer Accepted" ||
    interview?.status === "Selected";

  const isHold = student?.status === "HR On Hold" || interview?.status === "Hold";
  const isRejected = student?.status === "HR Rejected" || interview?.status === "Rejected";

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRescheduleOpen(false);
    toast.success("Reschedule Request Dispatched to HR Panel", {
      description: "Our talent acquisition team has received your request and will follow up with an updated slot.",
    });
  };

  const scheduledDate = interview?.scheduledSlot
    ? new Date(interview.scheduledSlot).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const scheduledTime = interview?.scheduledSlot
    ? new Date(interview.scheduledSlot).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const meetingLink = interview?.meetingLink || "";

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Round 2 Technical & HR Interview Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interview Evaluation & Schedule
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Live Google Meet meeting credentials, designated technical corporate panel, interview rubrics, and shortlisting status.
            </p>
          </div>

          {isSelected ? (
            <Link href="/student/offer-letter">
              <button className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all">
                <Award className="w-4 h-4" />
                <span>View Issued Offer Letter</span>
              </button>
            </Link>
          ) : interview?.scheduledSlot ? (
            <a href={meetingLink} target="_blank" rel="noreferrer">
              <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#14B8FF] to-[#007BFF] hover:from-[#007BFF] hover:to-[#005BBB] text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all">
                <Video className="w-4 h-4" />
                <span>Join Google Meet</span>
              </button>
            </a>
          ) : null}
        </div>
      </div>

      {/* Main Condition Flow */}
      {!isExamAttempted ? (
        /* 1. Exam Not Taken */
        <div className="p-10 rounded-[28px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-[#005BBB] flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Online Assessment Prerequisite
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            The interview stage unlocks after clearing the online proctored examination. You have not attempted the exam yet.
          </p>
          <Link href="/student/exam" className="inline-block pt-2">
            <button className="px-6 py-2.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold shadow-md hover:bg-[#004494] transition-colors flex items-center gap-2 mx-auto">
              <span>Enter Exam Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : !isExamQualified ? (
        /* 2. Disqualified in Exam */
        <div className="p-10 rounded-[28px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900">
            <XCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Assessment Cutoff Threshold Not Reached
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your score ({student?.examResult?.marksObtained || 0} marks / {student?.examResult?.percentage || 0}%) was below the 50% cutoff required for the technical interview round.
          </p>
          <Link href="/student/result" className="inline-block pt-2">
            <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              View Detailed Scorecard
            </button>
          </Link>
        </div>
      ) : !interview ? (
        /* 3. Qualified, Interview Pending Scheduling from HR */
        <div className="p-10 rounded-[28px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Assessment Qualified! Interview Queue Assigned
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Congratulations! You have satisfied the examination cutoff ({student.examResult?.percentage}%). The Corporate Talent Acquisition panel is currently allocating your interview slot and Google Meet credentials.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto text-left space-y-2">
            <span className="font-bold text-[#005BBB] dark:text-[#14B8FF] block">
              Interview Round Structure:
            </span>
            <ul className="space-y-1 list-disc pl-4 text-[11px]">
              <li>Core Programming & OOP Concepts (Java / Python)</li>
              <li>Database Design & SQL Aggregations</li>
              <li>Problem Solving, Logic & Agentic AI Fundamentals</li>
              <li>Communication, Behavioral & CSR Program Fitment</li>
            </ul>
          </div>
        </div>
      ) : (
        /* 4. Active Interview Scheduled or Conducted */
        <div className="space-y-6">
          {/* Main Interview Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Date & Time */}
            <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-[#005BBB]" />
                <span>Date & Time</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {scheduledDate || "Not Scheduled"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#005BBB]" />
                <span>{scheduledTime || "Pending Allocation"}</span>
              </p>
            </div>

            {/* Card 2: Status */}
            <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Interview Status</span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  isSelected
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : isHold
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : isRejected
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-blue-100 text-[#005BBB] dark:bg-blue-950 dark:text-blue-300"
                }`}
              >
                {interview.status || "Pending"}
              </span>
              <p className="text-[11px] text-slate-400 mt-2">Recruitment Stage 2</p>
            </div>

            {/* Card 3: Mode & Platform */}
            <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Meeting Mode</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Google Meet Video Call
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
                Virtual Video Conference
              </p>
            </div>

            {/* Card 4: Panel Members */}
            <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Interview Panel</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {interview.interviewerName || "Interview Panel"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {interview.interviewerRole || "Technical & HR Panel"}
              </p>
            </div>
          </div>

          {/* Action Callout Card */}
          <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Video Conference Link
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#005BBB] dark:text-[#14B8FF]">
                  {meetingLink}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRescheduleOpen(true)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Reschedule</span>
              </button>

              <a href={meetingLink} target="_blank" rel="noreferrer">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:from-[#005BBB] hover:to-[#004494] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all">
                  <Video className="w-4 h-4" />
                  <span>Join Meeting Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </a>
            </div>
          </div>

          {/* Interview Evaluation Remarks if Conducted */}
          {interview.remarks && (
            <div className="p-6 rounded-[24px] bg-slate-50 dark:bg-[#111C3A] border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  HR Panel Evaluation Feedback
                </h4>
                <span className="text-xs text-slate-400">
                  Recorded in Supabase HR Engine
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{interview.remarks}"
              </div>

              {interview.ratings && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">Technical Skills</span>
                    <div className="flex items-center gap-1 font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{interview.ratings.technicalSkills || 4} / 5</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">Problem Solving</span>
                    <div className="flex items-center gap-1 font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{interview.ratings.problemSolving || 4} / 5</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">Communication</span>
                    <div className="flex items-center gap-1 font-bold text-amber-500 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{interview.ratings.communication || 4} / 5</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">Overall Rating</span>
                    <div className="flex items-center gap-1 font-bold text-emerald-600 mt-1">
                      <Star className="w-3.5 h-3.5 fill-emerald-500" />
                      <span>{interview.ratings.overall || 4} / 5</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Request Slot Reschedule
            </h3>
            <p className="text-xs text-slate-500">
              Provide your reason and preferred alternative availability for the HR panel.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reason for Rescheduling
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. University semester exam clash or laboratory examination"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold shadow-md hover:bg-[#004494]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
