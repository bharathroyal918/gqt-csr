"use client";

import React from "react";
import { Plus } from "lucide-react";

export interface KanbanColumn<T> {
  id: string;
  title: string;
  badgeCount?: number;
  items: T[];
}

interface KanbanBoardProps<T> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T, columnId: string) => React.ReactNode;
  onAddItem?: (columnId: string) => void;
  addItemLabel?: string;
}

export function KanbanBoard<T>({
  columns,
  renderCard,
  onAddItem,
  addItemLabel = "Add Item",
}: KanbanBoardProps<T>) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[600px]">
      {columns.map((column) => (
        <div
          key={column.id}
          className="w-80 shrink-0 bg-slate-50/80 dark:bg-[#111C3A]/60 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 flex flex-col max-h-[80vh]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {column.title}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold">
                {column.badgeCount ?? column.items.length}
              </span>
            </div>

            {onAddItem && (
              <button
                onClick={() => onAddItem(column.id)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                title={addItemLabel}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {column.items.map((item, index) => (
              <div key={index} className="transition-transform hover:-translate-y-0.5 duration-200">
                {renderCard(item, column.id)}
              </div>
            ))}

            {column.items.length === 0 && (
              <div className="h-28 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] text-slate-400">
                No cards in this column
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
