"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award,
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Eye,
  CheckCircle2,
  Download,
  Printer,
  RotateCcw,
  XCircle,
  FileText,
  User,
  History,
  AlertCircle,
  Check,
  Smartphone,
  Globe,
  Mail,
  Phone
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ offerId: string }>;
}

export default function OfferDetailsPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const offerId = unwrappedParams.offerId;

  // Find offer from dataset or fallback to first
  const initialOffer =
    INITIAL_OFFER_LETTERS.find((o) => o.id === offerId || o.offerNumber === offerId) ||
    INITIAL_OFFER_LETTERS[0];

  const [offer, setOffer] = useState<OfferLetter>(initialOffer);
  const [activeTab, setActiveTab] = useState<"preview" | "candidate" | "details" | "timeline" | "audit">("preview");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelRemarks, setCancelRemarks] = useState("");

  const handleSend = () => {
    setOffer((prev) => ({
      ...prev,
      status: "Sent",
      deliveryChannel: "Both",
    }));
    toast.success("Offer Letter Dispatched!", {
      description: "Notification delivered to Student Portal, Email, and WhatsApp.",
    });
  };

  const handleResend = () => {
    toast.success("Reminder & Re-dispatch sent successfully!", {
      description: `Notification ping sent to ${offer.studentName} via WhatsApp & Email.`,
    });
  };

  const handleRevokeConfirm = () => {
    setOffer((prev) => ({
      ...prev,
      status: "Revoked",
      remarks: cancelRemarks ? `Revocation Reason: ${cancelRemarks}` : "Revoked by HR administrator.",
    }));
    setIsCancelModalOpen(false);
    toast.warning("Offer Letter has been officially revoked.");
  };

  const getStatusBadge = (status: OfferLetter["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300";
      case "Sent":
      case "Opened":
      case "Downloaded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300";
      case "Generated":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300";
      case "Rejected":
      case "Cancelled":
      case "Revoked":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300";
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link
            href="/hr/offer-queue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offer Queue
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {offer.offerNumber}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                offer.status
              )}`}
            >
              {offer.status}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Student: <span className="font-semibold text-foreground">{offer.studentName}</span> •{" "}
            {offer.collegeName}
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {offer.status === "Generated" || offer.status === "Draft" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSend}
              className="flex items-center gap-1.5 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Offer
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              className="flex items-center gap-1.5 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Resend Ping
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>

          {offer.status !== "Accepted" && offer.status !== "Revoked" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              Revoke
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border overflow-x-auto pb-1">
        {[
          { id: "preview", label: "Letter of Intent (PDF)", icon: FileText },
          { id: "candidate", label: "Student Profile", icon: User },
          { id: "details", label: "Offer & Package Terms", icon: Award },
          { id: "timeline", label: "Realtime Timeline", icon: Clock },
          { id: "audit", label: "Audit & Security Trail", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#005BBB] text-[#005BBB] bg-[#005BBB]/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <OfferLetterDocument offer={offer} showActions={true} />
        </div>
      )}

      {activeTab === "candidate" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-[#005BBB]" />
              Candidate Credentials
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Full Name:</span>
                <span className="font-bold text-foreground">{offer.studentName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email Address:</span>
                <span className="font-mono text-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  {offer.studentEmail}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Phone Number:</span>
                <span className="font-mono text-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  {offer.studentPhone}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">College:</span>
                <span className="font-semibold text-foreground text-right">{offer.collegeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Department / Branch:</span>
                <span className="font-medium text-foreground">{offer.branch || "—"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">CSR Recruitment Drive:</span>
                <span className="font-semibold text-[#005BBB] text-right">{offer.driveName}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Selection Record
            </h3>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                Selected in Final HR Interview
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Recommended by HR Executive: <span className="font-semibold">{offer.hrExecutive || "CSR HR Panel"}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Drive Evaluation:</span>
                <span className="font-bold text-foreground">Verified & Selected</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Training Track:</span>
                <span className="font-bold text-[#005BBB]">{offer.course}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Candidate ID:</span>
                <span className="font-mono text-muted-foreground">{offer.studentId}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "details" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-[#005BBB]" />
              Designation & Reporting
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Appointment Role:</span>
                <span className="font-bold text-foreground">{offer.roleTitle}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Batch Name:</span>
                <span className="font-semibold text-foreground">{offer.batch}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date of Joining:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{offer.joiningDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Reporting Time:</span>
                <span className="font-medium text-foreground">{offer.reportingTime || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Center Location:</span>
                <span className="font-medium text-foreground text-right">{offer.trainingCenter || offer.location}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Delivery Mode:</span>
                <span className="font-medium text-foreground">{offer.trainingMode || "—"}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              Commercial & CSR Terms
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Annual CTC Package:</span>
                <span className="font-extrabold text-foreground text-sm">{offer.ctc}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Monthly Internship Stipend:</span>
                <span className="font-bold text-[#005BBB]">{offer.stipendDuringInternship}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Training Fee:</span>
                <span className="font-semibold text-foreground">{offer.courseFee || "100% CSR Subsidized"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">CSR Sponsoring Body:</span>
                <span className="font-semibold text-foreground">{offer.csrSponsorship || "GQT CSR Foundation"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Service Bond:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{offer.bond || "None"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Offer Valid Until:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{offer.validUntil}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "timeline" && (
        <Card className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#005BBB]" />
            Lifecycle Activity Stream
          </h3>

          <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
            {[
              {
                title: "Offer Generated",
                time: offer.offerIssuedDate || null,
                desc: `LOI reference ${offer.offerNumber} drafted and authorized${offer.authorizedSignatory ? ` by ${offer.authorizedSignatory}` : ""}.`,
                status: "done",
              },
              {
                title: "Dispatched to Candidate",
                time: offer.status !== "Generated" && offer.status !== "Draft" ? (offer.offerIssuedDate || null) : null,
                desc: `Pushed to candidate portal, WhatsApp (${offer.studentPhone}), and email (${offer.studentEmail}).`,
                status: offer.status !== "Generated" && offer.status !== "Draft" ? "done" : "pending",
              },
              {
                title: "Viewed in Student Portal",
                time: offer.openedAt || (offer.status === "Accepted" ? offer.acceptedAt : null),
                desc: "Student opened and previewed the digital appointment letter.",
                status: offer.openedAt || offer.status === "Accepted" ? "done" : "pending",
              },
              {
                title: "Downloaded LOI Document",
                time: offer.downloadedAt || (offer.status === "Accepted" ? offer.acceptedAt : null),
                desc: `Official signed PDF downloaded${offer.downloadsCount ? ` (${offer.downloadsCount} times)` : ""}.`,
                status: offer.downloadedAt || offer.status === "Accepted" ? "done" : "pending",
              },
              {
                title: offer.status === "Accepted" ? "Digitally Accepted" : offer.status === "Rejected" ? "Declined by Student" : "Awaiting Acceptance",
                time: offer.acceptedAt || offer.rejectedAt || null,
                desc:
                  offer.status === "Accepted"
                    ? `Digital declaration accepted${offer.acceptedIp ? ` from IP ${offer.acceptedIp}` : ""}${offer.acceptedBrowser ? ` (${offer.acceptedBrowser})` : ""}.`
                    : offer.status === "Rejected"
                    ? `Offer declined: ${offer.rejectionReason || "Personal reasons"}`
                    : "Student has until expiry date to accept.",
                status: offer.status === "Accepted" ? "done" : offer.status === "Rejected" ? "error" : "pending",
              },
            ].map((event, idx) => (
              <div key={idx} className="relative pl-6">
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center ${
                    event.status === "done"
                      ? "border-emerald-500 text-emerald-500"
                      : event.status === "error"
                      ? "border-red-500 text-red-500"
                      : "border-muted-foreground/30 text-muted-foreground/30"
                  }`}
                >
                  {event.status === "done" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground">{event.title}</h4>
                    {event.time && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {event.time}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "audit" && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#005BBB]" />
            Cryptographic Integrity & Audit Log
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <p className="text-[11px] font-bold text-muted-foreground">QR Verification Hash</p>
              <p className="text-xs font-mono font-bold text-foreground mt-1 break-all">
                {offer.qrVerificationCode || "—"}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <p className="text-[11px] font-bold text-muted-foreground">Authorized Signatory</p>
              <p className="text-xs font-bold text-foreground mt-1">{offer.authorizedSignatory || "—"}</p>
              {offer.authorizedDesignation ? (
                <p className="text-[10px] text-muted-foreground">{offer.authorizedDesignation}</p>
              ) : null}
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <p className="text-[11px] font-bold text-muted-foreground">Delivery Channel</p>
              <p className="text-xs font-bold text-foreground mt-1">{offer.deliveryChannel || "Portal"}</p>
              <p className="text-[10px] text-muted-foreground">Dual authentication verified</p>
            </div>
          </div>

          {offer.acceptedAt && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Digital Acceptance Telemetry
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                <div>
                  <span className="font-semibold">Timestamp:</span> {offer.acceptedAt}
                </div>
                <div>
                  <span className="font-semibold">Client IP:</span> {offer.acceptedIp || "—"}
                </div>
                <div>
                  <span className="font-semibold">Browser & Device:</span> {offer.acceptedBrowser || "—"}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Revoke Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Revoke Offer Letter"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Are you sure you want to revoke offer <span className="font-bold text-foreground">{offer.offerNumber}</span> for{" "}
            <span className="font-bold text-foreground">{offer.studentName}</span>? This action is recorded in the platform audit logs.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Revocation Reason (Required)</label>
            <textarea
              value={cancelRemarks}
              onChange={(e) => setCancelRemarks(e.target.value)}
              placeholder="e.g. Disqualification, academic backlog discrepancy, candidate request..."
              rows={3}
              className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleRevokeConfirm}>
              Confirm Revocation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
