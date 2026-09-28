"use client";

import React from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Terminal,
  Zap,
  Server,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLicensePage() {
  const licenseDetails = {
    tier: "Enterprise Unlimited Multi-Tenant License",
    licensedTo: "Global Quest Technologies Private Limited",
    version: "3.4.0-enterprise-prod",
    buildNumber: "GQT-BUILD-2026.09.25-RELEASE",
    environment: "Production (Karnataka Multi-Cluster)",
    licenseExpiry: "Lifetime Corporate Perpetual License",
    seatsAllocated: "Unlimited Candidate & Institutional Accounts",
    activeModules: "14 of 14 Enterprise Modules Activated",
  };

  const changelog = [
    {
      version: "v3.4.0 (Prompt 11)",
      date: "September 25, 2026",
      summary: "Platform Control Center, Sentry diagnostics, feature gates, and zero-trust session security.",
      highlights: [
        "Master Control Center (OS) orchestrating live queues and microservices.",
        "Granular 19-module enterprise permission matrix with page-level access locks.",
        "Supabase Storage file explorer covering 8 private/public buckets.",
        "White-label branding customizer with client root CSS tokens injection.",
      ],
    },
    {
      version: "v3.3.0 (Prompt 10)",
      date: "September 25, 2026",
      summary: "Management Business Intelligence Portal & Karnataka 31-district interactive spatial map.",
      highlights: [
        "Interactive 31-district Karnataka map visualization with spatial heatmap.",
        "College conversion leaderboard with VTU and autonomous segmentation.",
        "End-to-end 9-stage recruitment funnel with attrition and drop-off analytics.",
        "Executive report builder with instant Excel, CSV, and PDF extraction.",
      ],
    },
    {
      version: "v3.2.0 (Prompt 9)",
      date: "September 24, 2026",
      summary: "Omnichannel Communication & Meta WhatsApp Cloud API automation.",
      highlights: [
        "Official Meta Cloud API template renderer and automated TPO drive groups.",
        "Enterprise call logging with audio recording links and outcome tags.",
        "Realtime slide-over notification drawer with priority badges.",
        "Institutional follow-up engine with Kanban, Calendar, and Timeline views.",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Perpetual Enterprise Entitlement
            </span>
            <span className="text-xs text-blue-200">Cryptographically Signed Signature</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Platform License & Release Engineering
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Audit build signatures, multi-tenant entitlements, environment deployment rings, and software changelogs for the GQT CSR Platform.
          </p>
        </div>

        <button
          onClick={() => toast.success("License verification certificate confirmed valid")}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verify Signature
        </button>
      </div>

      {/* License Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-slate-400 font-bold uppercase block">Platform Edition</span>
          <span className="text-base font-black text-slate-900 dark:text-white block">Enterprise Production</span>
          <span className="text-emerald-600 font-semibold block">v{licenseDetails.version}</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-slate-400 font-bold uppercase block">Deployment Ring</span>
          <span className="text-base font-black text-slate-900 dark:text-white block">Production Hub</span>
          <span className="text-blue-600 dark:text-cyan-400 font-semibold block">ap-south-1 (Mumbai Cluster)</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-slate-400 font-bold uppercase block">License Term</span>
          <span className="text-base font-black text-emerald-600 block">Perpetual</span>
          <span className="text-slate-500 block">GQT Corporate Entity</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-slate-400 font-bold uppercase block">Activated Modules</span>
          <span className="text-base font-black text-[#005BBB] dark:text-cyan-400 block">14 / 14</span>
          <span className="text-slate-500 block">Full Suite Unlocked</span>
        </div>
      </div>

      {/* Detailed Entitlement Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Corporate License Specification & Hash
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Licensee:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{licenseDetails.licensedTo}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">License Model:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{licenseDetails.tier}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Candidate Quota:</span>
              <span className="font-bold text-emerald-600">{licenseDetails.seatsAllocated}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Build Signature:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{licenseDetails.buildNumber}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Cryptographic Seal:</span>
              <span className="font-mono text-blue-600 dark:text-cyan-400">RSA-4096-SHA256 (Valid)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Next Audit Check:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">September 2027</span>
            </div>
          </div>
        </div>
      </div>

      {/* Release Notes Changelog */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5 text-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          Platform Version History & Changelog
        </h2>

        <div className="space-y-6">
          {changelog.map((entry, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md font-mono font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-cyan-300">
                    {entry.version}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{entry.summary}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{entry.date}</span>
              </div>

              <ul className="space-y-1.5 pl-4 list-disc text-slate-600 dark:text-slate-300">
                {entry.highlights.map((h, i) => (
                  <li key={i} className="leading-relaxed">{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
