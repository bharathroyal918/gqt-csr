"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  Calendar,
  Kanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  PhoneCall,
  MessageSquare,
  Mail,
  User,
  X,
  ChevronRight,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

type FollowUpStatus = "Pending" | "Today" | "Tomorrow" | "Completed" | "Overdue" | "Cancelled";

interface FollowUpItem {
  id: string;
  collegeName: string;
  contactPerson: string;
  contactRole: string;
  scheduledDate: string;
  scheduledTime: string;
  purpose: string;
  status: FollowUpStatus;
  priority: "Critical" | "High" | "Medium" | "Normal";
  reminderChannel: "WhatsApp" | "Email" | "Popup";
  escalated: boolean;
}

const INITIAL_FOLLOWUPS: FollowUpItem[] = [
  {
    id: "FLW-101",
    collegeName: "RV College of Engineering",
    contactPerson: "Dr. K. S. Badrinarayan",
    contactRole: "Head Placement Officer",
    scheduledDate: "2026-09-24",
    scheduledTime: "11:30 AM",
    purpose: "Verify online proctoring lab bandwidth and static IP range.",
    status: "Today",
    priority: "Critical",
    reminderChannel: "WhatsApp",
    escalated: false,
  },
  {
    id: "FLW-102",
    collegeName: "BMS College of Engineering",
    contactPerson: "Prof. Pradeep S.",
    contactRole: "T&P Officer",
    scheduledDate: "2026-09-24",
    scheduledTime: "03:00 PM",
    purpose: "Collect signed student enrollment CSV roster.",
    status: "Today",
    priority: "High",
    reminderChannel: "WhatsApp",
    escalated: false,
  },
  {
    id: "FLW-103",
    collegeName: "National Institute of Engineering (NIE)",
    contactPerson: "Dr. Harshavardhana",
    contactRole: "Placement Head",
    scheduledDate: "2026-09-25",
    scheduledTime: "10:00 AM",
    purpose: "Review faculty coordinator list for lab invigilation.",
    status: "Tomorrow",
    priority: "High",
    reminderChannel: "Email",
    escalated: false,
  },
  {
    id: "FLW-104",
    collegeName: "KLE Technological University",
    contactPerson: "Prof. Arun Patil",
    contactRole: "Placement Lead",
    scheduledDate: "2026-09-22",
    scheduledTime: "04:30 PM",
    purpose: "Confirm Principal signature on CSR sponsorship terms.",
    status: "Overdue",
    priority: "Critical",
    reminderChannel: "Popup",
    escalated: true,
  },
  {
    id: "FLW-105",
    collegeName: "Dayananda Sagar College",
    contactPerson: "Prof. Murali K.",
    contactRole: "Associate Director",
    scheduledDate: "2026-09-28",
    scheduledTime: "11:00 AM",
    purpose: "Host pre-assessment webinar for 300 final year engineering students.",
    status: "Pending",
    priority: "Medium",
    reminderChannel: "Email",
    escalated: false,
  },
  {
    id: "FLW-106",
    collegeName: "PES University",
    contactPerson: "Dr. Nagaraj Rao",
    contactRole: "Director Placements",
    scheduledDate: "2026-09-20",
    scheduledTime: "02:00 PM",
    purpose: "Institutional MoU execution and course syllabus signoff.",
    status: "Completed",
    priority: "High",
    reminderChannel: "WhatsApp",
    escalated: false,
  },
];

const KANBAN_COLUMNS: FollowUpStatus[] = ["Pending", "Today", "Tomorrow", "Completed", "Overdue", "Cancelled"];

