"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Pin,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_ANNOUNCEMENTS } from "@/lib/communication/communicationData";
import { AnnouncementRecord } from "@/types";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function CSRManagerAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(INITIAL_ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("Placement Officers");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("High");

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please fill title and description.");
      return;
    }

    const created: AnnouncementRecord = {
      id: `anc-${Date.now()}`,
      title,
      description,
      targetAudience: [targetAudience as any],
      channels: ["Dashboard", "Email"],
      priority,
      publishedAt: new Date().toISOString(),
      isPinned: false,
      authorName: "Kiran",
      authorRole: "CSR Manager",
      viewsCount: 0,
    };

    setAnnouncements((prev) => [created, ...prev]);

    // Dispatch to Supabase notifications table
    if (isSupabaseConfigured) {
      try {
        const targetRoles =
          targetAudience === "Placement Officers"
            ? ["pto", "placement_officer", "placement_coordinator"]
            : targetAudience === "Students"
            ? ["student"]
            : ["hr", "hr_recruiter", "faculty"];

        await supabase.from("notifications").insert([
          {
            title: `[CSR Announcement] ${title}`,
            message: description,
            type: priority === "Critical" ? "warning" : "info",
            channel: "Platform",
            target_roles: targetRoles,
            read: false,
            action_url: "/student/announcements",
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.warn("Announcement Supabase notification note:", err);
      }
    }

    toast.success("CSR Drive Announcement Broadcasted and Dispatched to Database!");
    setTitle("");
    setDescription("");
    setIsCreateOpen(false);
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
            CSR Operations Broadcasting
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Institutional Announcements Center
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Broadcast drive registrations, exam schedules, and scholarship allocations to partner engineering colleges.
          </p>
        </div>

        <Button
          variant="cyan"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </Button>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6 space-y-3 hover:border-[#005BBB] transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
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
                <span className="text-[11px] font-bold text-muted-foreground">
                  Target: {item.targetAudience.join(", ")}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-base font-bold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

            <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <span>By {item.authorName} ({item.authorRole})</span>
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <Eye className="w-3.5 h-3.5" /> {item.viewsCount} College Views
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create Institutional Announcement"
        >
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Headline Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CSR Examination Lab Requirements Update"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Detailed Message</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  <option value="Placement Officers">Placement Officers</option>
                  <option value="Faculty">Faculty Coordinators</option>
                  <option value="All Students">All Enrolled Students</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority</label>
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

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Broadcast Notice
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
