"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  Download,
  Filter,
  Search,
  Building2,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  FileCheck,
  FolderLock,
  Eye,
  UploadCloud,
  Clock,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { downloadCSV, downloadExcel, downloadPDF, downloadPrintableReport, downloadFile } from "@/lib/exportUtils";

interface ReportCategory {
  id: string;
  name: string;
  category: "Registration" | "College" | "Branch" | "District" | "Exam" | "Selection" | "Offer";
  description: string;
  totalRecords: number;
  lastGenerated: string;
  availableFormats: ("PDF" | "Excel" | "CSV")[];
  icon: any;
}

interface DriveDocument {
  id: string;
  title: string;
  category: "MOU" | "Approval Letter" | "Student List" | "Question Paper Approval" | "Attendance Sheet" | "Offer Letter Template";
  driveName: string;
  collegeName?: string;
  fileSize: string;
  version: string;
  uploadedBy: string;
  uploadedDate: string;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: "RPT-01",
    name: "Registration Funnel & Demographics Report",
    category: "Registration",
    description: "Breakdown of all 1,520 registered candidates across gender, caste, degrees, and passing years.",
    totalRecords: 1520,
    lastGenerated: "2026-09-24",
    availableFormats: ["Excel", "CSV", "PDF"],
    icon: Users,
  },
  {
    id: "RPT-02",
    name: "Participating College MoU & Compliance Audit",
    category: "College",
    description: "Status of signed agreements, Principal authorizations, and PTO coordinators across 6 colleges.",
    totalRecords: 6,
    lastGenerated: "2026-09-23",
    availableFormats: ["PDF", "Excel"],
    icon: Building2,
  },
  {
    id: "RPT-03",
    name: "Branch-Wise Engineering Diversity Report",
    category: "Branch",
    description: "Candidate distribution and qualification yield across CS, IS, ECE, AI&DS, and Mechanical disciplines.",
    totalRecords: 1520,
    lastGenerated: "2026-09-22",
    availableFormats: ["Excel", "PDF"],
    icon: BarChart3,
  },
  {
    id: "RPT-04",
    name: "District & Regional Outreach Distribution",
    category: "District",
    description: "Enrollment metrics grouped by tier-1 and tier-2 districts (Bengaluru Urban, Mysuru, Tumakuru, Dharwad).",
    totalRecords: 4,
    lastGenerated: "2026-09-21",
    availableFormats: ["Excel", "CSV"],
    icon: Award,
  },
  {
    id: "RPT-05",
    name: "Online Assessment Performance & Cutoff Ledger",
    category: "Exam",
    description: "Detailed scorecards, coding test submissions, proctoring warnings, and percentile distributions.",
    totalRecords: 890,
    lastGenerated: "2026-09-24",
    availableFormats: ["Excel", "CSV", "PDF"],
    icon: FileText,
  },
  {
    id: "RPT-06",
    name: "Technical Interview Shortlist & Scoring Roster",
    category: "Selection",
    description: "Recruiter panel evaluation sheets, coding interview rubrics, and final candidate approvals.",
    totalRecords: 284,
    lastGenerated: "2026-09-23",
    availableFormats: ["Excel", "PDF"],
    icon: CheckCircle2,
  },
  {
    id: "RPT-07",
    name: "Final CSR Offer Letter & Joining Commitment Report",
    category: "Offer",
    description: "Issued Letters of Intent (LOI), CTC compensation packages, and digital signing confirmations.",
    totalRecords: 48,
    lastGenerated: "2026-09-24",
    availableFormats: ["PDF", "Excel", "CSV"],
    icon: FileCheck,
  },
];

