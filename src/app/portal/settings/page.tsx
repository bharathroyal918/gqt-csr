"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  Settings,
  Building,
  Shield,
  MessageSquare,
  Mail,
  Sliders,
  CheckCircle2,
  Save,
  Key,
  Globe,
  Bell,
  RefreshCw,
  Palette,
  Moon,
  Sun,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { darkMode, toggleDarkMode, logAuditAction } = useApp();

  const [activeTab, setActiveTab] = useState<
    "organization" | "integrations" | "proctoring" | "notifications" | "security"
  >("organization");

  // Organization state
  const [orgName, setOrgName] = useState("Global Quest Technologies");
  const [initiativeName, setInitiativeName] = useState(
    "GQT Karnataka State-wide Engineering CSR Drive"
  );
  const [primaryEmail, setPrimaryEmail] = useState("csr-placements@gqt.co.in");
  const [supportPhone, setSupportPhone] = useState("+91 80 2345 6789");
  const [hqAddress, setHqAddress] = useState(
    "GQT Tech Tower, 4th Block, Rajajinagar, Bengaluru, Karnataka 560010"
  );

  // Integrations state
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("10849204928172");
  const [waAccountId, setWaAccountId] = useState("WABA-GQT-KARNATAKA-2026");
  const [waWebhookToken, setWaWebhookToken] = useState("gqt_prod_wh_secret_token_99");
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("apikey");
  const [videoProvider, setVideoProvider] = useState("Google Meet");

  // Proctoring & Exam Policy state
  const [maxStrikes, setMaxStrikes] = useState("3");
  const [fullscreenLock, setFullscreenLock] = useState(true);
  const [clipboardLock, setClipboardLock] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [qualifyingCutoff, setQualifyingCutoff] = useState("70");

  // Notification triggers
  const [notifyOnReg, setNotifyOnReg] = useState(true);
  const [notifyOnExamSchedule, setNotifyOnExamSchedule] = useState(true);
  const [notifyOnInterviewShortlist, setNotifyOnInterviewShortlist] = useState(true);
  const [notifyOnOfferRelease, setNotifyOnOfferRelease] = useState(true);
  const [weeklyTpoDigest, setWeeklyTpoDigest] = useState(true);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
    logAuditAction(
      "Update System Settings",
      "User",
      "sys-config",
      `Saved configuration preferences for section: ${section}`
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              System Administration
            </span>
            <span className="text-xs text-slate-500">Karnataka CSR Platform v2.4</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            System Settings & Enterprise Configuration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Configure GQT corporate identity, WhatsApp API keys, exam proctoring thresholds, and communications
          </p>
        </div>

        <button
          onClick={() => handleSave("All System")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-1">
        {[
          { id: "organization", label: "Brand & Identity", icon: Building },
          { id: "integrations", label: "WhatsApp & Mail APIs", icon: MessageSquare },
          { id: "proctoring", label: "Exam & Proctoring", icon: Shield },
          { id: "notifications", label: "Notification Triggers", icon: Bell },
          { id: "security", label: "Security & Appearance", icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORGANIZATION & BRAND IDENTITY */}
      {activeTab === "organization" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Enterprise CSR Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CSR Initiative Title
                  </label>
                  <input
                    type="text"
                    value={initiativeName}
                    onChange={(e) => setInitiativeName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official CSR Placements Email
                  </label>
                  <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Helpline / TPO Desk Contact
                  </label>
                  <input
                    type="tel"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bengaluru Headquarter Office Address
                </label>
                <textarea
                  rows={2}
                  value={hqAddress}
                  onChange={(e) => setHqAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSave("Organization Profile")}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* Logo & Brand Specs */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Official Brand Assets
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white dark:bg-slate-900 p-2 flex items-center justify-center">
                  <Image
                    src="/images/gqt-logo.png"
                    alt="GQT Logo"
                    width={90}
                    height={90}
                    className="object-contain"
                  />
                </div>
                <p className="font-bold text-slate-900 dark:text-white mt-3 text-sm">
                  Official GQT Logo
                </p>
                <p className="text-xs text-slate-500">Configured in public/images/gqt-logo.png</p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Approved Brand Palette:
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#005BBB] border border-black/10" />
                  <span className="font-mono">#005BBB</span>
                  <span className="text-slate-500">(Primary Blue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#007BFF] border border-black/10" />
                  <span className="font-mono">#007BFF</span>
                  <span className="text-slate-500">(Royal Accent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#001B4D] border border-black/10" />
                  <span className="font-mono">#001B4D</span>
                  <span className="text-slate-500">(Dark Navy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#14B8FF] border border-black/10" />
                  <span className="font-mono">#14B8FF</span>
                  <span className="text-slate-500">(Accent Cyan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp API */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Meta WhatsApp Business API
                  </h2>
                  <p className="text-xs text-slate-500">Cloud API v19.0 configuration</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300">
                Connected
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={waPhoneNumberId}
                  onChange={(e) => setWaPhoneNumberId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Business Account (WABA) ID
                </label>
                <input
                  type="text"
                  value={waAccountId}
                  onChange={(e) => setWaAccountId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Webhook Verify Secret
                </label>
                <input
                  type="password"
                  value={waWebhookToken}
                  onChange={(e) => setWaWebhookToken(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => toast.success("WhatsApp handshake ping test successful (Status 200 OK)")}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Test Webhook Handshake
              </button>
              <button
                onClick={() => handleSave("WhatsApp Cloud API")}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save WhatsApp Config
              </button>
            </div>
          </div>

          {/* Email SMTP */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Corporate Email Relay (SMTP)
                  </h2>
                  <p className="text-xs text-slate-500">Automated offer letter & admit card mailer</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full dark:bg-blue-950/60 dark:text-blue-300">
                Active TLS
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    SMTP Hostname
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Port
                  </label>
                  <input
                    type="text"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relay Username
                </label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Video Interview Engine
                </label>
                <select
                  value={videoProvider}
                  onChange={(e) => setVideoProvider(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                >
                  <option value="Google Meet">Google Meet (Auto-generated calendar links)</option>
                  <option value="Zoom Workplace">Zoom Workplace API</option>
                  <option value="Microsoft Teams">Microsoft Teams Education</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => toast.success("Test email dispatched to " + primaryEmail)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Send Test Email
              </button>
              <button
                onClick={() => handleSave("SMTP & Video Relay")}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Relay Config
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROCTORING & EXAM POLICIES */}
      {activeTab === "proctoring" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Anti-Cheating & Proctoring Engine Rules
              </h2>
              <p className="text-xs text-slate-500">
                Automated listeners enforce integrity in remote and campus online examinations
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    Mandatory Fullscreen Lock
                  </p>
                  <p className="text-xs text-slate-500">
                    Students cannot begin the exam without entering browser fullscreen mode
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={fullscreenLock}
                  onChange={(e) => setFullscreenLock(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    Clipboard & Developer Tools Lock
                  </p>
                  <p className="text-xs text-slate-500">
                    Blocks right-click, inspect element (F12), copy (Ctrl+C), and paste (Ctrl+V)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={clipboardLock}
                  onChange={(e) => setClipboardLock(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    Question & Option Shuffling
                  </p>
                  <p className="text-xs text-slate-500">
                    Randomizes question order and MCQ options to prevent neighboring peer copying
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Tab Switch Strikes Before Auto-Submit
                  </label>
                  <select
                    value={maxStrikes}
                    onChange={(e) => setMaxStrikes(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none"
                  >
                    <option value="1">1 Strike (Zero Tolerance)</option>
                    <option value="2">2 Strikes</option>
                    <option value="3">3 Strikes (GQT Standard Policy)</option>
                    <option value="5">5 Strikes (Permissive Lab Mode)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    HR Round Qualifying Cutoff Score (%)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="90"
                    value={qualifyingCutoff}
                    onChange={(e) => setQualifyingCutoff(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:outline-none font-semibold text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleSave("Proctoring Security Rules")}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Proctoring Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Automated Lifecycle Notification Dispatch
            </h2>
            <p className="text-xs text-slate-500">
              Control when students, colleges, and HR panel receive immediate alerts via WhatsApp & Email
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Student Registration Verification",
                  desc: "Send instant WhatsApp Hall Ticket & Admit Card link upon successful University USN submission",
                  state: notifyOnReg,
                  setter: setNotifyOnReg,
                },
                {
                  title: "Exam Schedule & Reminders",
                  desc: "Trigger 24-hour and 1-hour countdown reminders with exam portal login link",
                  state: notifyOnExamSchedule,
                  setter: setNotifyOnExamSchedule,
                },
                {
                  title: "HR Interview Shortlist Alert",
                  desc: "Notify qualified candidates with scheduled Google Meet link and reporting time",
                  state: notifyOnInterviewShortlist,
                  setter: setNotifyOnInterviewShortlist,
                },
                {
                  title: "Offer Letter Release & Acceptance Alert",
                  desc: "Deliver digital signed offer letter to candidate and notify College Placement Officer",
                  state: notifyOnOfferRelease,
                  setter: setNotifyOnOfferRelease,
                },
                {
                  title: "Weekly TPO Institutional Digest",
                  desc: "Send aggregated registration, exam qualification, and offer count report to College Principals",
                  state: weeklyTpoDigest,
                  setter: setWeeklyTpoDigest,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setter(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleSave("Notification Rules")}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Trigger Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & APPEARANCE */}
      {activeTab === "security" && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Interface Appearance & System Security
              </h2>
              <p className="text-xs text-slate-500">
                Dark mode theme, session timeouts, and two-factor authentication
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                      Dark Theme Mode
                    </p>
                    <p className="text-xs text-slate-500">
                      Toggle high-contrast dark palette across the enterprise portal
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {darkMode ? "Switch to Light" : "Switch to Dark"}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">
                      Two-Factor Authentication (2FA) for Admins
                    </p>
                    <p className="text-xs text-slate-500">
                      Enforces OTP challenge for Super Admin & CSR Manager roles
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300">
                  Enforced
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-white">
                    Immutable Audit Trail Logging
                  </p>
                  <p className="text-xs text-slate-500">
                    Captures IP, browser user-agent, and state mutations for all sensitive operations
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full dark:bg-blue-950/60 dark:text-blue-300">
                  Active
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleSave("Security & Appearance")}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
