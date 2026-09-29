"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Users,
  Building2,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Plus,
  LucideIcon,
} from "lucide-react";
import { UserRole } from "@/types";

interface PortalDashboardViewProps {
  portalTitle: string;
  portalSubtitle: string;
  roleBadge: string;
  stats?: Array<{
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon: LucideIcon;
  }>;
  quickActions?: Array<{
    label: string;
    href: string;
    icon: LucideIcon;
    variant?: "primary" | "secondary" | "outline";
  }>;
}

export function PortalDashboardView({
  portalTitle,
  portalSubtitle,
  roleBadge,
  stats,
  quickActions,
}: PortalDashboardViewProps) {
  const defaultStats = [
    { title: "Active Drives", value: "8", change: "+2 this month", trend: "up" as const, icon: Briefcase },
    { title: "Partner Colleges", value: "24", change: "+4 MoUs", trend: "up" as const, icon: Building2 },
    { title: "Registered Candidates", value: "4,280", change: "+320 today", trend: "up" as const, icon: Users },
    { title: "Offers Issued", value: "640", change: "94.8% Acceptance", trend: "up" as const, icon: Award },
  ];

  const statItems = stats || defaultStats;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] via-[#004899] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>{roleBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {portalTitle}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              {portalSubtitle}
            </p>
          </div>

          {quickActions && quickActions.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link key={idx} href={action.href}>
                    <Button
                      variant={action.variant || "secondary"}
                      size="sm"
                      leftIcon={<Icon className="w-4 h-4" />}
                    >
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statItems.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Pipeline & Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
                <CardTitle>Active CSR Drive Pipeline</CardTitle>
              </div>
              <span className="text-xs font-bold text-slate-500">Live Status</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "RVCE Bangalore CSR Drive 2026", phase: "Round 2: Technical Interview", candidates: 342, status: "In Progress" },
                  { name: "BMSCE Karnataka Excellence Drive", phase: "Online Aptitude & Coding Exam", candidates: 512, status: "Active" },
                  { name: "PESIT Tier-1 Tech Recruitment", phase: "Final Offer Release Phase", candidates: 184, status: "Closing" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.phase} • {item.candidates} Candidates
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real-Time Stream */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF]" />
                <CardTitle>Real-Time Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3.5">
                {[
                  { text: "Offer accepted by candidate 1RV22CS101", time: "10m ago" },
                  { text: "Interview score submitted by Priya Nair", time: "35m ago" },
                  { text: "Drive approved for BMSCE by CSR Lead", time: "1h ago" },
                  { text: "Hall ticket generated for 248 students", time: "2h ago" },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#005BBB] shrink-0 mt-1.5" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{act.text}</p>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
