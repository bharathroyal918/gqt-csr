"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Search, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export default function GeneralOfferVerifyLookupPage() {
  const router = useRouter();
  const [token, setToken] = useState("");

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    router.push(`/verify/offer/${encodeURIComponent(token.trim())}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#001B4D] via-[#003366] to-[#005BBB] flex items-center justify-center text-white mx-auto shadow-lg">
          <QrCode className="w-8 h-8 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-xl font-black text-white">GQT Offer Letter Verification</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter the 16-character QR verification hash or LOI reference number to authenticate credentials.
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4">
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g. GQT-VERIFY-2026-STU-001 or GQT/OFFER/2026/001"
            className="text-xs text-center font-mono bg-slate-900 border-slate-700 text-white"
          />

          <Button
            type="submit"
            variant="cyan"
            className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Document Authenticity
          </Button>
        </form>
      </div>
    </div>
  );
}
