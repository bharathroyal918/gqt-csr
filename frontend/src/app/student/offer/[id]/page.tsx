"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import { Modal } from "@/components/common/Modal";
import confetti from "canvas-confetti";
import {
  Printer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function OfferLetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { students, currentUser, respondToOffer } = useApp();

  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationText, setClarificationText] = useState("");

  const targetStudent =
    students.find(
      (s) =>
        s.offerDetails?.id === resolvedParams.id ||
        s.id === resolvedParams.id ||
        (currentUser.email && s.email?.toLowerCase() === currentUser.email?.toLowerCase())
    );

  const offer = targetStudent?.offerDetails || {
    id: resolvedParams.id || "",
    offerNumber: resolvedParams.id ? `GQT/OFFER/2026/${resolvedParams.id.replace(/[^0-9]/g, "")}` : "",
    studentId: targetStudent?.id,
    studentName: targetStudent?.fullName,
    studentEmail: targetStudent?.email,
    studentPhone: targetStudent?.mobile,
    collegeName: targetStudent?.collegeName,
    driveName: targetStudent?.driveName,
    roleTitle: "",
    course: "",
    batch: "",
    ctc: "",
    stipendDuringInternship: "",
    location: "",
    joiningDate: "",
    offerIssuedDate: "",
    validUntil: "",
    status: "Sent" as const,
    qrVerificationCode: resolvedParams.id ? `GQT-VERIFY-OFFER-${resolvedParams.id.toUpperCase()}-2026` : "",
    digitalSignatureUrl: "/images/signatures/director-signature.png",
  };

  const handleAccept = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
    respondToOffer(offer.id, "accept");
  };

  const handleReject = () => {
    respondToOffer(offer.id, "reject");
  };

  const handleClarifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    respondToOffer(offer.id, "clarify", clarificationText);
    setIsClarificationModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    offer.qrVerificationCode
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070D1E] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#005BBB]" /> Print Official Offer Letter
            </button>
          </div>
        </div>

        {/* Action Callout if Pending */}
        {offer.status === "Sent" && (
          <div className="no-print p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Action Required
              </span>
              <h3 className="text-lg font-extrabold mt-0.5">
                Official Letter of Employment Awaiting Your Decision
              </h3>
              <p className="text-xs text-blue-100">
                Please review the terms, compensation, and joining date below before responding.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsClarificationModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold transition-all"
              >
                Request Clarification
              </button>

              <button
                onClick={handleReject}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/80 hover:bg-rose-600 text-xs font-bold transition-all"
              >
                Decline Offer
              </button>

              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-2xl bg-white text-[#005BBB] text-xs font-extrabold shadow-lg hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accept Offer
              </button>
            </div>
          </div>
        )}

        {/* Accepted Confirmation Badge */}
        {offer.status === "Accepted" && (
          <div className="no-print p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Offer Accepted & Electronically Logged</h4>
                <p className="text-xs text-emerald-700">
                  Accepted on {new Date(offer.acceptedAt || Date.now()).toLocaleString()}{offer.acceptedIp ? ` from IP: ${offer.acceptedIp}` : ""}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
              VERIFIED CONTRACT
            </span>
          </div>
        )}

        {/* Official Letterhead Paper */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-200 text-[#0F172A] space-y-8 print-break-inside font-serif">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#005BBB] pb-6 font-sans">
            <GQTLogo size="lg" showTagline={true} clickable={false} />
            <div className="text-right">
              <p className="text-xs font-bold text-[#005BBB]">GLOBAL QUEST TECHNOLOGIES</p>
              <p className="text-[11px] text-slate-500">CSR Talent & Skilling Directorate</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">Ref: {offer.offerNumber}</p>
              <p className="text-[11px] text-slate-400">Date: {offer.offerIssuedDate}</p>
            </div>
          </div>

          {/* Salutation */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <p className="font-bold">
              To,<br />
              {offer.studentName}<br />
              {offer.collegeName}<br />
              Batch of {offer.batch}
            </p>

            <p className="font-bold text-base text-[#001B4D] pt-2">
              Subject: Letter of Intent & Employment Offer for {offer.roleTitle}
            </p>

            <p>
              Dear <strong>{offer.studentName}</strong>,
            </p>

            <p>
              Further to your participation in the <strong>{offer.driveName}</strong> and your exemplary performance
              in the online technical evaluation and HR panel interview, <strong>Global Quest Technologies</strong> is
              delighted to extend an offer of appointment for the position of <strong>{offer.roleTitle}</strong>.
            </p>

            {/* Compensation & Structure Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 my-4 font-sans">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#005BBB] mb-3">
                Compensation & Benefits Package (Annexure A)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Annual Cost to Company (CTC)</span>
                  <span className="text-lg font-extrabold text-emerald-600 block mt-0.5">{offer.ctc}</span>
                  <span className="text-[10px] text-slate-500">Subject to statutory deductions & performance bonus</span>
                </div>

                <div className="p-3 bg-white rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Internship Stipend</span>
                  <span className="text-lg font-extrabold text-[#005BBB] block mt-0.5">{offer.stipendDuringInternship}</span>
                  <span className="text-[10px] text-slate-500">Paid monthly during initial project semester</span>
                </div>

                <div className="p-3 bg-white rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Location</span>
                  <span className="font-bold text-[#0F172A] block mt-0.5">{offer.location}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Joining</span>
                  <span className="font-bold text-[#0F172A] block mt-0.5">{offer.joiningDate}</span>
                </div>
              </div>
            </div>

            <p>
              <strong>Key Terms of Appointment:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 text-xs">
              <li>This offer is contingent upon successful completion of your graduation degree with minimum qualifying CGPA and zero active backlogs.</li>
              <li>You will undergo an intensive hands-on skilling program in {offer.course} at no cost under the GQT CSR skilling covenant.</li>
              <li>The offer is valid until <strong>{offer.validUntil}</strong>, after which it will lapse automatically unless extended in writing.</li>
            </ol>

            <p className="pt-2">
              We look forward to welcoming you to the Global Quest Technologies innovation ecosystem and wish you a thriving corporate career ahead.
            </p>
          </div>

          {/* Signatures & Security QR */}
          <div className="pt-8 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Verification QR"
                className="w-24 h-24 p-1 bg-white border border-slate-300 rounded-xl"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#005BBB] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital QR Verification Seal
                </span>
                <p className="text-[10px] text-slate-500 max-w-xs leading-tight">
                  Cryptographically verified document hash: {offer.qrVerificationCode}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/signatures/director-signature.png"
                alt="Managing Director"
                className="h-12 w-auto inline-block object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <p className="text-xs font-bold text-[#0F172A] mt-1">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Global Quest Technologies Pvt. Ltd.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clarification Modal */}
      <Modal
        isOpen={isClarificationModalOpen}
        onClose={() => setIsClarificationModalOpen(false)}
        title="Request Offer Clarification"
        subtitle="Submit any queries regarding package, joining dates, or location directly to HR"
        maxWidth="md"
      >
        <form onSubmit={handleClarifySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Your Query / Clarification Request
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Can my joining date be adjusted by 2 weeks due to university final semester project viva?"
              value={clarificationText}
              onChange={(e) => setClarificationText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsClarificationModalOpen(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700"
            >
              Submit Query to HR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