export default function HRFollowupsPage() {
  const { colleges } = useApp();
  const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban");
  const [followups, setFollowups] = useState<FollowUpItem[]>(INITIAL_FOLLOWUPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);

  // New Follow-Up Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collegeName, setCollegeName] = useState("RV College of Engineering");
  const [contactPerson, setContactPerson] = useState("");
  const [contactRole, setContactRole] = useState("Placement Officer");
  const [scheduledDate, setScheduledDate] = useState("2026-09-25");
  const [scheduledTime, setScheduledTime] = useState("10:30 AM");
  const [purpose, setPurpose] = useState("");
  const [priority, setPriority] = useState<FollowUpItem["priority"]>("High");
  const [reminderChannel, setReminderChannel] = useState<FollowUpItem["reminderChannel"]>("WhatsApp");

  const handleCreateFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPerson || !purpose) {
      toast.error("Please enter contact person and purpose.");
      return;
    }

    const created: FollowUpItem = {
      id: `FLW-${Date.now().toString().slice(-4)}`,
      collegeName,
      contactPerson,
      contactRole,
      scheduledDate,
      scheduledTime,
      purpose,
      status: "Tomorrow",
      priority,
      reminderChannel,
      escalated: false,
    };

    setFollowups([created, ...followups]);
    setIsCreateModalOpen(false);
    toast.success(`Follow-up scheduled with ${contactPerson} on ${scheduledDate}`);
    setContactPerson("");
    setPurpose("");
  };

  const handleMoveStatus = (id: string, newStatus: FollowUpStatus) => {
    setFollowups((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    toast.success(`Follow-up moved to '${newStatus}'`);
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleTriggerReminder = (f: FollowUpItem) => {
    toast.success(`Dispatched automated ${f.reminderChannel} reminder to ${f.contactPerson}!`);
  };

  const filteredFollowups = followups.filter((f) => {
    const matchesSearch =
      f.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Campus Operations Cadence
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Follow-Up Management & SLA Reminders</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Never miss institutional touchpoints. Track overdue follow-ups, trigger automatic WhatsApp reminders, and escalate critical tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Schedule Follow-Up
          </Button>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search follow-ups by college, person, purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "kanban" ? "bg-white text-[#005BBB] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "calendar" ? "bg-white text-[#005BBB] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Calendar View
            </button>
          </div>
        </div>
      </Card>

      {/* View 1: Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((colStatus) => {
            const colItems = filteredFollowups.filter((item) => item.status === colStatus);
            return (
              <div
                key={colStatus}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[460px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        colStatus === "Today"
                          ? "bg-amber-500"
                          : colStatus === "Tomorrow"
                          ? "bg-blue-500"
                          : colStatus === "Completed"
                          ? "bg-emerald-500"
                          : colStatus === "Overdue"
                          ? "bg-rose-500 animate-ping"
                          : "bg-slate-400"
                      }`}
                    />
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{colStatus}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                    {colItems.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {colItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-3 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-lg cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-[#005BBB] truncate max-w-[110px]">
                          {item.collegeName}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            item.priority === "Critical"
                              ? "bg-rose-100 text-rose-700"
                              : item.priority === "High"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 leading-snug">{item.contactPerson}</h5>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.purpose}</p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.scheduledTime}
                        </span>
                        <span className="text-slate-600 font-medium">{item.reminderChannel}</span>
                      </div>
                    </Card>
                  ))}

                  {colItems.length === 0 && (
                    <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 italic">
                      No follow-ups
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View 2: Monthly Calendar Agenda View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFollowups.map((item) => (
            <Card
              key={item.id}
              className="p-4 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">
                    {new Date(item.scheduledDate).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="text-base font-bold text-slate-900 leading-none">
                    {new Date(item.scheduledDate).getDate()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.status}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{item.collegeName}</h4>
                  <p className="text-xs text-slate-600">{item.contactPerson} ({item.contactRole})</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{item.purpose}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Follow-up Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Follow-Up Task: ${selectedItem.collegeName}`}
          subtitle={`Contact: ${selectedItem.contactPerson} • Scheduled for ${selectedItem.scheduledDate} at ${selectedItem.scheduledTime}`}
          size="md"
        >
          <div className="space-y-4 text-slate-800 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Task Objective</h4>
              <p className="text-sm font-semibold text-slate-900">{selectedItem.purpose}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400">Current Status:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedItem.status}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400">Priority Level:</span>
                <p className="font-bold text-rose-600 mt-0.5">{selectedItem.priority}</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg border border-blue-200 flex items-center justify-between">
              <span>Automated Alert Channel: <strong>{selectedItem.reminderChannel}</strong></span>
              <Button variant="cyan" size="sm" onClick={() => handleTriggerReminder(selectedItem)}>
                Trigger Alert Now
              </Button>
            </div>

            {/* Quick Status Shift */}
            <div>
              <span className="font-semibold text-slate-600 block mb-1.5">Change Kanban Column:</span>
              <div className="flex flex-wrap gap-1.5">
                {KANBAN_COLUMNS.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMoveStatus(selectedItem.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      selectedItem.status === st
                        ? "bg-[#005BBB] text-white border-[#005BBB]"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              {selectedItem.status !== "Completed" && (
                <Button variant="cyan" onClick={() => handleMoveStatus(selectedItem.id, "Completed")}>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Follow-Up Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Institutional Follow-Up"
        subtitle="Set up recurring or one-time alerts with automated WhatsApp or Email reminders."
        size="lg"
      >
        <form onSubmit={handleCreateFollowup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Partner Institution *</label>
              <select
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                {colleges.map((col: any) => (
                  <option key={col.id} value={col.name}>
                    {col.name} ({col.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Officer Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. K. S. Badrinarayan"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Time</label>
              <input
                type="text"
                placeholder="e.g. 11:30 AM"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-Up Agenda & Objective *</label>
            <textarea
              rows={3}
              placeholder="What needs to be achieved in this follow-up call/meeting..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Schedule Follow-Up Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
