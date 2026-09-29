"use client";

import React, { useState } from "react";
import { CSR_15_PHASES, WorkflowPhaseDefinition, getNextPhase } from "@/lib/workflow/drivePhases";
import { CSRDrive } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface DrivePhaseTrackerProps {
  drive: CSRDrive;
  onPhaseAdvance?: (newPhaseOrder: number) => void;
}

export function DrivePhaseTracker({ drive, onPhaseAdvance }: DrivePhaseTrackerProps) {
  const { currentRole, logAuditAction } = useApp();

  // Determine current active phase (default to 4 if Registration Open, etc.)
  const getInitialPhaseOrder = () => {
    switch (drive.status) {
      case "Draft":
        return 1;
      case "Registration Open":
        return 4;
      case "Exam Scheduled":
        return 5;
      case "Exam In Progress":
        return 7;
      case "Evaluation Completed":
        return 8;
      case "HR Pipeline":
        return 10;
      case "Offer Phase":
        return 12;
      case "Completed":
      case "Archived":
        return 15;
      default:
        return 1;
    }
  };

  const [activePhaseOrder, setActivePhaseOrder] = useState<number>(getInitialPhaseOrder());
  const [selectedPhase, setSelectedPhase] = useState<WorkflowPhaseDefinition>(
    CSR_15_PHASES[activePhaseOrder - 1] || CSR_15_PHASES[0]
  );

  const handleAdvance = () => {
    const next = getNextPhase(activePhaseOrder);
    if (!next) {
      toast.info("This CSR Drive has successfully reached the final 15th phase!");
      return;
    }

    setActivePhaseOrder(next.order);
    setSelectedPhase(next);
    toast.success(`Stage Advanced: ${next.name}`, {
      description: `Automated trigger initiated next phase: ${next.shortName}`,
    });

    logAuditAction(
      "ADVANCE_DRIVE_PHASE",
      "CSR Drive",
      drive.id,
      `Drive ${drive.name} transitioned to Phase ${next.order}: ${next.code}`
    );

    if (onPhaseAdvance) {
      onPhaseAdvance(next.order);
    }
  };

  const progressPercentage = Math.round((activePhaseOrder / 15) * 100);

  return (
    <div className="gqt-card p-5 sm:p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-[11px] font-bold uppercase tracking-wider">
              15-Phase CSR Lifecycle
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Automated State Transition Engine
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <span>{drive.name}</span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              ({drive.driveCode})
            </span>
          </h3>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500">Overall Progress</p>
            <p className="text-lg font-extrabold text-[#005BBB] dark:text-[#14B8FF]">
              Phase {activePhaseOrder} of 15 ({progressPercentage}%)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#005BBB] dark:text-[#14B8FF] font-extrabold text-sm border border-blue-200 dark:border-blue-800">
            {progressPercentage}%
          </div>
        </div>
      </div>

      {/* 15 Horizontal Stepper Bubbles */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[760px] justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          {/* Active Fill Line */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#005BBB] dark:bg-[#14B8FF] transition-all duration-300 -z-0"
            style={{ width: `${((activePhaseOrder - 1) / 14) * 100}%` }}
          />

          {CSR_15_PHASES.map((p) => {
            const isCompleted = p.order < activePhaseOrder;
            const isCurrent = p.order === activePhaseOrder;
            const isSelected = selectedPhase.order === p.order;

            return (
              <button
                key={p.code}
                onClick={() => setSelectedPhase(p)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer`}
                title={`${p.order}. ${p.name}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-[#005BBB] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#14B8FF] text-[#001B4D] ring-4 ring-blue-100 dark:ring-blue-950 font-extrabold scale-110"
                      : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400"
                  } ${isSelected ? "ring-2 ring-[#005BBB]" : ""}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : p.order}
                </div>
                <span
                  className={`text-[10px] font-medium mt-1.5 max-w-[50px] truncate text-center ${
                    isCurrent
                      ? "font-bold text-[#005BBB] dark:text-[#14B8FF]"
                      : "text-slate-400"
                  }`}
                >
                  {p.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail Card */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              Phase {selectedPhase.order} of 15:
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedPhase.name}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Responsible: {selectedPhase.responsibleRole.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedPhase.description}
          </p>
        </div>

        {/* Action Button */}
        {selectedPhase.order === activePhaseOrder && activePhaseOrder < 15 && (
          <button
            onClick={handleAdvance}
            className="px-4 py-2 rounded-xl bg-[#005BBB] hover:bg-[#004899] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Complete & Trigger Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
