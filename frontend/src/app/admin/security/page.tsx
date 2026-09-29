"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { SecurityActiveSession, SecurityLoginEvent } from "@/types";
import {
  ShieldCheck,
  ShieldAlert,
  Laptop,
  Smartphone,
  Globe,
  Lock,
  LogOut,
  AlertTriangle,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSecurityPage() {
  const [sessions, setSessions] = useState<SecurityActiveSession[]>(() =>
    AdminService.getActiveSessions()
  );
  const [loginHistory] = useState<SecurityLoginEvent[]>(() =>
    AdminService.getLoginHistory()
  );

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Remote session terminated immediately", {
      description: "JWT access token revoked and browser redirected to login screen.",
    });
  };

  const handleTerminateAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrentSession));
    toast.warning("All non-current administrative sessions revoked", {
      description: "Staff and candidate sessions terminated across all nodes.",
    });
  };

  const handleExportSecurityLogs = () => {
    const rows = loginHistory.map((h) => ({
      Timestamp: h.timestamp,
      Email: h.email,
      Status: h.status,
      "IP Address": h.ipAddress,
      Browser: h.browser,
      Device: h.device,
      Location: h.location,
      "Failure Reason": h.failureReason || "N/A",
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Timestamp,Email,Status,IP Address,Browser,Device,Location,Failure Reason"]
        .concat(
          rows.map((r) =>
            Object.values(r)
              .map((v) => `"${v}"`)
              .join(",")
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `GQT_Security_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Security access logs exported to CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Perimeter Security Engine
            </span>
            <span className="text-xs text-blue-200">Zero-Trust Session Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Security Command & Session Management
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Live active session revocation, multi-device access control, failed login forensics, and IP rate-limiting telemetry across all GQT CSR sub-portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTerminateAllOtherSessions}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <LogOut className="w-4 h-4" />
            Terminate All Remote Sessions
          </button>
          <button
            onClick={handleExportSecurityLogs}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <Download className="w-4 h-4 text-[#005BBB]" />
            Export Security Logs
          </button>
        </div>
      </div>

      {/* Security Health Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Sessions</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{sessions.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block">All Nodes Healthy</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Failed Logins</span>
          <span className="text-2xl font-black text-rose-600 block">1</span>
          <span className="text-[10px] text-slate-500 block">Foreign IP Blocked</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Locked Accounts</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">0</span>
          <span className="text-[10px] text-emerald-600 font-semibold block">0 Compromised</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Devices Online</span>
          <span className="text-2xl font-black text-[#005BBB] dark:text-cyan-400 block">1,840</span>
          <span className="text-[10px] text-slate-500 block">Students & Staff</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Password Resets</span>
          <span className="text-2xl font-black text-purple-600 block">14</span>
          <span className="text-[10px] text-slate-500 block">Past 24 Hours</span>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">2FA Enforced</span>
          <span className="text-2xl font-black text-emerald-600 block">100%</span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">All Staff Accounts</span>
        </div>
      </div>

      {/* ACTIVE SESSIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-2">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              Live Authenticated Sessions ({sessions.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Super Admin can immediately kill any active session token across Karnataka.
            </p>
          </div>
          <span className="text-xs text-slate-400">Sync: WebSocket Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User Profile</th>
                <th className="py-3 px-4">Device & OS</th>
                <th className="py-3 px-4">IP & Location</th>
                <th className="py-3 px-4">Login Time</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {s.userName}
                      {s.isCurrentSession && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 rounded-full">
                          Your Session
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{s.userEmail} • <span className="font-semibold text-slate-700 dark:text-slate-300">{s.role}</span></div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{s.device} ({s.os})</div>
                    <div className="text-[11px] text-slate-400">{s.browser}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] font-medium text-slate-800 dark:text-slate-200">{s.ipAddress}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {s.location}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {new Date(s.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {s.lastActive}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {s.isCurrentSession ? (
                      <span className="text-[11px] font-bold text-slate-400">Active Node</span>
                    ) : (
                      <button
                        onClick={() => handleTerminateSession(s.id)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-900/60 transition-all"
                      >
                        Terminate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOGIN FORENSICS & AUDIT STREAM */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Recent Authentication Attempts & Security Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive telemetry of login successes, password reset requests, and throttled anomalies.
            </p>
          </div>
          <span className="text-xs text-slate-500">Last 24 Hours</span>
        </div>

        <div className="space-y-3">
          {loginHistory.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                {item.status === "Success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : item.status === "Blocked" ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <KeyRound className="w-4 h-4 text-purple-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {item.email}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    IP: {item.ipAddress} • {item.browser} ({item.device}) • {item.location}
                  </span>
                  {item.failureReason && (
                    <span className="text-[11px] font-semibold text-rose-600 block mt-0.5">
                      {item.failureReason}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === "Success"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : item.status === "Blocked"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
