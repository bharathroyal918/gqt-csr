"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Plus,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Edit3,
  Copy,
  Trash2,
  Eye,
  History,
  Save,
  Send,
  Code
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_EMAIL_TEMPLATES } from "@/lib/communication/communicationData";
import { EmailTemplate } from "@/types";
import { toast } from "sonner";

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_EMAIL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(INITIAL_EMAIL_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState("admin@gqtindia.com");

  // Editor states
  const [editName, setEditName] = useState(selectedTemplate.name);
  const [editSubject, setEditSubject] = useState(selectedTemplate.subject);
  const [editCategory, setEditCategory] = useState(selectedTemplate.category);
  const [editHtml, setEditHtml] = useState(selectedTemplate.htmlContent);

  const handleSelect = (tmpl: EmailTemplate) => {
    setSelectedTemplate(tmpl);
    setEditName(tmpl.name);
    setEditSubject(tmpl.subject);
    setEditCategory(tmpl.category);
    setEditHtml(tmpl.htmlContent);
    setIsEditing(false);
  };

  const handleSave = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, name: editName, subject: editSubject, category: editCategory as any, htmlContent: editHtml }
          : t
      )
    );
    setSelectedTemplate((prev) => ({
      ...prev,
      name: editName,
      subject: editSubject,
      category: editCategory as any,
      htmlContent: editHtml,
    }));
    setIsEditing(false);
    toast.success("Corporate Email HTML Template saved successfully!");
  };

  const handleSendTestEmail = () => {
    toast.success(`Test email dispatched to ${testRecipient}!`, {
      description: "Rendered template delivered via SMTP engine.",
    });
    setTestEmailOpen(false);
  };

  const getRenderedHtml = () => {
    return editHtml
      .replace(/{{student_name}}/g, "Aditya V. Kashyap")
      .replace(/{{offer_number}}/g, "GQT/OFFER/2026/001")
      .replace(/{{course_name}}/g, "Java Full Stack + Agentic AI")
      .replace(/{{joining_date}}/g, "July 1, 2026")
      .replace(/{{center_location}}/g, "Whitefield Advanced Learning Center, Bengaluru")
      .replace(/{{drive_name}}/g, "Karnataka State-wide CSR Engineering Drive 2026")
      .replace(/{{exam_date}}/g, "October 2, 2026")
      .replace(/{{exam_time}}/g, "10:00 AM IST");
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
            <Mail className="w-7 h-7 text-[#005BBB]" />
            Corporate HTML Email Template Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Responsive cross-client email layouts with GQT sapphire branding, dynamic merge tags, and open telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTestEmailOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Send Test Email
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const newT: EmailTemplate = {
                id: `em-tmpl-${Date.now()}`,
                name: "Custom CSR Announcement Email",
                subject: "Important Announcement: GQT CSR Drive",
                category: "Announcement",
                htmlContent: "<div style='font-family: Arial; padding: 20px;'><h2>Hello {{student_name}}</h2><p>Official update regarding {{drive_name}}.</p></div>",
                placeholders: ["student_name", "drive_name"],
                lastModifiedBy: "Admin",
                updatedAt: new Date().toISOString(),
              };
              setTemplates((prev) => [newT, ...prev]);
              handleSelect(newT);
              setIsEditing(true);
              toast.success("New email template draft created!");
            }}
            className="text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Email Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email Templates ({templates.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelect(tmpl)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTemplate.id === tmpl.id
                    ? "border-[#005BBB] bg-[#005BBB]/5 ring-1 ring-[#005BBB]"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{tmpl.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#005BBB] font-medium line-clamp-1">{tmpl.subject}</p>
                <p className="text-[10px] text-muted-foreground pt-2 mt-2 border-t border-border/50">
                  Last updated by {tmpl.lastModifiedBy}
                </p>
              </div>
            ))}
          </div>

          {/* Merge Tags Reference */}
          <Card className="p-4 space-y-3 bg-muted/20">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#005BBB]" />
              Merge Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "student_name",
                "offer_number",
                "course_name",
                "joining_date",
                "center_location",
                "drive_name",
                "exam_date",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setEditHtml((prev) => `${prev} {{${p}}}`);
                    toast.info(`Appended {{${p}}}`);
                  }}
                  className="px-2 py-1 rounded text-[10px] font-mono bg-background border border-border text-foreground hover:border-[#005BBB] transition-colors"
                >
                  {`{{${p}}}`}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Editor & HTML Preview (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedTemplate.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedTemplate.subject}</p>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Template
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit HTML Code
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Template Name</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Subject Line</label>
                    <Input
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">HTML Code</label>
                  <textarea
                    value={editHtml}
                    onChange={(e) => setEditHtml(e.target.value)}
                    rows={14}
                    className="w-full font-mono text-xs rounded-xl border border-border bg-background p-4 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-4 space-y-4">
                <div className="border border-border rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-muted/50 p-2.5 border-b border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Rendered Client Preview</span>
                    <span className="font-mono">From: offers@gqtindia.com</span>
                  </div>
                  <div
                    className="p-4 bg-slate-50 dark:bg-slate-900 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: getRenderedHtml() }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Test Email Modal */}
      {testEmailOpen && (
        <Modal
          isOpen={testEmailOpen}
          onClose={() => setTestEmailOpen(false)}
          title="Send Sample Test Email"
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Send a test rendering of <span className="font-bold text-foreground">{selectedTemplate.name}</span> with sample candidate data.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Recipient Email Address</label>
              <Input
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="you@domain.com"
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setTestEmailOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSendTestEmail}>
                Dispatch Test Email
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
