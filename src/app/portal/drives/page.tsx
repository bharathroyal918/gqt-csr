"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DriveStatus } from "@/types";
import {
  Briefcase,
  PlusCircle,
  Search,
  Copy,
  Archive,
  QrCode,
  Calendar,
  MapPin,
  Users,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function DrivesPage() {
  const { drives, cloneDrive, archiveDrive } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const statuses: { label: string; value: string }[] = [
    { label: "All Drives", value: "all" },
    { label: "Registration Open", value: "Registration Open" },
    { label: "Exam Phase", value: "Exam Scheduled" },
    { label: "HR Pipeline", value: "HR Pipeline" },
    { label: "Completed", value: "Completed" },
  ];

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.driveCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || drive.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || drive.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Registration link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            CSR Drive Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure, schedule, monitor, and automate statewide recruitment and skilling drives.
          </p>
        </div>

        <Link
          href="/portal/drives/create"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New CSR Drive</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search drives by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Status:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors ${
                  selectedStatus === s.value
                    ? "bg-[#005BBB] text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-all"
          >
            <div>
              {/* Card Top Pill */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                  {drive.driveCode}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {drive.academicYear}
                  </span>
                  <StatusBadge status={drive.status} size="sm" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#005BBB] transition-colors leading-tight">
                {drive.name}
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {drive.description}
              </p>

              {/* Badges / Metas */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{drive.location || "Karnataka"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Exam: {drive.schedule?.examDate || "TBD"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>HR Lead: {drive.assignments?.hrLeadName ? drive.assignments.hrLeadName.split(" ")[0] : "Assigned"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{Array.isArray(drive.graduationTypes) ? drive.graduationTypes.join(", ") : "Graduation"} ({drive.batch || "2026"})</span>
                </div>
              </div>

              {/* Progress Counters Bar */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-center">
                <div>
                  <span className="text-xs font-extrabold text-[#005BBB] dark:text-blue-400 block">
                    {drive.metrics?.collegesCount ?? 1}
                  </span>
                  <span className="text-[10px] text-slate-400">Colleges</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 block">
                    {(drive.metrics?.registeredStudents ?? (drive.metrics as any)?.registeredCount ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">Registered</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-600 block">
                    {(drive.metrics?.qualifiedStudents ?? (drive.metrics as any)?.passedExamCount ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">Qualified</span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-purple-600 block">
                    {(drive.metrics?.acceptedOffers ?? (drive.metrics as any)?.offersAccepted ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">Offers</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyLink(drive.automation.registrationLink)}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#005BBB] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Copy Student Registration Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => cloneDrive(drive.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clone Drive Configuration"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => archiveDrive(drive.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Archive Drive"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={`/portal/drives/${drive.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-xs font-bold hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Drive Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
