"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Building2,
  FileCheck2,
  Send,
  Eye,
  Calendar,
  Sparkles,
  FileText
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface OfferLetterItem {
  id: string;
  offerCode: string;
  studentName: string;
  studentId: string;
  college: string;
  role: string;
  ctc: string;
  joiningDate: string;
  location: string;
  batch: string;
  status: "Draft" | "Pending Approval" | "Sent" | "Signed / Accepted";
  generatedDate: string;
  digitalSignatureVerified: boolean;
}

const INITIAL_OFFERS: OfferLetterItem[] = [
  {
    id: "OFF-001",
    offerCode: "GQT/CSR/2026/089",
    studentName: "Rahul Verma",
    studentId: "GQT-2026-STU-8821",
    college: "RV College of Engineering",
    role: "Junior Software Engineer (Agentic AI)",
    ctc: "INR 6.50 LPA",
    joiningDate: "2026-11-01",
    location: "Bengaluru HQ / Hybrid",
    batch: "CSR Batch A-2026",
    status: "Signed / Accepted",
    generatedDate: "2026-09-22",
    digitalSignatureVerified: true,
  },
  {
    id: "OFF-002",
    offerCode: "GQT/CSR/2026/090",
    studentName: "Ananya Hegde",
    studentId: "GQT-2026-STU-8830",
    college: "BMS College of Engineering",
    role: "AI & Full Stack Trainee Engineer",
    ctc: "INR 6.00 LPA",
    joiningDate: "2026-11-01",
    location: "Bengaluru HQ",
    batch: "CSR Batch A-2026",
    status: "Sent",
    generatedDate: "2026-09-23",
    digitalSignatureVerified: false,
  },
  {
    id: "OFF-003",
    offerCode: "GQT/CSR/2026/091",
    studentName: "Siddharth Shetty",
    studentId: "GQT-2026-STU-8835",
    college: "National Institute of Engineering (NIE)",
    role: "Software Development Engineer (SDE-1)",
    ctc: "INR 5.50 LPA",
    joiningDate: "2026-11-15",
    location: "Mysuru Innovation Hub",
    batch: "CSR Batch B-2026",
    status: "Draft",
    generatedDate: "2026-09-24",
    digitalSignatureVerified: false,
  },
];

