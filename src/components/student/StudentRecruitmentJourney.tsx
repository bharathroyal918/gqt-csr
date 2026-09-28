"use client";

import React from "react";
import { Clock } from "lucide-react";
import { JourneyStage } from "@/hooks/useStudentSession";

interface StudentRecruitmentJourneyProps {
  stages: JourneyStage[];
}

export function StudentRecruitmentJourney({ stages }: StudentRecruitmentJourneyProps) {
  const completedStagesCount = stages.filter((s) => s.done).length;
  const progressPct = Math.round((completedStagesCount / stages.length) * 100);

  return (
    <div className="p-6 bg-card border border-border shadow-sm rounded-3xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recruitment Lifecycle Milestone Tracker (10 Stages)
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time status synchronized with corporate database & event bus
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary">
            {completedStagesCount} of {stages.length} Stages Cleared ({progressPct}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 10 Stages Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`p-2 rounded-xl border text-center transition-all ${stage.done
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 shadow-xs"
                : "bg-muted/30 border-border/60 text-muted-foreground"
              }`}
          >
            <div
              className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-[10px] font-bold ${stage.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                }`}
            >
              {stage.done ? "✓" : stage.id}
            </div>
            <span className="text-[10px] font-bold block leading-tight truncate" title={stage.title}>
              {stage.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
