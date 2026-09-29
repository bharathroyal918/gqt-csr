"use client";

import React from "react";
import Link from "next/link";
import { GQTLogo } from "@/components/common/GQTLogo";
import {
  Shield,
  Briefcase,
  Users,
  Building2,
  Award,
  BookOpen,
  GraduationCap,
  PieChart,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function GeneralAuthLoginPage() {
  const portalLinks = [
    {
      title: "Super Admin Command Center",
      role: "Super Admin",
      href: "/admin/login",
      icon: Shield,
      color: "from-blue-600 to-indigo-700",
    },
    {
      title: "CSR Operations Portal",
      role: "CSR Manager",
      href: "/csr-manager/login",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "HR Recruitment & Panel Portal",
      role: "Hiring Manager",
      href: "/hr/login",
      icon: Users,
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "College Placement Officer (PTO)",
      role: "Placement Officer",
      href: "/pto/login",
      icon: Building2,
      color: "from-emerald-600 to-teal-700",
    },
    {
      title: "Principal & Institutional Portal",
      role: "Principal / Dean",
      href: "/principal/login",
      icon: Award,
      color: "from-amber-600 to-orange-700",
    },
    {
      title: "Faculty Coordinator Portal",
      role: "Faculty Coordinator",
      href: "/faculty/login",
      icon: BookOpen,
      color: "from-indigo-600 to-purple-700",
    },
    {
      title: "Student Assessment & Offers",
      role: "Student Candidate",
      href: "/student/login",
      icon: GraduationCap,
      color: "from-[#007BFF] to-[#005BBB]",
    },
    {
      title: "Executive Management Portal",
      role: "Management Viewer",
      href: "/management/login",
      icon: PieChart,
      color: "from-slate-800 to-[#001B4D]",
    },
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-[#F7FAFC] to-[#EAF4FF] dark:from-[#0B132B] dark:to-[#070D1E] flex flex-col items-center p-3 sm:p-4">
      <div className="w-full max-w-2xl flex flex-col h-full">
        {/* Brand Header */}
        <div className="text-center mb-2 sm:mb-2.5 shrink-0 pt-0.5">
          <div className="flex justify-center mb-1.5">
            <GQTLogo size="md" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3 h-3" />
            Dedicated Authority Portals
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Select Your Authority Gateway
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md mx-auto line-clamp-1">
            Each role operates within an independent, isolated security portal. Direct authentication required per authority.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 flex-1 content-center py-1">
          {portalLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="gqt-card p-2.5 sm:p-3 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#005BBB] dark:group-hover:text-[#14B8FF] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.role}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005BBB] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Student Self-Registration Prompt & Footer */}
        <div className="text-center pt-2 border-t border-slate-200/80 dark:border-slate-800 shrink-0 space-y-1">
          <p className="text-xs text-slate-500">
            Student registering for an upcoming GQT CSR drive?{" "}
            <Link
              href="/student/register"
              className="font-bold text-[#005BBB] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Candidate Registration <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Global Quest Technologies. Enterprise CSR Examination Portal.
          </p>
        </div>
      </div>
    </div>
  );
}
