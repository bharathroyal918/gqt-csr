"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Building2,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
  Calendar,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Download,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export default function CollegeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { colleges, crmInteractions, students } = useApp();

  const [activeTab, setActiveTab] = useState<"overview" | "leadership" | "mou" | "communications" | "students">("overview");

  const college = colleges.find((c) => c.id === resolvedParams.id);
  if (!college) return notFound();

  const collegeInteractions = crmInteractions.filter((i) => i.collegeId === college.id);
  const collegeCode = college.collegeCode || college.vtuCode || "";
  const collegeStudents = students.filter((s) => s.collegeId === college.id || (collegeCode ? s.collegeName.includes(collegeCode) : false));

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/portal/colleges" className="hover:text-[#005BBB] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Colleges
          </Link>
          <span>/</span>
          <span className="font-mono text-[#005BBB] font-bold">{collegeCode}</span>
        </div>

        <StatusBadge status={college.status} size="md" />
      </div>

      {/* College Institutional Dossier Banner */}
      <div className="gqt-card p-6 sm:p-8 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                COLLEGE CODE: {collegeCode}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                AISHE: {college.aisheCode} • Established {college.establishedYear}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {college.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#005BBB]" /> {college.address}
              </span>
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#005BBB] hover:underline"
              >
                <Globe className="w-3.5 h-3.5" /> Official Website
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold">
                NAAC Accreditation: {college.naacGrade}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold">
                NBA: {college.nbaStatus}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                Type: {college.type} ({college.tier})
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shrink-0">
            <div>
              <span className="text-2xl font-extrabold text-[#005BBB] block">
                {college.studentStrength}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Strength</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-emerald-600 block">
                {college.eligibleStudentsCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Eligible CSR</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-purple-600 block">
                {college.studentsPlaced}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">GQT Placed</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
          {[
            { id: "overview", label: "Overview & Metrics" },
            { id: "leadership", label: "Academic Leadership & POCs" },
            { id: "mou", label: "MoU & Institutional Accords" },
            { id: "communications", label: `Communications (${collegeInteractions.length})` },
            { id: "students", label: `Candidates (${collegeStudents.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`pb-3 transition-colors relative ${
                activeTab === t.id
                  ? "text-[#005BBB] dark:text-blue-400 border-b-2 border-[#005BBB]"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Institutional Summary & Notes
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {college.notes || "Premier autonomous engineering college with high-calibre candidate turnouts."}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Available Branches:</span>
                <span className="font-semibold text-right">{college.branchesAvailable.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Preferred Training Mode:</span>
                <span className="font-semibold text-[#005BBB]">{college.trainingMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Drives Participated:</span>
                <span className="font-semibold">{college.drivesParticipated} State Drives</span>
              </div>
            </div>
          </div>

          <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Key Contact Person Quick Dial
            </h3>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                {college.placementOfficer.name}
              </h4>
              <p className="text-xs text-slate-500">{college.placementOfficer.designation}</p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                <a href={`tel:${college.placementOfficer.mobile}`} className="text-[#005BBB] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {college.placementOfficer.mobile}
                </a>
                <a href={`mailto:${college.placementOfficer.email}`} className="text-[#005BBB] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {college.placementOfficer.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEADERSHIP */}
      {activeTab === "leadership" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placement Officer */}
          <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#005BBB] bg-blue-50 px-2 py-0.5 rounded-full">
              Placement Head (PTO)
            </span>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              {college.placementOfficer.name}
            </h3>
            <p className="text-xs text-slate-500">{college.placementOfficer.designation} • {college.placementOfficer.department}</p>
            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p>• Mobile: <span className="font-bold text-[#0F172A] dark:text-white">{college.placementOfficer.mobile}</span></p>
              <p>• WhatsApp: <span className="font-bold text-emerald-600">{college.placementOfficer.whatsapp}</span></p>
              <p>• Official Email: <span className="font-bold text-[#005BBB]">{college.placementOfficer.email}</span></p>
            </div>
          </div>

          {/* Principal */}
          <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              Institutional Head
            </span>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              {college.principal.name}
            </h3>
            <p className="text-xs text-slate-500">Principal / Vice-Chancellor Secretariat</p>
            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p>• Mobile: <span className="font-bold">{college.principal.mobile}</span></p>
              <p>• Official Email: <span className="font-bold text-[#005BBB]">{college.principal.email}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MOU */}
      {activeTab === "mou" && (
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Bilateral Memorandum of Understanding (MoU)
              </h3>
              <p className="text-xs text-slate-400">
                Formal partnership covenant between Global Quest Technologies & {college.name}
              </p>
            </div>
            <button
              onClick={() => toast.success("Downloading signed MoU duplicate...")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Signed PDF
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
            <FileText className="w-12 h-12 text-[#005BBB] mx-auto mb-3" />
            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
              MoU Document Verified: {college.mouDocumentUrl || "MOU_COLLEGE_GQT_2025.pdf"}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Digitally sealed on {college.mouSignedDate || "2025-06-15"} • Validity: 3 Years (Until 2028)
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COMMUNICATIONS */}
      {activeTab === "communications" && (
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Interaction & Call History
            </h3>
            <Link
              href={`/portal/crm?college=${college.id}`}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#005BBB] text-xs font-bold hover:bg-blue-100 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Log New Communication
            </Link>
          </div>

          <div className="space-y-3">
            {collegeInteractions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No communications logged yet for this college.
              </p>
            ) : (
              collegeInteractions.map((ci) => (
                <div key={ci.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#005BBB]">{ci.type} with {ci.contactPerson}</span>
                    <span className="text-slate-400">{new Date(ci.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{ci.summary}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CANDIDATES */}
      {activeTab === "students" && (
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            Registered Students ({collegeStudents.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">USN</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {collegeStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3 font-bold">{s.fullName}</td>
                    <td className="p-3 font-mono">{s.usn}</td>
                    <td className="p-3">{s.branch}</td>
                    <td className="p-3 font-bold text-[#005BBB]">{s.cgpa}</td>
                    <td className="p-3"><StatusBadge status={s.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
