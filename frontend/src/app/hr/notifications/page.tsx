"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Archive,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Briefcase,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useNotifications } from "@/providers/NotificationProvider";
import { toast } from "sonner";

export default function HRNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, archiveNotification } = useNotifications();
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || n.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5 w-max mb-2">
            <Bell className="w-3.5 h-3.5" />
            HR Recruitment Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            HR Notifications & Realtime Alerts
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Realtime pings for exam qualification rosters, interview schedule slots, and digital LOI acceptances.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            {["all", "offers", "hr", "drives", "system"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all capitalize ${
                  filterCategory === cat
                    ? "bg-[#005BBB] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`p-4 transition-all hover:border-[#005BBB] ${
              !item.read ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#005BBB]/10 text-[#005BBB] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1.5">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!item.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => markAsRead(item.id)}
                  >
                    Mark Read
                  </Button>
                )}
                {item.actionUrl && (
                  <Link href={item.actionUrl}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
