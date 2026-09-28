"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCheck,
  Archive,
  ExternalLink,
  Award,
  Calendar,
  AlertTriangle,
  Clock,
  Briefcase,
  FileCheck2,
  CheckCircle2,
  Megaphone,
  Layers,
  ChevronRight,
  Filter
} from "lucide-react";
import { useNotifications } from "@/providers/NotificationProvider";
import { Button } from "@/components/common/Button";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, archiveNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<"unread" | "read" | "archived" | "system" | "announcements">("unread");

  // Tab Filtering
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "read") return n.read;
    if (activeTab === "system") return n.category === "system";
    if (activeTab === "announcements") return (n.category as string) === "announcements" || n.category === "drives";
    return true;
  });

  const getPriorityBadge = (type: string) => {
    switch (type) {
      case "error":
        return { label: "Critical", color: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" };
      case "warning":
        return { label: "High", color: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" };
      case "success":
        return { label: "Medium", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" };
      default:
        return { label: "Low", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" };
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "offers":
        return <Award className="w-4 h-4 text-emerald-500" />;
      case "hr":
        return <Briefcase className="w-4 h-4 text-[#005BBB]" />;
      case "drives":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "announcements":
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#005BBB]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Slide-over Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-white dark:bg-[#0B132B] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-border bg-gradient-to-r from-[#001B4D] to-[#003366] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Enterprise Notification Center</h3>
                  <p className="text-[10px] text-cyan-200/80">Realtime activity & multi-channel alerts</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-cyan-200 hover:text-white flex items-center gap-1 transition-colors"
                    title="Mark All Read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Read All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-muted/40 border-b border-border text-xs overflow-x-auto">
              {[
                { id: "unread", label: `Unread (${unreadCount})` },
                { id: "read", label: "Read" },
                { id: "announcements", label: "Announcements" },
                { id: "system", label: "System Alerts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications Feed */}
            <div className="flex-1 overflow-y-auto divide-y divide-border p-3 space-y-2.5">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    No {activeTab} notifications right now.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const priority = getPriorityBadge(notif.type || "info");
                  return (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                        !notif.read
                          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-xs"
                          : "bg-card border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(notif.category)}
                          <span className="text-xs font-bold text-foreground line-clamp-1">
                            {notif.title}
                          </span>
                        </div>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${priority.color}`}
                        >
                          {priority.label}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 pl-6 mt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>

                        <div className="flex items-center gap-2">
                          {notif.actionUrl && (
                            <Link
                              href={notif.actionUrl}
                              onClick={onClose}
                              className="text-[#005BBB] dark:text-[#14B8FF] font-bold hover:underline flex items-center gap-0.5"
                            >
                              View Details
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              archiveNotification(notif.id);
                            }}
                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Archive"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-muted/20 text-center">
              <Link
                href="/admin/notifications"
                onClick={onClose}
                className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
              >
                Go to Global Notification Hub →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
