"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Briefcase,
  QrCode,
  Copy,
  Download,
  Share2,
  Calendar,
  MapPin,
  Users,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { DrivePhaseTracker } from "@/components/workflow/DrivePhaseTracker";

export default function DriveDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { drives, students } = useApp();

  const drive = drives.find((d) => d.id === resolvedParams.id);
  if (!drive) return notFound();

  const driveStudents = students.filter(
    (s) => s.driveId === drive.id || s.driveId === drive.driveCode || (!s.driveId)
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Back link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/portal/drives" className="hover:text-[#005BBB] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Drives
          </Link>
          <span>/</span>
          <span className="font-mono text-[#005BBB] font-bold">{drive.driveCode}</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={drive.status} size="md" />
        </div>
      </div>

      {/* Hero Drive Card */}
      <div className="gqt-card p-6 sm:p-8 bg-gradient-to-br from-white to-blue-50/40 dark:from-[#111C3A] dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#005BBB] text-white">
                {drive.category}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                AY {drive.academicYear} • {drive.batch}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {drive.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              {drive.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-[#005BBB]" /> {drive.location} {drive.venue ? `(${drive.venue})` : ""}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#005BBB]" /> Exam Date: {drive.schedule?.examDate || "TBD"} {drive.schedule?.examTime ? `(${drive.schedule.examTime})` : ""}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-[#005BBB]" /> HR Lead: {drive.assignments?.hrLeadName || "Assigned"}
              </span>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex lg:flex-col items-center justify-around gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <div className="text-center">
              <span className="text-2xl font-extrabold text-[#005BBB] dark:text-blue-400 block">
                {(drive.metrics?.registeredStudents ?? (drive.metrics as any)?.registeredCount ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Registrations
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold text-emerald-600 block">
                {(drive.metrics?.acceptedOffers ?? (drive.metrics as any)?.offersAccepted ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Offers Accepted
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 15-Phase CSR Lifecycle Workflow Engine */}
      <DrivePhaseTracker drive={drive} />

      {/* Grid: QR Code Automation Card + Course Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Registration QR Code Card */}
        <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] text-xs font-bold mb-3">
            Official Registration Portal
          </span>
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white mb-2">
            Student Scan-to-Register QR
          </h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">
            Distribute to placement officers, college boards, and WhatsApp groups.
          </p>

          <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-blue-200 shadow-md">
            {drive.automation?.qrCodeUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={drive.automation.qrCodeUrl}
                alt="Drive Registration QR Code"
                className="w-44 h-44 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex flex-col items-center justify-center bg-blue-50/50 rounded-xl text-slate-400">
                <QrCode className="w-16 h-16 text-[#005BBB] mb-2" />
                <span className="text-[10px] font-semibold text-slate-500">QR Code Ready</span>
              </div>
            )}
          </div>

          <div className="mt-4 w-full space-y-2">
            <button
              onClick={() => handleCopy(drive.automation.registrationLink)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-[#005BBB]" />
              Copy Student Registration URL
            </button>

            {drive.automation.whatsappGroupLink && (
              <a
                href={drive.automation.whatsappGroupLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Open WhatsApp Coordination Group
              </a>
            )}
          </div>
        </div>

        {/* Course Configuration & Eligibility Rules */}
        <div className="lg:col-span-2 gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
            Curriculum & Candidate Eligibility Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Courses Included
              </span>
              <ul className="space-y-1">
                {drive.courses.map((crs) => (
                  <li key={crs} className="text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005BBB]" />
                    {crs}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Academic Criteria
              </span>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <p>• Min CGPA: <span className="font-bold text-[#005BBB]">{drive.minCgpa}</span> (or {drive.minPercentage}%)</p>
                <p>• Degrees: {drive.graduationTypes.join(", ")}</p>
                <p>• Semesters: {drive.semesterEligibility.join(", ")}th Sem</p>
                <p>• Backlog Limit: {drive.backlogAllowed ? `Allowed up to ${drive.maxBacklogs}` : "Zero active backlogs"}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Schedule Milestones
              </span>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <p>• Registration: {drive.schedule.regStart} to {drive.schedule.regEnd}</p>
                <p>• Online Assessment: {drive.schedule.examDate} ({drive.schedule.examTime})</p>
                <p>• HR Interview Round: {drive.schedule.interviewDate}</p>
                <p>• Target Joining Date: {drive.schedule.joiningDate}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Automation Flags
              </span>
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <p>• Auto Interview Scheduling: {drive.automation.autoInterviewScheduling ? "Enabled" : "Manual"}</p>
                <p>• WhatsApp Group Generator: {drive.automation.whatsappGroupEnabled ? "Enabled" : "Disabled"}</p>
                <p>• Auto Offer Letter Generation: {drive.automation.autoOfferLetter ? "Enabled" : "Manual"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registered Students Roster Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
              Candidate Roster for this Drive ({driveStudents.length})
            </h3>
            <p className="text-xs text-slate-400">
              Enrolled students across partner engineering colleges & universities
            </p>
          </div>
          <Link
            href="/portal/hr/pipeline"
            className="text-xs font-bold text-[#005BBB] hover:underline"
          >
            Open HR Kanban Pipeline →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">USN</th>
                <th className="p-3">College</th>
                <th className="p-3">Branch</th>
                <th className="p-3">CGPA</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {driveStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                    {s.fullName}
                  </td>
                  <td className="p-3 font-mono text-slate-500 font-semibold">
                    {s.usn}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                    {s.collegeName}
                  </td>
                  <td className="p-3 text-slate-500">
                    {s.branch}
                  </td>
                  <td className="p-3 font-bold text-[#005BBB]">
                    {s.cgpa}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={s.status} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/portal/hr/pipeline"
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] font-bold text-[11px] hover:bg-blue-100"
                    >
                      Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
