"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Bell,
  Mail,
  Smartphone,
  Save,
  Award,
  UploadCloud,
  FileCheck2,
  CheckCircle2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { toast } from "sonner";

export default function AdminOfferSettingsPage() {
  const [expiryDays, setExpiryDays] = useState("15");
  const [remind7Days, setRemind7Days] = useState(true);
  const [remind3Days, setRemind3Days] = useState(true);
  const [remind1Day, setRemind1Day] = useState(true);
  const [remindExpiryDay, setRemindExpiryDay] = useState(true);

  const [signatoryName, setSignatoryName] = useState("G.R. Narendra Reddy");
  const [signatoryRole, setSignatoryRole] = useState("Director - Talent Enablement & CSR");
  const [companyCin, setCompanyCin] = useState("U72900KA2020PTC138841");
  const [verificationHost, setVerificationHost] = useState("https://verify.gqtindia.com/offers");

  const [emailSender, setEmailSender] = useState("offers@gqtindia.com");
  const [whatsappTemplate, setWhatsappTemplate] = useState("gqt_csr_offer_letter_issued_v1");

  const [autoRevokeExpired, setAutoRevokeExpired] = useState(true);
  const [allowExtension, setAllowExtension] = useState(true);

  const handleSave = () => {
    toast.success("Offer Letter System Settings Updated Successfully!", {
      description: "Changes applied across all future generated Letters of Intent.",
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/offers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offer Master
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-[#005BBB]" />
            Enterprise Offer Automation Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure expiration windows, automatic multi-channel reminders, and digital authority seals.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} className="flex items-center gap-1.5 text-xs">
          <Save className="w-3.5 h-3.5" />
          Save Configurations
        </Button>
      </div>

      <div className="space-y-6">
        {/* 1. Expiry & Automated Reminder Schedule */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#005BBB]" />
            1. Expiry Window & Automated Reminder Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Default Offer Validity (Calendar Days)
              </label>
              <Input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Students will have {expiryDays} days from generation to digitally sign or decline.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Expired Offer Action</label>
              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs text-foreground font-medium">Auto-mark as Expired</span>
                <input
                  type="checkbox"
                  checked={autoRevokeExpired}
                  onChange={(e) => setAutoRevokeExpired(e.target.checked)}
                  className="w-4 h-4 accent-[#005BBB]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-foreground block mb-2">
              Automated WhatsApp & Email Reminders
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "7 Days Before Expiry", checked: remind7Days, setChecked: setRemind7Days },
                { label: "3 Days Before Expiry", checked: remind3Days, setChecked: setRemind3Days },
                { label: "1 Day Before Expiry", checked: remind1Day, setChecked: setRemind1Day },
                { label: "On Expiry Day", checked: remindExpiryDay, setChecked: setRemindExpiryDay },
              ].map((rem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
                >
                  <span className="text-xs text-foreground font-medium">{rem.label}</span>
                  <input
                    type="checkbox"
                    checked={rem.checked}
                    onChange={(e) => rem.setChecked(e.target.checked)}
                    className="w-4 h-4 accent-[#005BBB]"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 2. Digital Authority & Signatory */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            2. Digital Authority & Corporate Seal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Authorized Signatory Name</label>
              <Input
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Signatory Designation</label>
              <Input
                value={signatoryRole}
                onChange={(e) => setSignatoryRole(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Corporate Identity Number (CIN)</label>
              <Input
                value={companyCin}
                onChange={(e) => setCompanyCin(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Verification Portal URL</label>
              <Input
                value={verificationHost}
                onChange={(e) => setVerificationHost(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Director's Signature Asset</p>
                <p className="text-[11px] text-muted-foreground">director-signature.png (Stored in Supabase)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => toast.info("Signature upload modal active")}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Change
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Official GQT Corporate Seal</p>
                <p className="text-[11px] text-muted-foreground">gqt-seal.png (Stored in Supabase)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => toast.info("Seal upload modal active")}
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1" />
                Change
              </Button>
            </div>
          </div>
        </Card>

        {/* 3. Communication Channels */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-500" />
            3. Multi-Channel Notification Dispatch
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Outgoing From Email</label>
              <Input
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">WhatsApp Business Template ID</label>
              <Input
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
