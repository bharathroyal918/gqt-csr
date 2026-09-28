"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  MessageSquare,
  Mail,
  Calendar,
  FileText,
  Mic,
  Paperclip,
  Activity,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  UploadCloud,
  ChevronRight,
  X,
  Volume2
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface CRMInteractionItem {
  id: string;
  collegeName: string;
  contactPerson: string;
  contactRole: string;
  type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Note" | "Voice Recording" | "Status Change";
  direction?: "Incoming" | "Outgoing";
  timestamp: string;
  summary: string;
  outcome: string;
  followUpDate?: string;
  priority: "High" | "Medium" | "Normal";
  hasRecording?: boolean;
  recordingDuration?: string;
  attachments?: string[];
  hrStaff: string;
}

const INITIAL_INTERACTIONS: CRMInteractionItem[] = [
  {
    id: "CRM-001",
    collegeName: "RV College of Engineering",
    contactPerson: "Dr. K. S. Badrinarayan",
    contactRole: "Head of Training & Placement",
    type: "Call",
    direction: "Outgoing",
    timestamp: "Today, 11:30 AM",
    summary: "Called placement head to align on offline computer laboratory readiness for 400 simultaneous students.",
    outcome: "Lab 3 and Lab 4 confirmed with high-speed 100Mbps dedicated leased line.",
    followUpDate: "2026-09-26",
    priority: "High",
    hasRecording: true,
    recordingDuration: "4m 12s",
    attachments: ["Lab_Capacity_Confirmation.pdf"],
    hrStaff: "Priya Nair",
  },
  {
    id: "CRM-002",
    collegeName: "BMS College of Engineering",
    contactPerson: "Prof. Pradeep S.",
    contactRole: "Placement Officer",
    type: "WhatsApp",
    timestamp: "Today, 10:15 AM",
    summary: "Dispatched automated WhatsApp broadcast with registration link and student QR pass.",
    outcome: "Received student acknowledgement. 120 registrations logged in first hour.",
    priority: "Medium",
    hrStaff: "Priya Nair",
  },
  {
    id: "CRM-003",
    collegeName: "National Institute of Engineering (NIE)",
    contactPerson: "Dr. Rohini Nagapadma",
    contactRole: "Principal",
    type: "Meeting",
    timestamp: "Yesterday, 04:00 PM",
    summary: "Hybrid boardroom meeting regarding CSR sponsorship budget allocation and women empowerment curriculum.",
    outcome: "Signed MoU returned with college seal and Principal authorization.",
    followUpDate: "2026-09-28",
    priority: "High",
    attachments: ["Signed_NIE_CSR_MoU_2026.pdf"],
    hrStaff: "Priya Nair",
  },
  {
    id: "CRM-004",
    collegeName: "KLE Technological University",
    contactPerson: "Prof. Arun Patil",
    contactRole: "TPO Lead",
    type: "Email",
    direction: "Incoming",
    timestamp: "23 Sep, 02:45 PM",
    summary: "Received inquiry concerning backlog relaxation for diploma lateral entry students.",
    outcome: "Responded via official circular that up to 1 active backlog is permitted under GQT policy.",
    priority: "Normal",
    hrStaff: "Arun Menon",
  },
  {
    id: "CRM-005",
    collegeName: "RV College of Engineering",
    contactPerson: "Prof. Anitha Murthy",
    contactRole: "Faculty Coordinator",
    type: "Status Change",
    timestamp: "22 Sep, 06:15 PM",
    summary: "Moved college recruitment stage from 'Contacted' to 'MoU Signed & Active Drive'.",
    outcome: "Automated test link generation activated for CSE and ISE departments.",
    priority: "High",
    hrStaff: "Priya Nair",
  },
];

