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
          <Card key={d.id} className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between">
            <CardHeader className="border-b border-border/40 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{d.driveCode || d.id}</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${d.status.toLowerCase().includes("progress") || d.status.toLowerCase().includes("open")
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : d.status.toLowerCase().includes("completed")
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-muted text-muted-foreground border-border"
                    }`}
                >
                  {d.status}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2 line-clamp-1">
                {d.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{d.academicYear} • {d.category}</p>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-muted/30 rounded-2xl">
                <div>
                  <p className="text-[10px] text-muted-foreground">Institutions</p>
                  <p className="font-bold text-foreground text-sm">{d.metrics?.collegesCount || 12}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Registered</p>
                  <p className="font-bold text-blue-400 text-sm">{d.metrics?.registeredStudents || 380}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Selected</p>
                  <p className="font-bold text-emerald-400 text-sm">{d.metrics?.interviewSelected || 0}</p>
                </div>
              </div>

              <div className="space-y-1 text-muted-foreground text-[11px]">
                <p>Lead Recruiter: <strong className="text-foreground">{d.assignments?.hrLeadName || "Unassigned"}</strong></p>
                <p>Registration Window: <strong className="text-foreground">{d.schedule?.regStart || "TBD"} to {d.schedule?.regEnd || "TBD"}</strong></p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">{d.batch ? `Batch of ${d.batch}` : ""}</span>
                <Link href={`/csr-manager/drives/${d.id}`}>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                    Manage Drive <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
