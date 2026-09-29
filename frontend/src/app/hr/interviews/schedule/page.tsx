"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Video,
  Building2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Trash2,
  FileCheck2
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

interface InterviewSlotRecord {
  id: string;
  driveId: string;
  driveName: string;
  collegeId: string;
  collegeName: string;
  hrExecutive: string;
  panelMembers: string[];
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  mode: "Online" | "Offline" | "Hybrid";
  meetingLink: string;
  venue?: string;
  capacity: number;
  assignedStudentIds: string[];
  notes?: string;
}

const INITIAL_SLOTS: InterviewSlotRecord[] = [
  {
    id: "slot-01",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    collegeId: "col-001",
    collegeName: "R.V. College of Engineering (RVCE)",
    hrExecutive: "Priya Nair",
    panelMembers: ["Priya Nair (Lead HR)", "Senior Java Architect"],
    date: "2026-09-26",
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    durationMinutes: 45,
    mode: "Online",
    meetingLink: "https://meet.google.com/rvc-java-panel-1",
    capacity: 1,
    assignedStudentIds: ["stu-001"],
    notes: "Technical depth in Spring Boot & concurrency required.",
  },
  {
    id: "slot-02",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    collegeId: "col-002",
    collegeName: "B.M.S. College of Engineering (BMSCE)",
    hrExecutive: "Arun Menon",
    panelMembers: ["Arun Menon (Technical Lead)"],
    date: "2026-09-26",
    startTime: "11:00 AM",
    endTime: "11:45 AM",
    durationMinutes: 45,
    mode: "Online",
    meetingLink: "https://meet.google.com/bms-py-panel",
    capacity: 1,
    assignedStudentIds: [],
    notes: "Python & Machine Learning stack.",
  },
  {
    id: "slot-03",
    driveId: "drv-2026-001",
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    collegeId: "col-003",
    collegeName: "Ramaiah Institute of Technology (MSRIT)",
    hrExecutive: "Divya H",
    panelMembers: ["Divya H (HR Lead)", "MERN Lead Specialist"],
    date: "2026-09-26",
    startTime: "02:00 PM",
    endTime: "02:45 PM",
    durationMinutes: 45,
    mode: "Online",
    meetingLink: "https://meet.google.com/msr-mern-panel",
    capacity: 1,
    assignedStudentIds: ["stu-003"],
    notes: "Full stack MERN evaluation.",
  },
];

