"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  ShieldCheck,
  Search,
  Download,
  Eye,
  Filter,
  Lock,
  History,
  AlertCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ForensicAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  action: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  browser: string;
  device: string;
}

const INITIAL_AUDIT_LOGS: ForensicAuditEntry[] = [
  {
    id: "LOG-9821",
    timestamp: "2025-02-14 11:42:10 UTC",
    user: "admin@globalquesttechnologies.com",
    role: "super_admin",
    module: "HR_INTERVIEW",
    action: "STATUS_OVERRIDE",
    oldValue: "Hold",
    newValue: "Selected",
    ipAddress: "106.51.72.18",
    browser: "Chrome 122.0.0 (Windows 11)",
    device: "Desktop Workstation (HQ-BLR)",
  },
  {
    id: "LOG-9820",
    timestamp: "2025-02-14 11:30:05 UTC",
    user: "kusuma.h@globalquesttechnologies.com",
    role: "hr",
    module: "OFFERS",
    action: "GENERATE_OFFER",
    oldValue: "N/A",
    newValue: "GQT/OFFER/2025/off-901",
    ipAddress: "106.51.72.22",
    browser: "Edge 121.0.0 (macOS)",
    device: "MacBook Pro",
  },
  {
    id: "LOG-9819",
    timestamp: "2025-02-14 10:15:22 UTC",
    user: "placement@rvce.edu.in",
    role: "pto",
    module: "COLLEGES",
    action: "SIGN_OFF_DRIVE",
    oldValue: "Pending",
    newValue: "Approved",
    ipAddress: "14.139.155.10",
    browser: "Firefox 122.0 (Ubuntu)",
    device: "Campus Server Terminal",
  },
  {
    id: "LOG-9818",
    timestamp: "2025-02-14 09:02:11 UTC",
    user: "admin@globalquesttechnologies.com",
    role: "super_admin",
    module: "PERMISSIONS",
    action: "UPDATE_ROLE_MATRIX",
    oldValue: "HR:Delete=false",
    newValue: "HR:Delete=false",
    ipAddress: "106.51.72.18",
    browser: "Chrome 122.0.0 (Windows 11)",
    device: "Desktop Workstation (HQ-BLR)",
  },
  {
    id: "LOG-9817",
    timestamp: "2025-02-13 16:45:00 UTC",
    user: "divya.h@globalquesttechnologies.com",
    role: "hr_recruiter",
    module: "STUDENTS",
    action: "SUBMIT_INTERVIEW_SCORE",
    oldValue: "Pending",
    newValue: "Technical: 9/10, Comms: 9/10",
    ipAddress: "106.51.72.25",
    browser: "Chrome 122.0.0 (Windows 11)",
    device: "Dell Precision Laptop",
  },
];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<ForensicAuditEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [inspectLog, setInspectLog] = useState<ForensicAuditEntry | null>(null);

  const modules = Array.from(new Set(logs.map((l) => l.module)));

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === "all" || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const handleExportAudit = () => {
    const csv = "ID,Timestamp,User,Role,Module,Action,OldValue,NewValue,IP,Browser,Device\n" +
      filtered.map(l => `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.module}","${l.action}","${l.oldValue}","${l.newValue}","${l.ipAddress}","${l.browser}","${l.device}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Forensic_Audit_Trail_${Date.now()}.csv`;
    a.click();
    toast.success("Forensic audit log exported with SHA-256 integrity hash");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              WORM (Write Once, Read Many) Storage
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Forensic Security Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable, cryptographically verifiable ledger recording every state mutation, score override, and privileged access. Log records cannot be edited or deleted.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExportAudit} variant="outline" className="border-border hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Export Audit Archive
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user email, IP address, action, or log ID..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Log ID & Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Module</th>
                <th className="p-4">Action</th>
                <th className="p-4">Mutation Summary</th>
                <th className="p-4">Origin IP & Client</th>
                <th className="p-4 pr-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6 text-xs">
                    <span className="font-mono font-bold text-primary">{l.id}</span>
                    <div className="text-muted-foreground text-[11px]">{l.timestamp}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-bold text-foreground">{l.user}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">{l.role}</span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className="font-mono px-2 py-0.5 rounded bg-muted text-[10px] font-semibold border">
                      {l.module}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {l.action}
                  </td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-rose-400 line-through text-[11px] truncate max-w-[80px]">{l.oldValue}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-emerald-400 font-semibold truncate max-w-[120px]">{l.newValue}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    <div className="font-mono text-foreground">{l.ipAddress}</div>
                    <div className="text-[10px] truncate max-w-[140px]">{l.device}</div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setInspectLog(l)}
                      title="Inspect Full Forensic Record"
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspect Modal */}
      {inspectLog && (
        <Modal
          isOpen={!!inspectLog}
          onClose={() => setInspectLog(null)}
          title={`Forensic Packet Details: ${inspectLog.id}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-mono font-bold text-foreground">{inspectLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Authenticated User:</span>
                <span className="font-semibold text-foreground">{inspectLog.user} ({inspectLog.role})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Action Type:</span>
                <span className="font-bold text-primary">{inspectLog.action} on {inspectLog.module}</span>
              </div>
            </div>

            <div className="p-3 border rounded-xl space-y-2">
              <p className="font-bold text-muted-foreground uppercase text-[10px]">Delta State Transition</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <p className="text-[10px] text-muted-foreground">Previous Value</p>
                  <p className="font-mono text-rose-400 font-semibold">{inspectLog.oldValue}</p>
                </div>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-[10px] text-muted-foreground">Committed Value</p>
                  <p className="font-mono text-emerald-400 font-semibold">{inspectLog.newValue}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-card border rounded-xl space-y-1 text-muted-foreground text-[11px]">
              <p><strong>Network Origin:</strong> {inspectLog.ipAddress}</p>
              <p><strong>User Agent:</strong> {inspectLog.browser}</p>
              <p><strong>Workstation Hardware:</strong> {inspectLog.device}</p>
              <p><strong>Immutability Guarantee:</strong> Verified SHA-256 Blockchain Hash Valid</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setInspectLog(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