export default function HRCRMPage() {
  const { colleges } = useApp();
  const [interactions, setInteractions] = useState<CRMInteractionItem[]>(INITIAL_INTERACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Call Log Modal State
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [collegeName, setCollegeName] = useState("RV College of Engineering");
  const [contactPerson, setContactPerson] = useState("");
  const [contactRole, setContactRole] = useState("Placement Officer");
  const [callType, setCallType] = useState<"Outgoing" | "Incoming">("Outgoing");
  const [callDate, setCallDate] = useState("2026-09-24");
  const [startTime, setStartTime] = useState("11:30");
  const [endTime, setEndTime] = useState("11:42");
  const [duration, setDuration] = useState("12 mins");
  const [summary, setSummary] = useState("");
  const [outcome, setOutcome] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-09-26");
  const [priority, setPriority] = useState<"High" | "Medium" | "Normal">("High");
  const [notes, setNotes] = useState("");

  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPerson || !summary) {
      toast.error("Please fill in contact person and discussion summary.");
      return;
    }

    const newItem: CRMInteractionItem = {
      id: `CRM-${Date.now().toString().slice(-4)}`,
      collegeName,
      contactPerson,
      contactRole,
      type: "Call",
      direction: callType,
      timestamp: "Just now",
      summary,
      outcome: outcome || "Call logged successfully.",
      followUpDate,
      priority,
      hasRecording: true,
      recordingDuration: duration,
      hrStaff: "Priya Nair (Lead Recruiter)",
    };

    setInteractions([newItem, ...interactions]);
    setIsLogCallModalOpen(false);
    toast.success(`Call with ${contactPerson} logged and saved to Supabase!`);

    // Reset
    setContactPerson("");
    setSummary("");
    setOutcome("");
    setNotes("");
  };

  const filteredInteractions = interactions.filter((item) => {
    const matchesSearch =
      item.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.outcome.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Institutional CRM & Outreach
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">College CRM & Call Logs</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Permanent audit trail of institutional calls, WhatsApp notifications, physical visits, and automated follow-up reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsLogCallModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Log New Call Interaction
          </Button>
        </div>
      </div>

      {/* CRM Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 text-xs">
        <Link href="/hr/crm" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
          Overview
        </Link>
        <Link href="/hr/crm/calls" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Call Logs
        </Link>
        <Link href="/hr/crm/whatsapp" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          WhatsApp Business
        </Link>
        <Link href="/hr/crm/email" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Email Campaigns
        </Link>
        <Link href="/hr/crm/followups" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Follow-Up Engine
        </Link>
        <Link href="/hr/crm/meetings" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Meetings
        </Link>
        <Link href="/hr/crm/timeline" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Permanent Timeline
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by College, Contact Person, Summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Interaction Types</option>
              <option value="call">Phone Calls</option>
              <option value="whatsapp">WhatsApp Blasts</option>
              <option value="email">Email Communications</option>
              <option value="meeting">Principal / PTO Meetings</option>
              <option value="status change">Stage Status Changes</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Chronological Communication Timeline */}
      <div className="space-y-4">
        {filteredInteractions.map((item) => (
          <Card
            key={item.id}
            className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === "Call"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.type === "WhatsApp"
                      ? "bg-green-100 text-green-700"
                      : item.type === "Email"
                      ? "bg-blue-100 text-[#005BBB]"
                      : item.type === "Meeting"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.type === "Call" && <PhoneCall className="w-5 h-5" />}
                  {item.type === "WhatsApp" && <MessageSquare className="w-5 h-5" />}
                  {item.type === "Email" && <Mail className="w-5 h-5" />}
                  {item.type === "Meeting" && <Calendar className="w-5 h-5" />}
                  {item.type === "Status Change" && <Activity className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.collegeName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {item.contactPerson} ({item.contactRole})
                    </span>
                    {item.direction && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-0.5">
                        {item.direction === "Outgoing" ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3 text-blue-600" />
                        )}
                        {item.direction}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">{item.summary}</p>

                  <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-800">Outcome: </span>
                    <span className="text-slate-600">{item.outcome}</span>
                  </div>

                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 font-medium">Attachment:</span>
                      {item.attachments.map((att, i) => (
                        <span
                          key={i}
                          className="text-[#005BBB] underline cursor-pointer font-medium hover:text-[#001B4D]"
                          onClick={() => toast.success(`Downloading ${att}...`)}
                        >
                          {att}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.hasRecording && (
                    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Audio Recording Vaulted ({item.recordingDuration})</span>
                      <button
                        onClick={() => toast.success("Playing call audio verification sample...")}
                        className="text-[11px] underline font-bold ml-1 text-emerald-900"
                      >
                        Play Audio
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right text-xs shrink-0 self-end lg:self-center">
                <span className="text-slate-400 block font-mono">{item.timestamp}</span>
                <span className="text-[11px] text-slate-500 font-medium mt-1 block">Logged by {item.hrStaff}</span>
                {item.followUpDate && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Follow-Up: {item.followUpDate}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Log Call Modal */}
      <Modal
        isOpen={isLogCallModalOpen}
        onClose={() => setIsLogCallModalOpen(false)}
        title="Log College Call & Discussion Notes"
        subtitle="Record official institutional communication, action items, and automated follow-up calendar hooks."
        size="lg"
      >
        <form onSubmit={handleSaveCall} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target College *</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Call Direction</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={callType === "Outgoing"}
                    onChange={() => setCallType("Outgoing")}
                  />
                  <span>Outgoing Call</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input
                    type="radio"
                    checked={callType === "Incoming"}
                    onChange={() => setCallType("Incoming")}
                  />
                  <span>Incoming Call</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. K. S. Badrinarayan"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Designation</label>
              <input
                type="text"
                placeholder="e.g. Placement Officer / HOD CSE"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Call Date</label>
              <input
                type="date"
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 15 mins"
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
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Discussion Summary *</label>
            <textarea
              rows={3}
              placeholder="Key topics discussed regarding CSR Drive, infrastructure, or student participation..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Agreed Outcome / Action Item</label>
              <input
                type="text"
                placeholder="e.g. College agreed to sign MoU by tomorrow afternoon."
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Next Follow-Up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          {/* Voice recording simulator */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Mic className="w-4 h-4 text-rose-500" />
              <span>Voice Note Vault: Audio file simulated & attached (GQT-VOICE-REC-101.mp3)</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">Encrypted AES-256</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsLogCallModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Save Call to Supabase CRM
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
