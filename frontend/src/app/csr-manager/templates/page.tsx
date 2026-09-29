"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Copy,
  History,
  CheckCircle2,
  AlertCircle,
  Code,
  Smartphone,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Bot
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";

interface CommunicationTemplate {
  id: string;
  code: string;
  name: string;
  category: "Registration" | "Exam" | "Interview" | "Offer" | "Reminder" | "WhatsApp";
  channel: "WhatsApp" | "Email" | "SMS" | "Multi-Channel";
  subject?: string;
  body: string;
  version: string;
  lastUpdated: string;
  status: "Active" | "Draft" | "Archived";
  variables: string[];
  history: {
    version: string;
    updatedBy: string;
    timestamp: string;
    note: string;
  }[];
}

const INITIAL_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "TMP-001",
    code: "REG_SUCCESS_WA",
    name: "Student Registration Confirmation (WhatsApp)",
    category: "Registration",
    channel: "WhatsApp",
    body: "Hi {{student_name}}, your registration for {{drive_name}} through {{college_name}} has been successfully confirmed! 🎉\n\nYour Student ID is *{{student_id}}*.\nPlease keep your Hall Ticket safe: {{hallticket_link}}\n\nGood luck,\nGlobal Quest Technologies CSR Operations Team.",
    version: "v2.1",
    lastUpdated: "2026-09-22",
    status: "Active",
    variables: ["student_name", "drive_name", "college_name", "student_id", "hallticket_link"],
    history: [
      { version: "v2.1", updatedBy: "Rajesh Kumar", timestamp: "2026-09-22 14:15", note: "Added direct Hall Ticket dynamic URL" },
      { version: "v2.0", updatedBy: "Priya Nair", timestamp: "2026-09-10 11:20", note: "Updated formatting for Meta WhatsApp Business API" },
      { version: "v1.0", updatedBy: "Admin", timestamp: "2026-08-15 09:30", note: "Initial draft release" },
    ],
  },
  {
    id: "TMP-002",
    code: "EXAM_LOGIN_EMAIL",
    name: "Proctored Exam Login & Anti-Cheating Guidelines",
    category: "Exam",
    channel: "Email",
    subject: "GQT CSR Assessment: Hall Ticket & Proctoring Access for {{student_name}}",
    body: "<p>Dear <strong>{{student_name}}</strong>,</p><p>You are scheduled to take the <strong>{{course_name}}</strong> online assessment for <em>{{drive_name}}</em>.</p><ul><li><strong>Exam Date:</strong> {{exam_date}}</li><li><strong>Exam Time:</strong> {{exam_time}}</li><li><strong>Secure Exam Portal:</strong> <a href='{{exam_link}}'>{{exam_link}}</a></li><li><strong>Passcode:</strong> {{exam_passcode}}</li></ul><p>Please ensure you are in a quiet room with an active webcam enabled. Full screen anti-cheating mode is strictly monitored.</p><p>Best regards,<br/>GQT Assessment Board</p>",
    version: "v3.0",
    lastUpdated: "2026-09-20",
    status: "Active",
    variables: ["student_name", "course_name", "drive_name", "exam_date", "exam_time", "exam_link", "exam_passcode"],
    history: [
      { version: "v3.0", updatedBy: "Rajesh Kumar", timestamp: "2026-09-20 18:00", note: "Enhanced anti-cheating instructions and passcode tags" },
      { version: "v2.0", updatedBy: "Admin", timestamp: "2026-08-28 10:00", note: "Standard email HTML layout update" },
    ],
  },
  {
    id: "TMP-003",
    code: "INTV_SLOT_WA",
    name: "Technical Interview Slot Notification",
    category: "Interview",
    channel: "WhatsApp",
    body: "Congratulations {{student_name}}! 🚀 You have cleared the GQT Online Exam for {{drive_name}} with a top score of *{{exam_score}}%*.\n\nYour 1-on-1 Technical Interview has been scheduled:\n🗓️ *Date:* {{interview_date}}\n⏰ *Time:* {{interview_time}}\n🔗 *Google Meet Panel:* {{interview_link}}\n\nPlease be ready with your project source code and portfolio. Reply 'CONFIRM' to lock your slot.",
    version: "v1.4",
    lastUpdated: "2026-09-18",
    status: "Active",
    variables: ["student_name", "drive_name", "exam_score", "interview_date", "interview_time", "interview_link"],
    history: [
      { version: "v1.4", updatedBy: "Arun Menon", timestamp: "2026-09-18 16:40", note: "Added 'CONFIRM' chatbot interactive hook" },
      { version: "v1.0", updatedBy: "Rajesh Kumar", timestamp: "2026-09-02 12:00", note: "Initial draft release" },
    ],
  },
  {
    id: "TMP-004",
    code: "OFFER_LETTER_EMAIL",
    name: "Official CSR Offer Letter & LOI Release",
    category: "Offer",
    channel: "Email",
    subject: "Congratulations! Global Quest Technologies Offer of Training & Placement — {{student_name}}",
    body: "<p>Dear <strong>{{student_name}}</strong>,</p><p>We are delighted to extend this <strong>Letter of Intent (LOI)</strong> for the <strong>{{course_name}}</strong> sponsored through the <em>Global Quest CSR Initiative</em> at {{college_name}}.</p><p>Upon successful completion of the bootcamp modules, you will be onboarded as a Junior Software Engineer with an annual CTC of <strong>{{ctc_package}}</strong>.</p><p>Please view and digitally sign your official offer letter before <strong>{{offer_deadline}}</strong>: <a href='{{offer_link}}'>Sign Offer Letter</a>.</p><p>Warm congratulations,<br/>Global Quest Technologies CSR Operations</p>",
    version: "v2.0",
    lastUpdated: "2026-09-15",
    status: "Active",
    variables: ["student_name", "course_name", "college_name", "ctc_package", "offer_deadline", "offer_link"],
    history: [
      { version: "v2.0", updatedBy: "Rajesh Kumar", timestamp: "2026-09-15 15:30", note: "Integrated digital e-signature link" },
      { version: "v1.0", updatedBy: "Admin", timestamp: "2026-08-10 11:00", note: "Initial legal template release" },
    ],
  },
  {
    id: "TMP-005",
    code: "REMINDER_24HR_WA",
    name: "24-Hour Registration Closing Alert",
    category: "Reminder",
    channel: "WhatsApp",
    body: "⏰ URGENT REMINDER for students of {{college_name}}: Registration for the *{{drive_name}}* closes in *24 hours*!\n\nDo not miss your opportunity for 100% free industry training in Agentic AI & guaranteed placement drives.\n\n👉 Complete registration now: {{registration_link}}",
    version: "v1.2",
    lastUpdated: "2026-09-23",
    status: "Active",
    variables: ["college_name", "drive_name", "registration_link"],
    history: [
      { version: "v1.2", updatedBy: "Priya Nair", timestamp: "2026-09-23 09:10", note: "Refined urgency copywriting" },
    ],
  },
  {
    id: "TMP-006",
    code: "BOT_WELCOME_WA",
    name: "Interactive WhatsApp Bot Welcome Menu",
    category: "WhatsApp",
    channel: "WhatsApp",
    body: "Welcome to Global Quest Technologies CSR Helpline! 🤖\n\nPlease select an option by typing the number:\n1️⃣ Check Registration Status\n2️⃣ Download Hall Ticket\n3️⃣ Exam Day Guidelines\n4️⃣ Interview Schedule\n5️⃣ Speak to Assigned HR",
    version: "v2.0",
    lastUpdated: "2026-09-21",
    status: "Active",
    variables: [],
    history: [
      { version: "v2.0", updatedBy: "Rajesh Kumar", timestamp: "2026-09-21 17:00", note: "Automated menu logic connected to Twilio webhook" },
    ],
  },
];

