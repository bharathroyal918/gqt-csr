"use client";

import React from "react";
import { LucideIcon, FolderSearch } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gqt-card border-dashed border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
        {title}
      </h4>
      <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400 max-w-md">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
