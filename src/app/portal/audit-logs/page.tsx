"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
  Clock,
  Laptop,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const { auditLogs } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.ipAddress.includes(q);

    const matchesRole = roleFilter === "all" || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,User,Role,Action,Entity,IP Address,Details\n";
    filteredLogs.forEach((l) => {
      csvContent += `"${l.timestamp}","${l.user}","${l.userRole}","${l.action}","${l.entityType}","${l.ipAddress}","${l.details}"\n`;
    });
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `GQT_Audit_Log_Export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Audit Log Exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Immutable Security Ledger
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            System Audit Trail & Compliance Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable chronicle of all user actions, test events, proctoring violations, and offer dispatches.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          <span>Export Audit History (CSV)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit actions, IP addresses, users, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none"
          >
            <option value="all" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">All Roles</option>
            <option value="super_admin" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Super Admin</option>
            <option value="hr_recruiter" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">HR Recruiter</option>
            <option value="student" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Student</option>
            <option value="pto" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Placement Officer</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Action Type</th>
                <th className="p-3">Entity</th>
                <th className="p-3">IP & Client</th>
                <th className="p-3">Activity Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-[#0F172A] dark:text-white block">{log.user}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{log.userRole}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-[#005BBB]">
                    {log.action}
                  </td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">
                    {log.entityType}
                  </td>
                  <td className="p-3 font-mono text-slate-500 text-[11px]">
                    <div>{log.ipAddress}</div>
                    <span className="text-[9px] text-slate-400">{log.browser ? log.browser.split("(")[0] : "Browser"}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
