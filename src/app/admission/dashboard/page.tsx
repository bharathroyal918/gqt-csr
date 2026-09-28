"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Calendar,
  Building2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  XCircle,
  AlertCircle,
  Eye,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { INITIAL_OFFER_LETTERS, INITIAL_BATCHES, INITIAL_ADMISSION_VERIFICATIONS } from "@/lib/offer/offerData";
import { useApp } from "@/context/AppContext";

export default function AdmissionDashboardPage() {
  const { students } = useApp();
  const liveOffers = students.filter((s) => s.offerDetails).map((s) => s.offerDetails!);
  const offers = liveOffers.length > 0 ? liveOffers : INITIAL_OFFER_LETTERS;
  const [batches] = useState(INITIAL_BATCHES);

  // Dynamic Realtime Counters
  const acceptedCount = students.filter((s) => s.status === "Offer Accepted" || s.offerDetails?.status === "Accepted").length;
  const pendingConfirmations = students.filter((s) => s.status === "Offer Sent" || s.offerDetails?.status === "Sent").length;
  const batchPendingCount = students.filter((s) => (s.status.includes("Offer") || s.status.includes("Selected")) && !s.batch).length;
  const joiningTomorrowCount = acceptedCount > 0 ? Math.min(acceptedCount, 2) : 0;
  const joinedCount = acceptedCount;
  const rejectedCount = students.filter((s) => s.offerDetails?.status === "Rejected").length;

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-3xl shadow-xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-200 border border-white/20 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Admission & Onboarding Operations Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Admission Team Command Hub
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80">
            Realtime tracker for student LOI acceptances, document KYC authentications, and training batch seat rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admission/students">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-white border-white/20 hover:bg-white/10 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Accepted Students
            </Button>
          </Link>
          <Link href="/admission/batches">
            <Button
              variant="cyan"
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Allocate Batches
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 Essential KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Accepted Offers", value: acceptedCount, icon: Award, color: "text-emerald-500", href: "/admission/students" },
          { label: "Pending Confirms", value: pendingConfirmations, icon: Clock, color: "text-amber-500", href: "/admission/confirmations" },
          { label: "Batch Allocation", value: batchPendingCount, icon: Layers, color: "text-blue-500", href: "/admission/batches" },
          { label: "Joining Soon", value: joiningTomorrowCount, icon: Calendar, color: "text-indigo-500", href: "/admission/confirmations" },
          { label: "Joined Students", value: joinedCount, icon: CheckCircle2, color: "text-cyan-500", href: "/admission/students" },
          { label: "Declined Offers", value: rejectedCount, icon: XCircle, color: "text-red-500", href: "/admission/students" },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.href}>
              <Card className="p-4 hover:border-[#005BBB] transition-all cursor-pointer h-full flex flex-col justify-between">
                <div className="flex items-center justify-between text-muted-foreground mb-2">
                  <span className="text-[11px] font-bold uppercase">{card.label}</span>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-2xl font-black text-foreground">{card.value}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Grid: Active Batches Occupancy & Recent Accepted Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Accepted Students Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-[#005BBB]" />
              Accepted Candidates Awaiting Onboarding
            </h3>
            <Link
              href="/admission/students"
              className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1"
            >
              View Full Roster <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3.5 font-bold">Student</th>
                    <th className="p-3.5 font-bold">Offer LOI</th>
                    <th className="p-3.5 font-bold">Course Track</th>
                    <th className="p-3.5 font-bold">Assigned Batch</th>
                    <th className="p-3.5 font-bold">KYC Status</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {offers
                    .filter((o) => o.status === "Accepted")
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-foreground">{item.studentName}</p>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{item.collegeName}</p>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] font-bold text-[#005BBB]">
                          {item.offerNumber}
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-foreground">{item.course}</p>
                          <span className="text-[10px] text-muted-foreground">{item.joiningDate}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {item.batch}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Link href="/admission/students">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Batch Capacity Progress (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#005BBB]" />
              Batch Capacity Status
            </h3>
            <Link
              href="/admission/batches"
              className="text-xs font-bold text-[#005BBB] hover:underline"
            >
              All Batches
            </Link>
          </div>

          <div className="space-y-3">
            {batches.map((batch) => {
              const occupancyPct = Math.round((batch.enrolledCount / batch.capacity) * 100);
              return (
                <Card key={batch.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{batch.name}</h4>
                      <p className="text-[10px] font-mono text-[#005BBB]">{batch.batchCode}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        batch.status === "Full"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Seats Filled</span>
                      <span className="font-bold text-foreground">
                        {batch.enrolledCount} / {batch.capacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occupancyPct >= 100
                            ? "bg-red-500"
                            : occupancyPct >= 75
                            ? "bg-amber-500"
                            : "bg-[#005BBB]"
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate">{batch.location}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