const SAMPLE_VARS: Record<string, string> = {
  student_name: "Rahul Verma",
  student_id: "GQT-2026-STU-8821",
  drive_name: "CSR Flagship Campus Drive 2026",
  college_name: "RV College of Engineering",
  course_name: "Agentic AI Java Full Stack",
  exam_date: "Sept 26, 2026",
  exam_time: "10:00 AM - 12:00 PM IST",
  exam_score: "94",
  exam_link: "https://csr.globalquest.in/student/exam/login",
  exam_passcode: "GQT-EXAM-9921",
  hallticket_link: "https://csr.globalquest.in/student/hallticket/GQT-8821",
  interview_date: "Sept 28, 2026",
  interview_time: "02:30 PM IST",
  interview_link: "https://meet.google.com/xyz-qwer-abc",
  ctc_package: "INR 6.50 LPA",
  offer_deadline: "Oct 05, 2026",
  offer_link: "https://csr.globalquest.in/student/offer-letter/sign",
  registration_link: "https://csr.globalquest.in/register/DRV-2026-001",
};

export default function CSRTemplatesPage() {
  const [templates, setTemplates] = useState<CommunicationTemplate[]>(INITIAL_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  // Preview & Test state
  const [previewTemplate, setPreviewTemplate] = useState<CommunicationTemplate | null>(null);
  const [testRecipient, setTestRecipient] = useState("+91 98450 12891");
  const [isTestSending, setIsTestSending] = useState(false);

  // Version History Modal
  const [historyTemplate, setHistoryTemplate] = useState<CommunicationTemplate | null>(null);

  // Create / Edit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);

  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formCategory, setFormCategory] = useState<CommunicationTemplate["category"]>("Registration");
  const [formChannel, setFormChannel] = useState<CommunicationTemplate["channel"]>("WhatsApp");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormName("");
    setFormCode("");
    setFormCategory("Registration");
    setFormChannel("WhatsApp");
    setFormSubject("");
    setFormBody("");
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (t: CommunicationTemplate) => {
    setEditingTemplate(t);
    setFormName(t.name);
    setFormCode(t.code);
    setFormCategory(t.category);
    setFormChannel(t.channel);
    setFormSubject(t.subject || "");
    setFormBody(t.body);
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBody) {
      toast.error("Please fill in template name and message body.");
      return;
    }

    // Extract variables between {{ }}
    const matched = formBody.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
    const extractedVars = Array.from(new Set(matched.map((v) => v.replace(/[{}]/g, ""))));

    if (editingTemplate) {
      const updatedList = templates.map((t) => {
        if (t.id === editingTemplate.id) {
          const nextVersion = `v${(parseFloat(t.version.replace("v", "")) + 0.1).toFixed(1)}`;
          return {
            ...t,
            name: formName,
            category: formCategory,
            channel: formChannel,
            subject: formSubject,
            body: formBody,
            version: nextVersion,
            lastUpdated: new Date().toISOString().split("T")[0],
            variables: extractedVars,
            history: [
              {
                version: nextVersion,
                updatedBy: "CSR Manager",
                timestamp: new Date().toLocaleString(),
                note: "Template content revised",
              },
              ...t.history,
            ],
          };
        }
        return t;
      });
      setTemplates(updatedList);
      toast.success(`Template '${formName}' updated to next version!`);
    } else {
      const newTemplate: CommunicationTemplate = {
        id: `TMP-${Date.now().toString().slice(-4)}`,
        code: formCode || `TMP_${formCategory.toUpperCase()}_${Date.now().toString().slice(-3)}`,
        name: formName,
        category: formCategory,
        channel: formChannel,
        subject: formSubject,
        body: formBody,
        version: "v1.0",
        lastUpdated: new Date().toISOString().split("T")[0],
        status: "Active",
        variables: extractedVars,
        history: [
          {
            version: "v1.0",
            updatedBy: "CSR Manager",
            timestamp: new Date().toLocaleString(),
            note: "Initial version created",
          },
        ],
      };
      setTemplates([newTemplate, ...templates]);
      toast.success(`New template '${formName}' deployed successfully!`);
    }

    setIsCreateModalOpen(false);
  };

  const renderSimulatedPreview = (text: string) => {
    let result = text;
    Object.keys(SAMPLE_VARS).forEach((k) => {
      const regex = new RegExp(`\\{\\{${k}\\}\\}`, "g");
      result = result.replace(regex, SAMPLE_VARS[k]);
    });
    return result;
  };

  const handleSimulateDispatch = () => {
    setIsTestSending(true);
    setTimeout(() => {
      setIsTestSending(false);
      toast.success(`Test broadcast dispatched via ${previewTemplate?.channel} to ${testRecipient}!`);
    }, 900);
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || t.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesChannel = channelFilter === "all" || t.channel.toLowerCase() === channelFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesChannel;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Omnichannel Dispatch Hub
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">CSR Communication & Template Engine</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Configure dynamic Meta-approved WhatsApp bots, email HTML templates, and reminder blasts with real-time variable injection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={handleOpenCreate}
          >
            <Plus className="w-4 h-4" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Template Name, Code, or Content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="registration">Registration</option>
              <option value="exam">Online Exam</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer Letter</option>
              <option value="reminder">Reminder Alerts</option>
              <option value="whatsapp">WhatsApp Bot</option>
            </select>

            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="multi-channel">Multi-Channel</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-2 rounded-lg ${
                      template.channel === "WhatsApp"
                        ? "bg-emerald-50 text-emerald-600"
                        : template.channel === "Email"
                        ? "bg-blue-50 text-[#005BBB]"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {template.channel === "WhatsApp" ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{template.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{template.name}</h3>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {template.version}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                  {template.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-[11px]">Updated {template.lastUpdated}</span>
              </div>

              {/* Snippet preview */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 font-mono line-clamp-3 leading-relaxed">
                {template.body.replace(/<[^>]+>/g, " ")}
              </div>

              {/* Injected Variables badges */}
              <div className="mt-3 flex flex-wrap gap-1">
                {template.variables.slice(0, 4).map((v, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
                {template.variables.length > 4 && (
                  <span className="text-[10px] text-slate-400">+{template.variables.length - 4} more</span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="p-1.5 text-slate-500 hover:text-[#005BBB] hover:bg-slate-100 rounded-md transition-colors"
                  title="Simulate Preview & Test"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(template)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Edit Template"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setHistoryTemplate(template)}
                  className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Version History"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="cyan"
                size="sm"
                className="text-xs h-7 px-2.5"
                onClick={() => setPreviewTemplate(template)}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Test Dispatch
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Live Preview & Test Dispatch Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Simulate Dispatch — ${previewTemplate.name}`}
          subtitle={`Channel: ${previewTemplate.channel} • Version: ${previewTemplate.version}`}
          size="lg"
        >
          <div className="space-y-4 text-slate-800">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-sans shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Rendering (Variables Injected)</span>
                </div>
                <span className="font-mono">{previewTemplate.channel} Client Mockup</span>
              </div>

              {previewTemplate.subject && (
                <div className="mb-2 text-xs">
                  <span className="text-slate-400 font-semibold">Subject: </span>
                  <span className="text-amber-300 font-medium">
                    {renderSimulatedPreview(previewTemplate.subject)}
                  </span>
                </div>
              )}

              <div
                className="text-sm whitespace-pre-line leading-relaxed text-slate-200"
                dangerouslySetInnerHTML={{
                  __html: renderSimulatedPreview(previewTemplate.body),
                }}
              />
            </div>

            {/* Test recipient form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Send Sandbox Dispatch Test
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="Enter test phone or email..."
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                />
                <Button
                  variant="cyan"
                  onClick={handleSimulateDispatch}
                  disabled={isTestSending}
                  className="shrink-0"
                >
                  {isTestSending ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Send className="w-4 h-4 mr-1" />
                  )}
                  {isTestSending ? "Transmitting..." : "Send Test"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Version History Modal */}
      {historyTemplate && (
        <Modal
          isOpen={!!historyTemplate}
          onClose={() => setHistoryTemplate(null)}
          title={`Version Audit Log — ${historyTemplate.name}`}
          subtitle={`Template Code: ${historyTemplate.code}`}
          size="md"
        >
          <div className="space-y-3">
            {historyTemplate.history.map((h, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#005BBB]">{h.version}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">By {h.updatedBy}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{h.note}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{h.timestamp}</span>
              </div>
            ))}

            <div className="flex justify-end pt-3">
              <Button variant="outline" onClick={() => setHistoryTemplate(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingTemplate ? "Edit Template Blueprint" : "Create New Communication Template"}
        subtitle="Define dynamic placeholders like {{student_name}} or {{exam_date}} for automatic live substitution."
        size="lg"
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Template Name *</label>
              <input
                type="text"
                placeholder="e.g. Exam Hall Ticket Alert"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unique Template Code</label>
              <input
                type="text"
                placeholder="e.g. EXAM_TICKET_WA"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="Registration">Registration</option>
                <option value="Exam">Online Exam</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer Letter</option>
                <option value="Reminder">Reminder Alerts</option>
                <option value="WhatsApp">WhatsApp Bot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Channel</label>
              <select
                value={formChannel}
                onChange={(e) => setFormChannel(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="WhatsApp">WhatsApp Bot</option>
                <option value="Email">Email (HTML)</option>
                <option value="SMS">SMS Gateway</option>
                <option value="Multi-Channel">Multi-Channel Blast</option>
              </select>
            </div>
          </div>

          {formChannel === "Email" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Subject Line</label>
              <input
                type="text"
                placeholder="e.g. Important Update Regarding {{drive_name}}"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Message Body *</label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">Insert tag: </span>
                {["{{student_name}}", "{{drive_name}}", "{{exam_date}}"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormBody((prev) => prev + " " + t)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1 rounded border border-slate-200"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={6}
              placeholder="Type message with {{variable_name}} tokens..."
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              {editingTemplate ? "Save Version Update" : "Publish Template"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