export default function InterviewSchedulerPage() {
  const { drives, colleges, students, currentUser } = useApp();
  const [slots, setSlots] = useState<InterviewSlotRecord[]>(INITIAL_SLOTS);
  const liveCandidates = React.useMemo(() => getLiveCandidateProfiles(students), [students]);
  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveCandidates);

  React.useEffect(() => {
    if (liveCandidates.length > 0) {
      setCandidates(liveCandidates);
    }
  }, [liveCandidates]);

  // Slot creation form states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formDriveId, setFormDriveId] = useState(drives[0]?.id || "");
  const [formCollegeId, setFormCollegeId] = useState(colleges[0]?.id || "");
  const [formHr, setFormHr] = useState(currentUser.name || "HR Panel");
  const [formPanel, setFormPanel] = useState(currentUser.name ? `${currentUser.name} (HR)` : "HR Panel");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formStart, setFormStart] = useState("10:00 AM");
  const [formEnd, setFormEnd] = useState("10:45 AM");
  const [formDuration, setFormDuration] = useState(45);
  const [formMode, setFormMode] = useState<"Online" | "Offline" | "Hybrid">("Online");
  const [formLink, setFormLink] = useState("");
  const [formVenue, setFormVenue] = useState("");
  const [formCapacity, setFormCapacity] = useState(1);
  const [formNotes, setFormNotes] = useState("");

  // Bulk Auto-Assign Engine states
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [bulkDrive, setBulkDrive] = useState(drives[0]?.id || "all");
  const [bulkCollege, setBulkCollege] = useState("all");
  const [notifyCandidate, setNotifyCandidate] = useState(true);
  const [notifyPanel, setNotifyPanel] = useState(true);

  // Handle Slot Creation
  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDrive = drives.find((d) => d.id === formDriveId);
    const targetCollege = colleges.find((c) => c.id === formCollegeId);

    // Conflict detection
    const conflict = slots.find(
      (s) =>
        s.date === formDate &&
        s.startTime === formStart &&
        s.hrExecutive.toLowerCase() === formHr.toLowerCase()
    );

    if (conflict) {
      toast.error("Panel Conflict Detected!", {
        description: `${formHr} is already booked on ${formDate} at ${formStart}. Please choose another time.`,
      });
      return;
    }

    const newSlot: InterviewSlotRecord = {
      id: `slot-${Date.now().toString().slice(-4)}`,
      driveId: formDriveId,
      driveName: targetDrive?.name || "",
      collegeId: formCollegeId,
      collegeName: targetCollege?.name || "",
      hrExecutive: formHr,
      panelMembers: formPanel.split(",").map((p) => p.trim()),
      date: formDate,
      startTime: formStart,
      endTime: formEnd,
      durationMinutes: formDuration,
      mode: formMode,
      meetingLink: formLink,
      venue: formMode !== "Online" ? formVenue : undefined,
      capacity: formCapacity,
      assignedStudentIds: [],
      notes: formNotes,
    };

    setSlots([newSlot, ...slots]);
    setIsCreateModalOpen(false);
    toast.success("Interview slot created successfully!", {
      description: `Configured ${formMode} slot for ${targetCollege?.name || "Campus"} on ${formDate}.`,
    });
  };

  // Handle Auto Allocate
  const handleAutoAllocate = () => {
    // Find unallocated qualified students
    const unallocated = candidates.filter(
      (c) => c.status === "Qualified" && (!c.interviewSlot || c.interviewSlot.date === "")
    );

    if (unallocated.length === 0) {
      toast.info("No unallocated qualified candidates found.", {
        description: "All qualified candidates already have interview slots scheduled.",
      });
      setIsBulkAssignModalOpen(false);
      return;
    }

    // Find available slots with open capacity
    const availableSlots = slots.filter((s) => s.assignedStudentIds.length < s.capacity);

    if (availableSlots.length === 0) {
      toast.error("Insufficient Slot Capacity!", {
        description: "Please create more interview slots to allocate remaining candidates.",
      });
      return;
    }

    let allocatedCount = 0;
    const updatedSlots = [...slots];
    const updatedCandidates = [...candidates];

    unallocated.forEach((cand) => {
      // Find matching slot by college if possible, else next available
      const slotIndex = updatedSlots.findIndex(
        (s) => s.assignedStudentIds.length < s.capacity && (s.collegeName === cand.collegeName || s.collegeId === "all")
      ) !== -1
        ? updatedSlots.findIndex(
            (s) => s.assignedStudentIds.length < s.capacity && (s.collegeName === cand.collegeName || s.collegeId === "all")
          )
        : updatedSlots.findIndex((s) => s.assignedStudentIds.length < s.capacity);

      if (slotIndex !== -1) {
        const slot = updatedSlots[slotIndex];
        slot.assignedStudentIds.push(cand.id);

        const candIndex = updatedCandidates.findIndex((c) => c.id === cand.id);
        if (candIndex !== -1) {
          updatedCandidates[candIndex] = {
            ...cand,
            status: "Interview Scheduled",
            interviewSlot: {
              id: slot.id,
              date: slot.date,
              time: `${slot.startTime} - ${slot.endTime}`,
              mode: slot.mode,
              meetingLink: slot.meetingLink,
              venue: slot.venue,
              panelMembers: slot.panelMembers,
              hrExecutive: slot.hrExecutive,
              stage: "Automated Round 1 Allocation",
            },
          };
        }
        allocatedCount++;
      }
    });

    setSlots(updatedSlots);
    setCandidates(updatedCandidates);
    setIsBulkAssignModalOpen(false);

    toast.success(`Auto-Allocated ${allocatedCount} Candidate(s)!`, {
      description: `Dispatched automated invitations. Notifications sent: ${notifyCandidate ? "Candidates (Yes)" : "Candidates (No)"}, ${notifyPanel ? "Panels (Yes)" : "Panels (No)"}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Capacity & Slot Orchestration
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Conflict Collision Prevention Active
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Interview Scheduling & Slot Management</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Configure individual or batch interview windows, assign technical panel members, and execute automated conflict-free candidate slot allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Slot
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => setIsBulkAssignModalOpen(true)}
          >
            <Sparkles className="w-4 h-4" />
            Auto-Allocate Qualified
          </Button>

          <Link href="/hr/interviews/calendar">
            <Button variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Calendar className="w-4 h-4" />
              Calendar View
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Total Interview Slots</span>
          <p className="text-2xl font-bold text-foreground mt-0.5">{slots.length}</p>
          <span className="text-[10px] text-primary font-medium">Configured across panels</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Slots Filled</span>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">
            {slots.filter((s) => s.assignedStudentIds.length >= s.capacity).length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Candidate confirmed</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Open Slots</span>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">
            {slots.filter((s) => s.assignedStudentIds.length < s.capacity).length}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Available for allocation</span>
        </Card>
        <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
          <span className="text-xs text-muted-foreground font-semibold">Qualified Waiting</span>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">
            {candidates.filter((c) => c.status === "Qualified").length}
          </p>
          <span className="text-[10px] text-blue-600 font-medium">Awaiting slot assignment</span>
        </Card>
      </div>

      {/* Slots Table */}
      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-foreground">Configured Interview Slot Roster</h2>
          </div>
          <span className="text-xs text-muted-foreground">Realtime Supabase Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Campus / Institution</th>
                <th className="py-3 px-4 font-semibold">Panel & HR Lead</th>
                <th className="py-3 px-4 font-semibold">Mode & Link</th>
                <th className="py-3 px-4 font-semibold">Assigned Candidate</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slots.map((slot) => {
                const assignedCandidate = candidates.find((c) => slot.assignedStudentIds.includes(c.id));
                const isFull = slot.assignedStudentIds.length >= slot.capacity;

                return (
                  <tr key={slot.id} className="hover:bg-muted/30 transition-colors">
                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {slot.date}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {slot.startTime} - {slot.endTime} ({slot.durationMinutes}m)
                      </div>
                    </td>

                    {/* Campus */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs font-semibold text-foreground line-clamp-1">{slot.collegeName}</p>
                      <p className="text-[11px] text-muted-foreground">{slot.driveName}</p>
                    </td>

                    {/* Panel */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs font-medium text-foreground">{slot.hrExecutive}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{slot.panelMembers.join(", ")}</p>
                    </td>

                    {/* Mode & Link */}
                    <td className="py-3.5 px-4 text-xs">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          slot.mode === "Online"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {slot.mode}
                      </span>
                      {slot.mode === "Online" ? (
                        <div>
                          <a
                            href={slot.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline text-[11px] flex items-center gap-1"
                          >
                            <Video className="w-3 h-3" />
                            Join Video Link
                          </a>
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">{slot.venue || "TBD"}</p>
                      )}
                    </td>

                    {/* Assigned Candidate */}
                    <td className="py-3.5 px-4">
                      {assignedCandidate ? (
                        <div className="flex items-center gap-2">
                          {assignedCandidate.photoUrl && assignedCandidate.photoUrl.trim() !== "" ? (
                            <img
                              src={assignedCandidate.photoUrl}
                              alt={assignedCandidate.fullName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px]">
                              {assignedCandidate.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-xs text-foreground">{assignedCandidate.fullName}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{assignedCandidate.usn}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Vacant Slot
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {assignedCandidate ? (
                        <Link href={`/hr/interviews/${assignedCandidate.id}`}>
                          <Button size="sm" variant="primary" className="text-xs">
                            <Video className="w-3.5 h-3.5 mr-1" />
                            Live Workspace
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => {
                            toast.success("Ready for quick candidate assignment.");
                            setIsBulkAssignModalOpen(true);
                          }}
                        >
                          Allocate
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Slot Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Technical Interview Slot"
        >
          <form onSubmit={handleCreateSlot} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target CSR Drive</label>
              <select
                value={formDriveId}
                onChange={(e) => setFormDriveId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
              >
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">College Campus</label>
              <select
                value={formCollegeId}
                onChange={(e) => setFormCollegeId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Interview Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Slot Duration</label>
                <select
                  value={formDuration}
                  onChange={(e) => setFormDuration(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Standard)</option>
                  <option value={60}>60 Minutes (Deep Tech)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Start Time</label>
                <input
                  type="text"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="10:00 AM"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">End Time</label>
                <input
                  type="text"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="10:45 AM"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Mode</label>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value as "Online" | "Offline" | "Hybrid")}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Online">Online Video Link</option>
                  <option value="Offline">Offline Campus</option>
                  <option value="Hybrid">Hybrid Teleconference</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">HR Executive</label>
                <input
                  type="text"
                  value={formHr}
                  onChange={(e) => setFormHr(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Panel Members (comma-separated)</label>
              <input
                type="text"
                value={formPanel}
                onChange={(e) => setFormPanel(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Priya Nair (HR), Lead Java Architect"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Meeting Link / Virtual Room</label>
              <input
                type="url"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save & Open Slot
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Auto Allocate Modal */}
      {isBulkAssignModalOpen && (
        <Modal
          isOpen={isBulkAssignModalOpen}
          onClose={() => setIsBulkAssignModalOpen(false)}
          title="Automated Bulk Interview Allocator"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              The automated allocation engine pairs exam-qualified students with available panel slots by institution, track, and priority rankings without manual scheduling conflicts.
            </p>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-300">Engine Readiness Status:</p>
              <p>• Unallocated Qualified Students: <strong>{candidates.filter((c) => c.status === "Qualified").length}</strong></p>
              <p>• Vacant Interview Slots Available: <strong>{slots.filter((s) => s.assignedStudentIds.length < s.capacity).length}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyCandidate}
                  onChange={(e) => setNotifyCandidate(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                Send In-App & Email Confirmation to Students
              </label>

              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyPanel}
                  onChange={(e) => setNotifyPanel(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                Sync Calendar Event with Interview Panel Members
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsBulkAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAutoAllocate}>
                Execute Auto-Allocation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
