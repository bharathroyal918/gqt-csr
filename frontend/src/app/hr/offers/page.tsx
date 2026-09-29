"use client";

import React, { useState } from "react";
import {
  Award,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Send,
  Building2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Printer
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import Link from "next/link";
import { toast } from "sonner";

export default function HROffersPage() {
  const [offers, setOffers] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewOffer, setPreviewOffer] = useState<OfferLetter | null>(null);

  const filtered = offers.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.studentId.toLowerCase().includes(search.toLowerCase()) ||
      o.offerNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.collegeName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
            Employment Contracts & LOI
          </span>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-1">Offers Master Roster</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Directory of corporate Letters of Intent issued across all regional engineering institutions with realtime delivery analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/hr/offers/create">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg text-xs">
              <Plus className="w-3.5 h-3.5" />
              New Offer Letter
            </Button>
          </Link>
          <Link href="/hr/offer-queue">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 text-xs">
              Offer Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by candidate, USN, college, or offer number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs border border-border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Statuses ({offers.length})</option>
              <option value="Draft">Draft</option>
              <option value="Generated">Generated</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Expired">Expired</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => toast.success("Offer roster exported to CSV")}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Offers Table */}
      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Offer Number</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">College & Course</th>
                <th className="py-3 px-4 font-semibold">Compensation (CTC)</th>
                <th className="py-3 px-4 font-semibold">Validity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-primary">{o.offerNumber}</span>
                    <p className="text-[10px] text-muted-foreground">Issued: {o.offerIssuedDate}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-xs text-foreground">{o.studentName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{o.studentId}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{o.collegeName}</p>
                    <p className="text-[11px] text-muted-foreground">{o.course}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-xs text-foreground">{o.ctc}</span>
                    <span className="text-[11px] text-emerald-600 block">{o.stipendDuringInternship}</span>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium text-foreground block">{o.validUntil}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : o.status === "Sent"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : o.status === "Generated"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                          : o.status === "Draft"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => setPreviewOffer(o)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </Button>
                      <Link href={`/hr/offers/${o.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PDF Document Preview Modal */}
      {previewOffer && (
        <Modal
          isOpen={!!previewOffer}
          onClose={() => setPreviewOffer(null)}
          title={`Offer Document Preview: ${previewOffer.offerNumber}`}
        >
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            <OfferLetterDocument offer={previewOffer} />
          </div>
        </Modal>
      )}
    </div>
  );
}
