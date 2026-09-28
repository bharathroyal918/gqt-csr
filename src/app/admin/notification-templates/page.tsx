"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Edit3,
  Copy,
  Trash2,
  Eye,
  Save,
  Send,
  Radio,
  Layers,
  Filter
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";

interface SystemNotificationTemplate {
  id: string;
  name: string;
  type: string;
  titleTemplate: string;
  bodyTemplate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  targetRole: string;
  channel: string;
}

const SYSTEM_NOTIFICATION_TEMPLATES: SystemNotificationTemplate[] = [
  {
    id: "snt-01",
    name: "Registration Approved",
    type: "Registration Approved",
    titleTemplate: "Profile Verified — GQT CSR Drive",
    bodyTemplate: "Your registration for {{drive_name}} at {{college_name}} has been authenticated.",
    priority: "Medium",
    targetRole: "Student",
    channel: "In-App + WhatsApp",
  },
  {
    id: "snt-02",
    name: "Exam Reminder (24h)",
    type: "Exam Reminder",
    titleTemplate: "Online Assessment Tomorrow",
    bodyTemplate: "Reminder: Your GQT Online Assessment begins tomorrow at {{exam_time}}.",
    priority: "High",
    targetRole: "Student",
    channel: "In-App + WhatsApp + Email",
  },
  {
    id: "snt-03",
    name: "Interview Scheduled",
    type: "Interview Scheduled",
    titleTemplate: "Technical Interview Slot Assigned",
    bodyTemplate: "Your interview with HR panel is confirmed for {{interview_date}} at {{interview_time}}.",
    priority: "High",
    targetRole: "Student",
    channel: "In-App + Email",
  },
  {
    id: "snt-04",
    name: "Offer Letter Generated",
    type: "Offer Generated",
    titleTemplate: "Congratulations! Letter of Intent Issued",
    bodyTemplate: "Official appointment letter {{offer_number}} is ready for review in your portal.",
    priority: "Critical",
    targetRole: "Student",
    channel: "In-App + WhatsApp + Email",
  },
  {
    id: "snt-05",
    name: "Offer Acceptance Notice",
    type: "Offer Accepted",
    titleTemplate: "Candidate Accepted Offer",
    bodyTemplate: "{{student_name}} from {{college_name}} has digitally signed their Letter of Intent.",
    priority: "High",
    targetRole: "HR & Admission Team",
    channel: "In-App + Dashboard Push",
  },
  {
    id: "snt-06",
    name: "Follow-Up Overdue Escalation",
    type: "Follow-Up Reminder",
    titleTemplate: "URGENT: Follow-up Escalated",
    bodyTemplate: "Follow-up for {{college_name}} is overdue by 48 hours. Assigned lead: {{assigned_to}}.",
    priority: "Critical",
    targetRole: "CSR Manager & Admin",
    channel: "In-App + Email",
  },
];

export default function AdminNotificationTemplatesPage() {
  const [templates, setTemplates] = useState<SystemNotificationTemplate[]>(SYSTEM_NOTIFICATION_TEMPLATES);
  const [selected, setSelected] = useState<SystemNotificationTemplate>(SYSTEM_NOTIFICATION_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(selected.titleTemplate);
  const [editBody, setEditBody] = useState(selected.bodyTemplate);
  const [editPriority, setEditPriority] = useState(selected.priority);

  const handleSelect = (tmpl: SystemNotificationTemplate) => {
    setSelected(tmpl);
    setEditTitle(tmpl.titleTemplate);
    setEditBody(tmpl.bodyTemplate);
    setEditPriority(tmpl.priority);
    setIsEditing(false);
  };

  const handleSave = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, titleTemplate: editTitle, bodyTemplate: editBody, priority: editPriority }
          : t
      )
    );
    setSelected((prev) => ({
      ...prev,
      titleTemplate: editTitle,
      bodyTemplate: editBody,
      priority: editPriority,
    }));
    setIsEditing(false);
    toast.success("System Notification template updated!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/notifications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Communication Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-[#005BBB]" />
            Realtime Push & In-App Notification Templates
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure system event triggers for exam notifications, interview alerts, and offer acceptance broadcasts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List (1 col) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            System Event Triggers ({templates.length})
          </h3>

          <div className="space-y-2">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelect(tmpl)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selected.id === tmpl.id
                    ? "border-[#005BBB] bg-[#005BBB]/5 ring-1 ring-[#005BBB]"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{tmpl.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      tmpl.priority === "Critical"
                        ? "bg-red-100 text-red-800"
                        : tmpl.priority === "High"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {tmpl.priority}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{tmpl.targetRole} • {tmpl.channel}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">Target: {selected.targetRole} ({selected.channel})</p>
              </div>

              {isEditing ? (
                <Button variant="primary" size="sm" onClick={handleSave} className="text-xs">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Trigger
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-xs">
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit Template
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Notification Title</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Notification Body Text</label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={4}
                    className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Alert Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="pt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#005BBB]" />
                    <h4 className="text-xs font-bold text-foreground">{selected.titleTemplate}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{selected.bodyTemplate}</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
