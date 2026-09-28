"use client";

import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  let dotColor = "bg-slate-400";

  if (
    norm.includes("active") ||
    norm.includes("completed") ||
    norm.includes("selected") ||
    norm.includes("accepted") ||
    norm.includes("qualified") ||
    norm.includes("confirmed") ||
    norm.includes("done") ||
    norm.includes("present")
  ) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    dotColor = "bg-emerald-500";
  } else if (
    norm.includes("open") ||
    norm.includes("pipeline") ||
    norm.includes("progress") ||
    norm.includes("scheduled") ||
    norm.includes("in discussion") ||
    norm.includes("sent") ||
    norm.includes("hall ticket")
  ) {
    styles = "bg-blue-50 text-[#005BBB] border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    dotColor = "bg-[#005BBB]";
  } else if (
    norm.includes("pending") ||
    norm.includes("hold") ||
    norm.includes("tentative") ||
    norm.includes("clarification") ||
    norm.includes("review") ||
    norm.includes("warning")
  ) {
    styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    dotColor = "bg-amber-500";
  } else if (
    norm.includes("rejected") ||
    norm.includes("disqualified") ||
    norm.includes("cancelled") ||
    norm.includes("overdue") ||
    norm.includes("absent") ||
    norm.includes("inactive")
  ) {
    styles = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    dotColor = "bg-rose-500";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${sizeClasses[size]} ${styles} ${className} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {status}
    </span>
  );
}