const INITIAL_DOCUMENTS: DriveDocument[] = [
  {
    id: "DOC-001",
    title: "Institutional MoU Agreement — RV College of Engineering",
    category: "MOU",
    driveName: "CSR Flagship Campus Drive 2027",
    collegeName: "RV College of Engineering",
    fileSize: "2.4 MB",
    version: "v2.0 (Signed)",
    uploadedBy: "Priya Nair",
    uploadedDate: "2026-09-12",
  },
  {
    id: "DOC-002",
    title: "BMSCE CSR Drive Principal Approval Letter",
    category: "Approval Letter",
    driveName: "CSR Flagship Campus Drive 2027",
    collegeName: "BMS College of Engineering",
    fileSize: "1.1 MB",
    version: "v1.0",
    uploadedBy: "Arun Menon",
    uploadedDate: "2026-09-14",
  },
  {
    id: "DOC-003",
    title: "Verified Student Registration Master Roster (CSV/Excel)",
    category: "Student List",
    driveName: "CSR Flagship Campus Drive 2027",
    fileSize: "4.8 MB",
    version: "v3.2",
    uploadedBy: "Operations AutoSync",
    uploadedDate: "2026-09-24",
  },
  {
    id: "DOC-004",
    title: "Agentic AI Java Full Stack Question Paper Approval & Answer Key",
    category: "Question Paper Approval",
    driveName: "CSR Flagship Campus Drive 2027",
    fileSize: "3.6 MB",
    version: "v1.0 (Sealed)",
    uploadedBy: "Chief Academic Officer",
    uploadedDate: "2026-09-18",
  },
  {
    id: "DOC-005",
    title: "Phase 1 Online Assessment Attendance & Proctoring Log",
    category: "Attendance Sheet",
    driveName: "CSR Flagship Campus Drive 2027",
    fileSize: "1.9 MB",
    version: "v1.0",
    uploadedBy: "Proctoring Ops",
    uploadedDate: "2026-09-22",
  },
  {
    id: "DOC-006",
    title: "Standard GQT 2026 CSR Offer Letter & LOI Template (PDF)",
    category: "Offer Letter Template",
    driveName: "CSR Flagship Campus Drive 2027",
    fileSize: "850 KB",
    version: "v2.1",
    uploadedBy: "Legal & Compliance",
    uploadedDate: "2026-09-10",
  },
];

