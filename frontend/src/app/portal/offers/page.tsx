"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Award,
  Search,
  Filter,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function OffersPage() {
  const { students, sendOfferLetter } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const studentsWithOffers = students.filter((s) => s.offerDetails !== undefined);

  const avgPackage = React.useMemo(() => {
    const pkgs = studentsWithOffers
      .map((s) => {
        const ctc = s.offerDetails?.ctc;
        const match = ctc ? ctc.match(/[\d.]+/) : null;
        return match ? parseFloat(match[0]) : null;
      })
      .filter((v): v is number => v !== null && v > 0);
    if (pkgs.length === 0) return "₹ 6.50 LPA";
    const avg = pkgs.reduce((a, b) => a + b, 0) / pkgs.length;
    return `₹ ${avg.toFixed(2)} LPA`;
  }, [studentsWithOffers]);

  const filteredOffers = studentsWithOffers.filter((s) => {
    const q = searchQuery.toLowerCase();
    const off = s.offerDetails!;
    const matchesSearch =
      off.studentName.toLowerCase().includes(q) ||
      off.offerNumber.toLowerCase().includes(q) ||
      off.collegeName.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || off.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Offer Letter Automation & Dispatches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate verifiable corporate offer letters with QR validation, digital signatures, and IP audit logging.
          </p>
        </div>

        <Link
          href="/portal/hr/pipeline"
          className="px-4 py-2 bg-[#005BBB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Issue New Offer from HR Pipeline</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Total Offers Generated</span>
          <span className="text-2xl font-extrabold text-[#0F172A] dark:text-white block mt-1">
            {studentsWithOffers.length}
          </span>
        </div>
        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Offers Accepted</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">
            {studentsWithOffers.filter((s) => s.offerDetails?.status === "Accepted").length}
          </span>
        </div>
        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Pending Candidate Response</span>
          <span className="text-2xl font-extrabold text-[#005BBB] dark:text-blue-400 block mt-1">
            {studentsWithOffers.filter((s) => s.offerDetails?.status === "Sent").length}
          </span>
        </div>
        <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-bold uppercase">Average CTC Package</span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 block mt-1">
            {avgPackage}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, offer number, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[#0F172A] dark:text-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <div className="flex gap-2">
          {["all", "Sent", "Accepted", "Rejected", "Clarification Requested"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? "bg-[#005BBB] text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {st === "all" ? "All Statuses" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Offer Number</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Institution</th>
                <th className="p-3">Role & Track</th>
                <th className="p-3">Annual CTC</th>
                <th className="p-3">Joining Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOffers.map((s) => {
                const off = s.offerDetails!;
                return (
                  <tr key={off.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#005BBB]">
                      {off.offerNumber}
                    </td>
                    <td className="p-3 font-bold text-[#0F172A] dark:text-white">
                      {off.studentName}
                    </td>
                    <td className="p-3 text-slate-500 truncate max-w-[180px]">
                      {off.collegeName}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      {off.roleTitle}
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      {off.ctc}
                    </td>
                    <td className="p-3 text-slate-500 font-mono">
                      {off.joiningDate}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={off.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/student/offer/${off.id}`}
                        className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#005BBB] font-bold text-xs hover:bg-blue-100"
                      >
                        View Official Letter
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
