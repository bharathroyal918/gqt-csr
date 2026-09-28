import React from "react";
import { Calendar, MoreVertical } from "lucide-react";

export interface KanbanCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  dueDate?: string;
  assigneeName?: string;
  statusBadge?: string;
  onClick?: () => void;
}

export function KanbanCard({
  title,
  subtitle,
  category,
  priority = "Medium",
  dueDate,
  assigneeName,
  statusBadge,
  onClick,
}: KanbanCardProps) {
  const priorityColors = {
    Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    High: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    Urgent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 cursor-pointer space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {category && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {category}
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[priority]}`}
          >
            {priority}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        {dueDate && (
          <div className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{dueDate}</span>
          </div>
        )}
        {assigneeName && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#005BBB] text-white text-[9px] font-bold flex items-center justify-center">
              {assigneeName[0]}
            </div>
            <span className="truncate max-w-[80px]">{assigneeName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
