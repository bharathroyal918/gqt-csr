"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Printer,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Users
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_JOINING_CONFIRMATIONS } from "@/lib/offer/offerData";
import { JoiningConfirmationRecord } from "@/types";
import { toast } from "sonner";

export default function AdmissionConfirmationsPage() {
  const [confirmations, setConfirmations] = useState<JoiningConfirmationRecord[]>(INITIAL_JOINING_CONFIRMATIONS);
  const [search, setSearch] = useState("");
  const [selectedConfirm, setSelectedConfirm] = useState<JoiningConfirmationRecord | null>(null);

  const handleMarkJoined = (id: string, name: string) => {
    setConfirmations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Joined" } : c))
    );
    toast.success(`Candidate ${name} recorded as physically JOINED!`, {
      description: "Smart ID card badge and training portal credentials delivered.",
    });
  };

  const handleDefer = (id: string, name: string) => {
    setConfirmations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Deferred" } : c))
    );
    toast.info(`Joining date deferred for ${name}. Batch coordinator notified.`);
  };

  const filtered = confirmations.filter(
    (c) =>
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      c.offerNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.batchCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admission/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admission Command Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-[#005BBB]" />
            Joining Confirmation & Reporting Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Student emergency contacts, verified reporting schedules, center arrivals, and onboarding slips.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, college, batch code..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="text-xs font-semibold text-muted-foreground">
            Total Reporting: <span className="font-bold text-foreground">{filtered.length} Candidates</span>
          </div>
        </div>
      </Card>

      {/* Confirmations Table */}
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5 font-bold">Student & USN</th>
                <th className="p-3.5 font-bold">Offer Ref</th>
                <th className="p-3.5 font-bold">Assigned Batch</th>
                <th className="p-3.5 font-bold">Reporting Schedule</th>
                <th className="p-3.5 font-bold">Center Location</th>
                <th className="p-3.5 font-bold">Emergency Contact</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.collegeName} ({item.usn})</p>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] font-bold text-[#005BBB]">
                    {item.offerNumber}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {item.batchCode}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{item.reportingDate}</p>
                    <p className="text-[10px] text-muted-foreground">{item.reportingTime} • {item.mode}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-foreground line-clamp-1">{item.location}</p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-foreground">{item.emergencyContact.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{item.emergencyContact.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "Joined"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Deferred"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setSelectedConfirm(item)}
                      >
                        Slip
                      </Button>

                      {item.status !== "Joined" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleMarkJoined(item.id, item.studentName)}
                        >
                          Mark Joined
                        </Button>
                      )}

                      {item.status === "Confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 text-amber-600"
                          onClick={() => handleDefer(item.id, item.studentName)}
                        >
                          Defer
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

      {/* Confirmation Slip Modal */}
      {selectedConfirm && (
        <Modal
          isOpen={!!selectedConfirm}
          onClose={() => setSelectedConfirm(null)}
          title={`Admission Confirmation Slip — ${selectedConfirm.studentName}`}
        >
          <div className="space-y-4">
            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-white text-slate-900 shadow-sm space-y-4">
              <div className="border-b pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-lg text-[#001B4D]">GLOBAL QUEST TECHNOLOGIES</h3>
                  <p className="text-xs text-[#005BBB] font-bold uppercase">Official Admission & Reporting Pass</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-slate-600">
                    PASS #{selectedConfirm.id.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Student Name:</span>
                  <span className="font-bold text-slate-900">{selectedConfirm.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Offer Number:</span>
                  <span className="font-mono font-bold text-[#005BBB]">{selectedConfirm.offerNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">College:</span>
                  <span className="font-medium text-slate-800">{selectedConfirm.collegeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">USN:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedConfirm.usn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assigned Batch:</span>
                  <span className="font-bold text-slate-900">{selectedConfirm.batchCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reporting Date & Time:</span>
                  <span className="font-bold text-emerald-600">
                    {selectedConfirm.reportingDate} at {selectedConfirm.reportingTime}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t text-[11px] text-slate-500">
                Reporting Venue: {selectedConfirm.location}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print Slip
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedConfirm(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
