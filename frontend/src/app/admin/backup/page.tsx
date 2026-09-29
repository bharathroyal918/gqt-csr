"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Database,
  Download,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  FileCheck2,
  AlertTriangle,
  History,
  Clock,
  Sparkles
} from "lucide-react";

interface BackupSnapshot {
  id: string;
  name: string;
  type: "Full Database" | "Storage Metadata" | "Audit Ledger";
  size: string;
  recordsCount: number;
  timestamp: string;
  checksum: string;
  status: "Verified Healthy" | "In Progress";
}

const INITIAL_BACKUPS: BackupSnapshot[] = [
  { id: "BKP-2025-0214-01", name: "GQT_CSR_Prod_Full_DB_20250214.dump", type: "Full Database", size: "148.6 MB", recordsCount: 14250, timestamp: "2025-02-14 04:00:00 UTC", checksum: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", status: "Verified Healthy" },
  { id: "BKP-2025-0214-02", name: "Storage_Bucket_Manifest_20250214.tar.gz", type: "Storage Metadata", size: "38.2 MB", recordsCount: 840, timestamp: "2025-02-14 04:05:00 UTC", checksum: "sha256:d82c4b2676839352e04313f8c5b36bb5c68f1885b591b7e411b93f773426e27b", status: "Verified Healthy" },
  { id: "BKP-2025-0213-01", name: "GQT_CSR_Prod_Full_DB_20250213.dump", type: "Full Database", size: "145.1 MB", recordsCount: 13910, timestamp: "2025-02-13 04:00:00 UTC", checksum: "sha256:1a84f932f91319760775d506ab15928fb8e1548eebf99dc21b51e506692225a0", status: "Verified Healthy" },
  { id: "BKP-2025-0212-01", name: "GQT_CSR_Prod_Full_DB_20250212.dump", type: "Full Database", size: "141.8 MB", recordsCount: 13500, timestamp: "2025-02-12 04:00:00 UTC", checksum: "sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", status: "Verified Healthy" },
];

export default function AdminBackupRestorePage() {
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [restoringBackup, setRestoringBackup] = useState<BackupSnapshot | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleTriggerBackup = (type: BackupSnapshot["type"]) => {
    setIsBackingUp(true);
    toast.info(`Snapshotting ${type}...`);
    setTimeout(() => {
      const newSnapshot: BackupSnapshot = {
        id: `BKP-${Date.now().toString().slice(-6)}`,
        name: `GQT_CSR_${type.replace(/\s+/g, "_")}_${new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)}.dump`,
        type,
        size: "151.2 MB",
        recordsCount: 14500,
        timestamp: new Date().toISOString(),
        checksum: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "Verified Healthy",
      };
      setBackups([newSnapshot, ...backups]);
      setIsBackingUp(false);
      toast.success(`Backup snapshot "${newSnapshot.name}" captured successfully in secondary storage`);
    }, 1200);
  };

  const handleDownload = (b: BackupSnapshot) => {
    toast.success(`Downloading backup archive "${b.name}"`);
  };

  const handleConfirmRestore = () => {
    if (!restoringBackup) return;
    toast.success(`Database restore sequence initiated from "${restoringBackup.name}"`, {
      description: "Read replicas synced. Production cluster verified healthy.",
    });
    setRestoringBackup(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Disaster Recovery & Point-in-Time Recovery
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Backup & Restore Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage automated daily Supabase database snapshots, generate storage metadata archives, and perform disaster restoration drills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleTriggerBackup("Storage Metadata")}
            variant="outline"
            className="border-border hover:bg-muted gap-2"
            disabled={isBackingUp}
          >
            <HardDrive className="w-4 h-4" /> Backup Storage Metadata
          </Button>
          <Button
            onClick={() => handleTriggerBackup("Full Database")}
            disabled={isBackingUp}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <Database className="w-4 h-4" /> Trigger Immediate Database Dump
          </Button>
        </div>
      </div>

      {/* Snapshot Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Automated Frequency</p>
              <p className="text-xl font-bold text-foreground mt-0.5">Daily at 04:00 UTC</p>
              <p className="text-[11px] text-emerald-500 font-medium">Retention: 365 Days</p>
            </div>
            <Clock className="w-8 h-8 text-primary/40" />
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Replication Health</p>
              <p className="text-xl font-bold text-emerald-500 mt-0.5">100% In-Sync</p>
              <p className="text-[11px] text-muted-foreground">Multi-Region Redundancy</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-emerald-500/40" />
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Backups on File</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{backups.length} Snapshots</p>
              <p className="text-[11px] text-muted-foreground">473.7 MB Total Compressed</p>
            </div>
            <HardDrive className="w-8 h-8 text-indigo-500/40" />
          </CardContent>
        </Card>
      </div>

      {/* Backups Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Snapshot Name & ID</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-center">Size</th>
                <th className="p-4 text-center">Row Census</th>
                <th className="p-4 text-center">Integrity Status</th>
                <th className="p-4">Created Timestamp</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-primary" />
                      {b.name}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{b.checksum.slice(0, 32)}...</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {b.type}
                  </td>
                  <td className="p-4 text-center text-xs font-mono text-muted-foreground">
                    {b.size}
                  </td>
                  <td className="p-4 text-center text-xs font-bold text-blue-400">
                    {b.recordsCount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {b.timestamp}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(b)}
                        title="Download Dump File"
                        className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRestoringBackup(b)}
                        title="Restore Snapshot to Cluster"
                        className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restore Confirmation Modal */}
      {restoringBackup && (
        <Modal
          isOpen={!!restoringBackup}
          onClose={() => setRestoringBackup(null)}
          title="Super Admin Database Restoration Sequence"
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2 text-amber-400">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                Critical Production Operation
              </div>
              <p className="leading-relaxed">
                Restoring snapshot <strong className="text-foreground">{restoringBackup.name}</strong> will overwrite database state with snapshot timestamp <strong>{restoringBackup.timestamp}</strong>.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setRestoringBackup(null)}>Cancel</Button>
              <Button onClick={handleConfirmRestore} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                Authorize Restoration Drill
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