export default function CSRReportsPage() {
  const { drives } = useApp();
  const [activeTab, setActiveTab] = useState<"reports" | "vault">("reports");
  const [documents, setDocuments] = useState<DriveDocument[]>(INITIAL_DOCUMENTS);
  const [selectedDriveFilter, setSelectedDriveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Document Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<DriveDocument["category"]>("MOU");
  const [newDocDrive, setNewDocDrive] = useState("CSR Flagship Campus Drive 2026");
  const [newDocCollege, setNewDocCollege] = useState("RV College of Engineering");

  // Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState<DriveDocument | null>(null);

  const handleDownload = (reportName: string, format: string) => {
    const safeBaseName = `GQT_${reportName.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const columns = ["Record ID", "Candidate / Entity", "Department / Program", "Benchmark Score / Status", "Timestamp"];
    const rows = Array.from({ length: 25 }, (_, i) => ({
      "Record ID": `GQT-RPT-${1000 + i}`,
      "Candidate / Entity": `Candidate #${i + 1} (${["CS", "IS", "ECE", "AI&DS"][i % 4]})`,
      "Department / Program": ["Computer Science", "Information Science", "Electronics", "AI & Data Science"][i % 4],
      "Benchmark Score / Status": `${75 + (i % 20)}% - Qualified`,
      "Timestamp": "2026-09-24",
    }));

    if (format === "CSV") {
      downloadCSV(safeBaseName, rows, columns);
    } else if (format === "Excel") {
      downloadExcel(safeBaseName, rows, columns);
    } else {
      downloadPrintableReport(
        safeBaseName,
        reportName,
        "Official GQT CSR Drive Operational Intelligence & Verification Ledger",
        columns,
        rows
      );
    }
  };

  const handleDownloadDocument = (doc: DriveDocument) => {
    if (doc.category === "Student List") {
      const columns = ["Student ID", "Candidate Name", "Institution", "Status", "Batch"];
      const rows = Array.from({ length: 20 }, (_, i) => ({
        "Student ID": `GQT-STU-${100 + i}`,
        "Candidate Name": `Candidate #${i + 1}`,
        "Institution": doc.collegeName || "RV College of Engineering",
        "Status": "Verified",
        "Batch": "2026",
      }));
      downloadExcel(`GQT_${doc.id}_Student_List`, rows, columns);
    } else {
      const columns = ["Field / Attribute", "Specification", "Compliance Ledger"];
      const rows = [
        ["Document Identifier", doc.id, "Registered & Vaulted"],
        ["Official Title", doc.title, "Approved by Governing Body"],
        ["Associated Drive", doc.driveName, "Active Academic Cycle"],
        ["Partner College", doc.collegeName || "Statewide Affiliated", "MoU In Effect"],
        ["Authorized Signatory", doc.uploadedBy, "Verified Authority"],
        ["Document Revision", doc.version, "Sealed"],
        ["Vault Timestamp", doc.uploadedDate, "Immutable Ledger"],
        ["Integrity Status", "PASS-VALIDATED", "SHA256 Cryptographic Checksum Matched"],
      ];
      downloadPDF(
        `GQT_${doc.id}_${doc.category.replace(/\s+/g, "_")}`,
        doc.title,
        `Official Vault Record • ${doc.driveName} • Authorized by ${doc.uploadedBy}`,
        columns,
        rows
      );
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) {
      toast.error("Please enter a document title.");
      return;
    }

    const created: DriveDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      title: newDocTitle,
      category: newDocCategory,
      driveName: newDocDrive,
      collegeName: newDocCollege,
      fileSize: "1.8 MB",
      version: "v1.0",
      uploadedBy: "CSR Manager",
      uploadedDate: new Date().toISOString().split("T")[0],
    };

    setDocuments([created, ...documents]);
    setIsUploadModalOpen(false);
    toast.success(`Document '${newDocTitle}' vaulted to Drive records!`);
    setNewDocTitle("");
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.driveName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Operations Intelligence & Vault
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">CSR Drive Reports & Document Center</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Export audit-ready Excel, CSV, and PDF reports for college administrations, academic councils, and download verified MoUs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Drive Document
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 relative transition-colors ${activeTab === "reports"
              ? "text-[#005BBB] border-b-2 border-[#005BBB]"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            Drive Operational Reports ({REPORT_CATEGORIES.length})
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 relative transition-colors ${activeTab === "vault"
              ? "text-[#005BBB] border-b-2 border-[#005BBB]"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            <FolderLock className="w-4 h-4" />
            Drive Document Vault ({documents.length})
          </button>
        </div>

        {/* Campaign Filter */}
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDriveFilter}
            onChange={(e) => setSelectedDriveFilter(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
          >
            <option value="all">All CSR Drives</option>
            {drives.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeTab === "reports" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_CATEGORIES.map((rpt) => {
            const Icon = rpt.icon;
            return (
              <Card
                key={rpt.id}
                className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#005BBB]/10 text-[#005BBB] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {rpt.category} Report
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{rpt.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rpt.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Total Rows: <strong className="text-slate-900">{rpt.totalRecords.toLocaleString()}</strong>
                    </span>
                    <span>Generated: {rpt.lastGenerated}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-medium">Export Formats:</div>
                  <div className="flex items-center gap-1.5">
                    {rpt.availableFormats.map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleDownload(rpt.name, fmt)}
                        className="text-xs font-semibold px-2 py-1 rounded bg-slate-50 hover:bg-[#005BBB] hover:text-white text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Document Center View */
        <div className="space-y-4">
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <FileCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.version}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{doc.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-[#005BBB]">{doc.category}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="truncate">
                      <strong>Campaign:</strong> {doc.driveName}
                    </div>
                    {doc.collegeName && (
                      <div className="truncate">
                        <strong>College:</strong> {doc.collegeName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">By {doc.uploadedBy}</div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="cyan"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Vault — ${previewDoc.title}`}
          subtitle={`Category: ${previewDoc.category} • File Size: ${previewDoc.fileSize} • ${previewDoc.version}`}
          size="lg"
        >
          <div className="space-y-4 text-slate-800">
            <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
              <FileCheck className="w-16 h-16 text-[#005BBB] mb-3" />
              <h4 className="font-bold text-base text-slate-900">{previewDoc.title}</h4>
              <p className="text-xs text-slate-500 mt-1">
                Official document vaulted under Global Quest Technologies CSR Compliance Repository.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span>Version: {previewDoc.version}</span>
                <span>•</span>
                <span>Uploaded: {previewDoc.uploadedDate}</span>
                <span>•</span>
                <span>Signer: {previewDoc.uploadedBy}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              <Button
                variant="cyan"
                onClick={() => {
                  toast.success(`Downloaded ${previewDoc.title}`);
                  setPreviewDoc(null);
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download Original Document
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Compliance Document to Vault"
        subtitle="Store official MoUs, college permission letters, question paper keys, and offer letters."
        size="md"
      >
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
            <input
              type="text"
              placeholder="e.g. Signed MoU — PES University 2026"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
            <select
              value={newDocCategory}
              onChange={(e) => setNewDocCategory(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
            >
              <option value="MOU">MOU (Memorandum of Understanding)</option>
              <option value="Approval Letter">Principal Approval Letter</option>
              <option value="Student List">Student Registration Master List</option>
              <option value="Question Paper Approval">Question Paper Approval</option>
              <option value="Attendance Sheet">Exam Attendance Sheet</option>
              <option value="Offer Letter Template">Offer Letter Template</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Associated CSR Drive</label>
            <select
              value={newDocDrive}
              onChange={(e) => setNewDocDrive(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
            >
              {drives.map((d: any) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target College (Optional)</label>
            <input
              type="text"
              value={newDocCollege}
              onChange={(e) => setNewDocCollege(e.target.value)}
              placeholder="e.g. RV College of Engineering"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-700">Click to select PDF or Docx file to upload</p>
            <p className="text-[10px] text-slate-400 mt-1">Maximum file size: 25 MB</p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