export default function HROfferLettersPage() {
  const { colleges } = useApp();
  const [offers, setOffers] = useState<OfferLetterItem[]>(INITIAL_OFFERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Prepare Offer Modal State
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newCollege, setNewCollege] = useState("RV College of Engineering");
  const [newRole, setNewRole] = useState("Junior Software Engineer (Agentic AI)");
  const [newCtc, setNewCtc] = useState("INR 6.50 LPA");
  const [newJoiningDate, setNewJoiningDate] = useState("2026-11-01");
  const [newLocation, setNewLocation] = useState("Bengaluru HQ / Hybrid");
  const [newBatch, setNewBatch] = useState("CSR Batch A-2026");
  const [newRemarks, setNewRemarks] = useState("");

  // Preview Offer Modal
  const [previewOffer, setPreviewOffer] = useState<OfferLetterItem | null>(null);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) {
      toast.error("Please enter student name.");
      return;
    }

    const created: OfferLetterItem = {
      id: `OFF-${Date.now().toString().slice(-3)}`,
      offerCode: `GQT/CSR/2026/${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      studentId: newStudentId || `GQT-STU-${Date.now().toString().slice(-4)}`,
      college: newCollege,
      role: newRole,
      ctc: newCtc,
      joiningDate: newJoiningDate,
      location: newLocation,
      batch: newBatch,
      status: "Draft",
      generatedDate: new Date().toISOString().split("T")[0],
      digitalSignatureVerified: false,
    };

    setOffers([created, ...offers]);
    setIsPrepareModalOpen(false);
    toast.success(`Draft Offer Letter created for ${newStudentName}!`);
    setNewStudentName("");
    setNewStudentId("");
  };

  const handleSendOffer = (id: string, name: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Sent" } : o))
    );
    toast.success(`Official LOI dispatched via Email & WhatsApp to ${name}!`);
  };

  const filteredOffers = offers.filter((o) => {
    const matchesSearch =
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.offerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Employment Authorization
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Offer Letter Preparation & Release</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Configure GQT corporate letters of intent, compensation breakdowns, joining dates, and digitally verifiable QR authorization badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsPrepareModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Prepare Offer Letter
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Candidate Name, Offer Code, College..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Offer Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="signed / accepted">Signed / Accepted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Offer Code</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">College</th>
                <th className="py-3 px-3">Designation / Role</th>
                <th className="py-3 px-3 text-center">CTC Package</th>
                <th className="py-3 px-3">Joining Date</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOffers.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {item.offerCode}
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    <div>{item.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.studentId}</div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700">
                    {item.college}
                  </td>

                  <td className="py-3.5 px-3 text-slate-800 font-medium">
                    {item.role}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-emerald-600">
                    {item.ctc}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-mono">
                    {item.joiningDate}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600">
                    {item.location}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Signed / Accepted"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : item.status === "Sent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => setPreviewOffer(item)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Preview
                      </Button>
                      {item.status === "Draft" && (
                        <Button
                          variant="cyan"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={() => handleSendOffer(item.id, item.studentName)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1" />
                          Release
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

      {/* Prepare Offer Modal */}
      <Modal
        isOpen={isPrepareModalOpen}
        onClose={() => setIsPrepareModalOpen(false)}
        title="Prepare Letter of Intent (LOI)"
        subtitle="Specify candidate compensation package, joining location, and cohort batch."
        size="lg"
      >
        <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Candidate Student ID</label>
              <input
                type="text"
                placeholder="e.g. GQT-2026-STU-8821"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliated College</label>
              <select
                value={newCollege}
                onChange={(e) => setNewCollege(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                {colleges.map((col: any) => (
                  <option key={col.id} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Offered Role / Designation</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual CTC Package</label>
              <input
                type="text"
                value={newCtc}
                onChange={(e) => setNewCtc(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-semibold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                value={newJoiningDate}
                onChange={(e) => setNewJoiningDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Joining Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsPrepareModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Save Draft Offer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Offer Modal */}
      {previewOffer && (
        <Modal
          isOpen={!!previewOffer}
          onClose={() => setPreviewOffer(null)}
          title={`Offer Preview — ${previewOffer.offerCode}`}
          subtitle={`Candidate: ${previewOffer.studentName} (${previewOffer.studentId}) • ${previewOffer.college}`}
          size="lg"
        >
          <div className="space-y-4 text-slate-800 text-xs">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-sans shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-[#001B4D]">GLOBAL QUEST TECHNOLOGIES</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    CSR Talent Empowerment Initiative
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-800">{previewOffer.offerCode}</span>
                  <div className="text-[10px] text-slate-400">Date: {previewOffer.generatedDate}</div>
                </div>
              </div>

              <p className="leading-relaxed">
                Dear <strong>{previewOffer.studentName}</strong>,
              </p>
              <p className="leading-relaxed text-slate-700">
                We are pleased to extend this official Letter of Intent for the role of{" "}
                <strong>{previewOffer.role}</strong> at Global Quest Technologies, subsequent to your successful performance in the CSR campus drive at{" "}
                {previewOffer.college}.
              </p>

              <div className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Total Compensation:</span>
                  <p className="font-bold text-emerald-600 text-sm">{previewOffer.ctc}</p>
                </div>
                <div>
                  <span className="text-slate-400">Joining Date:</span>
                  <p className="font-bold text-slate-800 text-sm">{previewOffer.joiningDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Work Location:</span>
                  <p className="font-semibold text-slate-800">{previewOffer.location}</p>
                </div>
                <div>
                  <span className="text-slate-400">Assigned Cohort:</span>
                  <p className="font-semibold text-slate-800">{previewOffer.batch}</p>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>QR Verification Code: GQT-QR-VERIFIED</span>
                <span className="text-emerald-700 font-bold">Authorized Digital Sign-off</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" onClick={() => setPreviewOffer(null)}>
                Close
              </Button>
              <Button
                variant="cyan"
                onClick={() => {
                  toast.success(`Downloaded official PDF for ${previewOffer.offerCode}`);
                  setPreviewOffer(null);
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download Official PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
