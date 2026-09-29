"use client";

import React from "react";
import { OfferLetter } from "@/types";
import { ShieldCheck, Award, CheckCircle2, Download, Printer, ExternalLink, Calendar, MapPin, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";
import { downloadLOIPDF } from "@/lib/exportUtils";

interface OfferLetterDocumentProps {
  offer: OfferLetter;
  showActions?: boolean;
}

export function OfferLetterDocument({ offer, showActions = true }: OfferLetterDocumentProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadLOI = () => {
    downloadLOIPDF(offer);
  };

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex items-center justify-between bg-muted/60 p-3 rounded-xl border border-border print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Official GQT Letter of Intent (LOI)</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                offer.status === "Accepted"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : offer.status === "Sent"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {offer.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs flex items-center gap-1.5"
              onClick={handlePrint}
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="text-xs flex items-center gap-1.5"
              onClick={handleDownloadLOI}
            >
              <Download className="w-3.5 h-3.5" />
              Download Official LOI
            </Button>
          </div>
        </div>
      )}

      {/* A4 Document Container */}
      <div className="relative mx-auto max-w-[800px] bg-white text-slate-900 border border-slate-200 shadow-xl rounded-2xl p-8 sm:p-12 overflow-hidden print:border-none print:shadow-none print:m-0 print:p-6 print:max-w-none">
        {/* Subtle Watermark */}
        {offer.watermarkEnabled && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg]">
            <span className="text-7xl sm:text-9xl font-black tracking-widest text-[#001B4D]">
              GLOBAL QUEST
            </span>
          </div>
        )}

        {/* Header with GQT Branding */}
        <div className="border-b-2 border-[#005BBB] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#001B4D] via-[#003366] to-[#005BBB] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                GQT
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#001B4D]">
                  GLOBAL QUEST TECHNOLOGIES
                </h1>
                <p className="text-xs font-semibold text-[#005BBB] tracking-wider uppercase">
                  Training • Innovation • Placement Services
                </p>
                <p className="text-[10px] text-slate-500">Corporate Identity No: U72900KA2020PTC138841</p>
              </div>
            </div>
          </div>

          {/* QR Code and Reference */}
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
            <div className="flex items-center justify-end gap-2 mb-1">
              {/* Stylized QR Code Visual */}
              <div className="w-14 h-14 bg-white p-1 border-2 border-slate-800 rounded-lg flex flex-col items-center justify-center shadow-xs">
                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-0.5">
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-400" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-300" />
                  <div className="bg-slate-900" />
                  <div className="bg-slate-400" />
                  <div className="bg-slate-900 rounded-xs" />
                  <div className="bg-slate-400" />
                  <div className="bg-slate-900 rounded-xs" />
                </div>
              </div>
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-700">REF: {offer.offerNumber}</p>
            <p className="text-[10px] text-slate-500">Issued: {offer.offerIssuedDate}</p>
          </div>
        </div>

        {/* Letter Subtitle */}
        <div className="my-6 text-center">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#005BBB] border border-blue-200">
            Letter of Intent (LOI) & Conditional Offer of Admission
          </span>
        </div>

        {/* Candidate & Institution Details */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
            <p className="text-xs text-slate-500">To,</p>
            <p className="text-sm font-bold text-slate-900">{offer.studentName}</p>
            <p className="font-mono text-[11px] text-slate-600">Student ID: {offer.studentId}</p>
            <p className="font-medium text-slate-800">
              Institution: {offer.collegeName} {offer.branch ? `• ${offer.branch}` : ""}
            </p>
            <p className="text-slate-600">Contact: {offer.studentEmail} | {offer.studentPhone}</p>
          </div>

          <p>
            Dear <strong>{offer.studentName}</strong>,
          </p>
          <p>
            Following your distinguished performance in the <strong>{offer.driveName}</strong>, including the online technical assessment and subsequent HR/Technical calibration rounds, we are pleased to issue this formal <strong>Letter of Intent (LOI)</strong> for the position of <strong>{offer.roleTitle}</strong>.
          </p>

          {/* Key Appointment Terms Grid */}
          <div className="my-4 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/80 px-4 py-2 font-bold text-slate-800 text-xs border-b border-slate-200">
              Summary of Appointment & Corporate Sponsorship Terms
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="p-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Role:</span>
                  <span className="font-semibold text-slate-900">{offer.roleTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course Track:</span>
                  <span className="font-semibold text-slate-900">{offer.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cohort / Batch:</span>
                  <span className="font-semibold text-slate-900">{offer.batch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Training Mode:</span>
                  <span className="font-semibold text-slate-900">{offer.trainingMode || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Training Center:</span>
                  <span className="font-semibold text-slate-900 text-right">{offer.trainingCenter || offer.location}</span>
                </div>
              </div>

              <div className="p-3.5 space-y-2 bg-blue-50/30">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full-Time Package (CTC):</span>
                  <span className="font-bold text-[#005BBB] text-sm">{offer.ctc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Internship Stipend:</span>
                  <span className="font-bold text-emerald-700">{offer.stipendDuringInternship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CSR Sponsorship:</span>
                  <span className="font-semibold text-slate-900">{offer.courseFee || "GQT CSR Subsidized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bond Obligation:</span>
                  <span className="font-semibold text-emerald-700">{offer.bond || "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Date & Time:</span>
                  <span className="font-semibold text-slate-900">
                    {offer.joiningDate}{offer.reportingTime ? ` at ${offer.reportingTime}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-slate-600 text-[11px] leading-relaxed">
            <p>
              <strong>1. Code of Conduct & Academic Continuity:</strong> This offer is conditional upon satisfactory completion of your undergraduate degree without active backlogs and compliance with GQT enablement benchmarks.
            </p>
            <p>
              <strong>2. Acceptance Deadline:</strong> This conditional offer is valid until <strong>{offer.validUntil}</strong>. Acceptance must be digitally confirmed via your GQT Student Portal. Unaccepted offers shall expire automatically.
            </p>
            {offer.remarks && (
              <p>
                <strong>3. Special Conditions:</strong> {offer.remarks}
              </p>
            )}
          </div>

          {/* Signatures & Seal Section */}
          <div className="pt-8 border-t border-slate-200 mt-8 flex flex-col sm:flex-row items-end justify-between gap-6">
            <div>
              <div className="w-40 border-b border-slate-400 pb-1 mb-1">
                <p className="font-serif italic font-bold text-slate-800 text-base">{offer.authorizedSignatory || "Authorized Signatory"}</p>
              </div>
              <p className="font-bold text-slate-900 text-xs">
                {offer.authorizedSignatory || "Authorized Signatory"}
              </p>
              <p className="text-[11px] text-slate-500">
                {offer.authorizedDesignation || "Director - CSR"}
              </p>
              <p className="text-[10px] text-slate-400">Global Quest Technologies Pvt. Ltd.</p>
            </div>

            {/* Verification Seal */}
            <div className="text-center sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Cryptographically Signed & Sealed
              </div>
              <p className="text-[10px] text-slate-400 font-mono">HASH: {offer.qrVerificationCode}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
          <p>
            Global Quest Technologies Pvt. Ltd. • Corporate Office: Global Tech Park, Whitefield, Bengaluru - 560066
          </p>
          <p>
            Support: csr-offers@globalquesttech.com | +91 80 4123 4567 | Verify Online: https://csr.globalquesttech.com/verify-offer/{offer.offerNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
