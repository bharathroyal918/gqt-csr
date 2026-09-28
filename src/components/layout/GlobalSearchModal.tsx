"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Users, Building2, Briefcase, UserCheck, Bell, FileText, ArrowRight } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { label: "All", icon: Search },
    { label: "Students", icon: Users },
    { label: "Colleges", icon: Building2 },
    { label: "CSR Drives", icon: Briefcase },
    { label: "HR Team", icon: UserCheck },
    { label: "Notifications", icon: Bell },
    { label: "Documents", icon: FileText },
  ];

  const searchEntities = [
    { type: "Students", title: "Bharath Royal", subtitle: "USN: 1RV22CS101 • R.V. College of Engineering", icon: Users },
    { type: "Students", title: "Aditi Rao", subtitle: "USN: 1RV22CS001 • R.V. College of Engineering", icon: Users },
    { type: "Colleges", title: "R.V. College of Engineering (RVCE)", subtitle: "Bangalore Urban • Autonomous Tier-1", icon: Building2 },
    { type: "Colleges", title: "BMS College of Engineering (BMSCE)", subtitle: "Bangalore Urban • Autonomous Tier-1", icon: Building2 },
    { type: "CSR Drives", title: "CSR Flagship Drive 2026", subtitle: "Target: 4,000 Candidates • 18 Partner Colleges", icon: Briefcase },
    { type: "CSR Drives", title: "Women in Tech Empowerment 2026", subtitle: "Special Initiative • Mysore & Bangalore", icon: Briefcase },
    { type: "HR Team", title: "Priya Nair", subtitle: "Senior Recruiter • Technical Interview Panel Lead", icon: UserCheck },
    { type: "Notifications", title: "RVCE Bangalore Drive Approved", subtitle: "System Notification • 30 mins ago", icon: Bell },
    { type: "Documents", title: "RVCE MoU Agreement Document 2025-26", subtitle: "Signed PDF • 2.4 MB", icon: FileText },
  ];

  const filtered = searchEntities.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.type === selectedCategory;
    const matchesQuery =
      query.trim() === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#111C3A] rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, colleges, CSR drives, HR, notifications, documents..."
            className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#005BBB] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={onClose}
                  className="p-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#005BBB] group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Enterprise Search connected to Supabase</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}
