"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Edit3,
  Copy,
  Trash2,
  Eye,
  History,
  Layers,
  Save,
  Check,
  Code
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_OFFER_TEMPLATES } from "@/lib/offer/offerData";
import { OfferTemplate } from "@/types";
import { toast } from "sonner";

export default function AdminOfferTemplatesPage() {
  const [templates, setTemplates] = useState<OfferTemplate[]>(INITIAL_OFFER_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<OfferTemplate>(INITIAL_OFFER_TEMPLATES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [previewPlaceholderData, setPreviewPlaceholderData] = useState(true);

  // Template editor form states
  const [editTitle, setEditTitle] = useState(selectedTemplate.title);
  const [editCourse, setEditCourse] = useState(selectedTemplate.courseTrack);
  const [editContent, setEditContent] = useState(selectedTemplate.content);

  const handleSelectTemplate = (t: OfferTemplate) => {
    setSelectedTemplate(t);
    setEditTitle(t.title);
    setEditCourse(t.courseTrack);
    setEditContent(t.content);
    setIsEditing(false);
  };

  const handleSaveTemplate = () => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              title: editTitle,
              courseTrack: editCourse,
              content: editContent,
              version: t.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setSelectedTemplate((prev) => ({
      ...prev,
      title: editTitle,
      courseTrack: editCourse,
      content: editContent,
      version: prev.version + 1,
      updatedAt: new Date().toISOString(),
    }));
    setIsEditing(false);
    toast.success("Offer Template saved & version bumped!", {
      description: `Updated to version ${selectedTemplate.version + 1}`,
    });
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    setEditContent((prev) => `${prev} {{${placeholder}}}`);
    toast.info(`Inserted placeholder {{${placeholder}}}`);
  };

  // Replace placeholders for preview
  const getRenderedPreview = () => {
    let text = editContent;
    if (previewPlaceholderData) {
      text = text
        .replace(/{{student_name}}/g, "Aditya V. Kashyap")
        .replace(/{{college}}/g, "R.V. College of Engineering (RVCE)")
        .replace(/{{course}}/g, selectedTemplate.courseTrack)
        .replace(/{{joining_date}}/g, "July 1, 2026")
        .replace(/{{batch}}/g, "2026 Batch Alpha")
        .replace(/{{offer_number}}/g, "GQT/OFFER/2026/001")
        .replace(/{{location}}/g, "Bengaluru, Karnataka")
        .replace(/{{academic_year}}/g, "2025-2026");
    }
    return text;
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/offers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offer Master
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#005BBB]" />
            Offer Letter Template Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure enterprise markdown/HTML templates with variable interpolation and legal stipulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/offer-settings">
            <Button variant="outline" size="sm" className="text-xs">
              Offer Policy Settings
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const newTmpl: OfferTemplate = {
                id: `tmpl-${Date.now()}`,
                title: "Custom Track LOI Template",
                courseTrack: "Data Analytics & BI",
                description: "New enterprise track template",
                version: 1,
                isActive: true,
                content: "# LETTER OF INTENT\n\nDear {{student_name}},\n\nWelcome to {{course}} batch {{batch}}.",
                placeholders: ["student_name", "college", "course", "joining_date", "batch", "offer_number"],
                lastModifiedBy: "Super Admin",
                updatedAt: new Date().toISOString(),
              };
              setTemplates((prev) => [...prev, newTmpl]);
              handleSelectTemplate(newTmpl);
              setIsEditing(true);
              toast.success("New Template Draft initialized!");
            }}
            className="flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Available Templates ({templates.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTemplate.id === tmpl.id
                    ? "border-[#005BBB] bg-[#005BBB]/5 ring-1 ring-[#005BBB]"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{tmpl.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground">
                    v{tmpl.version}.0
                  </span>
                </div>
                <p className="text-[11px] text-[#005BBB] font-medium">{tmpl.courseTrack}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                  {tmpl.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 mt-2 border-t border-border/50">
                  <span>Modified by {tmpl.lastModifiedBy}</span>
                  <span>{new Date(tmpl.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholders Reference */}
          <Card className="p-4 space-y-3 bg-muted/20">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#005BBB]" />
              Interpolation Placeholders
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                "student_name",
                "college",
                "course",
                "joining_date",
                "batch",
                "offer_number",
                "location",
                "academic_year",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => handleInsertPlaceholder(p)}
                  className="px-2 py-1 rounded-md text-[10px] font-mono bg-background border border-border text-foreground hover:border-[#005BBB] hover:text-[#005BBB] transition-colors"
                  title="Click to insert"
                >
                  {`{{${p}}}`}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Placeholders are dynamically replaced upon offer generation.
            </p>
          </Card>
        </div>

        {/* Editor & Preview Area (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedTemplate.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Track: <span className="font-semibold text-foreground">{selectedTemplate.courseTrack}</span> •
                  Version: <span className="font-mono text-foreground font-bold">v{selectedTemplate.version}.0</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewPlaceholderData(!previewPlaceholderData)}
                  className="text-xs"
                >
                  {previewPlaceholderData ? "Show Raw Placeholders" : "Sample Data Preview"}
                </Button>
                {isEditing ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveTemplate}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save & Publish
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

            {/* Template Body */}
            {isEditing ? (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Template Title</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Course Track</label>
                    <Input
                      value={editCourse}
                      onChange={(e) => setEditCourse(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Template Content (Markdown / Text)</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={16}
                    className="w-full font-mono text-xs rounded-xl border border-border bg-background p-4 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-4 space-y-4">
                <div className="p-6 rounded-2xl bg-muted/20 border border-border/70 font-sans text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {getRenderedPreview()}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
