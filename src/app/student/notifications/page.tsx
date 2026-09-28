"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  CheckCheck,
  ExternalLink,
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface StudentNotification {
  id: string;
  category: "Registration" | "Exam" | "Interview" | "Offer" | "Announcements" | "Reminders";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function StudentNotificationsPage() {
  const { notifications: rawNotifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Map real notifications from Supabase and AppContext
  const dynamicNotifications: StudentNotification[] = rawNotifications.map((n) => {
    let cat: StudentNotification["category"] = "Announcements";
    const lower = (n.title + " " + n.message).toLowerCase();
    if (lower.includes("offer")) cat = "Offer";
    else if (lower.includes("interview")) cat = "Interview";
    else if (lower.includes("exam") || lower.includes("assessment") || lower.includes("score")) cat = "Exam";
    else if (lower.includes("register") || lower.includes("hall ticket")) cat = "Registration";

    let dateStr = "Recently";
    try {
      if (n.timestamp) {
        dateStr = new Date(n.timestamp).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch {}

    return {
      id: n.id,
      category: cat,
      title: n.title,
      message: n.message,
      timestamp: dateStr,
      read: n.read,
      actionUrl: n.actionUrl || "/student/dashboard",
    };
  });

  const categories = ["All", "Exam", "Interview", "Offer", "Registration", "Announcements"];

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    toast.success("Notification marked as read");
  };

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    toast.success("All notifications marked as read");
  };

  const filtered = dynamicNotifications.filter((n) => {
    const matchesCategory = activeCategory === "All" || n.category === activeCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Offer":
        return <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "Interview":
        return <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "Exam":
        return <FileCheck className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />;
      case "Registration":
        return <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Realtime Supabase Push Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Notification & Broadcast Center
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Official institutional alerts, proctored exam releases, interview invites, and CSR drive updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <CheckCheck className="w-4 h-4 text-cyan-300" />
                <span>Mark All Read ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#005BBB] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`gqt-card p-5 rounded-[22px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.read
                  ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs"
                  : "bg-white dark:bg-[#111C3A] border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !item.read
                      ? "bg-blue-100 dark:bg-blue-950 text-[#005BBB]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {getCategoryIcon(item.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">• {item.timestamp}</span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#005BBB] dark:bg-[#14B8FF]" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.actionUrl && (
                  <Link href={item.actionUrl}>
                    <button className="px-3.5 py-1.5 rounded-xl bg-[#005BBB] hover:bg-[#004494] text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                )}

                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 rounded-[28px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Notifications Found
            </h3>
            <p className="text-xs text-slate-400">
              {searchQuery ? "Try searching with different keywords." : "You're all caught up! New alerts will stream in via Supabase Realtime."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
