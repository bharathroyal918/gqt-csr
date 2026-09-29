"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Building2,
  User,
  Filter,
  Search,
  Kanban,
  List,
  Flame,
  Bell,
  Smartphone,
  Mail,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_FOLLOW_UPS } from "@/lib/communication/communicationData";
import { FollowUpReminder } from "@/types";
import { toast } from "sonner";

export default function HRFollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUpReminder[]>(INITIAL_FOLLOW_UPS);
  const [viewMode, setViewMode] = useState<"kanban" | "timeline" | "calendar">("kanban");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [collegeName, setCollegeName] = useState("R.V. College of Engineering (RVCE)");
  const [contactPerson, setContactPerson] = useState("Prof. Chandrasekhar");
  const [contactPhone, setContactPhone] = useState("+91 98450 44556");
  const [purpose, setPurpose] = useState("");
  const [scheduledFor, setScheduledFor] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("High");
  const [notes, setNotes] = useState("");
  const [channelDashboard, setChannelDashboard] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);

  // Status counters
  const todayCount = followUps.filter((f) => f.dueCategory === "Today").length;
  const upcomingCount = followUps.filter((f) => f.dueCategory === "Upcoming").length;
  const completedCount = followUps.filter((f) => f.dueCategory === "Completed").length;
  const overdueCount = followUps.filter((f) => f.dueCategory === "Overdue").length;

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose) {
      toast.error("Please enter the follow-up purpose.");
      return;
    }

    const created: FollowUpReminder = {
      id: `fu-${Date.now()}`,
      collegeId: `col-${Date.now()}`,
      collegeName,
      contactPerson,
      contactPhone,
      scheduledFor,
      dueCategory: scheduledFor === new Date().toISOString().split("T")[0] ? "Today" : "Upcoming",
      purpose,
      assignedTo: "Priya Nair",
      priority,
      status: "Pending",
      notes,
      emailReminderSent: channelEmail,
      whatsappReminderSent: channelWhatsApp,
    };

    setFollowUps((prev) => [created, ...prev]);
    toast.success("Follow-Up Reminder Scheduled!", {
      description: `Automated ping alerts activated for ${scheduledFor}.`,
    });
    setIsCreateOpen(false);
    setPurpose("");
    setNotes("");
  };

  const handleMarkComplete = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "Completed", dueCategory: "Completed" } : f
      )
    );
    toast.success("Follow-up marked as COMPLETED!");
  };

  const handleEscalate = (id: string) => {
    toast.error("Follow-Up Escalated!", {
      description: "Priority raised to Urgent. High-priority alert sent to CSR Manager Kiran and Admin.",
    });
  };

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
            <CalendarCheck className="w-7 h-7 text-[#005BBB]" />
            Automated Follow-Up & Escalation Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Smart countdown reminders (7d, 5d, 3d, 1d, on time) with auto-escalation triggers for unanswered institutional leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                viewMode === "kanban" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                viewMode === "timeline" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                viewMode === "calendar" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Schedule Follow-Up
          </Button>
        </div>
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
        <Link href="/hr/crm/followups" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
          Follow-Up Engine
        </Link>
        <Link href="/hr/crm/meetings" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Meetings
        </Link>
        <Link href="/hr/crm/timeline" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
          Permanent Timeline
        </Link>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase">Today's Due</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{todayCount}</p>
        </Card>

        <Card className="p-4 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase">Upcoming</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{upcomingCount}</p>
        </Card>

        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{completedCount}</p>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase">Overdue / Escalated</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-500">{overdueCount}</p>
        </Card>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(["Today", "Upcoming", "Overdue", "Completed"] as const).map((cat) => {
            const items = followUps.filter((f) => f.dueCategory === cat);
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50 border border-border">
                  <span className="text-xs font-bold uppercase text-foreground">{cat}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background text-foreground font-mono">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4 space-y-3 hover:border-[#005BBB] transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.priority === "Urgent"
                              ? "bg-red-100 text-red-800"
                              : item.priority === "High"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.priority}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {item.scheduledFor}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-foreground">{item.contactPerson}</h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{item.collegeName}</p>
                      </div>

                      <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/60">
                        {item.purpose}
                      </p>

                      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                        {item.status !== "Completed" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 text-emerald-600"
                              onClick={() => handleMarkComplete(item.id)}
                            >
                              Done
                            </Button>
                            {item.dueCategory === "Overdue" && (
                              <Button
                                variant="danger"
                                size="sm"
                                className="text-xs h-7"
                                onClick={() => handleEscalate(item.id)}
                              >
                                Escalate
                              </Button>
                            )}
                          </>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Finished
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <Card className="p-6">
          <div className="relative border-l-2 border-border ml-4 space-y-6 pb-2">
            {followUps.map((item) => (
              <div key={item.id} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-background ${
                    item.status === "Completed"
                      ? "border-emerald-500"
                      : item.dueCategory === "Overdue"
                      ? "border-red-500"
                      : "border-blue-500"
                  }`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{item.collegeName}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({item.scheduledFor})</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-muted">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.purpose}</p>
                  <p className="text-[11px] text-foreground font-medium">Contact: {item.contactPerson} ({item.contactPhone})</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Calendar View Placeholder */}
      {viewMode === "calendar" && (
        <Card className="p-8 text-center space-y-3">
          <Calendar className="w-12 h-12 text-[#005BBB] mx-auto opacity-70" />
          <h3 className="text-sm font-bold text-foreground">Interactive Calendar Schedule</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Synchronized with Google Workspace and Microsoft 365. 4 institutional syncs scheduled for this week.
          </p>
        </Card>
      )}

      {/* Schedule Follow-up Modal */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Schedule College Follow-Up Reminder"
        >
          <form onSubmit={handleCreateFollowUp} className="space-y-4">
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
                <label className="text-xs font-semibold text-foreground">Follow-Up Date</label>
                <Input
                  type="date"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Follow-Up Purpose</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Collect signed MoU or confirm auditorium readiness..."
                rows={2}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
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

            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold text-foreground">Automated Notification Reminders</label>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelDashboard}
                    onChange={(e) => setChannelDashboard(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>Dashboard Bell</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelWhatsApp}
                    onChange={(e) => setChannelWhatsApp(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>WhatsApp Ping</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={(e) => setChannelEmail(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>Email Digest</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Schedule Reminder
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
