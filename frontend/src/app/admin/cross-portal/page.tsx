"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  GraduationCap,
  Briefcase,
  Layers,
  School,
  Award,
  Building2,
  BarChart3,
  Users,
  UserPlus,
  ShieldCheck,
  ExternalLink,
  Activity,
  Lock,
  CheckCircle2,
  Clock,
  Eye,
  Settings,
} from "lucide-react";

interface PortalConfig {
  id: string;
  name: string;
  description: string;
  dashboardHref: string;
  loginHref: string;
  manageHref: string;
  icon: React.ElementType;
  gradient: string;
  roles: string[];
  color: string;
}

const PORTALS: PortalConfig[] = [
  {
    id: "student",
    name: "Student Candidate Portal",
    description: "View and manage student registrations, exam results, interview status, and offer letters.",
    dashboardHref: "/student/dashboard",
    loginHref: "/student/login",
    manageHref: "/admin/students",
    icon: GraduationCap,
    gradient: "from-blue-600 to-indigo-700",
    color: "blue",
    roles: ["student"],
  },
  {
    id: "hr",
    name: "HR Recruiter Portal",
    description: "Access HR recruiter dashboards, interview scheduling, shortlisting, and offer management.",
    dashboardHref: "/hr/dashboard",
    loginHref: "/hr/login",
    manageHref: "/admin/hr",
    icon: Briefcase,
    gradient: "from-violet-600 to-purple-700",
    color: "violet",
    roles: ["hr", "hr_recruiter"],
  },
  {
    id: "csr_manager",
    name: "CSR Drive Manager Portal",
    description: "Oversee CSR drives, college onboarding, batch allocations, and operations calendar.",
    dashboardHref: "/csr-manager/dashboard",
    loginHref: "/csr-manager/login",
    manageHref: "/admin/drives",
    icon: Layers,
    gradient: "from-emerald-600 to-teal-700",
    color: "emerald",
    roles: ["csr_manager"],
  },
  {
    id: "pto",
    name: "Placement Officer Portal",
    description: "Monitor placement statistics, approve student profiles, and coordinate with colleges.",
    dashboardHref: "/pto/dashboard",
    loginHref: "/pto/login",
    manageHref: "/admin/pto",
    icon: School,
    gradient: "from-amber-600 to-orange-700",
    color: "amber",
    roles: ["placement_officer", "pto", "placement_coordinator"],
  },
  {
    id: "faculty",
    name: "Faculty Coordinator Portal",
    description: "Coordinate faculty attendance marking, student mentorship, and drive participation.",
    dashboardHref: "/faculty/dashboard",
    loginHref: "/faculty/login",
    manageHref: "/admin/faculty",
    icon: Award,
    gradient: "from-rose-600 to-pink-700",
    color: "rose",
    roles: ["faculty", "faculty_coordinator"],
  },
  {
    id: "principal",
    name: "Principal Portal",
    description: "Provide institutional leadership with drive performance reports and student summaries.",
    dashboardHref: "/principal/dashboard",
    loginHref: "/principal/login",
    manageHref: "/admin/principal",
    icon: Building2,
    gradient: "from-slate-600 to-gray-700",
    color: "slate",
    roles: ["principal"],
  },
  {
    id: "management",
    name: "Management Viewer Portal",
    description: "Executive analytics, revenue tracking, statewide CSR maps, and board-level BI dashboards.",
    dashboardHref: "/management/dashboard",
    loginHref: "/management/login",
    manageHref: "/management/dashboard",
    icon: BarChart3,
    gradient: "from-cyan-600 to-blue-700",
    color: "cyan",
    roles: ["management"],
  },
];

