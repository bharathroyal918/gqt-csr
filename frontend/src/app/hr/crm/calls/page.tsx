"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building2,
  Search,
  Filter,
  Mic,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  FileText
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_CALL_LOGS } from "@/lib/communication/communicationData";
import { CallLogRecord } from "@/types";
import { toast } from "sonner";

export default function HRCallsManagementPage() {
  const [calls, setCalls] = useState<CallLogRecord[]>(INITIAL_CALL_LOGS);
  const [search, setSearch] = useState("");
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);

  // Form states
  const [collegeName, setCollegeName] = useState("R.V. College of Engineering (RVCE)");
  const [contactPerson, setContactPerson] = useState("Prof. Chandrasekhar");
  const [contactPhone, setContactPhone] = useState("+91 98450 44556");
  const [contactRole, setContactRole] = useState("Director - Placement");
  const [callType, setCallType] = useState<"Incoming" | "Outgoing">("Outgoing");
  const [callStatus, setCallStatus] = useState<"Connected" | "Missed" | "Busy">("Connected");
  const [startTime, setStartTime] = useState("10:30 AM");
  const [durationMinutes, setDurationMinutes] = useState("12");
  const [discussionSummary, setDiscussionSummary] = useState("");
  const [outcome, setOutcome] = useState<CallLogRecord["outcome"]>("Interested");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("High");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("2026-09-28");
  const [notes, setNotes] = useState("");

  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionSummary) {
      toast.error("Please provide discussion summary.");
      return;
    }

    const newCall: CallLogRecord = {
      id: `cl-${Date.now()}`,
      collegeId: `col-${Date.now()}`,
      collegeName,
      contactPerson,
      contactPhone,
      contactRole,
      callDate: new Date().toISOString().split("T")[0],
      startTime,
      endTime: "10:45 AM",
      durationSeconds: parseInt(durationMinutes, 10) * 60 || 720,
      callType,
      callStatus,
      discussionSummary,
      outcome,
      nextFollowUpDate,
      priority,
      notes,
      loggedBy: "Priya Nair (Senior HR)",
    };

    setCalls((prev) => [newCall, ...prev]);
    toast.success("Call Log Recorded Permanently!", {
      description: `Logged call with ${contactPerson} (${collegeName}).`,
    });
    setIsLogCallOpen(false);
    setDiscussionSummary("");
  };

  const filtered = calls.filter(
    (c) =>
      c.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.discussionSummary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/hr/crm"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to CRM Command Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <PhoneCall className="w-7 h-7 text-[#005BBB]" />
            Enterprise Institutional Call Log
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Record telephonic syncs with College Principals, Placement Directors, and Faculty Coordinators with audio attachments.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsLogCallOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Telephonic Call
        </Button>
      </div>

      {/* Sub-nav navigation pills */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 text-xs">
        <Link href="/hr/crm" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Overview
        </Link>
        <Link href="/hr/crm/calls" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
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

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search call logs by contact, college, or discussion..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="text-xs font-semibold text-muted-foreground">
            Total Logged Calls: <span className="font-bold text-foreground">{filtered.length}</span>
          </div>
        </div>
      </Card>

      {/* Calls Stream */}
      <div className="space-y-4">
        {filtered.map((call) => (
          <Card key={call.id} className="p-6 space-y-4 hover:border-[#005BBB] transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    call.callType === "Incoming"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {call.callType === "Incoming" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{call.contactPerson}</h3>
                    <span className="text-[11px] text-muted-foreground">({call.contactRole})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        call.callStatus === "Connected"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {call.callStatus}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{call.collegeName} • {call.contactPhone}</p>
                </div>
              </div>

              <div className="text-right text-xs text-muted-foreground font-mono">
                <p className="font-bold text-foreground">{call.callDate} at {call.startTime}</p>
                <p>Duration: {Math.round(call.durationSeconds / 60)} mins</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground block">Discussion Summary:</span>
              <p className="text-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/60">
                {call.discussionSummary}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-muted-foreground block">Call Outcome:</span>
                <span className="font-bold text-[#005BBB]">{call.outcome}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Next Follow-Up:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{call.nextFollowUpDate || "N/A"}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Call Priority:</span>
                <span className="font-semibold text-foreground">{call.priority}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Logged By:</span>
                <span className="font-medium text-foreground">{call.loggedBy}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Log Call Modal */}
      {isLogCallOpen && (
        <Modal
          isOpen={isLogCallOpen}
          onClose={() => setIsLogCallOpen(false)}
          title="Log Institutional Phone Call"
        >
          <form onSubmit={handleSaveCall} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">College Name</label>
                <Input
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contact Person</label>
                <Input
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Role / Designation</label>
                <Input
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Direction</label>
                <select
                  value={callType}
                  onChange={(e) => setCallType(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Outgoing">Outgoing Call</option>
                  <option value="Incoming">Incoming Call</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Status</label>
                <select
                  value={callStatus}
                  onChange={(e) => setCallStatus(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Connected">Connected</option>
                  <option value="Missed">Missed</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Duration (Minutes)</label>
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Call Outcome</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Interested">Interested</option>
                  <option value="MoU Agreed">MoU Agreed</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Drive Scheduled">Drive Scheduled</option>
                  <option value="Call Later">Call Later</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discussion Summary</label>
              <textarea
                value={discussionSummary}
                onChange={(e) => setDiscussionSummary(e.target.value)}
                placeholder="Key points discussed during call..."
                rows={3}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Next Follow-Up Date</label>
                <Input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsLogCallOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Call Entry
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
