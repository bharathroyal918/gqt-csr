"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Filter, Download, Search, LucideIcon } from "lucide-react";

interface PortalPlaceholderPageProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon: LucideIcon;
  actionButtonText?: string;
  onAction?: () => void;
  entityName?: string;
  columns?: string[];
  rows?: Array<Record<string, string | number>>;
  mockRows?: Array<Record<string, string | number>>;
}

export function PortalPlaceholderPage({
  title,
  subtitle,
  badge,
  icon: Icon,
  actionButtonText,
  onAction,
  entityName = "records",
  columns = ["ID", "Name", "Category", "Status", "Last Updated"],
  rows,
  mockRows,
}: PortalPlaceholderPageProps) {
  const displayRows = rows || mockRows;
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold uppercase tracking-wider mb-1">
              {badge}
            </span>
          )}
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Icon className="w-5 h-5 text-[#005BBB] dark:text-[#14B8FF]" />
            <span>{title}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
          {actionButtonText && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAction}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {actionButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <Card>
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${entityName.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              Filter
            </Button>
          </div>
        </div>

        {/* Data View */}
        <CardContent className="p-0">
          {displayRows && displayRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    {columns.map((col, idx) => (
                      <th key={idx} className="p-3.5">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {displayRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState
                icon={Icon}
                title={`No ${entityName} Found`}
                description={`No active records found in the database. New entries synchronized from Supabase will appear here.`}
                actionText={actionButtonText}
                onAction={onAction}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
