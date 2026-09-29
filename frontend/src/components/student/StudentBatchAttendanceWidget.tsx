"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Student } from "@/types";

interface StudentBatchAttendanceWidgetProps {
  student: Student;
  attendanceRate: number;
  leadTrainer: string;
}

export function StudentBatchAttendanceWidget({
  student,
  attendanceRate,
  leadTrainer,
}: StudentBatchAttendanceWidgetProps) {
  return (
    <div className="p-6 bg-card border border-border shadow-sm rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Batch & Training Attendance Summary</h3>
        </div>
        <Link href="/student/attendance" className="text-xs font-bold text-primary hover:underline">
          View Full Attendance Log →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Assigned Batch</span>
          <p className="font-mono font-bold text-sm text-foreground">{student.batch || "—"}</p>
          {student.preferredTrainingMode ? (
            <span className="text-[11px] text-muted-foreground block">{student.preferredTrainingMode}</span>
          ) : null}
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Attendance Standing</span>
          <p className="font-bold text-sm text-emerald-600">{attendanceRate}% Attended</p>
          <span className="text-[11px] text-muted-foreground block">
            {attendanceRate >= 85 ? "Meets 85% requirement" : "Attendance recovery required"}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Lead Trainer / Mentor</span>
          <p className="font-bold text-sm text-foreground">
            {leadTrainer || <span className="text-muted-foreground font-normal italic text-xs">Not assigned yet</span>}
          </p>
          {(student.selectedCourse || student.branch) ? (
            <span className="text-[11px] text-muted-foreground block">{student.selectedCourse || student.branch}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
