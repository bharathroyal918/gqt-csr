"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Plus,
  ArrowLeft,
  Users,
  Search,
  Filter,
  Copy,
  Share2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Send,
  Building2,
  Check,
  AlertTriangle,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import {
  INITIAL_WHATSAPP_GROUPS,
  INITIAL_WHATSAPP_MESSAGES,
  INITIAL_WHATSAPP_TEMPLATES
} from "@/lib/communication/communicationData";
import { WhatsAppGroupRecord, WhatsAppMessageRecord } from "@/types";
import { toast } from "sonner";

export default function HRWhatsAppPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "messages" | "campaign">("groups");
  const [groups, setGroups] = useState<WhatsAppGroupRecord[]>(INITIAL_WHATSAPP_GROUPS);
  const [messages, setMessages] = useState<WhatsAppMessageRecord[]>(INITIAL_WHATSAPP_MESSAGES);
  const [search, setSearch] = useState("");

  // Campaign Form States
  const [campaignAudience, setCampaignAudience] = useState("Selected Students");
  const [campaignTemplate, setCampaignTemplate] = useState(INITIAL_WHATSAPP_TEMPLATES[0].name);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // New Group Form States
  const [newCollegeName, setNewCollegeName] = useState("National Institute of Engineering (NIE)");
  const [newAcademicYear, setNewAcademicYear] = useState("2026-27");
  const [newPtoName, setNewPtoName] = useState("Dr. Rohini Nagapadma");

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedGroupName = `${newCollegeName} + GQT + ${newAcademicYear}`;
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();

    const created: WhatsAppGroupRecord = {
      id: `wag-${Date.now()}`,
      groupName: formattedGroupName,
      groupId: `12036302489110${Math.floor(1000 + Math.random() * 9000)}@g.us`,
      inviteLink: `https://chat.whatsapp.com/GQT-${hash}-CSR`,
      createdDate: new Date().toISOString().split("T")[0],
      driveId: "drv-001",
      driveName: "Karnataka State-wide CSR Engineering Drive 2026",
      collegeId: `col-${Date.now()}`,
      collegeName: newCollegeName,
      hrId: "usr-hr-01",
      hrName: "Priya Nair",
      ptoId: "usr-pto-04",
      ptoName: newPtoName,
      facultyNames: ["Prof. Srinivas (CSE)"],
      status: "Active",
      membersCount: 4,
    };

    setGroups((prev) => [created, ...prev]);
    toast.success("Official WhatsApp Drive Group Created!", {
      description: `Initialized ${formattedGroupName} with invite link.`,
    });
    setIsCreateGroupModalOpen(false);
  };

  const handleSendCampaign = () => {
    toast.success("Bulk WhatsApp Campaign Dispatched!", {
      description: `Sent to 142 ${campaignAudience} via Meta Cloud API.`,
    });
    setIsCampaignModalOpen(false);
  };

  const handleRetry = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, status: "Delivered", retryCount: m.retryCount + 1, errorLog: undefined } : m
      )
    );
    toast.success("WhatsApp message resent and delivered successfully!");
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("WhatsApp Group Invite Link copied to clipboard!");
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
            <Smartphone className="w-7 h-7 text-emerald-500" />
            WhatsApp Business & Group Automation Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Official GQT institutional group creator, bulk candidate notifications, and real-time delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCampaignModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-emerald-500" />
            Bulk Campaign
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Create Drive Group
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
        <Link href="/hr/crm/whatsapp" className="px-3.5 py-2 font-bold text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/10 rounded-t-lg">
          WhatsApp Business
        </Link>
        <Link href="/hr/crm/email" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
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

      {/* View Switcher */}
      <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border w-max">
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "groups" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          Automated Groups ({groups.length})
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "messages" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
          }`}
        >
          Message Delivery Queue ({messages.length})
        </button>
      </div>

      {activeTab === "groups" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((grp) => (
            <Card key={grp.id} className="p-6 space-y-4 hover:border-emerald-500 transition-all">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      Confirmed Group
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{grp.groupName}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground">
                  {grp.membersCount} Members
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">College:</span>
                  <span className="font-semibold text-foreground text-right">{grp.collegeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HR Coordinator:</span>
                  <span className="font-medium text-foreground">{grp.hrName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placement Officer:</span>
                  <span className="font-medium text-foreground">{grp.ptoName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Faculty Panel:</span>
                  <span className="font-medium text-foreground text-right">{grp.facultyNames.join(", ")}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[140px]">
                  {grp.inviteLink}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={() => handleCopyLink(grp.inviteLink)}
                    title="Copy Link"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 text-emerald-600"
                    onClick={() => window.open(grp.inviteLink, "_blank")}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3.5 font-bold">Recipient & Role</th>
                  <th className="p-3.5 font-bold">Template Used</th>
                  <th className="p-3.5 font-bold">Message Content</th>
                  <th className="p-3.5 font-bold">Timestamp</th>
                  <th className="p-3.5 font-bold">Delivery Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-foreground">{item.recipientName}</p>
                      <p className="text-[11px] font-mono text-muted-foreground">{item.recipientPhone}</p>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {item.templateName}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground">{item.content}</p>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "Read"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : item.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
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
                      {item.status === "Failed" && (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Drive WhatsApp Group Modal */}
      {isCreateGroupModalOpen && (
        <Modal
          isOpen={isCreateGroupModalOpen}
          onClose={() => setIsCreateGroupModalOpen(false)}
          title="Create Institutional WhatsApp Drive Group"
        >
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Follows mandatory GQT naming format: <strong className="text-foreground">College Name + GQT + Academic Year</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">College Name</label>
              <Input
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Academic Year</label>
              <Input
                value={newAcademicYear}
                onChange={(e) => setNewAcademicYear(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Placement Officer Contact</label>
              <Input
                value={newPtoName}
                onChange={(e) => setNewPtoName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="p-3 rounded-xl bg-muted/30 text-xs">
              Preview Group Name: <span className="font-bold text-emerald-600">{newCollegeName} + GQT + {newAcademicYear}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Initialize WhatsApp Group
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Campaign Modal */}
      {isCampaignModalOpen && (
        <Modal
          isOpen={isCampaignModalOpen}
          onClose={() => setIsCampaignModalOpen(false)}
          title="Launch WhatsApp Business Campaign"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Target Audience</label>
              <select
                value={campaignAudience}
                onChange={(e) => setCampaignAudience(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Selected Students">Selected Students (LOI Acceptance Push)</option>
                <option value="Shortlisted Students">Shortlisted Interview Candidates</option>
                <option value="Placement Officers">Placement Officers & Principals</option>
                <option value="Faculty Coordinators">Faculty Invigilators</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Choose Approved Meta Template</label>
              <select
                value={campaignTemplate}
                onChange={(e) => setCampaignTemplate(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              >
                {INITIAL_WHATSAPP_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.name}>
                    {tmpl.name} ({tmpl.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
              <div className="flex justify-between">
                <span>Total Recipients:</span>
                <span className="font-bold text-foreground">142 Contacts</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Meta API Cost:</span>
                <span className="font-bold text-emerald-600">Sponsored by GQT</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsCampaignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSendCampaign} className="bg-emerald-600 hover:bg-emerald-700">
                Launch Broadcast
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
