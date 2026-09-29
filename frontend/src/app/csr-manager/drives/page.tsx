"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Search,
  Eye,
  Calendar,
  Building2,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Layers
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CSRManagerDrivesPage() {
  const { drives } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = drives.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Statewide CSR Hiring Drives
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            CSR Campus Drives
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage multi-institutional recruitment campaigns, inspect candidate funnel progressions, and configure drive parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/csr-manager/drives/create">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2">
              <Plus className="w-4 h-4" /> Create New Drive
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drives by name or code..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Drive Statuses</option>
          <option value="progress">In Progress / Active</option>
          <option value="registration open">Registration Open</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="border border-border/70 bg-card/90 backdrop-blur-xl rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Drive Code & Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                  {d.driveCode || d.id}
                </span>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border whitespace-nowrap flex items-center gap-1.5 ${
                    d.status.toLowerCase().includes("progress") || d.status.toLowerCase().includes("open")
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : d.status.toLowerCase().includes("completed")
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : d.status.toLowerCase().includes("exam") || d.status.toLowerCase().includes("pipeline")
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {d.status}
                </span>
              </div>

              {/* Title & Category Row */}
              <div className="mb-4">
                <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors min-h-[2.8rem] flex items-center">
                  {d.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{d.academicYear}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-primary/80 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {d.category || "CSR Flagship"}
                  </span>
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-muted/40 dark:bg-muted/20 rounded-2xl border border-border/50 mb-4">
                <div className="px-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Institutions</p>
                  <p className="font-extrabold text-foreground text-sm mt-0.5">{d.metrics?.collegesCount || 12}</p>
                </div>
                <div className="px-1 border-x border-border/60">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Registered</p>
                  <p className="font-extrabold text-blue-600 dark:text-blue-400 text-sm mt-0.5">
                    {d.metrics?.registeredStudents || 380}
                  </p>
                </div>
                <div className="px-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Selected</p>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    {d.metrics?.interviewSelected || 0}
                  </p>
                </div>
              </div>

              {/* Recruiter & Window Info */}
              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2 truncate">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Lead Recruiter: <strong className="text-foreground font-medium">{d.assignments?.hrLeadName || "Unassigned"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] truncate">
                    Window: <strong className="text-foreground font-medium">{d.schedule?.regStart || "TBD"} to {d.schedule?.regEnd || "TBD"}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
              <span className="text-xs font-semibold text-muted-foreground truncate">
                {d.batch
                  ? d.batch.toLowerCase().includes("batch")
                    ? d.batch
                    : `Batch of ${d.batch}`
                  : "General Batch"}
              </span>
              <Link href={`/csr-manager/drives/${d.id}`} className="shrink-0">
                <Button size="sm" variant="outline" className="h-8 px-3 text-xs gap-1.5 whitespace-nowrap hover:bg-primary hover:text-white transition-colors">
                  Manage Drive <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