const COLOR_CLASSES: Record<string, { ring: string; bg: string; text: string; badge: string }> = {
  blue:    { ring: "ring-blue-500/30",    bg: "bg-blue-500/10",    text: "text-blue-400",    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  violet:  { ring: "ring-violet-500/30",  bg: "bg-violet-500/10",  text: "text-violet-400",  badge: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  emerald: { ring: "ring-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  amber:   { ring: "ring-amber-500/30",   bg: "bg-amber-500/10",   text: "text-amber-400",   badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  rose:    { ring: "ring-rose-500/30",    bg: "bg-rose-500/10",    text: "text-rose-400",    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  slate:   { ring: "ring-slate-500/30",   bg: "bg-slate-500/10",   text: "text-slate-400",   badge: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  cyan:    { ring: "ring-cyan-500/30",    bg: "bg-cyan-500/10",    text: "text-cyan-400",    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
};

export default function AdminCrossPortalPage() {
  const { users, students } = useApp();
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  const getUserCountForPortal = (roles: string[]) => {
    if (roles.includes("student")) return students.length;
    return users.filter((u) => roles.includes(u.role as string)).length;
  };

  const getActiveCount = (roles: string[]) => {
    if (roles.includes("student")) return students.filter((s) => s.status !== "Disqualified").length;
    return users.filter((u) => roles.includes(u.role as string) && u.status === "active").length;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold border border-white/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin — Universal Access
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Activity className="w-3 h-3 animate-pulse" />
                All Portals Live
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Cross-Portal Admin Access
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Enter any sub-portal directly as Super Admin. View, modify, and manage all data across every role — no separate login required.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-2">
                <UserPlus className="w-4 h-4" />
                Provision User
              </Button>
            </Link>
            <Link href="/admin/portal-access">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-2">
                <Lock className="w-4 h-4" />
                Access Policies
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Portals", value: PORTALS.length, icon: Layers, color: "text-primary" },
          { label: "Total Users", value: users.length + students.length, icon: Users, color: "text-emerald-500" },
          { label: "Active Sessions", value: users.filter(u => u.status === "active").length, icon: Activity, color: "text-blue-500" },
          { label: "Admin Override", value: "ENABLED", icon: ShieldCheck, color: "text-amber-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="rounded-2xl border border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-muted/60">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Portal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PORTALS.map((portal, i) => {
          const Icon = portal.icon;
          const cols = COLOR_CLASSES[portal.color];
          const totalUsers = getUserCountForPortal(portal.roles);
          const activeUsers = getActiveCount(portal.roles);
          const isHovered = hoveredPortal === portal.id;

          return (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setHoveredPortal(portal.id)}
              onMouseLeave={() => setHoveredPortal(null)}
            >
              <Card className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card hover:shadow-xl transition-all duration-300 ${isHovered ? `ring-2 ${cols.ring}` : ""}`}>
                <CardContent className="p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`p-3.5 rounded-2xl ${cols.bg} ring-1 ${cols.ring}`}>
                      <Icon className={`w-6 h-6 ${cols.text}`} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cols.badge} flex items-center gap-1`}>
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground">{portal.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{portal.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Total Users</p>
                      <p className="text-xl font-extrabold text-foreground mt-0.5">{totalUsers}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Active</p>
                      <p className={`text-xl font-extrabold mt-0.5 ${cols.text}`}>{activeUsers}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link href={portal.dashboardHref} className="flex-1">
                      <Button
                        variant="primary"
                        className={`w-full text-xs font-bold bg-gradient-to-r ${portal.gradient} text-white flex items-center justify-center gap-2 shadow-md`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Enter Portal
                      </Button>
                    </Link>
                    <Link href={portal.manageHref}>
                      <Button variant="outline" className="text-xs font-semibold gap-1.5 px-3">
                        <Settings className="w-3.5 h-3.5" />
                        Manage
                      </Button>
                    </Link>
                  </div>

                  {/* Quick links */}
                  <div className="flex items-center gap-3 pt-1 border-t border-border/60">
                    <Link href={portal.loginHref} className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <Eye className="w-3 h-3" /> View Login
                    </Link>
                    <Link href="/admin/users" className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <Users className="w-3 h-3" /> Add User
                    </Link>
                    <Link href="/admin/portal-access" className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <Lock className="w-3 h-3" /> Access Policy
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Admin Actions Footer */}
      <Card className="rounded-3xl border border-border/60 bg-gradient-to-r from-muted/40 to-muted/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-foreground">Admin Governance Actions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Quickly access key admin controls from one place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/users/create">
                <Button variant="primary" size="sm" className="text-xs gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" /> Create User & Grant Access
                </Button>
              </Link>
              <Link href="/admin/roles">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Manage Roles & Permissions
                </Button>
              </Link>
              <Link href="/admin/portal-access">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Portal Access Control
                </Button>
              </Link>
              <Link href="/admin/audit">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Audit Logs
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
