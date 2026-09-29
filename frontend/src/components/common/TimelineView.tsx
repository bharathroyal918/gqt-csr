"use client";

import React from "react";
import { Clock } from "lucide-react";

export interface TimelineItem {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ElementType;
  author?: string;
}

interface TimelineViewProps {
  items: TimelineItem[];
}

export function TimelineView({ items }: TimelineViewProps) {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {items.map((item) => {
        const Icon = item.icon || Clock;

        return (
          <div key={item.id} className="relative group">
            {/* Dot Indicator */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-[#005BBB] dark:border-[#14B8FF] flex items-center justify-center text-[#005BBB] group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-[#005BBB] dark:bg-[#14B8FF]" />
            </div>

            {/* Content Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.timestamp}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                {item.author && <span>By: {item.author}</span>}
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold text-[10px] text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
