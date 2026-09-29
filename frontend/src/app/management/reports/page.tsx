"use client";

import React, { useState } from "react";
import { ManagementService } from "@/services/management.service";
import { ExecutiveSavedReport } from "@/types";
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  FileSpreadsheet,
  FileText,
  Lock,
  Plus,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagementReportsPage() {
  const reports = ManagementService.getSavedReports();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("Weekly Karnataka CSR Executive Synthesis");
  const [scheduleFreq, setScheduleFreq] = useState("Weekly");
  const [recipientEmail, setRecipientEmail] = useState("director@globalquesttechnologies.com");

  const handleDownloadReport = (report: ExecutiveSavedReport) => {
    ManagementService.exportToCSV(`GQT_Executive_${report.title.replace(/\s+/g, "_")}`, [
      {
        "Report ID": report.id,
        "Document Title": report.title,
        Category: report.category,
        Frequency: report.frequency,
        Version: report.version,
        "Generated Date": report.generatedDate,
        "Next Scheduled": report.nextScheduled || "Ad-hoc",
        Format: report.format,
        "File Size": report.fileSize,
        Recipients: report.recipients.join("; "),
        "Confidentiality Level": report.isBoardConfidential ? "Board Confidential" : "Standard",
      },
    ]);
    toast.success(`Downloaded ${report.title}`, {
      description: `Format: ${report.format} (${report.fileSize})`,
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduleModalOpen(false);
    toast.success("Executive automated report scheduled successfully", {
      description: `${scheduleTitle} will be dispatched ${scheduleFreq.toLowerCase()} to ${recipientEmail}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Board Governance Documentation
            </span>
            <span className="text-xs text-blue-200">Director Briefings & Regulatory Filings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Executive Saved Reports & Regulatory Dossiers
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Pre-compiled strategic audit packages for the Board of Directors, CSR Governing Committee, academic accreditation bodies, and corporate funders.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Calendar className="w-4 h-4 text-[#005BBB]" />
          Schedule Automated Report
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300">
                  {report.category} Report • {report.frequency}
                </span>
                {report.isBoardConfidential && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40">
                    <Lock className="w-3 h-3" />
                    Board Only
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {report.title}
              </h3>

              <div className="text-xs text-slate-500 space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span>Version:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{report.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Format & Size:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {report.format} ({report.fileSize})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Generated:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {new Date(report.generatedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {report.recipients.length} Recipient(s)
              </span>

              <button
                onClick={() => handleDownloadReport(report)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001B4D] hover:bg-[#003366] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download {report.format}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Report Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Schedule Executive Report
                </h3>
                <p className="text-xs text-slate-500">Automated recurring dispatch to Director inbox</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Report Title</label>
                <input
                  type="text"
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Cadence</label>
                  <select
                    value={scheduleFreq}
                    onChange={(e) => setScheduleFreq(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Daily">Daily Summary</option>
                    <option value="Weekly">Weekly Digest</option>
                    <option value="Monthly">Monthly Governance</option>
                    <option value="Quarterly">Quarterly Board Deck</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Format</label>
                  <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                    <option value="PDF">Signed PDF</option>
                    <option value="Excel">Raw Data (.xlsx)</option>
                    <option value="CSV">Compressed CSV</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Recipient Email(s)</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 text-blue-800 dark:text-cyan-300">
                Reports are generated automatically at 06:00 AM IST via background cron worker.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001B4D] hover:bg-[#003366] text-white rounded-lg font-bold shadow-md"
                >
                  Activate Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
