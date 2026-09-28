"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Send,
  Calendar,
  Users,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
  Building2,
  GraduationCap,
  Megaphone,
  Radio,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  Check
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import { INITIAL_WHATSAPP_MESSAGES, INITIAL_EMAIL_MESSAGES } from "@/lib/communication/communicationData";

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  audience: string;
  channels: string[];
  scheduledFor: string;
  status: "Sent" | "Scheduled" | "Draft";
  recipientCount: number;
}

const INITIAL_CAMPAIGNS: NotificationCampaign[] = [
  {
    id: "notif-101",
    title: "Phase-1 Statewide Online Exam Slot Announcement",
    message: "Dear candidate, your CSR assessment slot has been scheduled for Oct 2, 2026 at 10:00 AM IST. Please review your hall ticket.",
    audience: "All Students",
    channels: ["Dashboard", "Email", "WhatsApp"],
    scheduledFor: "Immediate",
    status: "Sent",
    recipientCount: 840,
  },
  {
    id: "notif-102",
    title: "Lab Readiness Signoff Reminder",
    message: "Respected Faculty Coordinators, please complete the lab workstation readiness checklist by 5:00 PM today.",
    audience: "Faculty",
    channels: ["Dashboard", "Email"],
    scheduledFor: "2026-09-28 09:00 AM",
    status: "Scheduled",
    recipientCount: 38,
  },
  {
    id: "notif-103",
    title: "Executive MoU Execution Complete",
    message: "Bilateral CSR MoU for R.V. College of Engineering has been ratified.",
    audience: "Principal",
    channels: ["Email"],
    scheduledFor: "Immediate",
    status: "Sent",
    recipientCount: 15,
  },
];

