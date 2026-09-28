"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { FeatureFlagItem } from "@/types";
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState(() => AdminService.getFeatureFlags());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFlags = flags.filter((f) => {
    const matchCategory = selectedCategory === "all" || f.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleToggle = (key: string) => {
    const updated = AdminService.toggleFeatureFlag(key);
    setFlags(updated);
    toast.success(`Flag ${key} toggled`, {
      description: "State persisted and propagated via Supabase Realtime.",
    });
  };

  const handleEnableAll = () => {
    const updated = flags.map((f) => ({ ...f, isEnabled: true }));
    setFlags(updated);
    localStorage.setItem("gqt_feature_flags", JSON.stringify(updated));
    toast.success("All platform modules activated");
  };

  const handleResetDefaults = () => {
    localStorage.removeItem("gqt_feature_flags");
    const fresh = AdminService.getFeatureFlags();
    setFlags(fresh);
    toast.info("Feature flags reset to production defaults");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Zero-Downtime Releases
            </span>
            <span className="text-xs text-blue-200">Global Feature Gates & Circuit Breakers</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Platform Feature Flag Management Center
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Dynamically toggle examinations, interviews, offer dispatch, Meta Cloud API, email broadcasts, and certificate issuance in realtime without requiring application redeployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all backdrop-blur-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={handleEnableAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Activate All Modules
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="md:col-span-7 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search flag key, name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="md:col-span-5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter category"
            className="w-full py-2 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Flag Categories ({flags.length})</option>
            <option value="Core Modules">Core Candidate Modules</option>
            <option value="Integrations">Integrations & Messaging</option>
            <option value="Security & Access">Security & Access Control</option>
            <option value="UI & Experience">UI & Experience</option>
          </select>
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFlags.map((flag) => (
          <div
            key={flag.id}
            className={`p-5 rounded-2xl border transition-all ${
              flag.isEnabled
                ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md"
                : "bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-80"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-cyan-300">
                    {flag.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {flag.key}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {flag.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {flag.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Affects Portals:</span>
                  {flag.affectsPortals.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggle switch */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={flag.isEnabled}
                  onClick={() => handleToggle(flag.key)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    flag.isEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      flag.isEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    flag.isEnabled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {flag.isEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
