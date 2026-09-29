"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Pin,
  Calendar,
  Building2,
  Search,
  Filter,
  Eye,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Award
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { INITIAL_ANNOUNCEMENTS } from "@/lib/communication/communicationData";
import { AnnouncementRecord } from "@/types";
import { useApp } from "@/context/AppContext";

export default function StudentAnnouncementsPage() {
  const { drives, notifications } = useApp();
  const [search, setSearch] = useState("");

  const dynamicAnnouncements = React.useMemo<AnnouncementRecord[]>(() => {
    const list: AnnouncementRecord[] = [];

    drives.forEach((d) => {
      if (d.schedule?.examDate) {
        list.push({
          id: `ann-exam-${d.id}`,
          title: `Online Assessment Schedule: ${d.name}`,
          description: `The online proctored technical examination for ${d.name} is scheduled for ${d.schedule.examDate}${d.schedule.examTime ? ` at ${d.schedule.examTime}` : ""}.${d.venue ? ` Venue: ${d.venue}.` : ""}`,
          targetAudience: ["All Students"],
          channels: ["Dashboard", "Email"],
          priority: "High",
          publishedAt: d.schedule.examDate,
          isPinned: true,
          authorName: "Directorate of Technical Examinations",
          authorRole: "Assessment Committee",
          viewsCount: 150,
        });
      }
      if (d.schedule?.interviewDate) {
        list.push({
          id: `ann-int-${d.id}`,
          title: `HR Technical Panel Interviews: ${d.name}`,
          description: `Panel interviews for qualified candidates are set for ${d.schedule.interviewDate}. Please verify your identity badge and attendance credentials.`,
          targetAudience: ["All Students"],
          channels: ["Dashboard", "WhatsApp"],
          priority: "Critical",
          publishedAt: d.schedule.interviewDate,
          isPinned: true,
          authorName: "Corporate Talent Acquisition",
          authorRole: "Campus Recruitment Lead",
          viewsCount: 220,
        });
      }
    });

    notifications.forEach((n) => {
      list.push({
        id: `ann-notif-${n.id}`,
        title: n.title,
        description: n.message,
        targetAudience: ["All Students"],
        channels: ["Dashboard"],
        priority: (n.type === "error" ? "Critical" : n.type === "warning" ? "High" : "Medium") as "Critical" | "High" | "Medium",
        publishedAt: n.timestamp || new Date().toISOString(),
        isPinned: false,
        authorName: "CSR Operations Directorate",
        authorRole: "Global Quest Technologies",
        viewsCount: 95,
      });
    });

    return list.length > 0 ? list : INITIAL_ANNOUNCEMENTS;
  }, [drives, notifications]);

  const filtered = dynamicAnnouncements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5 w-max mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            Official Candidate Bulletin
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            CSR Drive Announcements & Notices
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Important updates regarding syllabus, exam schedules, interview slots, and corporate batch onboarding.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drive notices & guidelines..."
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`p-6 space-y-3 transition-all ${
              item.isPinned
                ? "border-amber-300 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
                : "border-border hover:border-[#005BBB]"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 flex-wrap">
                {item.isPinned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    PINNED NOTICE
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
                  {item.priority} Priority
                </span>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground">
                {new Date(item.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-base font-bold text-foreground">{item.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>

            <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground border-t border-border/50">
              <span>
                Posted by <strong className="text-foreground">{item.authorName}</strong> ({item.authorRole})
              </span>
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" /> {item.viewsCount} Reads
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
