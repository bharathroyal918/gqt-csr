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
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-[#F7FAFC] to-[#EAF4FF] dark:from-[#0B132B] dark:to-[#070D1E] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GQTLogo size="lg" showTagline={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            Dedicated Authority Portals
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Select Your Authority Gateway
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Each role operates within an independent, isolated security portal. Direct authentication required per authority.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portalLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="gqt-card p-4 sm:p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#005BBB] dark:group-hover:text-[#14B8FF] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.role}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#005BBB] group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>

        {/* Student Self-Registration Prompt */}
        <div className="mt-8 text-center pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Student registering for an upcoming GQT CSR drive?{" "}
            <Link
              href="/student/register"
              className="font-bold text-[#005BBB] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Candidate Registration <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
