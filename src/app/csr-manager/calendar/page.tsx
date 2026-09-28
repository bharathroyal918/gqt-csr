"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Building2,
  Users,
  Award,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  PhoneCall,
  Mail,
  MessageSquare,
  Filter,
  Search,
  ExternalLink,
  X,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  type: "Registration" | "Exam" | "Interview" | "Offer" | "College Meeting" | "Follow-Up";
  date: string; // YYYY-MM-DD
  time: string;
  driveName: string;
  collegeName?: string;
  location?: string;
  status: "Upcoming" | "Completed" | "Missed" | "Escalated";
  priority: "Critical" | "High" | "Medium" | "Normal";
  assignedTo: string;
  reminderTrigger: "5_days" | "3_days" | "1_day" | "on_time" | "overdue";
  channel: "WhatsApp" | "Email" | "Dashboard" | "All";
  description: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "EVT-101",
    title: "Registration Closing Window — RVCE & BMSCE",
    type: "Registration",
    date: "2026-09-25",
    time: "17:00",
    driveName: "CSR Flagship Campus Drive 2026",
    collegeName: "RV College of Engineering",
    location: "Online Portal",
    status: "Upcoming",
    priority: "Critical",
    assignedTo: "Priya Nair",
    reminderTrigger: "1_day",
    channel: "WhatsApp",
    description: "Final registration window closes at 5:00 PM. Dispatch WhatsApp blast to remaining unverified candidates.",
  },
  {
    id: "EVT-102",
    title: "Batch A Online Assessment Launch",
    type: "Exam",
    date: "2026-09-26",
    time: "10:00 - 12:00",
    driveName: "CSR Flagship Campus Drive 2026",
    collegeName: "All Participating Colleges",
    location: "Proctoring Cloud System",
    status: "Upcoming",
    priority: "Critical",
    assignedTo: "Priya Nair & Proctoring Ops",
    reminderTrigger: "1_day",
    channel: "All",
    description: "1,200 eligible students across 5 colleges attempting Java Full Stack & Aptitude questions. Anti-cheating enabled.",
  },
  {
    id: "EVT-103",
    title: "Principal MoU Ratification Meeting",
    type: "College Meeting",
    date: "2026-09-27",
    time: "11:30 - 12:30",
    driveName: "Women in Tech Empowerment Drive",
    collegeName: "National Institute of Engineering (NIE)",
    location: "Principal Boardroom / Hybrid Meet",
    status: "Upcoming",
    priority: "High",
    assignedTo: "Sneha Rao",
    reminderTrigger: "3_days",
    channel: "Email",
    description: "Review of CSR sponsorship terms, 100% free training curriculum for female engineers, and campus lab infrastructure.",
  },
  {
    id: "EVT-104",
    title: "Technical Interview Calibration Rounds",
    type: "Interview",
    date: "2026-09-28",
    time: "09:30 - 18:00",
    driveName: "CSR Flagship Campus Drive 2026",
    collegeName: "BMS College of Engineering",
    location: "Google Meet Panels 1-4",
    status: "Upcoming",
    priority: "High",
    assignedTo: "Arun Menon & Tech Panels",
    reminderTrigger: "3_days",
    channel: "Email",
    description: "32 shortlisted students from Coding Round 1 appearing for live system architecture & problem solving panels.",
  },
  {
    id: "EVT-105",
    title: "Follow-Up: Placement Officer Pending Data Roster",
    type: "Follow-Up",
    date: "2026-09-24",
    time: "14:00",
    driveName: "Rural Talent Outreach Drive 2026",
    collegeName: "KLE Technological University",
    location: "Direct Phone Call",
    status: "Escalated",
    priority: "Critical",
    assignedTo: "Vikram Deshmukh",
    reminderTrigger: "overdue",
    channel: "Dashboard",
    description: "Placement head Dr. Patil requested clarification on diploma entry backlog limits. Escalated to CSR Manager.",
  },
  {
    id: "EVT-106",
    title: "Issuance of CSR Select Offer Letters (Batch 1)",
    type: "Offer",
    date: "2026-10-02",
    time: "15:00",
    driveName: "CSR Flagship Campus Drive 2026",
    collegeName: "PES University & RVCE",
    location: "Automated DocuSign / GQT Portal",
    status: "Upcoming",
    priority: "High",
    assignedTo: "HR Operations Lead",
    reminderTrigger: "5_days",
    channel: "Email",
    description: "Auto-generate official Letters of Intent with INR 4.5 LPA - 7.5 LPA CTC packages for 48 placed engineers.",
  },
  {
    id: "EVT-107",
    title: "Post-Exam Proctoring Audit Review",
    type: "Follow-Up",
    date: "2026-09-22",
    time: "16:00",
    driveName: "Tier-2 Engineering Excellence 2026",
    collegeName: "Dayananda Sagar College",
    location: "GQT Ops Room",
    status: "Completed",
    priority: "Normal",
    assignedTo: "Proctoring Lead",
    reminderTrigger: "on_time",
    channel: "Dashboard",
    description: "Audit completed. Flagged 3 tab switches; resolved and approved 142 authentic exam submissions.",
  },
];

