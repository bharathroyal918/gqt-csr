"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Plus,
  ArrowLeft,
  Users,
  Search,
  Filter,
  Eye,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_EMAIL_MESSAGES, INITIAL_EMAIL_TEMPLATES } from "@/lib/communication/communicationData";
import { EmailMessageRecord } from "@/types";
import { toast } from "sonner";

export default function HREmailCampaignsPage() {
  const [emails, setEmails] = useState<EmailMessageRecord[]>(INITIAL_EMAIL_MESSAGES);
  const [search, setSearch] = useState("");
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [previewEmail, setPreviewEmail] = useState<EmailMessageRecord | null>(null);

  // Campaign Form
  const [campaignSubject, setCampaignSubject] = useState("Important Announcement — GQT CSR Drive Milestones");
  const [campaignAudience, setCampaignAudience] = useState("All Registered Students");
  const [selectedTemplate, setSelectedTemplate] = useState(INITIAL_EMAIL_TEMPLATES[0].id);

  // Delivery Analytics Counters
  const totalSent = emails.length;
  const opened = emails.filter((e) => e.status === "Opened" || e.status === "Clicked").length;
  const clicked = emails.filter((e) => e.status === "Clicked").length;
  const failed = emails.filter((e) => e.status === "Failed" || e.status === "Bounced").length;
  const openRate = totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0;
  const clickRate = totalSent > 0 ? Math.round((clicked / totalSent) * 100) : 0;

  const handleLaunchCampaign = () => {
    toast.success("Bulk Email Campaign Dispatched!", {
      description: `Dispatched to 284 ${campaignAudience} via GQT SMTP Cluster.`,
    });
    setIsCampaignOpen(false);
  };

  const handleRetry = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Delivered", retryCount: e.retryCount + 1, errorLog: undefined } : e))
    );
    toast.success("Email redelivered successfully!");
  };

  const filtered = emails.filter(
    (e) =>
      e.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      e.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
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
            <Mail className="w-7 h-7 text-[#005BBB]" />
            Enterprise Email Campaigns & Open Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Bulk institutional dispatches, automated offer delivery, engagement tracking, and bounce rate resolution.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCampaignOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          New Email Campaign
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
        <Link href="/hr/crm/email" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
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

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Total Dispatched</span>
          <p className="text-2xl font-black text-foreground">{totalSent}</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Delivered</span>
          <p className="text-2xl font-black text-blue-500">{totalSent - failed}</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Opened</span>
          <p className="text-2xl font-black text-emerald-500">{opened}</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Clicked Links</span>
          <p className="text-2xl font-black text-cyan-500">{clicked}</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Open Rate</span>
          <p className="text-2xl font-black text-indigo-500">{openRate}%</p>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Bounced / Failed</span>
          <p className="text-2xl font-black text-red-500">{failed}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by recipient email, candidate, or subject..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="text-xs font-semibold text-muted-foreground">
            Messages Tracked: <span className="font-bold text-foreground">{filtered.length}</span>
          </div>
        </div>
      </Card>

      {/* Email Dispatches Table */}
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5 font-bold">Recipient & Email</th>
                <th className="p-3.5 font-bold">Template & Subject</th>
                <th className="p-3.5 font-bold">Drive / College</th>
                <th className="p-3.5 font-bold">Dispatched Time</th>
                <th className="p-3.5 font-bold">Delivery Status</th>
                <th className="p-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{item.recipientName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{item.recipientEmail}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-foreground line-clamp-1">{item.subject}</p>
                    <span className="text-[10px] text-[#005BBB] font-medium">{item.templateName}</span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    <p className="line-clamp-1">{item.collegeName || "State-wide Drive"}</p>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "Clicked"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : item.status === "Opened"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : item.status === "Delivered"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : item.status === "Sent"
                          ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.errorLog && (
                      <p className="text-[10px] text-red-500 mt-1 line-clamp-1">{item.errorLog}</p>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        title="Preview Email"
                        onClick={() => setPreviewEmail(item)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {(item.status === "Failed" || item.status === "Bounced") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 text-red-600"
                          onClick={() => handleRetry(item.id)}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Campaign Modal */}
      {isCampaignOpen && (
        <Modal
          isOpen={isCampaignOpen}
          onClose={() => setIsCampaignOpen(false)}
          title="Dispatch Bulk Corporate Email Campaign"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Campaign Subject Line</label>
              <Input
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Recipient Audience</label>
              <select
                value={campaignAudience}
                onChange={(e) => setCampaignAudience(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="All Registered Students">All Registered Students (284 Candidates)</option>
                <option value="Selected Students">Selected Offer Letter Recipients</option>
                <option value="Placement Officers">Institutional Placement Officers</option>
                <option value="Principals">College Principals & Deans</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              >
                {INITIAL_EMAIL_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name} ({tmpl.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsCampaignOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleLaunchCampaign}>
                Launch Campaign Dispatches
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Preview Email Modal */}
      {previewEmail && (
        <Modal
          isOpen={!!previewEmail}
          onClose={() => setPreviewEmail(null)}
          title={`Email Preview — ${previewEmail.subject}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 space-y-1">
              <p><strong>To:</strong> {previewEmail.recipientName} ({previewEmail.recipientEmail})</p>
              <p><strong>Subject:</strong> {previewEmail.subject}</p>
              <p><strong>Status:</strong> {previewEmail.status}</p>
            </div>
            <div
              className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900"
              dangerouslySetInnerHTML={{ __html: previewEmail.contentHtml }}
            />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setPreviewEmail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
