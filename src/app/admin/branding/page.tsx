"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { PlatformBrandingSettings } from "@/types";
import {
  Sparkles,
  Save,
  RotateCcw,
  Palette,
  Image,
  Globe,
  Mail,
  Phone,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<PlatformBrandingSettings>(() =>
    AdminService.getBrandingSettings()
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AdminService.saveBrandingSettings(settings);
    toast.success("Branding and theme configuration saved globally", {
      description: "Custom styles injected into client root CSS variables.",
    });
  };

  const handleReset = () => {
    localStorage.removeItem("gqt_branding_settings");
    const fresh = AdminService.getBrandingSettings();
    setSettings(fresh);
    toast.info("Branding reset to GQT Corporate Blue defaults");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              White-Label & Corporate Identity
            </span>
            <span className="text-xs text-blue-200">GQT Brand Design Tokens</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Platform Branding & Theme Customizer
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Configure enterprise logos, primary color palettes, typography, footer disclaimers, and institutional support channels across all portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-all backdrop-blur-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Colors
          </button>
          <button
            form="branding-form"
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            <Save className="w-4 h-4 text-[#005BBB]" />
            Publish Branding
          </button>
        </div>
      </div>

      <form id="branding-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Configurations (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs">
          {/* Identity & Typography */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Platform Name & Typography
            </h2>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Platform Title</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Organization Legal Entity</label>
              <input
                type="text"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Tagline / Mission Statement</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Palette className="w-4 h-4 text-cyan-500" />
              Curated Theme Colors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Primary Navy Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Secondary Blue Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Accent Cyan Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support & Footer */}
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Support Channels & Legal Disclaimer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Official Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Helpline Phone Number</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Copyright Footer Text</label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Preview Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-500" />
                  Live Branding Preview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time preview of rendered header, badges, and primary cards.
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                Active Render
              </span>
            </div>

            {/* Mock Header Card with Dynamic Colors */}
            <div
              style={{
                background: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.secondaryColor} 100%)`,
              }}
              className="p-5 rounded-2xl text-white shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    GQT
                  </div>
                  <span className="font-bold text-sm tracking-tight">{settings.platformName}</span>
                </div>
                <span
                  style={{ borderColor: settings.accentColor, color: settings.accentColor }}
                  className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full border bg-white/10"
                >
                  Verified
                </span>
              </div>

              <p className="text-xs text-white/90 leading-relaxed">{settings.tagline}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/20">
                <span>{settings.organizationName}</span>
                <span style={{ color: settings.accentColor }} className="font-bold">
                  Karnataka State
                </span>
              </div>
            </div>

            {/* Mock Buttons with Palette */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">Sample Button States:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  style={{ backgroundColor: settings.primaryColor }}
                  className="px-4 py-2 text-white font-bold rounded-lg shadow-sm"
                >
                  Primary CTA
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: settings.secondaryColor }}
                  className="px-4 py-2 text-white font-bold rounded-lg shadow-sm"
                >
                  Secondary Action
                </button>
                <button
                  type="button"
                  style={{ borderColor: settings.accentColor, color: settings.secondaryColor }}
                  className="px-4 py-2 border font-bold rounded-lg"
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Footer preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Footer Preview:</span>
              <p>{settings.footerText}</p>
              <div className="mt-2 text-[10px] text-slate-400">
                Support: {settings.supportEmail} • {settings.supportPhone}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
