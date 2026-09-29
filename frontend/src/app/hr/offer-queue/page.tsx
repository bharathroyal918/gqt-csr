"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Building2,
  Briefcase,
  Sparkles,
  Plus,
  Eye,
  FileText,
  Trash2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  XCircle
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import Link from "next/link";
import { toast } from "sonner";

export default function HROfferQueuePage() {
  const [offers, setOffers] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewOffer, setPreviewOffer] = useState<OfferLetter | null>(null);

  // Counters
  const pendingCount = offers.filter((o) => o.status === "Draft").length;
  const generatedCount = offers.filter((o) => o.status === "Generated").length;
  const sentCount = offers.filter((o) => o.status === "Sent" || o.status === "Opened" || o.status === "Downloaded").length;
  const acceptedCount = offers.filter((o) => o.status === "Accepted").length;
  const rejectedCount = offers.filter((o) => o.status === "Rejected").length;
  const expiredCount = offers.filter((o) => o.status === "Expired").length;

  const handleSendOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: "Sent",
              deliveryChannel: "Both",
            }
          : o
      )
    );
    toast.success("Offer Letter Dispatched!", {
      description: "Notification pushed to Student Portal, Email, and WhatsApp.",
    });
  };

  const handleCancelOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: "Cancelled",
            }
          : o
      )
    );
    toast.warning("Offer revoked and marked as Cancelled.");
  };

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.studentId.toLowerCase().includes(search.toLowerCase()) ||
      o.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      o.offerNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Employment Letter Automation
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Selection Ingestion
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Recruitment Offer Queue</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Central orchestration hub for generating, digitally signing, dispatching, and monitoring Global Quest Technologies corporate offer letters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/hr/offers/create">
            <Button variant="cyan" className="flex items-center gap-2 shadow-lg text-xs">
              <Plus className="w-3.5 h-3.5" />
              Generate Offer Letter
            </Button>
          </Link>
          <Link href="/hr/offers">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 text-xs">
              All Offers
            </Button>
          </Link>
        </div>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card
          onClick={() => setStatusFilter("all")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/40"
          }`}
        >
          <span className="text-[11px] font-semibold text-muted-foreground block">Total Pipeline</span>
          <p className="text-2xl font-bold text-foreground mt-0.5">{offers.length}</p>
          <span className="text-[10px] text-muted-foreground">All records</span>
        </Card>

        <Card
          onClick={() => setStatusFilter("Draft")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "Draft" ? "ring-2 ring-amber-500 border-amber-500" : "hover:border-amber-400"
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">Draft / Pending</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</p>
          <span className="text-[10px] text-muted-foreground">Needs terms setup</span>
        </Card>

        <Card
          onClick={() => setStatusFilter("Generated")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "Generated" ? "ring-2 ring-blue-500 border-blue-500" : "hover:border-blue-400"
          }`}
        >
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block">Generated</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{generatedCount}</p>
          <span className="text-[10px] text-muted-foreground">Ready to dispatch</span>
        </Card>

        <Card
          onClick={() => setStatusFilter("Sent")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "Sent" ? "ring-2 ring-indigo-500 border-indigo-500" : "hover:border-indigo-400"
          }`}
        >
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">Sent Out</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{sentCount}</p>
          <span className="text-[10px] text-muted-foreground">Awaiting response</span>
        </Card>

        <Card
          onClick={() => setStatusFilter("Accepted")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "Accepted" ? "ring-2 ring-emerald-500 border-emerald-500" : "hover:border-emerald-400"
          }`}
        >
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Accepted</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{acceptedCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Admission ready</span>
        </Card>

        <Card
          onClick={() => setStatusFilter("Rejected")}
          className={`p-3.5 bg-card border rounded-xl cursor-pointer transition-all shadow-sm ${
            statusFilter === "Rejected" ? "ring-2 ring-rose-500 border-rose-500" : "hover:border-rose-400"
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block">Declined / Exp</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{rejectedCount + expiredCount}</p>
          <span className="text-[10px] text-muted-foreground">Archived offers</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-card border border-border shadow-sm rounded-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by candidate name, USN, college, or offer ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </Card>

      {/* Offer Queue Table */}
      <Card className="overflow-hidden border border-border shadow-sm rounded-xl bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                <th className="py-3 px-4 font-semibold">Student Profile</th>
                <th className="py-3 px-4 font-semibold">Offer Reference</th>
                <th className="py-3 px-4 font-semibold">College & Course</th>
                <th className="py-3 px-4 font-semibold">Package (CTC / Stipend)</th>
                <th className="py-3 px-4 font-semibold">Cohort & Joining</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOffers.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  {/* Student */}
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-xs text-foreground">{o.studentName}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{o.studentId}</p>
                  </td>

                  {/* Offer Ref */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-primary">{o.offerNumber}</span>
                    <p className="text-[10px] text-muted-foreground">Issued: {o.offerIssuedDate}</p>
                  </td>

                  {/* College & Course */}
                  <td className="py-3.5 px-4">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{o.collegeName}</p>
                    <p className="text-[11px] text-muted-foreground">{o.course}</p>
                  </td>

                  {/* Package */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-xs text-foreground">{o.ctc}</span>
                    <span className="text-[11px] text-emerald-600 block">{o.stipendDuringInternship}</span>
                  </td>

                  {/* Cohort & Joining */}
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-medium text-foreground">{o.batch}</span>
                    <p className="text-[11px] text-muted-foreground">Join: {o.joiningDate}</p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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

                  {/* Actions */}
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

                      {o.status === "Generated" && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-xs flex items-center gap-1"
                          onClick={() => handleSendOffer(o.id)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send
                        </Button>
                      )}

                      <Link href={`/hr/offers/${o.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Edit
                        </Button>
                      </Link>

                      {o.status !== "Accepted" && o.status !== "Cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-rose-600 hover:bg-rose-50"
                          title="Revoke Offer"
                          onClick={() => handleCancelOffer(o.id)}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
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
          title={`Letter of Intent Document: ${previewOffer.offerNumber}`}
        >
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            <OfferLetterDocument offer={previewOffer} />
          </div>
        </Modal>
      )}
    </div>
  );
}
