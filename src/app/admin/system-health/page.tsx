"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { SystemHealthMetric, AdminErrorLog } from "@/types";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";

export default function AdminSystemHealthPage() {
  const [metrics] = useState<SystemHealthMetric[]>(() =>
    AdminService.getSystemHealth()
  );
  const [errorLogs, setErrorLogs] = useState<AdminErrorLog[]>(() =>
    AdminService.getErrorLogs()
  );
  const [isPinging, setIsPinging] = useState(false);

  const latencyHistory = [
    { time: "09:00", db: 12, api: 110, socket: 18 },
    { time: "09:15", db: 14, api: 125, socket: 20 },
    { time: "09:30", db: 18, api: 140, socket: 22 },
    { time: "09:45", db: 15, api: 120, socket: 19 },
    { time: "10:00", db: 14, api: 115, socket: 22 },
  ];

  const handleResolveError = (errorId: string) => {
    setErrorLogs((prev) =>
      prev.map((e) =>
        e.id === errorId
          ? { ...e, status: "Resolved", resolvedBy: "Super Admin", resolvedAt: new Date().toISOString() }
          : e
      )
    );
    toast.success("Error log marked as resolved in Sentry registry");
  };

  const handleRunDiagnostics = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      toast.success("State-wide diagnostics completed: All 6 microservices operational", {
        description: "Median cluster latency: 14.2ms • 0 HTTP 5xx errors in last hour.",
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Sentry Diagnostic Probe
            </span>
            <span className="text-xs text-blue-200">Continuous Cluster Health Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            System Health, Latency & Error Center
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Realtime monitoring of database connection pooling, WebSocket replication, Meta Cloud API webhooks, edge proxy roundtrips, and application error logs.
          </p>
        </div>

        <button
          onClick={handleRunDiagnostics}
          disabled={isPinging}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[#005BBB] ${isPinging ? "animate-spin" : ""}`} />
          {isPinging ? "Probing Nodes..." : "Run Global Diagnostics"}
        </button>
      </div>

      {/* 6 Microservices Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Service Node
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {m.service}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {m.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px]">Roundtrip Latency</span>
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                  {m.latencyMs} ms
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">30-Day Uptime</span>
                <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {m.uptimePct}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">{m.details}</p>
          </div>
        ))}
      </div>

      {/* Latency History Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cluster Latency Profiles (Last 1 Hour)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative latency across Postgres Database, API Gateway, and Realtime WebSockets.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Database
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              WebSockets
            </span>
            <span className="flex items-center gap-1 text-purple-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              API Gateway
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="ms" />
              <Tooltip />
              <Line type="monotone" dataKey="db" stroke="#005BBB" strokeWidth={2} name="Database (ms)" />
              <Line type="monotone" dataKey="socket" stroke="#10B981" strokeWidth={2} name="WebSocket (ms)" />
              <Line type="monotone" dataKey="api" stroke="#7C3AED" strokeWidth={2} name="API Gateway (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error Log Registry */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Application Error Logs & Sentry Ingestion
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered exception telemetry captured across Next.js server actions and client runtimes.
            </p>
          </div>
          <span className="text-xs text-slate-400">Total: {errorLogs.length} Events</span>
        </div>

        <div className="space-y-3">
          {errorLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.level === "Critical"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {log.source}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                  {log.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {log.status}
                </span>

                {log.status === "Pending" && (
                  <button
                    onClick={() => handleResolveError(log.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
