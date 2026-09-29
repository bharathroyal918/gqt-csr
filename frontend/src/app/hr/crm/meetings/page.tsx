"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  ArrowLeft,
  Clock,
  Video,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  Building2,
  Paperclip
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_MEETINGS } from "@/lib/communication/communicationData";
import { MeetingRecord } from "@/types";
import { toast } from "sonner";

export default function HRMeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>(INITIAL_MEETINGS);
  const [search, setSearch] = useState("");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [collegeName, setCollegeName] = useState("R.V. College of Engineering (RVCE)");
  const [date, setDate] = useState("2026-09-28");
  const [time, setTime] = useState("03:00 PM - 04:00 PM");
  const [mode, setMode] = useState<"Online" | "Offline" | "Hybrid">("Hybrid");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/gqt-sync");
  const [venue, setVenue] = useState("Boardroom, Admin Block");
  const [agenda, setAgenda] = useState("");

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !agenda) {
      toast.error("Please fill title and agenda.");
      return;
    }

    const created: MeetingRecord = {
      id: `mtg-${Date.now()}`,
      title,
      collegeId: `col-${Date.now()}`,
      collegeName,
      attendees: [
        { name: "Priya Nair", role: "HR Executive", email: "priya@gqtindia.com" },
        { name: "Prof. Chandrasekhar", role: "Placement Officer", email: "placement@rvce.edu.in" },
      ],
      date,
      time,
      durationMinutes: 60,
      mode,
      meetingLink: mode !== "Offline" ? meetingLink : undefined,
      venue: mode !== "Online" ? venue : undefined,
      agenda,
      status: "Scheduled",
    };

    setMeetings((prev) => [created, ...prev]);
    toast.success("Meeting Scheduled & Calendar Invites Dispatched!", {
      description: `Google Meet link delivered to attendees for ${date}.`,
    });
    setIsScheduleOpen(false);
  };

  const filtered = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      m.agenda.toLowerCase().includes(search.toLowerCase())
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
            <Calendar className="w-7 h-7 text-[#005BBB]" />
            Institutional Meetings & MoM Governance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Coordinate leadership boardrooms with Principals and TPOs, record Minutes of Meeting, and track attendance.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsScheduleOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Schedule Sync
        </Button>
      </div>

      {/* CRM Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 text-xs">
        <Link href="/hr/crm" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
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
        <Link href="/hr/crm/meetings" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
          Meetings
        </Link>
        <Link href="/hr/crm/timeline" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Permanent Timeline
        </Link>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6 space-y-4 hover:border-[#005BBB] transition-all">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.mode === "Online"
                        ? "bg-purple-100 text-purple-800"
                        : item.mode === "Hybrid"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.mode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.collegeName}</p>
              </div>

              <div className="text-right text-xs font-mono text-muted-foreground">
                <p className="font-bold text-foreground">{item.date}</p>
                <p>{item.time}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground block">Agenda:</span>
              <p className="text-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/60">
                {item.agenda}
              </p>
            </div>

            {item.minutesOfMeeting && item.minutesOfMeeting.length > 0 && (
              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-300">Recorded Minutes (MoM):</span>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                  {item.minutesOfMeeting.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                Attendees: <strong className="text-foreground">{item.attendees.length} Leaders</strong>
              </span>

              <div className="flex items-center gap-2">
                {item.meetingLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => window.open(item.meetingLink, "_blank")}
                  >
                    <Video className="w-3.5 h-3.5 mr-1 text-[#005BBB]" />
                    Join Link
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setSelectedMeeting(item)}
                >
                  MoM Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleOpen && (
        <Modal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
          title="Schedule Institutional Coordination Sync"
        >
          <form onSubmit={handleScheduleMeeting} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Meeting Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CSR Drive Auditorium & Lab Preparation Sync"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">College</label>
                <Input
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Meeting Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Hybrid">Hybrid (Online + Physical)</option>
                  <option value="Online">Online (Google Meet / Zoom)</option>
                  <option value="Offline">Offline Campus Visit</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Time Slot</label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="03:00 PM - 04:00 PM"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Meeting Link / URL</label>
              <Input
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discussion Agenda</label>
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="Bullet points or topics to discuss..."
                rows={3}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsScheduleOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Schedule & Send Invites
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* MoM Details Modal */}
      {selectedMeeting && (
        <Modal
          isOpen={!!selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          title={`Meeting Minutes & Attendees — ${selectedMeeting.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
              <p><strong>College:</strong> {selectedMeeting.collegeName}</p>
              <p><strong>Scheduled:</strong> {selectedMeeting.date} ({selectedMeeting.time})</p>
              <p><strong>Venue / Link:</strong> {selectedMeeting.meetingLink || selectedMeeting.venue}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-foreground">Confirmed Attendees:</span>
              <div className="space-y-1.5">
                {selectedMeeting.attendees.map((att, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{att.name}</p>
                      <p className="text-[10px] text-muted-foreground">{att.role} • {att.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedMeeting(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
