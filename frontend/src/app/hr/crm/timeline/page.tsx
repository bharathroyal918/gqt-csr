"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  PhoneCall,
  Smartphone,
  Mail,
  Calendar,
  Bell,
  Megaphone,
  Paperclip,
  CheckCircle2,
  Filter,
  Search,
  Building2,
  User,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { INITIAL_COMMUNICATION_TIMELINE } from "@/lib/communication/communicationData";
import { CommunicationTimelineItem } from "@/types";

export default function HRCommunicationTimelinePage() {
  const [timeline] = useState<CommunicationTimelineItem[]>(INITIAL_COMMUNICATION_TIMELINE);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const getTypeIcon = (type: CommunicationTimelineItem["type"]) => {
    switch (type) {
      case "Call":
        return <PhoneCall className="w-4 h-4 text-blue-500" />;
      case "WhatsApp":
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case "Email":
        return <Mail className="w-4 h-4 text-purple-500" />;
      case "Meeting":
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case "Reminder":
        return <Bell className="w-4 h-4 text-amber-500" />;
      case "Announcement":
        return <Megaphone className="w-4 h-4 text-cyan-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filtered = timeline.filter((item) => {
    const matchesSearch =
      item.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
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
            <Clock className="w-7 h-7 text-[#005BBB]" />
            Permanent Institutional Communication Timeline
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Cryptographically stamped chronological ledger of all calls, emails, WhatsApp messages, and meetings.
          </p>
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
        <Link href="/hr/crm/whatsapp" className="px-3.5 py-2 font-medium text-muted-foreground hover:text-foreground">
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
        <Link href="/hr/crm/timeline" className="px-3.5 py-2 font-bold text-[#005BBB] border-b-2 border-[#005BBB] bg-[#005BBB]/5 rounded-t-lg">
          Permanent Timeline
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search timeline events..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            {["all", "Call", "WhatsApp", "Email", "Meeting", "Reminder"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  typeFilter === t
                    ? "bg-[#005BBB] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Chronological Timeline Stream */}
      <Card className="p-6">
        <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
          {filtered.map((item) => (
            <div key={item.id} className="relative pl-6">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 border-background bg-card flex items-center justify-center shadow-xs">
                {getTypeIcon(item.type)}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{item.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                      {item.type}
                    </span>
                    {item.statusBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.statusBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{item.timestamp}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                    {item.collegeName}
                  </span>
                  <span>Logged by: {item.performedBy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
