"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ManagementService } from "@/services/management.service";
import { ManagementActivityFeedItem } from "@/types";
import {
  Activity,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  FileCheck2,
  Clock,
  Filter,
  Search,
  Sparkles,
  Award,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagementActivityCenterPage() {
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feed, setFeed] = useState<ManagementActivityFeedItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setFeed(ManagementService.getActivityFeed());
  }, []);

  const filteredFeed = useMemo(() => {
    return feed.filter((item) => {
      const matchType = eventTypeFilter === "all" || item.eventType === eventTypeFilter;
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.actor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [feed, eventTypeFilter, searchQuery]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setFeed(ManagementService.getActivityFeed());
      setIsRefreshing(false);
      toast.success("Realtime feed synchronized with Supabase stream");
    }, 400);
  };

  const getEventBadgeClass = (eventType: string) => {
    switch (eventType) {
      case "Offer Accepted":
      case "Selected":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "Exam Submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300";
      case "College Added":
      case "Drive Published":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
      case "Escalation Missed":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live Operations Stream
            </span>
            <span className="text-xs text-blue-200">Supabase Realtime Channel: CSR_FEED</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Global Activity Center & Event Stream
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Live chronological stream of candidate registrations, proctored test submissions, interview ratings, offer acceptances, and administrative decisions statewide.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-[#005BBB] ${isRefreshing ? "animate-spin" : ""}`} />
          Sync Live Stream
        </button>
      </div>

      {/* Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search activity stream by student, college, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="md:col-span-5">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            aria-label="Filter by Event Type"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Operational Events ({feed.length})</option>
            <option value="Offer Accepted">Offer Accepted & Signed</option>
            <option value="Selected">Candidate Selected</option>
            <option value="Exam Submitted">Exam Finished & Scored</option>
            <option value="Interview Completed">Interview Evaluated</option>
            <option value="College Added">Institutional MoU Added</option>
            <option value="Drive Published">Drive Published</option>
            <option value="Student Registered">Candidate Registrations</option>
            <option value="Escalation Missed">Escalations Flagged</option>
          </select>
        </div>
      </div>

      {/* Feed List Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Live Event Stream (Newest First)
          </h2>
          <span className="text-xs text-slate-500">
            Showing {filteredFeed.length} of {feed.length} events
          </span>
        </div>

        <div className="space-y-4">
          {filteredFeed.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300 font-bold shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${getEventBadgeClass(
                        item.eventType
                      )}`}
                    >
                      {item.eventType}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>Initiated by: <strong className="text-slate-700 dark:text-slate-200">{item.actor}</strong> ({item.actorRole})</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200 dark:border-slate-800">
                <span className="font-mono text-slate-500 font-medium">{item.timestamp}</span>
                {item.statusBadge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 rounded-full border border-blue-200 dark:border-blue-900/60">
                    {item.statusBadge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
