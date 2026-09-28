"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  Download,
  Eye,
  Send,
  Calendar,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Settings,
  Layers,
  Sparkles,
  ShieldCheck,
  Filter,
  UserCheck,
  ChevronRight,
  TrendingUp,
  FileCheck2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import { INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { toast } from "sonner";

export default function AdminOfferCenterPage() {
  const [offers, setOffers] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [previewOffer, setPreviewOffer] = useState<OfferLetter | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferLetter | null>(null);
  const [newJoiningDate, setNewJoiningDate] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [newBatch, setNewBatch] = useState("");

  // Metrics
  const totalOffers = offers.length;
  const acceptedOffers = offers.filter((o) => o.status === "Accepted").length;
  const sentOffers = offers.filter((o) => o.status === "Sent" || o.status === "Opened" || o.status === "Downloaded").length;
  const pendingOffers = offers.filter((o) => o.status === "Draft" || o.status === "Generated").length;
  const expiredOffers = offers.filter((o) => o.status === "Expired" || o.status === "Rejected").length;
  const acceptanceRate = totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0;

  const filtered = offers.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.offerNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleRevoke = (id: string, name: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Revoked" } : o))
    );
    toast.error(`Offer letter revoked for ${name}`);
  };

  const handleSaveOfferUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    setOffers((prev) =>
      prev.map((o) =>
        o.id === editingOffer.id
          ? {
              ...o,
              joiningDate: newJoiningDate || o.joiningDate,
              validUntil: newValidUntil || o.validUntil,
              batch: newBatch || o.batch,
            }
          : o
      )
    );
    toast.success(`Updated parameters for offer ${editingOffer.offerNumber}`);
    setEditingOffer(null);
  };

  const getStatusBadge = (status: OfferLetter["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "Sent":
      case "Opened":
      case "Downloaded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "Generated":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300";
      case "Rejected":
      case "Cancelled":
      case "Revoked":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Super Admin Offer Lifecycle Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Offer Letter Management Control
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Realtime enterprise telemetry, cryptographic signatures, batch allocations, and policy enforcement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/offer-templates">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Template Engine
            </Button>
          </Link>

          <Link href="/admin/offer-settings">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Policy Settings
            </Button>
          </Link>

          <Link href="/hr/offers/create">
            <Button
              variant="cyan"
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Create LOI
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Generated", value: totalOffers, icon: Award, color: "text-[#005BBB]" },
          { label: "Pending Sent", value: pendingOffers, icon: Clock, color: "text-amber-500" },
          { label: "Dispatched", value: sentOffers, icon: Send, color: "text-blue-500" },
          { label: "Accepted (LOI)", value: acceptedOffers, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Declined / Exp", value: expiredOffers, icon: XCircle, color: "text-red-500" },
          { label: "Acceptance Rate", value: `${acceptanceRate}%`, icon: TrendingUp, color: "text-indigo-500" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground mb-2">
                <span className="text-[11px] font-bold uppercase">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-xl sm:text-2xl font-black text-foreground">{kpi.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, college, offer number..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {["all", "Draft", "Generated", "Sent", "Accepted", "Rejected", "Expired"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-[#005BBB] text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Offers Table */}
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5 font-bold">Offer Reference</th>
                <th className="p-3.5 font-bold">Student Name & College</th>
                <th className="p-3.5 font-bold">Role & Track</th>
                <th className="p-3.5 font-bold">Package (CTC)</th>
                <th className="p-3.5 font-bold">Joining Date</th>
                <th className="p-3.5 font-bold">Expiry</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-foreground">
                    <Link
                      href={`/hr/offers/${item.id}`}
                      className="text-[#005BBB] hover:underline flex items-center gap-1"
                    >
                      {item.offerNumber}
                    </Link>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{item.collegeName}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-foreground">{item.roleTitle}</p>
                    <span className="text-[10px] text-[#005BBB] font-medium">{item.course}</span>
                  </td>
                  <td className="p-3.5 font-bold text-foreground">{item.ctc}</td>
                  <td className="p-3.5 text-muted-foreground">{item.joiningDate}</td>
                  <td className="p-3.5 text-muted-foreground">{item.validUntil}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Preview PDF"
                        onClick={() => setPreviewOffer(item)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Update Terms & Batch"
                        onClick={() => {
                          setEditingOffer(item);
                          setNewJoiningDate(item.joiningDate);
                          setNewValidUntil(item.validUntil);
                          setNewBatch(item.batch);
                        }}
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#005BBB]" />
                      </Button>

                      {item.status !== "Accepted" && item.status !== "Revoked" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Revoke Offer"
                          onClick={() => handleRevoke(item.id, item.studentName)}
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

      {/* PDF Preview Modal */}
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

      {/* Edit Offer Dates / Batch Modal */}
      {editingOffer && (
        <Modal
          isOpen={!!editingOffer}
          onClose={() => setEditingOffer(null)}
          title={`Update Parameters — ${editingOffer.offerNumber}`}
        >
          <form onSubmit={handleSaveOfferUpdates} className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Candidate: <span className="font-bold text-foreground">{editingOffer.studentName}</span> •{" "}
              {editingOffer.collegeName}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tentative Joining Date</label>
              <Input
                type="date"
                value={newJoiningDate}
                onChange={(e) => setNewJoiningDate(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Extend Expiry Date</label>
              <Input
                type="date"
                value={newValidUntil}
                onChange={(e) => setNewValidUntil(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assigned Batch</label>
              <Input
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditingOffer(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
