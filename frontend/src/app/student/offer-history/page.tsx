"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  ArrowLeft,
  Calendar,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { toast } from "sonner";

export default function StudentOfferHistoryPage() {
  const [offers] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS.slice(0, 3));
  const [previewOffer, setPreviewOffer] = useState<OfferLetter | null>(null);

  const getStatusBadge = (status: OfferLetter["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
      case "Expired":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/student/offer-letter"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Active Offer
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="w-7 h-7 text-[#005BBB]" />
            Candidate Offer Letter History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Complete milestone archive of all Letters of Intent issued across CSR recruitment drives.
          </p>
        </div>
      </div>

      {/* Offers Archive List */}
      <div className="space-y-4">
        {offers.map((off) => (
          <Card key={off.id} className="p-6 transition-all hover:shadow-md border border-border">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {off.offerNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                      off.status
                    )}`}
                  >
                    {off.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{off.roleTitle}</h3>
                <p className="text-xs text-[#005BBB] font-medium">{off.course}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{off.driveName}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOffer(off)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View LOI
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast.success(`Downloading signed PDF: ${off.offerNumber}`)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </div>
            </div>

            {/* Quick Details & Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block">Compensation:</span>
                <span className="font-bold text-foreground">{off.ctc}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Date of Joining:</span>
                <span className="font-bold text-foreground">{off.joiningDate}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Reporting Center:</span>
                <span className="font-medium text-foreground truncate block">{off.trainingCenter || off.location}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Issued Date:</span>
                <span className="font-medium text-foreground">{off.offerIssuedDate}</span>
              </div>
            </div>

            {/* Milestone Trail */}
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-muted-foreground font-semibold">Lifecycle:</span>
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Issued {off.offerIssuedDate}
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Dispatched
              </span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              {off.status === "Accepted" ? (
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Accepted {off.acceptedAt ? new Date(off.acceptedAt).toLocaleDateString() : ""}
                </span>
              ) : off.status === "Rejected" ? (
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold">
                  Declined
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  Under Consideration
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* PDF Modal */}
      {previewOffer && (
        <Modal
          isOpen={!!previewOffer}
          onClose={() => setPreviewOffer(null)}
          title={`Letter of Intent — ${previewOffer.offerNumber}`}
        >
          <div className="space-y-4">
            <OfferLetterDocument offer={previewOffer} showActions={true} />
          </div>
        </Modal>
      )}
    </div>
  );
}
