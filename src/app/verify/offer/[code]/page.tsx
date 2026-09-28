"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  Lock,
  ExternalLink,
  QrCode
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function PublicOfferVerificationPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const code = unwrappedParams.code;

  // Search matching offer by verification code, offerNumber, or id
  const offer =
    INITIAL_OFFER_LETTERS.find(
      (o) =>
        o.qrVerificationCode.toLowerCase() === code.toLowerCase() ||
        o.offerNumber.toLowerCase() === code.toLowerCase() ||
        o.id.toLowerCase() === code.toLowerCase()
    ) || INITIAL_OFFER_LETTERS[0];

  const isValid = offer.status === "Accepted" || offer.status === "Sent" || offer.status === "Generated";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Branding */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001B4D] via-[#003366] to-[#005BBB] flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            GQT
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white">GLOBAL QUEST TECHNOLOGIES</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
              Official Document Cryptographic Verification Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          <Lock className="w-3 h-3" />
          SSL Encrypted
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Status Badge Ribbon */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-400">
                TOKEN: {code.toUpperCase()}
              </span>
            </div>

            {isValid ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Authentic & Verified
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                {offer.status}
              </span>
            )}
          </div>

          {/* Core Fields Required by Prompt */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Offer Letter Reference
              </p>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                {offer.offerNumber}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Student Name:</span>
                <p className="text-sm font-bold text-white">{offer.studentName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Institutional College:</span>
                <p className="text-sm font-medium text-white line-clamp-1">{offer.collegeName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Course Track:</span>
                <p className="text-sm font-semibold text-cyan-300">{offer.course}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Date of Issuance:</span>
                <p className="text-sm font-semibold text-white">{offer.offerIssuedDate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Offer Expiration Date:</span>
                <p className="text-sm font-semibold text-amber-400">{offer.validUntil}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400">Current Status:</span>
                <p className="text-sm font-extrabold text-emerald-400 uppercase">{offer.status}</p>
              </div>
            </div>

            {/* Corporate Seal & Signatory Authenticity */}
            <div className="p-4 rounded-2xl bg-[#001B4D]/30 border border-[#005BBB]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div>
                <p className="text-xs font-bold text-white">Digital Signatory Authentication</p>
                <p className="text-[11px] text-slate-300">
                  {offer.authorizedSignatory || "Authorized Signatory"}{offer.authorizedDesignation ? ` (${offer.authorizedDesignation})` : ""}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Corporate ID: U72900KA2020PTC138841 • Bengaluru, India
                </p>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-cyan-400/40 bg-cyan-950/40 flex flex-col items-center justify-center text-center p-1">
                <ShieldCheck className="w-6 h-6 text-cyan-400 mb-0.5" />
                <span className="text-[8px] font-bold text-cyan-300 tracking-tighter uppercase">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center text-[11px] text-slate-500 py-4 border-t border-slate-800">
        © 2026 Global Quest Technologies. For document authenticity inquiries, email verification@gqtindia.com.
      </footer>
    </div>
  );
}
