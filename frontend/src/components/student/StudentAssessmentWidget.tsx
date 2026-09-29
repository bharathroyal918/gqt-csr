"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Award, CheckCircle2, ArrowRight, Timer, Users } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Student, CSRDrive, ExamResult } from "@/types";

interface StudentAssessmentWidgetProps {
  student: Student;
  activeDrive?: CSRDrive;
  examResult: ExamResult | null;
}

export function StudentAssessmentWidget({
  student,
  activeDrive,
  examResult,
}: StudentAssessmentWidgetProps) {
  const [countdown, setCountdown] = useState<string>("45:00");

  useEffect(() => {
    if (examResult) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const [mins, secs] = prev.split(":").map(Number);
        if (mins === 0 && secs === 0) return "00:00";
        if (secs === 0) return `${mins - 1}:59`;
        return `${mins}:${secs < 11 ? "0" : ""}${secs - 1}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examResult]);

  if (examResult) {
    return (
      <div className="p-6 bg-card border border-emerald-200 dark:border-emerald-900/60 shadow-lg rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                Assessment Evaluated
              </span>
              <h2 className="text-lg font-bold text-foreground">
                Official CSR Scorecard Summary
              </h2>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${examResult.qualified
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {examResult.qualified ? "Qualified for HR Round" : "Did Not Qualify"}
          </span>
        </div>

        {/* Scorecard KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Score</span>
            <span className="text-xl font-extrabold text-foreground">
              {examResult.marksObtained} / {examResult.maxMarks || 100}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              {examResult.percentage}% aggregate
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">State Rank</span>
            <span className="text-xl font-extrabold text-primary">
              #{examResult.rank}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold block">
              Percentile: {examResult.percentile}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Attempted</span>
            <span className="text-xl font-extrabold text-foreground">
              {examResult.attempted} / {examResult.totalQuestions}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              {examResult.correct} correct
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Proctoring Telemetry</span>
            <span className="text-xl font-extrabold text-foreground">
              {examResult.violations?.length} Strikes
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block">Clean Verified</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link href="/student/result">
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>View Comprehensive Scorecard</span>
            </Button>
          </Link>
          {examResult.qualified && (
            <Link href="/student/interview">
              <Button variant="outline" className="text-xs font-bold flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Check Interview Slot</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Exam Pending View
  return (
    <div className="p-6 bg-card border border-blue-200 dark:border-blue-900/60 shadow-lg rounded-3xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-primary flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              Action Required
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Proctored CSR Technical Assessment
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Session Active
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
            <Timer className="w-3.5 h-3.5" />
            {countdown}
          </span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        You are registered for <strong>{activeDrive?.name || student.driveName}</strong>{(student.selectedCourse || student.branch) ? <> under the <strong>{student.selectedCourse || student.branch}</strong> track</> : ""}. Complete your 50-question proctored evaluation to unlock technical and HR interview rounds.
      </p>

      {/* Assessment Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
          <span className="text-muted-foreground block text-[10px]">Timer</span>
          <span className="font-bold text-foreground">60 Minutes</span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
          <span className="text-muted-foreground block text-[10px]">Proctoring</span>
          <span className="font-bold text-emerald-600">Strict Anti-Cheat</span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
          <span className="text-muted-foreground block text-[10px]">Cutoff Score</span>
          <span className="font-bold text-primary">85% </span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
          <span className="text-muted-foreground block text-[10px]">Sync Engine</span>
          <span className="font-bold text-emerald-600">Auto Save</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link href="/student/exam" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto text-xs font-bold h-11 flex items-center gap-2">
            <span>Enter Exam Room & Pre-Flight</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href="/student/exam/instructions">
          <Button variant="outline" className="text-xs font-bold h-11">
            Read Candidate Guidelines
          </Button>
        </Link>
      </div>
    </div>
  );
}
