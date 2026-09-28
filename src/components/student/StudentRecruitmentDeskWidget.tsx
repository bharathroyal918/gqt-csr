"use client";

import React from "react";
import Link from "next/link";
import { Users, Calendar, Video } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Student, CSRDrive, ExamResult } from "@/types";

interface StudentRecruitmentDeskWidgetProps {
  student: Student;
  activeDrive?: CSRDrive;
  examResult: ExamResult | null;
}

export function StudentRecruitmentDeskWidget({
  student,
  activeDrive,
  examResult,
}: StudentRecruitmentDeskWidgetProps) {
  return (
    <div className="p-6 bg-card border border-border shadow-sm rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Corporate Recruitment Desk
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          LIVE
        </span>
      </div>

      {student.offerDetails ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Offer Letter Released!
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full">
              {student.offerDetails.status}
            </span>
          </div>
          <div className="text-sm font-extrabold text-foreground">
            {student.offerDetails.roleTitle}
          </div>
          <div className="text-xs text-muted-foreground">
            CTC: <strong className="text-foreground">{student.offerDetails.ctc}</strong> • Stipend: {student.offerDetails.stipendDuringInternship}
          </div>
          <Link href="/student/offer-letter" className="block pt-2">
            <Button variant="primary" className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              Review & Accept Offer
            </Button>
          </Link>
        </div>
      ) : student.interviewResult ? (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300">
              Interview Scheduled
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full">
              {student.interviewResult.status}
            </span>
          </div>
          <div className="text-xs text-foreground">
            Panel Member: <strong>{student.interviewResult.interviewerName}</strong>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(student.interviewResult.scheduledSlot).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
          </div>
          {student.interviewResult.meetingLink && (
            <a
              href={student.interviewResult.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="block pt-2"
            >
              <Button variant="primary" className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 cursor-pointer">
                <Video className="w-3.5 h-3.5" />
                <span>Join Interview Room</span>
              </Button>
            </a>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center py-5 space-y-1.5">
          <Users className="w-7 h-7 text-muted-foreground mx-auto" />
          <h4 className="text-xs font-bold text-foreground">Recruitment Pipeline Stage</h4>
          <p className="text-[11px] text-muted-foreground">
            {examResult?.qualified
              ? "Score verified. The HR recruiting panel is assigning your technical interview slot."
              : "Complete and pass the examination assessment to unlock interview scheduling."}
          </p>
        </div>
      )}

      {/* Assigned Drive Particulars */}
      <div className="pt-2 border-t border-border text-xs space-y-1.5">
        <span className="text-muted-foreground text-[10px] uppercase font-bold block">Assigned CSR Drive</span>
        <div className="font-bold text-foreground truncate">
          {activeDrive?.name || student.driveName || ""}
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Mode: {activeDrive?.mode || student.preferredTrainingMode || "—"}</span>
          {activeDrive?.driveCode ? (
            <span className="font-mono">Code: {activeDrive.driveCode}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
