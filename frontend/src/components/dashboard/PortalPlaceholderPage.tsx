"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Filter, Download, Search, LucideIcon, FileSpreadsheet } from "lucide-react";
import { downloadCSV, downloadExcel } from "@/lib/exportUtils";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  const rawRows = useMemo(() => {
    return rows || mockRows || [];
  }, [rows, mockRows]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rawRows;
    const term = searchTerm.toLowerCase();
    return rawRows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(term)
      )
    );
  }, [rawRows, searchTerm]);

  const handleExportCSV = () => {
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");
    downloadCSV(`GQT_${safeTitle}`, filteredRows.length > 0 ? filteredRows : rawRows, columns);
  };

  const handleExportExcel = () => {
    const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");
    downloadExcel(`GQT_${safeTitle}`, filteredRows.length > 0 ? filteredRows : rawRows, columns);
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      // If actionButtonText indicates download or report, trigger export
      if (actionButtonText?.toLowerCase().includes("download") || actionButtonText?.toLowerCase().includes("report")) {
        handleExportCSV();
      } else {
        toast.info(`${actionButtonText || "Action"} triggered`, {
          description: `Action initiated for ${entityName}.`,
        });
      }
    }
  };

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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5 text-[#005BBB]" />}
            title="Download CSV to local system"
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
            title="Download Excel workbook to local system"
          >
            Excel
          </Button>
          {actionButtonText && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAction}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${entityName.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filterActive ? "primary" : "outline"}
              size="sm"
              onClick={() => {
                setFilterActive(!filterActive);
                if (filterActive) setSearchTerm("");
              }}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              {filterActive ? "Filters Active" : "Filter"}
            </Button>
            <span className="text-xs text-slate-500 font-medium">
              {filteredRows.length} of {rawRows.length} Records
            </span>
          </div>
        </div>

        {/* Data View */}
        <CardContent className="p-0">
          {filteredRows.length > 0 ? (
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
                  {filteredRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {columns.map((col, cIdx) => {
                        const val = (row as any)[col] ?? Object.values(row)[cIdx] ?? "-";
                        return (
                          <td key={cIdx} className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                            {String(val)}
                          </td>
                        );
                      })}
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
                description={
                  searchTerm
                    ? `No records matching "${searchTerm}". Try resetting search filter.`
                    : `No active records found in the database. New entries synchronized from Supabase will appear here.`
                }
                actionText={searchTerm ? "Clear Search" : actionButtonText}
                onAction={searchTerm ? () => setSearchTerm("") : handleAction}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
