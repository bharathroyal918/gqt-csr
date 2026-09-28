"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import {
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Laptop,
  Globe,
  Radio,
  Calendar,
  Building2,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { AttendanceRecord } from "@/types";

export default function AttendancePage() {
  const { attendanceRecords, drives, colleges, logAuditAction } = useApp();

  const [records, setRecords] = useState<AttendanceRecord[]>(attendanceRecords);

  React.useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
      setRecords(attendanceRecords);
    }
  }, [attendanceRecords]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDrive, setSelectedDrive] = useState<string>("all");
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Attendance Form state
  const [newStudentName, setNewStudentName] = useState("");
  const [newUsn, setNewUsn] = useState("");
  const [newCollege, setNewCollege] = useState(colleges[0]?.name || "");
  const [newSession, setNewSession] = useState("CSR Drive Day 1 - Online Examination");
  const [newStatus, setNewStatus] = useState<AttendanceRecord["status"]>("Present");

  // Derived filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.ipAddress.includes(searchQuery);

      const matchesStatus = selectedStatus === "all" || rec.status === selectedStatus;
      const matchesDrive = selectedDrive === "all" || rec.driveId === selectedDrive;

      return matchesSearch && matchesStatus && matchesDrive;
    });
  }, [records, searchQuery, selectedStatus, selectedDrive]);

  // Statistics
  const totalCount = records.length;
  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const avgDuration =
    records.length > 0
      ? Math.round(records.reduce((acc, r) => acc + r.durationMinutes, 0) / records.length)
      : 0;

  const handleExportCSV = () => {
    const headers = [
      "Student Name",
      "USN",
      "College",
      "Session",
      "Join Time",
      "Leave Time",
      "Duration (Mins)",
      "Rejoins",
      "Device",
      "IP Address",
      "Status",
    ];

    const rows = filteredRecords.map((r) => [
      r.studentName,
      r.usn,
      r.collegeName,
      r.sessionTitle,
      r.joinTime,
      r.leaveTime || "In Session",
      r.durationMinutes,
      r.rejoinCount,
      r.device,
      r.ipAddress,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GQT_CSR_Attendance_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Attendance report downloaded successfully as CSV");
    logAuditAction("Export Attendance CSV", "CSR Drive", selectedDrive, "Exported filtered attendance records");
  };

  const handleAddManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newUsn) {
      toast.error("Please fill in candidate name and USN");
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: `stu-${Date.now()}`,
      studentName: newStudentName,
      usn: newUsn.toUpperCase(),
      collegeName: newCollege,
      driveId: selectedDrive === "all" ? (drives[0]?.id || "drv-2026-001") : selectedDrive,
      sessionTitle: newSession,
      joinTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      leaveTime: undefined,
      durationMinutes: newStatus === "Present" ? 45 : 10,
      rejoinCount: 0,
      device: "Campus Test Lab Terminal (Chrome)",
      ipAddress: "172.16.24.110 (College Lab Subnet)",
      status: newStatus,
    };

    setRecords([newRecord, ...records]);
    setIsManualModalOpen(false);
    setNewStudentName("");
    setNewUsn("");
    toast.success(`Attendance logged manually for ${newStudentName} (${newUsn.toUpperCase()})`);
    logAuditAction(
      "Manual Attendance Recorded",
      "Student",
      newRecord.studentId,
      `Manual attendance marked as ${newStatus} for ${newUsn}`
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Proctoring & Telemetry
            </span>
            <span className="text-xs text-slate-500">Karnataka CSR Network</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Student Attendance Tracking
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time biometric, session heartbeat, and IP telemetry logs across 100+ Karnataka colleges
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsLiveActive(!isLiveActive);
              toast.info(isLiveActive ? "Live sync paused" : "Live auto-sync active");
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${isLiveActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
          >
            <Radio className={`w-4 h-4 ${isLiveActive ? "animate-pulse text-emerald-600" : ""}`} />
            {isLiveActive ? "Auto-Sync (3s)" : "Paused"}
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Manual Attendance
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Logged"
          value={totalCount}
          icon={Users}
          gradient="blue"
          change="+18 today"
          isPositive={true}
        />
        <StatCard
          title="Present Now"
          value={presentCount}
          icon={CheckCircle2}
          gradient="emerald"
          subtitle={`${Math.round((presentCount / (totalCount || 1)) * 100)}% active rate`}
        />
        <StatCard
          title="Late Arrivals"
          value={lateCount}
          icon={AlertTriangle}
          gradient="amber"
          subtitle="Joined > 15m after start"
        />
        <StatCard
          title="Absent / No Show"
          value={absentCount}
          icon={XCircle}
          gradient="purple"
          subtitle="Alert sent to TPO"
        />
        <StatCard
          title="Avg. Session Time"
          value={`${avgDuration} min`}
          icon={Clock}
          gradient="cyan"
          subtitle="Exam duration target: 90m"
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full md:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, USN, college or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedDrive}
            onChange={(e) => setSelectedDrive(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Drives ({drives.length})</option>
            {drives.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Active Session Roster</h2>
            <p className="text-xs text-slate-500">
              Showing {filteredRecords.length} recorded session attendees
            </p>
          </div>
          <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-semibold px-2.5 py-1 rounded-full">
            University Lab Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-3.5">Student & USN</th>
                <th className="px-6 py-3.5">College Institution</th>
                <th className="px-6 py-3.5">Session / Event</th>
                <th className="px-6 py-3.5">Join & Leave</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Device & Network IP</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No attendance records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {rec.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {rec.studentName}
                          </p>
                          <p className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                            {rec.usn}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {rec.collegeName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {rec.sessionTitle}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          In: {rec.joinTime}
                        </p>
                        <p className="text-xs text-slate-500">
                          {rec.leaveTime ? `Out: ${rec.leaveTime}` : "Active Session"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {rec.durationMinutes}m
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${Math.min(100, (rec.durationMinutes / 90) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      {rec.rejoinCount > 0 && (
                        <span className="text-[10px] text-amber-600 font-medium">
                          {rec.rejoinCount} reconnect{rec.rejoinCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <Laptop className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]">{rec.device}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{rec.ipAddress}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={rec.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Record Manual Attendance"
        maxWidth="md"
      >
        <form onSubmit={handleAddManualRecord} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Candidate Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sumanth K. Gowda"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              University Seat Number (USN) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1RV22CS144"
              value={newUsn}
              onChange={(e) => setNewUsn(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College Institution
            </label>
            <select
              value={newCollege}
              onChange={(e) => setNewCollege(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white focus:outline-none"
            >
              {colleges.slice(0, 15).map((col) => (
                <option key={col.id} value={col.name} className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">
                  {col.name} ({col.collegeCode || col.vtuCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Session Title
            </label>
            <select
              value={newSession}
              onChange={(e) => setNewSession(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="CSR Drive Day 1 - Online Examination" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">CSR Drive Day 1 - Online Examination</option>
              <option value="HR Technical Interview Round 1" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">HR Technical Interview Round 1</option>
              <option value="HR Managerial / Cultural Fit Round" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">HR Managerial / Cultural Fit Round</option>
              <option value="CSR Pre-Placement Talk & Q&A" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">CSR Pre-Placement Talk & Q&A</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attendance Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AttendanceRecord["status"])}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="Present" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">Present (On-Time)</option>
              <option value="Late" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">Late Arrival</option>
              <option value="Partial" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">Partial Session</option>
              <option value="Absent" className="bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white">Mark Absent</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
            >
              Save Attendance Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