export default function CSRCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Create Follow-up / Event modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<CalendarEvent["type"]>("Follow-Up");
  const [newDate, setNewDate] = useState("2026-09-26");
  const [newTime, setNewTime] = useState("11:00");
  const [newDriveName, setNewDriveName] = useState("CSR Flagship Campus Drive 2026");
  const [newCollegeName, setNewCollegeName] = useState("RV College of Engineering");
  const [newPriority, setNewPriority] = useState<CalendarEvent["priority"]>("High");
  const [newReminder, setNewReminder] = useState<CalendarEvent["reminderTrigger"]>("1_day");
  const [newChannel, setNewChannel] = useState<CalendarEvent["channel"]>("WhatsApp");
  const [newAssignedTo, setNewAssignedTo] = useState("Priya Nair");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      toast.error("Please provide an event or follow-up title.");
      return;
    }

    const created: CalendarEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      driveName: newDriveName,
      collegeName: newCollegeName,
      location: "GQT Operational Portal",
      status: "Upcoming",
      priority: newPriority,
      assignedTo: newAssignedTo,
      reminderTrigger: newReminder,
      channel: newChannel,
      description: newDescription || "Scheduled operational task for CSR drive timeline adherence.",
    };

    setEvents([created, ...events]);
    setIsCreateModalOpen(false);
    toast.success(`Event '${newTitle}' scheduled with automated ${newChannel} reminders!`);

    // Reset
    setNewTitle("");
    setNewDescription("");
  };

  const handleMarkStatus = (id: string, newStatus: CalendarEvent["status"]) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, status: newStatus } : ev))
    );
    toast.success(`Event status updated to ${newStatus}`);
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.driveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.collegeName && ev.collegeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "all" || ev.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === "all" || ev.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI stats
  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;
  const completedCount = events.filter((e) => e.status === "Completed").length;
  const missedCount = events.filter((e) => e.status === "Missed").length;
  const escalatedCount = events.filter((e) => e.status === "Escalated").length;

  const getTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "Registration":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Exam":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Interview":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Offer":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "College Meeting":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Follow-Up":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusBadge = (status: CalendarEvent["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Missed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Escalated":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Operations Timeline Engine
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">CSR Calendar & Reminder Automation</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Track multi-drive registrations, proctored exams, interview schedules, college MoUs, and automated omnichannel follow-up alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Schedule Follow-Up / Milestone
          </Button>
        </div>
      </div>

      {/* Reminder Engine Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Upcoming Milestones</span>
            <Clock className="w-4 h-4 text-[#005BBB]" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{upcomingCount}</p>
          <span className="text-[11px] text-sky-600 font-medium">Next 14 business days</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Escalated Follow-Ups</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{escalatedCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">Requires CSR Manager touch</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Overdue / Missed</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-rose-600">{missedCount}</p>
          <span className="text-[11px] text-rose-600 font-medium">Auto-reminders dispatched</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Completed Milestones</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">100% SLA compliant</span>
        </Card>
      </div>

      {/* Reminder Automation Status Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#005BBB] text-white flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#001B4D]">GQT Automated Reminder Engine is Active</h4>
              <p className="text-xs text-slate-600">
                Automated reminders configured at: <span className="font-semibold text-slate-900">5 Days Before</span> •{" "}
                <span className="font-semibold text-slate-900">3 Days Before</span> •{" "}
                <span className="font-semibold text-slate-900">1 Day Before</span> •{" "}
                <span className="font-semibold text-slate-900">On Time</span>. Multichannel broadcast via WhatsApp Bot, Email & Manager Push.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Reminder queue checked. All 48 pending notifications synced.")}
            className="text-xs bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Sync Reminder Engine
          </Button>
        </div>
      </Card>

      {/* Filter and View Options */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Event, Drive, or College..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] focus:border-transparent text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Event Types</option>
              <option value="registration">Registration Windows</option>
              <option value="exam">Proctored Exams</option>
              <option value="interview">Interviews</option>
              <option value="offer">Offer Letters</option>
              <option value="college meeting">College Meetings</option>
              <option value="follow-up">Follow-Ups</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="escalated">Escalated</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Agenda & Event Timeline Stream */}
      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <Card
            key={evt.id}
            className="p-4 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Date Box */}
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {new Date(evt.date).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-slate-900 leading-tight">
                    {new Date(evt.date).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getTypeColor(
                        evt.type
                      )}`}
                    >
                      {evt.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(
                        evt.status
                      )}`}
                    >
                      {evt.status}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        evt.priority === "Critical"
                          ? "bg-rose-100 text-rose-800"
                          : evt.priority === "High"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {evt.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">{evt.title}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-[#005BBB]" />
                      {evt.driveName}
                    </span>
                    {evt.collegeName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {evt.collegeName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Assigned: <strong className="text-slate-700">{evt.assignedTo}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and Channel Controls */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <div className="text-right mr-2 hidden sm:block">
                  <div className="text-[11px] text-slate-400">Trigger Window</div>
                  <span className="text-xs font-semibold text-slate-700">
                    {evt.reminderTrigger.replace("_", " ").toUpperCase()} via {evt.channel}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedEvent(evt)}
                >
                  Details Drawer
                </Button>

                {evt.status !== "Completed" ? (
                  <Button
                    variant="cyan"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleMarkStatus(evt.id, "Completed")}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Complete
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs text-slate-500"
                    onClick={() => handleMarkStatus(evt.id, "Upcoming")}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Details Drawer Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Milestone Dossier — ${selectedEvent.title}`}
          subtitle={`${selectedEvent.type} • Scheduled for ${selectedEvent.date} at ${selectedEvent.time}`}
          size="lg"
        >
          <div className="space-y-4 text-slate-800">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Operational Description & SOP
              </h4>
              <p className="text-sm text-slate-700">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">CSR Drive:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedEvent.driveName}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Institution:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedEvent.collegeName || "Global / Multiple"}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Location / Platform:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedEvent.location || "Web Portal"}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Assigned Recruiter / Lead:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{selectedEvent.assignedTo}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Automated Reminder:</span>
                <p className="font-semibold text-[#005BBB] mt-0.5">
                  {selectedEvent.reminderTrigger.replace("_", " ").toUpperCase()}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Dispatch Channel:</span>
                <p className="font-semibold text-indigo-700 mt-0.5">{selectedEvent.channel}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    handleMarkStatus(selectedEvent.id, "Escalated");
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Escalate to Management
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-blue-600 border-blue-200"
                  onClick={() => {
                    toast.success(`Dispatched instant ${selectedEvent.channel} reminder test!`);
                  }}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1" />
                  Trigger Instant Reminder Now
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                {selectedEvent.status !== "Completed" && (
                  <Button
                    variant="cyan"
                    size="sm"
                    onClick={() => {
                      handleMarkStatus(selectedEvent.id, "Completed");
                    }}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Event / Follow-Up Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New CSR Milestone or Follow-Up"
        subtitle="Configure timeline triggers, responsible recruiters, and automated multichannel alert engines."
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Event / Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Call Placement Officer for Confirmed Student CSV"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="Follow-Up">Follow-Up Call</option>
                <option value="Registration">Registration Window</option>
                <option value="Exam">Online Exam</option>
                <option value="Interview">Interview Slot</option>
                <option value="Offer">Offer Release</option>
                <option value="College Meeting">College Meeting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Time</label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CSR Campaign</label>
              <input
                type="text"
                value={newDriveName}
                onChange={(e) => setNewDriveName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target College (Optional)</label>
              <input
                type="text"
                placeholder="e.g. RV College of Engineering"
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Automatic Reminder</label>
              <select
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="5_days">5 Days Before</option>
                <option value="3_days">3 Days Before</option>
                <option value="1_day">1 Day Before</option>
                <option value="on_time">On Time</option>
                <option value="overdue">Overdue Alerts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="WhatsApp">WhatsApp Bot</option>
                <option value="Email">Email Dispatch</option>
                <option value="Dashboard">Dashboard Notification</option>
                <option value="All">All Channels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned HR Staff</label>
              <input
                type="text"
                value={newAssignedTo}
                onChange={(e) => setNewAssignedTo(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description & Agenda</label>
            <textarea
              rows={3}
              placeholder="Provide context, required documents, or call goals..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Confirm & Arm Reminders
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
