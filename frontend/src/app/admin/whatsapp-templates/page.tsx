"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
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
  Smartphone,
  Code
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_WHATSAPP_TEMPLATES } from "@/lib/communication/communicationData";
import { WhatsAppTemplate } from "@/types";
import { toast } from "sonner";

export default function AdminWhatsAppTemplatesPage() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(INITIAL_WHATSAPP_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [previewVars, setPreviewVars] = useState(true);

  // Editor states
  const [editName, setEditName] = useState(selectedTemplate.name);
  const [editCategory, setEditCategory] = useState(selectedTemplate.category);
  const [editContent, setEditContent] = useState(selectedTemplate.content);

  const handleSelect = (tmpl: WhatsAppTemplate) => {
    setSelectedTemplate(tmpl);
    setEditName(tmpl.name);
    setEditCategory(tmpl.category);
    setEditContent(tmpl.content);
    setIsEditing(false);
  };

  const handleSave = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, name: editName, category: editCategory as any, content: editContent }
          : t
      )
    );
    setSelectedTemplate((prev) => ({
      ...prev,
      name: editName,
      category: editCategory as any,
      content: editContent,
    }));
    setIsEditing(false);
    toast.success("WhatsApp Business Template updated & synced with Meta API!");
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    setEditContent((prev) => `${prev} {{${placeholder}}}`);
    toast.info(`Inserted placeholder {{${placeholder}}}`);
  };

  const getRenderedContent = () => {
    if (!previewVars) return editContent;
    return editContent
      .replace(/{{student_name}}/g, "Aditya V. Kashyap")
      .replace(/{{college_name}}/g, "R.V. College of Engineering")
      .replace(/{{drive_name}}/g, "Karnataka State-wide CSR Drive 2026")
      .replace(/{{exam_date}}/g, "October 2, 2026")
      .replace(/{{exam_time}}/g, "10:00 AM IST")
      .replace(/{{interview_date}}/g, "October 5, 2026")
      .replace(/{{interview_time}}/g, "02:30 PM IST")
      .replace(/{{offer_number}}/g, "GQT/OFFER/2026/001")
      .replace(/{{contact_person}}/g, "Prof. Chandrasekhar")
      .replace(/{{student_count}}/g, "380");
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
            <Smartphone className="w-7 h-7 text-emerald-500" />
            WhatsApp Business Template Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Meta Cloud API verified interactive templates with dynamic variables and automated delivery webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const newT: WhatsAppTemplate = {
                id: `wa-tmpl-${Date.now()}`,
                name: `gqt_custom_notice_${Date.now()}`,
                category: "General Announcement" as any,
                content: "Hello {{student_name}}, this is an official update regarding {{drive_name}}.",
                placeholders: ["student_name", "drive_name"],
              };
              setTemplates((prev) => [newT, ...prev]);
              handleSelect(newT);
              setIsEditing(true);
              toast.success("New WhatsApp template draft initialized!");
            }}
            className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-4 h-4" />
            New Meta Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Approved Templates ({templates.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelect(tmpl)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTemplate.id === tmpl.id
                    ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground font-mono">{tmpl.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    APPROVED
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {tmpl.category}
                </p>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                  {tmpl.content}
                </p>
              </div>
            ))}
          </div>

          {/* Placeholders helper */}
          <Card className="p-4 space-y-3 bg-muted/20">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-500" />
              Meta Dynamic Variables
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "student_name",
                "college_name",
                "drive_name",
                "exam_date",
                "exam_time",
                "offer_number",
                "contact_person",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => handleInsertPlaceholder(p)}
                  className="px-2 py-1 rounded text-[10px] font-mono bg-background border border-border text-foreground hover:border-emerald-500 transition-colors"
                >
                  {`{{${p}}}`}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Editor & WhatsApp Phone Mockup (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground font-mono">{selectedTemplate.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Category: <span className="font-semibold text-foreground">{selectedTemplate.category}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewVars(!previewVars)}
                  className="text-xs"
                >
                  {previewVars ? "Raw Variables" : "Sample Data"}
                </Button>
                {isEditing ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Submit to Meta
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Template
                  </Button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Identifier Name (Snake_case)</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Message Body Text</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={6}
                    className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-6 flex justify-center">
                {/* WhatsApp Chat Preview Mockup */}
                <div className="w-full max-w-sm rounded-3xl border-2 border-slate-700 bg-slate-900 p-4 shadow-2xl text-slate-100">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      GQT
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Global Quest Technologies</p>
                      <p className="text-[10px] text-emerald-400">Official WhatsApp Business</p>
                    </div>
                  </div>

                  <div className="py-6 space-y-2">
                    <div className="bg-emerald-950/80 border border-emerald-800/60 rounded-2xl rounded-tl-xs p-3.5 text-xs text-white shadow-sm space-y-2">
                      <p className="leading-relaxed">{getRenderedContent()}</p>
                      <div className="text-right text-[10px] text-emerald-300 font-mono flex items-center justify-end gap-1">
                        <span>11:42 AM</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
