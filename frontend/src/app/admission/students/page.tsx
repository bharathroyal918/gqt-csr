"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  FileCheck2,
  Layers,
  Award,
  Calendar,
  Building2,
  ArrowLeft,
  Eye,
  Check,
  XCircle,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_OFFER_LETTERS, INITIAL_BATCHES, INITIAL_ADMISSION_VERIFICATIONS } from "@/lib/offer/offerData";
import { OfferLetter, BatchRecord, AdmissionVerificationRecord } from "@/types";
import { toast } from "sonner";

export default function AcceptedStudentsPage() {
  const [offers, setOffers] = useState<OfferLetter[]>(INITIAL_OFFER_LETTERS.filter((o) => o.status === "Accepted"));
  const [batches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [verifications, setVerifications] = useState<AdmissionVerificationRecord[]>(INITIAL_ADMISSION_VERIFICATIONS);
  const [search, setSearch] = useState("");

  // Modals
  const [batchModalStudent, setBatchModalStudent] = useState<OfferLetter | null>(null);
  const [selectedBatchCode, setSelectedBatchCode] = useState("");

  const [verifyModalStudent, setVerifyModalStudent] = useState<OfferLetter | null>(null);
  const [activeVerification, setActiveVerification] = useState<AdmissionVerificationRecord | null>(null);

  const handleOpenBatchModal = (student: OfferLetter) => {
    setBatchModalStudent(student);
    setSelectedBatchCode(batches[0].batchCode);
  };

  const handleSaveBatchAllocation = () => {
    if (!batchModalStudent) return;
    setOffers((prev) =>
      prev.map((o) => (o.id === batchModalStudent.id ? { ...o, batch: selectedBatchCode } : o))
    );
    toast.success("Batch Allocated Successfully!", {
      description: `Student ${batchModalStudent.studentName} assigned to ${selectedBatchCode}.`,
    });
    setBatchModalStudent(null);
  };

  const handleOpenVerifyModal = (student: OfferLetter) => {
    setVerifyModalStudent(student);
    const existing = verifications.find((v) => v.studentId === student.studentId) || {
      id: `av-${Date.now()}`,
      studentId: student.studentId,
      studentName: student.studentName,
      usn: "1RV22CS014",
      collegeName: student.collegeName,
      offerNumber: student.offerNumber,
      overallStatus: "Pending Review",
      documents: [
        { type: "Resume", url: "/doc/resume.pdf", status: "Approved" },
        { type: "Photo", url: "/doc/photo.jpg", status: "Approved" },
        { type: "College ID", url: "/doc/college_id.pdf", status: "Approved" },
        { type: "Aadhaar", url: "/doc/aadhaar.pdf", status: "Approved" },
        { type: "Marks Cards", url: "/doc/marks.pdf", status: "Approved" },
        { type: "Bonafide Certificate", url: "/doc/bonafide.pdf", status: "Approved" },
      ],
    };
    setActiveVerification(existing as AdmissionVerificationRecord);
  };

  const handleToggleDocStatus = (index: number) => {
    if (!activeVerification) return;
    const updatedDocs = [...activeVerification.documents];
    const current = updatedDocs[index].status;
    updatedDocs[index].status = current === "Approved" ? "Rejected" : "Approved";
    setActiveVerification({
      ...activeVerification,
      documents: updatedDocs,
    });
  };

  const handleApproveAllDocs = () => {
    if (!activeVerification) return;
    const allApproved = activeVerification.documents.map((d) => ({
      ...d,
      status: "Approved" as const,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "Admission Officer - Ravi",
    }));
    setActiveVerification({
      ...activeVerification,
      documents: allApproved,
      overallStatus: "Approved",
    });
    toast.success("All candidate KYC documents verified & approved!");
    setVerifyModalStudent(null);
  };

  const handleMarkJoined = (student: OfferLetter) => {
    toast.success(`Candidate ${student.studentName} marked as officially JOINED!`, {
      description: "Onboarding completed. ERP enrollment and LMS access activated.",
    });
  };

  const filtered = offers.filter(
    (o) =>
      o.studentName.toLowerCase().includes(search.toLowerCase()) ||
      o.collegeName.toLowerCase().includes(search.toLowerCase()) ||
      o.offerNumber.toLowerCase().includes(search.toLowerCase())
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
            <UserCheck className="w-7 h-7 text-[#005BBB]" />
            Accepted Students Onboarding Roster
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Candidates who have digitally signed their GQT CSR Letters of Intent. Allocate training batches and verify credentials.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, college, offer number..."
              className="pl-9 text-xs"
            />
          </div>

          <span className="text-xs font-semibold text-muted-foreground">
            Total Accepted: <span className="font-bold text-foreground">{filtered.length} Students</span>
          </span>
        </div>
      </Card>

      {/* Students Table */}
      <Card className="overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3.5 font-bold">Candidate & USN</th>
                <th className="p-3.5 font-bold">Offer Reference</th>
                <th className="p-3.5 font-bold">College & Branch</th>
                <th className="p-3.5 font-bold">Assigned Batch</th>
                <th className="p-3.5 font-bold">Joining Date</th>
                <th className="p-3.5 font-bold">Fee Sponsorship</th>
                <th className="p-3.5 font-bold">KYC Documents</th>
                <th className="p-3.5 font-bold text-right">Admission Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-foreground">{item.studentName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{item.studentId}</p>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#005BBB]">
                    {item.offerNumber}
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-foreground">{item.collegeName}</p>
                    <span className="text-[10px] text-muted-foreground">{item.branch || item.course}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {item.batch}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.joiningDate}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      100% CSR Sponsored
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved (6/6)
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleOpenBatchModal(item)}
                      >
                        <Layers className="w-3 h-3 mr-1 text-[#005BBB]" />
                        Batch
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleOpenVerifyModal(item)}
                      >
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                        KYC
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleMarkJoined(item)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Joined
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Batch Allocation Modal */}
      {batchModalStudent && (
        <Modal
          isOpen={!!batchModalStudent}
          onClose={() => setBatchModalStudent(null)}
          title={`Allocate Batch — ${batchModalStudent.studentName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Assign <span className="font-bold text-foreground">{batchModalStudent.studentName}</span> (Course:{" "}
              <span className="text-[#005BBB] font-bold">{batchModalStudent.course}</span>) to an active training batch.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Select Training Batch</label>
              <div className="space-y-2">
                {batches.map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedBatchCode === b.batchCode
                        ? "border-[#005BBB] bg-[#005BBB]/5 ring-1 ring-[#005BBB]"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="batchSelection"
                        checked={selectedBatchCode === b.batchCode}
                        onChange={() => setSelectedBatchCode(b.batchCode)}
                        className="accent-[#005BBB]"
                      />
                      <div>
                        <p className="text-xs font-bold text-foreground">{b.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {b.location} • Starts: {b.startDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded">
                        {b.enrolledCount}/{b.capacity} Seats
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setBatchModalStudent(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveBatchAllocation}>
                Confirm Allocation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* KYC Document Verification Modal */}
      {verifyModalStudent && activeVerification && (
        <Modal
          isOpen={!!verifyModalStudent}
          onClose={() => setVerifyModalStudent(null)}
          title={`KYC Document Checklist — ${verifyModalStudent.studentName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Review and authenticate statutory admission documents for Offer{" "}
              <span className="font-mono font-bold text-foreground">{verifyModalStudent.offerNumber}</span>.
            </p>

            <div className="space-y-2">
              {activeVerification.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 className="w-4 h-4 text-[#005BBB]" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{doc.type}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                        {doc.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        doc.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => handleToggleDocStatus(idx)}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setVerifyModalStudent(null)}>
                Close
              </Button>
              <Button variant="primary" size="sm" onClick={handleApproveAllDocs}>
                Approve All Documents
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
