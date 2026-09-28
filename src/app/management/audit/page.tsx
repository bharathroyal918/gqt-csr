"use client";

import React, { useState, useMemo } from "react";
import { ManagementService } from "@/services/management.service";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Info,
  Clock,
  Laptop,
  Globe,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagementAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");

  const logs = useMemo(() => {
    return ManagementService.getAuditLogs({
      search: searchQuery,
      role: roleFilter,
      module: moduleFilter,
    });
  }, [searchQuery, roleFilter, moduleFilter]);

  const handleExportAuditLogs = () => {
    ManagementService.exportToCSV("GQT_Governance_Audit_Trail_Log_2026", [
      ...logs.map((l) => ({
        "Log ID": l.id,
        Timestamp: l.timestamp,
        User: l.user,
        Role: l.role,
        Module: l.module,
        Action: l.action,
        "Old Value": l.oldValue || "N/A",
        "New Value": l.newValue || "N/A",
        "IP Address": l.ipAddress,
        Browser: l.browser,
        Device: l.device,
        Location: l.location,
        Severity: l.severity,
      })),
    ]);
    toast.success("Governance audit logs exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Corporate Governance & Compliance
            </span>
            <span className="text-xs text-blue-200">Immutable Cryptographic Audit Trail</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Enterprise Governance Audit Log Center
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Permanent, tamper-evident chronological ledger recording state modifications, phase transitions, authorization events, and security access across the GQT CSR platform.
          </p>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4 text-[#005BBB]" />
          Export Audit Logs
        </button>
      </div>

      {/* Control / Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, user, module, IP or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by Role"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles (Omnipresent)</option>
            <option value="super_admin">Super Administrator</option>
            <option value="csr_manager">CSR Manager</option>
            <option value="hr">HR Recruiter</option>
            <option value="management">Board Management</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            aria-label="Filter by Module"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platform Modules</option>
            <option value="CSR Drive Engine">CSR Drive Engine</option>
            <option value="Institutional MoU">Institutional MoU</option>
            <option value="Interview Evaluation">Interview Evaluation</option>
            <option value="Offer Expiry Engine">Offer Expiry Engine</option>
            <option value="Authentication Gateway">Authentication Gateway</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Immutable Audit Trail ({logs.length} Entries)
          </h2>
          <span className="text-xs text-slate-500">Read-Only Governance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp & Location</th>
                <th className="py-3 px-4">User & Role</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action & State Change</th>
                <th className="py-3 px-4">Client Telemetry</th>
                <th className="py-3 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-medium text-slate-900 dark:text-white">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {log.location}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.user}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {log.module}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-slate-900 dark:text-white">{log.action}</div>
                    {log.oldValue && log.newValue && (
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        <span className="text-rose-500 font-medium">{log.oldValue}</span> →{" "}
                        <span className="text-emerald-600 font-medium">{log.newValue}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      IP: {log.ipAddress}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                      {log.browser}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === "critical"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : log.severity === "warning"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
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
