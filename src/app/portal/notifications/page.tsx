"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  CheckCheck,
  Filter,
  Mail,
  MessageSquare,
  Smartphone,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadCount,
  } = useApp();

  const [channelFilter, setChannelFilter] = useState("all");

  const filtered = notifications.filter((n) => {
    return channelFilter === "all" || n.channel === channelFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Notification & Multi-Channel Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Omni-channel broadcast history: In-App alerts, WhatsApp pings, Email updates, and Push notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] dark:text-blue-300 font-bold text-xs hover:bg-blue-100 flex items-center gap-1.5 shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "In-App", "WhatsApp", "Email", "Push"].map((ch) => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              channelFilter === ch
                ? "bg-[#005BBB] text-white"
                : "bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {ch === "all" ? "All Channels" : ch}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markNotificationAsRead(item.id)}
            className={`gqt-card p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all ${
              item.read
                ? "bg-white/70 dark:bg-[#111C3A]/60 border-slate-200 dark:border-slate-800 opacity-80"
                : "bg-white dark:bg-[#111C3A] border-blue-200 dark:border-blue-900 shadow-md ring-1 ring-[#005BBB]/20"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {item.title}
                  </h4>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#005BBB] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.message}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="font-semibold text-[#005BBB] dark:text-blue-400">{item.channel}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {item.actionUrl && (
              <Link
                href={item.actionUrl}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#005BBB] hover:text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
              >
                <span>View Event</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
