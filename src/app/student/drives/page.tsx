"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentDrivesPage() {
  const { drives } = useApp();
  const { student } = useStudentSession();

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B132B] flex flex-col">
      {/* Student Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <GQTLogo size="sm" showTagline={true} />

          <div className="flex items-center gap-3">
            <Link
              href="/student/dashboard"
              className="text-xs font-semibold text-slate-500 hover:text-[#005BBB] flex items-center gap-1.5 mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF]">
              <Briefcase className="w-3.5 h-3.5" />
              Campus CSR Drives
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Available & Active CSR Campus Drives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global Quest Technologies proctored campus placement & corporate skilling recruitment drives.
          </p>
        </div>

        {/* Drives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.map((d) => {
            const isRegistered = student?.driveId === d.id || student?.driveName === d.name;

            return (
              <div
                key={d.id}
                className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      {d.driveCode}
                    </span>
                    {isRegistered ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enrolled
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#005BBB]">
                        {d.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {d.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{d.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Exam: {d.schedule?.examDate || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Cutoff: ≥ {d.minPercentage || 60}% / {d.minCgpa || 6.5} CGPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Batch: {d.batch}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Training Mode: <strong className="text-slate-700 dark:text-slate-200">{d.mode}</strong>
                  </div>

                  {isRegistered ? (
                    <Link
                      href="/student/registration-card/current"
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Hall Ticket</span>
                    </Link>
                  ) : (
                    <Link
                      href="/student/register"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#005BBB] to-[#007BFF] text-white text-xs font-bold hover:shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
