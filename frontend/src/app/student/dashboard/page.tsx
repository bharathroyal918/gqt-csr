"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Search,
  X,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { useStudentSession } from "@/hooks/useStudentSession";
import { StudentHeroBanner } from "@/components/student/StudentHeroBanner";
import { StudentRecruitmentJourney } from "@/components/student/StudentRecruitmentJourney";
import { StudentAssessmentWidget } from "@/components/student/StudentAssessmentWidget";
import { StudentBatchAttendanceWidget } from "@/components/student/StudentBatchAttendanceWidget";
import { StudentRecruitmentDeskWidget } from "@/components/student/StudentRecruitmentDeskWidget";
import { StudentQuickHub } from "@/components/student/StudentQuickHub";
import { StudentActivityStream } from "@/components/student/StudentActivityStream";
import { StudentHallTicketModal } from "@/components/student/StudentHallTicketModal";
import { EditStudentProfileModal } from "@/components/student/EditStudentProfileModal";

export default function StudentDashboardPage() {
  const {
    student,
    isLoading,
    activeDrive,
    profileCompletion,
    registrationNumber,
    initials,
    journeyStages,
    examResult,
    leadTrainer,
    studentAttendanceRate,
    greeting,
    activities,
    updateProfile,
    uploadAvatar,
    recordHallTicketDownload,
  } = useStudentSession();

  const [isHallTicketModalOpen, setIsHallTicketModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search Knowledge Items dynamically
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const items = [
      { type: "Announcement", title: "Statewide CSR Drive Technical Schedule Released", link: "/student/announcements" },
      { type: "Announcement", title: "Virtual Lab Instructions & Compiler Guidelines", link: "/student/announcements" },
      { type: "Notification", title: "Hall Ticket Verified & Examination Seat Allocated", link: "/student/notifications" },
      { type: "FAQ", title: "Minimum Assessment Cutoff Score (85% Required)", link: "/student/exam" },
      { type: "FAQ", title: "95% Mandatory Attendance Policy for Batch Certification", link: "/student/attendance" },
      { type: "Support", title: "Submit Helpdesk Inquiry or Ticket", link: "/student/helpdesk" },
      ...(activeDrive?.name ? [{ type: "Drive", title: activeDrive.name, link: "/student/csr-drives" }] : []),
      { type: "Document", title: "My Resume Vault & Uploaded Marksheets", link: "/student/documents" },
      { type: "Attendance", title: "Batch Sessions & Biometric QR Check-In", link: "/student/attendance" },
    ];

    return items.filter((item) => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));
  }, [searchQuery, activeDrive]);

  if (isLoading && !student.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">
          Synchronizing candidate profile from corporate database...
        </p>
      </div>
    );
  }

  if (!isLoading && !student.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Session Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Your login session could not be resolved. Please sign in again to access your student dashboard.
          </p>
        </div>
        <Link
          href="/student/login"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2"
        >
          <span>Sign In to Student Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* TOP SEARCH BAR */}
      <div className="relative">
        <div className="relative rounded-2xl bg-card border border-border/80 shadow-xs backdrop-blur-md overflow-hidden flex items-center px-4 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search announcements, examination FAQs, notifications, support tickets, drives, or documents..."
            className="w-full text-xs bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-2xl p-2 divide-y divide-border/40 max-h-72 overflow-y-auto"
            >
              {searchResults.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center justify-between p-2.5 hover:bg-muted/40 rounded-xl transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                      {item.type}
                    </span>
                    <span className="font-semibold text-foreground">{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Incomplete Notification Banner */}
      {profileCompletion < 100 && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <span>Profile Completion: {profileCompletion}%</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-normal text-amber-700 dark:text-amber-300">Mandatory Details Pending</span>
              </div>
              <p className="text-xs text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                Complete your academic details and resume to unlock official hall ticket validation and interview shortlisting.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Complete Profile Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HERO BANNER COMPONENT */}
      <StudentHeroBanner
        student={student}
        greeting={greeting}
        registrationNumber={registrationNumber}
        profileCompletion={profileCompletion}
        initials={initials}
        examResult={examResult}
        onEditProfile={() => setIsEditProfileModalOpen(true)}
        onOpenHallTicket={() => setIsHallTicketModalOpen(true)}
        onUploadAvatar={uploadAvatar}
      />

      {/* RECRUITMENT JOURNEY MILESTONE TRACKER */}
      <StudentRecruitmentJourney stages={journeyStages} />

      {/* MAIN TWO-COLUMN DASHBOARD WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment Widget (Scorecard or Exam Launcher) */}
          <StudentAssessmentWidget
            student={student}
            activeDrive={activeDrive}
            examResult={examResult}
          />

          {/* Quick Access Module Hub */}
          <StudentQuickHub />

          {/* Attendance Summary & Batch Information */}
          <StudentBatchAttendanceWidget
            student={student}
            attendanceRate={studentAttendanceRate}
            leadTrainer={leadTrainer}
          />
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Corporate Recruitment Desk */}
          <StudentRecruitmentDeskWidget
            student={student}
            activeDrive={activeDrive}
            examResult={examResult}
          />

          {/* Support Tickets Status Widget */}
          <div className="p-6 bg-card border border-border shadow-sm rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Helpdesk & Inquiries
              </h3>
              <Link href="/student/helpdesk" className="text-[11px] font-bold text-primary hover:underline">
                Create Ticket
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-foreground">Active Helpdesk Channel</p>
                  <p className="text-[10px] text-muted-foreground">Examination & Hall Ticket Support</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Online
              </span>
            </div>
          </div>

          {/* Realtime Audit Activity Stream */}
          <StudentActivityStream activities={activities} />
        </div>
      </div>

      {/* HALL TICKET MODAL */}
      {isHallTicketModalOpen && (
        <StudentHallTicketModal
          isOpen={isHallTicketModalOpen}
          onClose={() => setIsHallTicketModalOpen(false)}
          student={student}
          activeDrive={activeDrive}
          initials={initials}
          onRecordDownload={recordHallTicketDownload}
        />
      )}

      {/* Edit Student Particulars Modal */}
      {isEditProfileModalOpen && (
        <EditStudentProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          student={student}
          onUpdated={(updated) => updateProfile(updated)}
        />
      )}
    </div>
  );
}
