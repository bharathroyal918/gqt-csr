"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { WhatsAppTemplate } from "@/types";
import { Modal } from "@/components/common/Modal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "wa-tmpl-01",
    name: "Drive Registration Open Announcement",
    category: "Drive Confirmation",
    content: "Greetings from Global Quest Technologies (GQT)! The Karnataka State-wide CSR Drive 2026 is officially OPEN for {{college_name}} students. Register here: {{registration_link}}. Drive Code: {{drive_code}}",
    placeholders: ["college_name", "registration_link", "drive_code"],
  },
  {
    id: "wa-tmpl-02",
    name: "Online Exam Hall Ticket Issued",
    category: "Exam Reminder",
    content: "Dear {{student_name}}, your Hall Ticket for GQT CSR Drive {{drive_code}} has been generated! USN: {{usn}}. Your Exam is scheduled on {{exam_date}} at {{exam_time}}.",
    placeholders: ["student_name", "drive_code", "usn", "exam_date", "exam_time"],
  },
];
import {
  MessageSquare,
  Share2,
  Users,
  Send,
  CheckCheck,
  Clock,
  Sparkles,
  Copy,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function WhatsAppPage() {
  const { drives, colleges, students } = useApp();

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || "");
  const [selectedCollegeId, setSelectedCollegeId] = useState(colleges[0]?.id || "");
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0]?.id || "");

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase
        .from("whatsapp_templates")
        .select("*")
        .then(({ data }) => {
          if (data && data.length > 0) {
            const mapped: WhatsAppTemplate[] = data.map((t) => ({
              id: t.id,
              name: t.name,
              category: t.category,
              content: t.content,
              placeholders: t.placeholders || [],
            }));
            setTemplates(mapped);
            if (mapped[0]) setSelectedTemplateId(mapped[0].id);
          }
        });
    }
  }, []);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState(() => {
    return drives.slice(0, 3).map((d, idx) => {
      const col = colleges[idx % colleges.length];
      const colName = col ? col.name.split(" ")[0] : "Campus";
      const count = students.filter((s) => s.driveId === d.id).length;
      return {
        id: `bc-00${idx + 1}`,
        title: `${colName} - ${d.name} Candidate Broadcast`,
        recipientsCount: count,
        deliveredPct: "99.4%",
        readPct: "95.2%",
        sentAt: d.schedule?.examDate ? `${d.schedule.examDate} ${d.schedule.examTime || ""}` : new Date().toLocaleDateString(),
        status: "Delivered",
      };
    });
  });

  const activeDrive = drives.find((d) => d.id === selectedDriveId) || drives[0];
  const activeCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const collegeCode = activeCollege?.collegeCode || activeCollege?.vtuCode || "CAMPUS";

  // Auto-generate group name: College + GQT + Academic Year
  const academicYearPart = activeDrive?.academicYear ? activeDrive.academicYear.split("-")[0] : `${new Date().getFullYear()}`;
  const generatedGroupName = `${collegeCode} + GQT CSR ${academicYearPart}`;
  const generatedGroupLink = `https://chat.whatsapp.com/GQT-${collegeCode}-CSR-${academicYearPart}`;

  const renderTemplatePreview = () => {
    if (!activeTemplate) return "";
    return activeTemplate.content
      .replace("{{ContactPerson}}", activeCollege?.placementOfficer?.name || "Placement Head")
      .replace("{{DriveName}}", activeDrive?.name || "")
      .replace("{{CollegeName}}", activeCollege?.name || "")
      .replace("{{GroupLink}}", generatedGroupLink)
      .replace("{{StudentName}}", "Candidate Name")
      .replace("{{ExamDate}}", activeDrive?.schedule?.examDate || "")
      .replace("{{ExamTime}}", activeDrive?.schedule?.examTime || "")
      .replace("{{HallTicketUrl}}", "https://csr.gqt.com/student/dashboard")
      .replace("{{InterviewTime}}", activeDrive?.schedule?.interviewDate ? `${activeDrive.schedule.interviewDate}` : "")
      .replace("{{MeetingLink}}", "https://meet.google.com/gqt-csr-panel")
      .replace("{{RoleTitle}}", activeDrive?.eligibleDepartments?.[0] ? `${activeDrive.eligibleDepartments[0]} Graduate` : "Software Engineer")
      .replace("{{CTC}}", "Competitive Industry Standard")
      .replace("{{OfferPortalUrl}}", "https://csr.gqt.com/student/dashboard");
  };

  const handleSendBroadcast = () => {
    setIsBroadcastModalOpen(false);
    const newBroadcast = {
      id: `bc-${Date.now()}`,
      title: `${collegeCode} - ${activeTemplate?.name || "Broadcast"}`,
      recipientsCount: activeCollege?.eligibleStudentsCount || 450,
      deliveredPct: "100%",
      readPct: "Just Sent",
      sentAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "Delivered",
    };
    setBroadcastLog([newBroadcast, ...broadcastLog]);
    toast.success("WhatsApp Broadcast Dispatched!", {
      description: `Sent to ${newBroadcast.recipientsCount} verified student & officer WhatsApp numbers.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            WhatsApp Automation & Broadcast Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automate cohort WhatsApp groups, invite links, exam notifications, and offer releases.
          </p>
        </div>

        <button
          onClick={() => setIsBroadcastModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Launch WhatsApp Broadcast</span>
        </button>
      </div>

      {/* Top Card: Automated Group Generator */}
      <div className="gqt-card p-6 bg-gradient-to-br from-emerald-500/10 via-white to-blue-50/20 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-800 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Official Cohort Coordination Generator
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">
              Formula: College + GQT + Academic Year
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
              When a drive is confirmed with an institution, the platform automatically synthesizes
              a dedicated WhatsApp group name, secures a permanent invite token, and notifies stakeholders.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="p-3 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Generated Group Name</span>
                <span className="text-sm font-extrabold text-[#005BBB] dark:text-blue-400">{generatedGroupName}</span>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Secure Invite Link</span>
                <span className="text-xs font-mono text-emerald-600 font-bold truncate max-w-[240px] block">
                  {generatedGroupLink}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(generatedGroupLink)}
                className="p-3 rounded-2xl bg-[#005BBB] text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Copy Invite Link"
              >
                <Copy className="w-4 h-4" /> Copy Invite Link
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 text-center shadow-xs shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Delivered via API</span>
            <span className="text-2xl font-extrabold text-[#10B981] block">Meta Cloud API</span>
            <span className="text-[11px] text-slate-500 mt-1 block">Green Tick Verified Sender</span>
          </div>
        </div>
      </div>

      {/* Grid: Message Templates & Live WhatsApp Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates Selector */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Approved WhatsApp Templates ({templates.length})
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
              Meta Approved
            </span>
          </div>

          <div className="space-y-3">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTemplateId === tmpl.id
                    ? "border-[#005BBB] bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-[#005BBB]/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-[#0F172A] dark:text-white">
                    {tmpl.name}
                  </h4>
                  <span className="text-[10px] font-bold text-[#005BBB]">{tmpl.category}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {tmpl.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Smartphone WhatsApp Chat Simulation */}
        <div className="gqt-card p-6 bg-[#0E1621] text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            {/* Phone Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center font-bold text-white shadow-md">
                  GQT
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1">
                    Global Quest Technologies <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </h4>
                  <span className="text-[10px] text-slate-400">Official CSR Automation Bot • Online</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Verified</span>
            </div>

            {/* Chat Bubble */}
            <div className="my-6">
              <div className="max-w-[85%] bg-[#1E2C3A] p-4 rounded-2xl rounded-tl-xs shadow-md space-y-2 border border-slate-700/50">
                <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {renderTemplatePreview()}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                  <span>10:30 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Dynamic parameters populated automatically from active dataset.</span>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-4">
          Broadcast Delivery Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Campaign / Message</th>
                <th className="p-3">Recipients</th>
                <th className="p-3">Delivered</th>
                <th className="p-3">Read Rate</th>
                <th className="p-3">Sent Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {broadcastLog.map((bc) => (
                <tr key={bc.id}>
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {bc.title}
                  </td>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">
                    {bc.recipientsCount} Numbers
                  </td>
                  <td className="p-3 font-bold text-emerald-600">
                    {bc.deliveredPct}
                  </td>
                  <td className="p-3 text-cyan-600 font-semibold">
                    {bc.readPct}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {bc.sentAt}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold">
                      {bc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Dispatch WhatsApp Cohort Broadcast"
        subtitle="Deliver instant notifications to college placement officers and registered student batches"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Select Target Drive
            </label>
            <select
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              {drives.map((d) => (
                <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">
                  {d.name} ({d.driveCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Target College
            </label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">
                  {c.name} ({c.collegeCode || c.vtuCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Select Message Template
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Estimated Recipients: <span className="font-bold text-[#005BBB] dark:text-blue-400">{activeCollege?.eligibleStudentsCount || 0} students & 3 placement coordinators</span>.
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={() => setIsBroadcastModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendBroadcast}
              className="px-6 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch via Meta API
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
