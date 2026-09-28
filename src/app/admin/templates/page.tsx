"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  MessageSquare,
  Mail,
  Smartphone,
  Plus,
  Eye,
  Edit,
  Code,
  CheckCircle2,
  Clock,
  Sparkles,
  History,
  FileCode2
} from "lucide-react";

interface CommTemplate {
  id: string;
  type: "email" | "whatsapp";
  title: string;
  slug: string;
  category: "Registration Success" | "Exam Reminder" | "Interview Reminder" | "Offer Letter" | "Drive Announcement" | "Password Reset";
  subject?: string;
  content: string;
  variables: string[];
  buttons?: string[];
  metaApprovalStatus?: "Approved" | "Pending Approval" | "Rejected";
  version: number;
}

const INITIAL_TEMPLATES: CommTemplate[] = [
  {
    id: "tpl-em-01",
    type: "email",
    title: "Candidate Registration Confirmation",
    slug: "email_registration_success",
    category: "Registration Success",
    subject: "Welcome to GQT CSR Talent Drive {{academic_year}} — Registration Confirmed",
    content: `<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <h2>Congratulations {{student_name}}!</h2>
  <p>Your registration for the <strong>{{drive_name}}</strong> has been verified.</p>
  <p>Your Student ID is: <strong>{{student_id}}</strong></p>
  <p>Please log in to your candidate dashboard to access your study materials and test schedule.</p>
</div>`,
    variables: ["student_name", "drive_name", "student_id", "academic_year"],
    version: 2,
  },
  {
    id: "tpl-em-02",
    type: "email",
    title: "Exam Slot & Proctoring Pass",
    slug: "email_exam_reminder",
    category: "Exam Reminder",
    subject: "Mandatory Online CSR Exam Scheduled: {{exam_date}} at {{exam_time}}",
    content: `<p>Hello {{student_name}}, your online technical evaluation commences on {{exam_date}}.</p>`,
    variables: ["student_name", "exam_date", "exam_time", "hallticket_link"],
    version: 3,
  },
  {
    id: "tpl-em-03",
    type: "email",
    title: "Official Offer Letter Release",
    slug: "email_offer_letter",
    category: "Offer Letter",
    subject: "Offer of Employment — Global Quest Technologies CSR Drive",
    content: `<p>Dear {{student_name}}, we are delighted to offer you the position of {{role_title}}.</p>`,
    variables: ["student_name", "role_title", "ctc_amount", "joining_date"],
    version: 4,
  },
  {
    id: "tpl-wa-01",
    type: "whatsapp",
    title: "WhatsApp Exam Reminder with Quick Actions",
    slug: "wa_exam_reminder_v2",
    category: "Exam Reminder",
    content: `Hi {{student_name}}! 🚀 Your GQT CSR Exam starts tomorrow at {{exam_time}}. Ensure your webcam is working and click below to view your hall ticket.`,
    variables: ["student_name", "exam_time"],
    buttons: ["View Hall Ticket", "Support Helpline"],
    metaApprovalStatus: "Approved",
    version: 1,
  },
  {
    id: "tpl-wa-02",
    type: "whatsapp",
    title: "WhatsApp Offer Alert Notification",
    slug: "wa_offer_alert",
    category: "Offer Letter",
    content: `🎉 Congratulations {{student_name}}! You have been selected in the GQT CSR Campus Drive for {{college_name}}. Your Offer Letter is ready for digital acceptance.`,
    variables: ["student_name", "college_name"],
    buttons: ["Accept Offer", "Download PDF"],
    metaApprovalStatus: "Approved",
    version: 2,
  },
];

export default function AdminTemplateManagementPage() {
  const [templates, setTemplates] = useState<CommTemplate[]>(INITIAL_TEMPLATES);
  const [activeTab, setActiveTab] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<CommTemplate | null>(null);

  const tabs = [
    { id: "all", label: "All Templates" },
    { id: "email", label: "Email Templates (HTML)", icon: <Mail className="w-4 h-4 text-blue-500" /> },
    { id: "whatsapp", label: "WhatsApp Bot Templates (Meta Verified)", icon: <Smartphone className="w-4 h-4 text-emerald-500" /> },
  ];

  const filtered = templates.filter((t) => activeTab === "all" || t.type === activeTab);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Dynamic Content Registry
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Template Management & Messaging Bot
          </h1>
          <p className="text-sm text-muted-foreground">
            Author and inspect HTML email blueprints, manage WhatsApp Meta Cloud API template approvals, and configure dynamic variable tags.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <Card key={t.id} className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/40 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-primary">{t.slug}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    t.type === "email"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}
                >
                  {t.type === "email" ? "HTML Email" : "WhatsApp"}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2 line-clamp-1">
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">Category: <span className="font-semibold text-foreground">{t.category}</span></p>
                {t.subject && (
                  <p className="text-muted-foreground line-clamp-1">Subject: <span className="text-foreground">{t.subject}</span></p>
                )}
              </div>

              {/* Variables */}
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold mb-1">Dynamic Variables:</p>
                <div className="flex gap-1 flex-wrap">
                  {t.variables.map((v, i) => (
                    <span key={i} className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border">
                      {"{{" + v + "}}"}
                    </span>
                  ))}
                </div>
              </div>

              {/* WhatsApp Buttons */}
              {t.buttons && (
                <div>
                  <p className="text-[11px] text-muted-foreground font-semibold mb-1">Interactive CTA Buttons:</p>
                  <div className="flex gap-1">
                    {t.buttons.map((b, i) => (
                      <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-[11px] text-muted-foreground">Version v{t.version}</span>
                <Button size="sm" variant="ghost" onClick={() => setPreviewTemplate(t)} className="h-8 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Template Blueprint: ${previewTemplate.title}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            {previewTemplate.subject && (
              <div className="p-3 bg-muted/40 rounded-xl">
                <strong className="text-foreground">Email Subject: </strong>
                <span>{previewTemplate.subject}</span>
              </div>
            )}
            <div className="border border-border p-4 rounded-xl bg-card space-y-2">
              <p className="font-bold text-muted-foreground uppercase text-[10px]">Rendered Preview</p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
              />
            </div>
            {previewTemplate.buttons && (
              <div className="flex gap-2">
                {previewTemplate.buttons.map((b, i) => (
                  <Button key={i} size="sm" variant="outline" className="text-xs">
                    {b}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewTemplate(null)}>Close Preview</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
