"use client";

import React, { useState } from "react";
import { useNotifications } from "@/providers/NotificationProvider";
import { Bell, CheckCheck, Archive, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
  } = useNotifications();

  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    { key: "all", label: "All" },
    { key: "drives", label: "Drives" },
    { key: "hr", label: "HR" },
    { key: "offers", label: "Offers" },
    { key: "system", label: "System" },
  ];

  const filtered = notifications.filter(
    (n) => filterCategory === "all" || n.category === filterCategory
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-[#111C3A] rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <Filter className="w-3 h-3 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setFilterCategory(cat.key)}
              className={`px-2.5 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                filterCategory === cat.key
                  ? "bg-[#005BBB] text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No notifications in this category
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 ${
                  !item.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                    !item.read ? "bg-[#005BBB]" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {item.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      {item.actionUrl && (
                        <Link
                          href={item.actionUrl}
                          onClick={() => {
                            markAsRead(item.id);
                            onClose();
                          }}
                          className="text-[10px] font-bold text-[#005BBB] dark:text-[#14B8FF] flex items-center gap-1 hover:underline"
                        >
                          View Details <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => archiveNotification(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Archive"
                      >
                        <Archive className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <Link
            href="/admin/notifications"
            onClick={onClose}
            className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline"
          >
            Notification Hub →
          </Link>
          <span className="text-[10px] text-slate-400 font-mono">
            Realtime Sync Active
          </span>
        </div>
      </div>
    </>
  );
}
