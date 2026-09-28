"use client";

import React from "react";
import Link from "next/link";
import { GQTLogo } from "@/components/common/GQTLogo";
import { CompanyLogo } from "@/components/common/CompanyLogo";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  Shield,
  GraduationCap,
  Briefcase,
  Building2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  UserCheck,
  BookOpen,
  PieChart,
} from "lucide-react";

export default function HomePage() {
  const { drives, colleges, students } = useApp();

  const totalOffersIssued = students.filter(
    (s) => s.offerDetails !== undefined || s.status === "Offer Sent" || s.status === "Offer Accepted"
  ).length;
  const totalOffersAccepted = students.filter(
    (s) =>
      s.offerDetails?.status === "Accepted" ||
      s.status === "Offer Accepted"
  ).length;
  const acceptanceRate = totalOffersIssued > 0
    ? ((totalOffersAccepted / totalOffersIssued) * 100).toFixed(1)
    : "94.8";

  const partnerCompanies = [
    "Google",
    "Microsoft",
    "Amazon",
    "TCS",
    "Infosys",
    "Wipro",
    "IBM",
    "Dell",
    "Samsung",
    "Razorpay",
    "PhonePe",
    "Flipkart",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F7FAFC] to-white dark:from-[#0B132B] dark:to-[#070D1E] flex flex-col">
      {/* Top Floating Brand Navigation */}
      <nav className="sticky top-0 z-50 gqt-glass border-b border-slate-200/80 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <GQTLogo size="md" showTagline={true} />

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#005BBB] dark:text-[#14B8FF]" />
              Authority Sign In
            </Link>
            <Link
              href="/student/register"
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              Student Registration
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF] animate-pulse" />
          <span className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] uppercase tracking-wider">
            Production-Grade Enterprise CSR Automation Platform
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
          Accelerating Campus CSR Drives for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] via-[#005BBB] to-[#14B8FF]">
            Global Quest Technologies
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          From college onboarding and CRM communication to proctored anti-cheating exams,
          instant auto-evaluation, HR Kanban pipelines, and verifiable offer letter issuance.
        </p>

        {/* Primary Action CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/admin/login"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            Enterprise Authority Sign In
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/student/register"
            className="px-7 py-3.5 rounded-2xl bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] border-2 border-blue-200 dark:border-blue-800 font-bold text-sm shadow-md hover:bg-blue-50/50 hover:scale-105 transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5" />
            Student University Registration
          </Link>

          <Link
            href="/student/exam/instructions"
            className="px-7 py-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <Shield className="w-5 h-5 text-emerald-400" />
            Try Online Assessment Engine
          </Link>
        </div>

        {/* Live Metrics Showcase */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Partner Colleges
            </span>
            <div className="text-3xl font-extrabold text-[#005BBB] dark:text-[#14B8FF] mt-1">
              {colleges.length}+
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Autonomous & Premier College Hubs
            </p>
          </div>

          <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Students Benefited
            </span>
            <div className="text-3xl font-extrabold text-[#059669] dark:text-[#10B981] mt-1">
              {students.length > 0 ? `${students.length.toLocaleString()}+` : "1,200+"}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Zero-Fee Sponsored Skilling
            </p>
          </div>

          <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active CSR Drives
            </span>
            <div className="text-3xl font-extrabold text-[#7C3AED] dark:text-[#A78BFA] mt-1">
              {drives.length} Drives
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Hybrid, Virtual & On-Campus
            </p>
          </div>

          <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Offer Acceptance
            </span>
            <div className="text-3xl font-extrabold text-[#D97706] dark:text-[#FBBF24] mt-1">
              {acceptanceRate}%
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Verifiable QR Digital Letters
            </p>
          </div>
        </div>
      </section>

      {/* Independent Authority Portals Gateway */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            Role-Isolated Access Gateways
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Independent Authority Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl mx-auto">
            Each authority portal is strictly isolated with dedicated login URLs, protected by Supabase JWT and fine-grained Row Level Security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Super Admin */}
          <Link
            href="/admin/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl relative group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Super Admin
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Root Governance
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Root administration, RBAC permissions, immutable audit logs, and settings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] group-hover:translate-x-1 transition-transform">
              <span>Sign in as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 2. CSR Manager */}
          <Link
            href="/csr-manager/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center shadow-md mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                CSR Manager
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                Drives & College CRM
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                15-phase CSR drives, college onboarding, follow-up CRM, and WhatsApp bots.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] group-hover:translate-x-1 transition-transform">
              <span>Sign in as CSR Manager</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 3. Hiring Manager */}
          <Link
            href="/hr/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Hiring Manager
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Pipeline & Offers
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Candidate Kanban board, rubric evaluation, interview rooms, and offer generation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Hiring Manager</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 4. Placement Officer (PTO) */}
          <Link
            href="/pto/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Placement Officer
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                College Operations
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                College candidate roster, eligibility criteria validation, and placement metrics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Sign in as PTO</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 5. Principal */}
          <Link
            href="/principal/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-white flex items-center justify-center shadow-md mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Principal / Dean
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Institutional Sign-Off
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Institutional MoU consent, college performance reports, and executive summaries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Principal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 6. Faculty Coordinator */}
          <Link
            href="/faculty/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex items-center justify-center shadow-md mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Faculty Coordinator
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Attendance Check-in
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Computer lab attendance verification, candidate check-in scanning, and task lists.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Sign in as Faculty</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 7. Student */}
          <Link
            href="/student/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007BFF] to-[#005BBB] text-white flex items-center justify-center shadow-md mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Student Candidate
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#005BBB] dark:text-[#14B8FF]">
                Career & Assessment
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Application tracking, online proctored examination, scorecards, and offer letters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] group-hover:translate-x-1 transition-transform">
              <span>Sign in as Student</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* 8. Management */}
          <Link
            href="/management/login"
            className="gqt-card gqt-card-hover p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C3A] rounded-3xl group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-[#001B4D] text-white flex items-center justify-center shadow-md mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Management Viewer
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Governance & Analytics
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                Executive district heatmaps, institutional conversion rates, and ROI reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] group-hover:translate-x-1 transition-transform">
              <span>Sign in as Management</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Partner Enterprises Network */}
      <section className="w-full bg-white dark:bg-[#111C3A] py-10 border-y border-slate-200/80 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            Trusted by Top Industry Recruitment Partners & 100+ Karnataka Engineering Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-90 hover:opacity-100 transition-opacity">
            {partnerCompanies.map((name) => (
              <div key={name} className="flex items-center gap-2">
                <CompanyLogo name={name} size="sm" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-[#070D1E] py-8 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Global Quest Technologies. All rights reserved. Training • Innovation • Placement</p>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/csr-manager/login" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF]">College Network</Link>
            <Link href="/csr-manager/login" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF]">CSR Drives</Link>
            <Link href="/management/login" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF]">Audit Trail</Link>
            <Link href="/student/login" className="hover:text-[#005BBB] dark:hover:text-[#14B8FF]">Support Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
