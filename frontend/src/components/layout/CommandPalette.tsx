"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/common/Modal";
import {
  Search,
  Building2,
  Briefcase,
  GraduationCap,
  Layers,
  FileText,
  PhoneCall,
  Settings,
  ArrowRight,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, colleges, drives, students } = useApp();
  const [query, setQuery] = useState("");

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation Links
  const quickLinks = [
    { title: "Dashboard Overview", url: "/portal/dashboard", icon: Layers, category: "Navigation" },
    { title: "CSR Drives Management", url: "/portal/drives", icon: Briefcase, category: "Navigation" },
    { title: "Create New CSR Drive", url: "/portal/drives/create", icon: Briefcase, category: "Navigation" },
    { title: "Colleges Directory (100+)", url: "/portal/colleges", icon: Building2, category: "Navigation" },
    { title: "CRM Communication & Calls", url: "/portal/crm", icon: PhoneCall, category: "Navigation" },
    { title: "Follow-up Engine (Kanban)", url: "/portal/crm/follow-ups", icon: PhoneCall, category: "Navigation" },
    { title: "HR Interview Kanban", url: "/portal/hr/pipeline", icon: GraduationCap, category: "Navigation" },
    { title: "Offer Letter Automation", url: "/portal/offers", icon: FileText, category: "Navigation" },
    { title: "Reporting & Analytics", url: "/portal/reports", icon: Layers, category: "Navigation" },
    { title: "Student Registration Portal", url: "/student/register", icon: GraduationCap, category: "Student" },
    { title: "Student Dashboard & Tests", url: "/student/dashboard", icon: GraduationCap, category: "Student" },
    { title: "Anti-Cheating Online Exam", url: "/student/exam/instructions", icon: GraduationCap, category: "Student" },
    { title: "System Settings", url: "/portal/settings", icon: Settings, category: "System" },
  ];

  const filteredLinks = quickLinks.filter((l) => l.title.toLowerCase().includes(q));

  const filteredColleges = colleges
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.collegeCode || c.vtuCode || "").toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
    )
    .slice(0, 4);

  const filteredDrives = drives
    .filter((d) => d.name.toLowerCase().includes(q) || d.driveCode.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredStudents = students
    .filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.usn.toLowerCase().includes(q) ||
        s.collegeName.toLowerCase().includes(q)
    )
    .slice(0, 4);

  const handleNavigate = (url: string) => {
    setIsCommandPaletteOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <Modal isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} maxWidth="2xl">
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search drives, colleges, students, USN, or modules... (e.g., RVCE, 1RV, Java, Offer)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1">
          {/* Quick Navigation */}
          {filteredLinks.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Pages & Modules
              </p>
              <div className="space-y-1">
                {filteredLinks.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.url}
                      onClick={() => handleNavigate(item.url)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#005BBB]">
                          {item.title}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#005BBB] transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Colleges */}
          {filteredColleges.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Colleges ({colleges.length} in network)
              </p>
              <div className="space-y-1">
                {filteredColleges.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleNavigate(`/portal/colleges/${c.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {c.collegeCode || c.vtuCode}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#005BBB]">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {c.district} • {c.type} • {c.naacGrade}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">View 360°</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CSR Drives */}
          {filteredDrives.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                CSR Drives
              </p>
              <div className="space-y-1">
                {filteredDrives.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleNavigate(`/portal/drives/${d.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#005BBB]">
                        {d.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Code: {d.driveCode} • {d.category} • {d.status}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#005BBB]">Open Drive</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Registered Students
              </p>
              <div className="space-y-1">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleNavigate(`/portal/hr/pipeline`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-white group-hover:text-[#005BBB]">
                        {s.fullName} ({s.usn})
                      </p>
                      <p className="text-xs text-slate-400">
                        {s.collegeName} • {s.branch} • Status: {s.status}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">Review</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
