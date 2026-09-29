"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  ArrowLeft,
  Sparkles,
  Pin,
  Calendar,
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  Building2,
  Share2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_ANNOUNCEMENTS } from "@/lib/communication/communicationData";
import { AnnouncementRecord } from "@/types";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(INITIAL_ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState<string>("All Students");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");
  const [channelDashboard, setChannelDashboard] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please provide title and description.");
      return;
    }

    const channels: ("Dashboard" | "Email" | "WhatsApp")[] = [];
    if (channelDashboard) channels.push("Dashboard");
    if (channelEmail) channels.push("Email");
    if (channelWhatsApp) channels.push("WhatsApp");

    const newAnc: AnnouncementRecord = {
      id: `anc-${Date.now()}`,
      title,
      description,
      targetAudience: [targetAudience as any],
      channels,
      priority,
      publishedAt: new Date().toISOString(),
      isPinned,
      authorName: "Super Admin",
      authorRole: "Governance",
      viewsCount: 0,
    };

    setAnnouncements((prev) => [newAnc, ...prev]);
    toast.success("Announcement Broadcasted Successfully!", {
      description: `Dispatched to ${targetAudience} via ${channels.join(", ")}.`,
    });
    setIsCreateOpen(false);
    // Reset
    setTitle("");
    setDescription("");
  };

  const filtered = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5 w-max mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            Executive Broadcasting Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Centralized Announcement Center
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Publish institutional notices, exam schedules, and drive milestones across Student, HR, and College portals.
          </p>
        </div>

        <Button
          variant="cyan"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Broadcast Announcement
        </Button>
      </div>

      {/* Search and Stats */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements by title or content..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="text-xs font-semibold text-muted-foreground">
            Total Broadcasts: <span className="font-bold text-foreground">{announcements.length}</span>
          </div>
        </div>
      </Card>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6 space-y-3 hover:border-[#005BBB] transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2 flex-wrap">
                {item.isPinned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    PINNED
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.priority === "Critical"
                      ? "bg-red-100 text-red-800"
                      : item.priority === "High"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {item.priority}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                  Target: {item.targetAudience.join(", ")}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  {item.viewsCount} Views
                </span>
                <span className="text-[11px] font-mono">
                  {new Date(item.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

            <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <span>
                Broadcast by <strong className="text-foreground">{item.authorName}</strong> ({item.authorRole})
              </span>
              <div className="flex items-center gap-1.5 font-medium">
                <span>Channels:</span>
                {item.channels.map((ch) => (
                  <span key={ch} className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[10px]">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Broadcast Modal */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Broadcast Corporate Announcement"
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Announcement Headline</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule Update for Assessment Window"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write comprehensive guidelines or notice..."
                rows={4}
                className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="All Students">All Registered Students</option>
                  <option value="Placement Officers">Placement Officers & Principals</option>
                  <option value="HR">HR Recruitment Panel</option>
                  <option value="Faculty">Faculty Coordinators</option>
                  <option value="Admission Team">Admission Onboarding Team</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <label className="text-xs font-bold text-foreground">Delivery Channels</label>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelDashboard}
                    onChange={(e) => setChannelDashboard(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>Dashboard Feed</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={(e) => setChannelEmail(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>Email Broadcast</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelWhatsApp}
                    onChange={(e) => setChannelWhatsApp(e.target.checked)}
                    className="accent-[#005BBB]"
                  />
                  <span>WhatsApp Push</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <div>
                <p className="text-xs font-bold text-foreground">Pin to Top of Portal Feed</p>
                <p className="text-[10px] text-muted-foreground">Highlight notice prominently for 7 days</p>
              </div>
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 accent-[#005BBB]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Publish Now
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