export default function AdminNotificationCenterPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "retry_queue" | "analytics">("campaigns");
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(INITIAL_CAMPAIGNS);
  const [failedWaMessages, setFailedWaMessages] = useState(INITIAL_WHATSAPP_MESSAGES.filter((m) => m.status === "Failed"));
  const [failedEmails, setFailedEmails] = useState(INITIAL_EMAIL_MESSAGES.filter((e) => e.status === "Failed" || e.status === "Bounced"));
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Students");
  const [channels, setChannels] = useState<string[]>(["Dashboard", "WhatsApp"]);
  const [scheduledFor, setScheduledFor] = useState("Immediate");

  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Title and message are required");
      return;
    }
    const newCamp: NotificationCampaign = {
      id: `notif-${Date.now().toString().slice(-4)}`,
      title,
      message,
      audience,
      channels,
      scheduledFor,
      status: scheduledFor === "Immediate" ? "Sent" : "Scheduled",
      recipientCount: audience === "All Students" ? 950 : 45,
    };
    setCampaigns([newCamp, ...campaigns]);
    setIsComposeOpen(false);
    toast.success(`Notification broadcast dispatched to ${newCamp.recipientCount} recipients across ${channels.join(", ")}`);
    setTitle("");
    setMessage("");
  };

  const handleRetryWa = (id: string) => {
    setFailedWaMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("WhatsApp message resent and delivered successfully!");
  };

  const handleRetryEmail = (id: string) => {
    setFailedEmails((prev) => prev.filter((e) => e.id !== id));
    toast.success("Email redelivered successfully!");
  };

  const handleRetryAll = () => {
    setFailedWaMessages([]);
    setFailedEmails([]);
    toast.success("Bulk Retry Executed! All failed communications resolved.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Omnichannel Messaging Hub & Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Global Notification & Automation Command
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Realtime multi-channel broadcasts across Student, Placement Officer, HR, and Admin portals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/notification-templates">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              Triggers
            </Button>
          </Link>
          <Link href="/admin/whatsapp-templates">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              WhatsApp
            </Button>
          </Link>
          <Link href="/admin/email-templates">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </Button>
          </Link>
          <Link href="/admin/announcements">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5" />
              Announcements
            </Button>
          </Link>

          <Button
            variant="cyan"
            size="sm"
            onClick={() => setIsComposeOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Broadcast
          </Button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">WhatsApp Delivery Rate</span>
          <p className="text-2xl font-black text-emerald-500">98.2%</p>
          <span className="text-[10px] text-muted-foreground">Meta Cloud API Verified</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Email Open Rate</span>
          <p className="text-2xl font-black text-[#005BBB]">84.6%</p>
          <span className="text-[10px] text-muted-foreground">Institutional Mailboxes</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Follow-Up Completion</span>
          <p className="text-2xl font-black text-cyan-500">92.0%</p>
          <span className="text-[10px] text-muted-foreground">4 Overdue Escalated</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Pending Delivery Retries</span>
          <p className="text-2xl font-black text-red-500">{failedWaMessages.length + failedEmails.length}</p>
          <span className="text-[10px] text-muted-foreground">Automated Webhook Retry Active</span>
        </Card>
      </div>

      {/* View Switcher */}
      <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border w-max">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "campaigns" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          Dispatched Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab("retry_queue")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            activeTab === "retry_queue" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-500" />
          Delivery Retry Queue ({failedWaMessages.length + failedEmails.length})
        </button>
      </div>

      {activeTab === "campaigns" ? (
        <div className="space-y-4">
          {campaigns.map((camp) => (
            <Card key={camp.id} className="p-6 space-y-3 hover:border-[#005BBB] transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      camp.status === "Sent"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {camp.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                    Target: {camp.audience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span>Recipients: <strong className="text-foreground">{camp.recipientCount}</strong></span>
                  <span>•</span>
                  <span>{camp.scheduledFor}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-foreground">{camp.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{camp.message}</p>

              <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                <span>Channels:</span>
                {camp.channels.map((ch) => (
                  <span key={ch} className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[10px]">
                    {ch}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground">Failed Communication Retries</h3>
              <p className="text-xs text-muted-foreground">Transient carrier or network dropouts queued for re-dispatch.</p>
            </div>
            {(failedWaMessages.length > 0 || failedEmails.length > 0) && (
              <Button variant="primary" size="sm" onClick={handleRetryAll} className="text-xs">
                Retry All Failed Messages
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {failedWaMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-foreground">{msg.recipientName} ({msg.recipientPhone})</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800">FAILED</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{msg.content}</p>
                  <p className="text-[10px] text-red-600 font-mono">{msg.errorLog}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleRetryWa(msg.id)}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            ))}

            {failedEmails.map((em) => (
              <div key={em.id} className="p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-foreground">{em.recipientName} ({em.recipientEmail})</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800">BOUNCED</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{em.subject}</p>
                  <p className="text-[10px] text-red-600 font-mono">{em.errorLog}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleRetryEmail(em.id)}>
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            ))}

            {failedWaMessages.length === 0 && failedEmails.length === 0 && (
              <div className="text-center py-12 text-xs text-muted-foreground space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>All queues clear! 100% of communications delivered.</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Broadcast Compose Modal */}
      {isComposeOpen && (
        <Modal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          title="Dispatch Omnichannel Notification Broadcast"
        >
          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Headline Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CSR Drive Assessment Slot Confirmed"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Message Body</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Message delivered to recipients..."
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Recipient Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="All Students">All Registered Candidates</option>
                <option value="Placement Officers">Institutional Placement Officers</option>
                <option value="HR Panel">HR Interview Panel Members</option>
                <option value="Principals">College Principals & Deans</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Dispatched Channels</label>
              <div className="flex items-center gap-4 text-xs">
                {["Dashboard", "WhatsApp", "Email"].map((ch) => (
                  <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.includes(ch)}
                      onChange={() => toggleChannel(ch)}
                      className="accent-[#005BBB]"
                    />
                    <span>{ch}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Dispatch Broadcast
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
