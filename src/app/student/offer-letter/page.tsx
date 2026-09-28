"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import {
  Award,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Download,
  Eye,
  Check,
  XCircle,
  Clock,
  ShieldCheck,
  QrCode,
  Sparkles,
  FileText,
  AlertTriangle,
  HelpCircle,
  Printer,
  History
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentOfferLetterPage() {
  const { respondToOffer } = useApp();
  const { student: currentStudent, activeDrive } = useStudentSession();

  const isOfferAvailable = Boolean(
    currentStudent?.offerDetails ||
    currentStudent?.status === "Offer Accepted" ||
    currentStudent?.status === "Offer Sent" ||
    currentStudent?.status === "HR Selected"
  );

  const defaultOffer: OfferLetter = currentStudent?.offerDetails || {
    id: currentStudent?.id ? `off-${currentStudent.id}` : "",
    offerNumber: currentStudent ? `GQT/OFFER/2026/${(currentStudent.studentId || currentStudent.id).slice(-4)}` : "",
    studentId: currentStudent?.id || "",
    studentName: currentStudent?.fullName || "",
    studentEmail: currentStudent?.email || "",
    studentPhone: currentStudent?.mobile || "",
    collegeName: currentStudent?.collegeName || "",
    driveName: activeDrive?.name || currentStudent?.driveName || "",
    roleTitle: "Associate Software Engineer",
    course: currentStudent?.selectedCourse || currentStudent?.branch || "",
    branch: currentStudent?.branch || "",
    batch: currentStudent?.batch || "",
    ctc: "₹ 6.50 LPA",
    stipendDuringInternship: "₹ 18,000 / month",
    location: "Bengaluru, Karnataka",
    joiningDate: "2026-07-01",
    offerIssuedDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    status: (currentStudent?.status === "Offer Accepted"
      ? "Accepted"
      : currentStudent?.status === "Offer Sent" || currentStudent?.status === "HR Selected"
      ? "Sent"
      : "Draft") as OfferLetter["status"],
    qrVerificationCode: currentStudent ? `GQT-VERIFY-2026-${(currentStudent.studentId || currentStudent.id).slice(-4)}` : "",
    digitalSignatureUrl: "/images/signatures/director-signature.png",
  };

  // Primary active offer
  const [offer, setOffer] = useState<OfferLetter>(defaultOffer);

  useEffect(() => {
    if (currentStudent?.offerDetails) {
      setOffer(currentStudent.offerDetails);
    } else if (currentStudent) {
      setOffer(defaultOffer);
    }
  }, [currentStudent]);

  // Modals & form state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Digital Acceptance Checkboxes
  const [acceptCheck1, setAcceptCheck1] = useState(false);
  const [acceptCheck2, setAcceptCheck2] = useState(false);
  const [acceptCheck3, setAcceptCheck3] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rejection state
  const [rejectReason, setRejectReason] = useState("Higher Studies");
  const [rejectRemarks, setRejectRemarks] = useState("");

  // Countdown timer calculations
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [hoursRemaining, setHoursRemaining] = useState(8);

  useEffect(() => {
    if (!offer?.validUntil) return;
    const expiry = new Date(offer.validUntil).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, expiry - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    setDaysRemaining(days);
    setHoursRemaining(hours);
  }, [offer?.validUntil]);

  const allChecksAccepted = acceptCheck1 && acceptCheck2 && acceptCheck3;

  const handleAcceptConfirm = () => {
    if (!allChecksAccepted) {
      toast.error("Please agree to all 3 declaration checkboxes before accepting.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAcceptModalOpen(false);

      const timestamp = new Date().toISOString();
      setOffer((prev) => ({
        ...prev,
        status: "Accepted",
        acceptedAt: timestamp,
        acceptedIp: "106.51.240.18",
        acceptedBrowser: "Chrome 128 / macOS",
        acceptedDevice: "MacBook Pro",
      }));

      if (offer?.id) {
        respondToOffer(offer.id, "accept");
      }

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }

      toast.success("Offer Letter Digitally Accepted!", {
        description: "Official acceptance timestamp & cryptographic telemetry logged.",
      });
    }, 800);
  };

  const handleRejectConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRejectModalOpen(false);

      setOffer((prev) => ({
        ...prev,
        status: "Rejected",
        rejectionReason: rejectReason,
        rejectionRemarks: rejectRemarks,
        rejectedAt: new Date().toISOString(),
      }));

      if (offer?.id) {
        respondToOffer(offer.id, "reject", `${rejectReason}: ${rejectRemarks}`);
      }
      toast.info("Offer decision recorded as declined.");
    }, 600);
  };

  const handleDownload = () => {
    setOffer((prev) => ({
      ...prev,
      status: prev.status === "Sent" ? "Downloaded" : prev.status,
      downloadedAt: new Date().toISOString(),
      downloadsCount: (prev.downloadsCount || 0) + 1,
    }));
    toast.success(`Downloading signed PDF: ${offer.offerNumber}`);
  };

  if (!isOfferAvailable) {
    return (
      <div className="space-y-6 pb-12 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 inline-flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Corporate Selection Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Offer Letter Desk
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100/80 mt-1">
              Official corporate letters of intent are published here upon evaluation completion.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 text-center bg-card border border-border rounded-3xl shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            No Offer Letter Released Yet
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {currentStudent?.fullName ? `${currentStudent.fullName}, your` : "Your"} application is currently in the recruitment evaluation pipeline (Status: <strong className="text-foreground">{currentStudent?.status || "Registered"}</strong>). Once you qualify the technical evaluation and interview rounds, your official Letter of Intent and compensation package will be available for review and digital signature.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link href="/student/dashboard">
              <Button variant="primary" className="text-xs font-bold">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/student/exam">
              <Button variant="outline" className="text-xs font-bold">
                Check Assessment Status
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Corporate Selection Offer Letter
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                offer.status === "Accepted"
                  ? "bg-emerald-500 text-white"
                  : offer.status === "Rejected"
                  ? "bg-red-500 text-white"
                  : "bg-amber-400 text-slate-900"
              }`}
            >
              {offer.status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Congratulations, {offer.studentName}!
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            You have been selected in the Global Quest Technologies CSR Drive. Review terms, preview LOI, and submit digital consent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/student/offer-history">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              Offer History
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Essential Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Offer Status</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
              offer.status === "Accepted"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : offer.status === "Rejected"
                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
            }`}
          >
            {offer.status}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Offer Number</span>
          <p className="text-xs font-mono font-bold text-foreground truncate">{offer.offerNumber}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Training Track</span>
          <p className="text-xs font-bold text-[#005BBB] truncate">{offer.course}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Date of Joining</span>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{offer.joiningDate}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Location</span>
          <p className="text-xs font-semibold text-foreground truncate">{offer.location}</p>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">Expiry Countdown</span>
          {daysRemaining > 0 || hoursRemaining > 0 ? (
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {daysRemaining}d {hoursRemaining}h left
            </p>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">Expired</span>
          )}
        </Card>
      </div>

      {/* Main Details and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Offer Snapshot (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-[#005BBB]" />
              Employment Terms Snapshot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-muted-foreground">Appointed Role:</span>
                <p className="text-sm font-bold text-foreground">{offer.roleTitle}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-muted-foreground">Annual CTC Package:</span>
                <p className="text-sm font-extrabold text-foreground">{offer.ctc}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                <span className="text-muted-foreground">Internship Stipend:</span>
                <p className="text-sm font-bold text-[#005BBB]">{offer.stipendDuringInternship}</p>
              </div>

              {offer.bond ? (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Corporate Service Bond:</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{offer.bond}</p>
                </div>
              ) : null}

              {(offer.trainingCenter || offer.location) ? (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Reporting Center:</span>
                  <p className="text-xs font-semibold text-foreground">{offer.trainingCenter || offer.location}</p>
                </div>
              ) : null}

              {offer.csrSponsorship ? (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">CSR Sponsorship:</span>
                  <p className="text-xs font-semibold text-foreground">{offer.csrSponsorship}</p>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Offer Acceptance Status Card */}
          {offer.status === "Accepted" && (
            <Card className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Offer Acceptance Confirmed
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                You digitally accepted this offer on {offer.acceptedAt ? new Date(offer.acceptedAt).toLocaleString() : "September 24, 2026"}. The admission team has received your confirmation for batch onboarding.
              </p>
            </Card>
          )}

          {offer.status === "Rejected" && (
            <Card className="p-6 bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800 space-y-2">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                Offer Declined
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                You declined this offer. Reason: {offer.rejectionReason} {offer.rejectionRemarks ? `(${offer.rejectionRemarks})` : ""}.
              </p>
            </Card>
          )}
        </div>

        {/* Right Column: Actions (1 col) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Candidate Actions
            </h3>

            <div className="space-y-2.5">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye className="w-4 h-4 text-[#005BBB]" />
                Preview Official LOI (PDF)
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 text-emerald-500" />
                Download Signed PDF
              </Button>

              {offer.status !== "Accepted" && offer.status !== "Rejected" && (
                <>
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 text-xs py-2.5 shadow-md"
                    onClick={() => setIsAcceptModalOpen(true)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Offer Letter
                  </Button>

                  <Button
                    variant="danger"
                    className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
                    onClick={() => setIsRejectModalOpen(true)}
                  >
                    <XCircle className="w-4 h-4" />
                    Decline Offer
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setIsHelpModalOpen(true)}
              >
                <HelpCircle className="w-4 h-4" />
                Need Assistance / Query
              </Button>
            </div>
          </Card>

          {/* Cryptographic Authenticity Card */}
          <Card className="p-5 space-y-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005BBB]" />
              <h4 className="text-xs font-bold text-foreground">Verified Document</h4>
            </div>
            <p className="text-[11px] text-muted-foreground">
              This digital LOI is cryptographically stamped by Director G.R. Narendra Reddy with anti-counterfeit QR code verification.
            </p>
          </Card>
        </div>
      </div>

      {/* Embedded Document Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Official Letter of Intent — ${offer.offerNumber}`}
        >
          <div className="space-y-4">
            <OfferLetterDocument offer={offer} showActions={true} />
          </div>
        </Modal>
      )}

      {/* Offer Acceptance Modal with Required 3 Checkboxes */}
      <Modal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title="Digital Offer Letter Acceptance"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
            <p className="font-bold">Digital Undertaking & Consent</p>
            <p className="mt-1 text-[11px]">
              By accepting below, you confirm your commitment to join Global Quest Technologies on {offer.joiningDate}.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/30">
              <input
                type="checkbox"
                checked={acceptCheck1}
                onChange={(e) => setAcceptCheck1(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#005BBB]"
              />
              <span className="text-xs text-foreground font-medium">
                I accept the offer for the position of <span className="font-bold">{offer.roleTitle}</span>.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/30">
              <input
                type="checkbox"
                checked={acceptCheck2}
                onChange={(e) => setAcceptCheck2(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#005BBB]"
              />
              <span className="text-xs text-foreground font-medium">
                I understand joining conditions, reporting schedule ({offer.joiningDate}{offer.reportingTime ? ` at ${offer.reportingTime}` : ""}), and center location.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border cursor-pointer hover:bg-muted/30">
              <input
                type="checkbox"
                checked={acceptCheck3}
                onChange={(e) => setAcceptCheck3(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#005BBB]"
              />
              <span className="text-xs text-foreground font-medium">
                I agree to the CSR training guidelines and confirm document submission upon reporting.
              </span>
            </label>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Telemetry: Acceptance timestamp, client IP address, and browser will be permanently appended to the audit ledger.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAcceptModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!allChecksAccepted || isSubmitting}
              onClick={handleAcceptConfirm}
            >
              {isSubmitting ? "Logging Consent..." : "Confirm & Sign Offer"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Offer Rejection Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Decline Offer Letter"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Please share the reason for declining this offer. Your feedback is shared confidentially with the HR team.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Primary Reason (Required)</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="Higher Studies">Pursuing Higher Studies (M.Tech / MS / MBA)</option>
              <option value="Other Job">Accepted Another Corporate Job Offer</option>
              <option value="Not Interested">Role / Training Track Mismatch</option>
              <option value="Personal Reason">Personal / Relocation Constraint</option>
              <option value="Other">Other Reasons</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Remarks (Optional)</label>
            <textarea
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              placeholder="Any additional details or comments..."
              rows={3}
              className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsRejectModalOpen(false)}>
              Back
            </Button>
            <Button variant="danger" size="sm" onClick={handleRejectConfirm}>
              Submit Decline Decision
            </Button>
          </div>
        </div>
      </Modal>

      {/* Helpdesk Modal */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="Offer Letter Support & Queries"
      >
        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground">
            Have questions regarding reporting dates, syllabus, batch timings, or center transport?
          </p>
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2">
            <div>
              <span className="font-semibold text-foreground">HR Coordinator:</span> Priya Nair
            </div>
            <div>
              <span className="font-semibold text-foreground">Email:</span> offers@gqtindia.com
            </div>
            <div>
              <span className="font-semibold text-foreground">Helpline:</span> +91 80 4123 4567
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setIsHelpModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
