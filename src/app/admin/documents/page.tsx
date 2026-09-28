"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  FolderLock,
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  FileCheck2,
  Mic,
  Paperclip,
  Building2,
  Lock,
  FileUp,
  Plus
} from "lucide-react";

interface VaultDocument {
  id: string;
  name: string;
  category: "Resume" | "Offer Letter" | "MOU" | "Approval Letter" | "Call Recording" | "Meeting Attachment" | "Report";
  fileSize: string;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  collegeOrEntity: string;
}

const INITIAL_DOCS: VaultDocument[] = [
  { id: "DOC-001", name: "RVCE_Karnataka_CSR_MoU_2024_2027.pdf", category: "MOU", fileSize: "2.4 MB", mimeType: "application/pdf", uploadedBy: "G.R Narendra Reddy", uploadedAt: "2025-01-15", collegeOrEntity: "R.V. College of Engineering" },
  { id: "DOC-002", name: "BMSCE_Campus_Auditorium_Approval.pdf", category: "Approval Letter", fileSize: "1.1 MB", mimeType: "application/pdf", uploadedBy: "Kiran", uploadedAt: "2025-01-20", collegeOrEntity: "BMS College of Engineering" },
  { id: "DOC-003", name: "Offer_Aditi_Rao_GQT_2025_signed.pdf", category: "Offer Letter", fileSize: "420 KB", mimeType: "application/pdf", uploadedBy: "Hitha, Kusuma", uploadedAt: "2025-02-14", collegeOrEntity: "Aditi S. Rao (1RV21CS014)" },
  { id: "DOC-004", name: "PTO_Briefing_Call_Audio_Recording.mp3", category: "Call Recording", fileSize: "14.8 MB", mimeType: "audio/mpeg", uploadedBy: "Divya.H", uploadedAt: "2025-02-10", collegeOrEntity: "KLE Technological University" },
  { id: "DOC-005", name: "Statewide_Phase1_Executive_Summary.pdf", category: "Report", fileSize: "4.8 MB", mimeType: "application/pdf", uploadedBy: "Super Admin", uploadedAt: "2025-02-12", collegeOrEntity: "Statewide CSR" },
  { id: "DOC-006", name: "Candidate_Resume_Rohan_Gowda.pdf", category: "Resume", fileSize: "310 KB", mimeType: "application/pdf", uploadedBy: "Rohan Gowda", uploadedAt: "2025-02-08", collegeOrEntity: "BMS College of Engineering" },
];

export default function AdminDocumentVaultPage() {
  const [docs, setDocs] = useState<VaultDocument[]>(INITIAL_DOCS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<VaultDocument | null>(null);

  const categories = Array.from(new Set(docs.map((d) => d.category)));

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.collegeOrEntity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleDelete = () => {
    if (deleteConfirmDoc) {
      setDocs((prev) => prev.filter((d) => d.id !== deleteConfirmDoc.id));
      toast.success(`Document "${deleteConfirmDoc.name}" deleted from encrypted vault`);
      setDeleteConfirmDoc(null);
    }
  };

  const handleDownload = (d: VaultDocument) => {
    toast.success(`Securely downloading "${d.name}"`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <FolderLock className="w-3.5 h-3.5" />
              Encrypted Document Repository
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Document Center & Vault
          </h1>
          <p className="text-sm text-muted-foreground">
            Central repository for verified MoUs, student resumes, signed offer letters, call recordings, and official approval notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => toast.info("Select local file to upload into encrypted storage bucket")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <FileUp className="w-4 h-4" /> Upload Document
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name or associated institution/candidate..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Document Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Documents Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Document Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Entity / Institution</th>
                <th className="p-4 text-center">File Size</th>
                <th className="p-4">Uploaded By</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate max-w-sm">{d.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{d.id}</span>
                  </td>
                  <td className="p-4 text-xs">
                    <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      {d.category}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground truncate max-w-xs">
                    {d.collegeOrEntity}
                  </td>
                  <td className="p-4 text-center text-xs font-mono text-muted-foreground">
                    {d.fileSize}
                  </td>
                  <td className="p-4 text-xs text-foreground">
                    {d.uploadedBy}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {d.uploadedAt}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPreviewDoc(d)}
                        title="Preview Document"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(d)}
                        title="Download File"
                        className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmDoc(d)}
                        title="Delete Document (Admin Only)"
                        className="h-8 w-8 p-0 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={`Document Vault: ${previewDoc.name}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="border border-border/80 p-8 rounded-2xl bg-muted/20 min-h-[300px] flex flex-col items-center justify-center text-center space-y-3">
              <FileText className="w-12 h-12 text-primary/60" />
              <div>
                <p className="font-bold text-foreground text-sm">{previewDoc.name}</p>
                <p className="text-muted-foreground">{previewDoc.mimeType} • {previewDoc.fileSize}</p>
              </div>
              <Button size="sm" onClick={() => handleDownload(previewDoc)}>
                Download Encrypted File
              </Button>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewDoc(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDoc && (
        <Modal
          isOpen={!!deleteConfirmDoc}
          onClose={() => setDeleteConfirmDoc(null)}
          title="Super Admin Permanent Deletion"
        >
          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete document <strong className="text-foreground">{deleteConfirmDoc.name}</strong> from cloud storage? This file cannot be recovered.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmDoc(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Deletion
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
