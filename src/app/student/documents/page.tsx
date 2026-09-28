"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { documentService, VaultDocument } from "@/lib/supabase/document.service";
import { activityService } from "@/lib/supabase/activity.service";
import {
  FileText,
  UploadCloud,
  Download,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Image as ImageIcon,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentDocumentsPage() {
  const { student: currentStudent } = useStudentSession();

  const [documentsList, setDocumentsList] = useState<VaultDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<VaultDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<VaultDocument["category"]>("Resume");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load documents for current student
  useEffect(() => {
    setIsLoading(true);
    documentService
      .getStudentDocuments(currentStudent.id)
      .then((docs) => {
        setDocumentsList(docs);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentStudent.id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit. Please upload a compressed document.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${uploadCategory} to secure vault...`);

    try {
      const res = await documentService.uploadStudentDocument(
        currentStudent.id,
        uploadCategory,
        file
      );

      if (res.success && res.document) {
        setDocumentsList((prev) => [res.document!, ...prev]);
        toast.success(`${uploadCategory} uploaded successfully!`, { id: toastId });
        setIsUploadModalOpen(false);

        await activityService.logStudentActivity(
          currentStudent.id,
          currentStudent.fullName,
          "Document Uploaded",
          `Uploaded ${uploadCategory} (${file.name}) to Document Vault.`,
          "document"
        );
      } else {
        toast.error("Upload failed: " + (res.error || "Storage rejected request"), { id: toastId });
      }
    } catch (err: any) {
      toast.error("Upload error: " + err.message, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (docId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your vault?`)) return;

    const success = await documentService.deleteStudentDocument(currentStudent.id, docId);
    if (success) {
      setDocumentsList((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document removed from vault.");
    }
  };

  const filteredDocs = documentsList.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted Supabase Storage Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Student Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
              Store, inspect, and verify your resumes, marksheets, certificates, and identity documents for institutional clearance.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#14B8FF] to-[#007BFF] hover:from-[#007BFF] hover:to-[#005BBB] text-white font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Vault Search & Summary Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold self-end sm:self-center">
          <span>{documentsList.length} Total Documents</span>
          <span>•</span>
          <span className="text-emerald-600">
            {documentsList.filter((d) => d.status === "Verified").length} Verified
          </span>
          <span>•</span>
          <span className="text-amber-600">
            {documentsList.filter((d) => d.status === "Pending").length} Pending
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={`skel-${i}`}
              className="p-6 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center font-bold">
                    {doc.category === "Resume" ? (
                      <FileText className="w-6 h-6" />
                    ) : doc.category === "Photo" ? (
                      <ImageIcon className="w-6 h-6" />
                    ) : (
                      <FileSpreadsheet className="w-6 h-6" />
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      doc.status === "Verified"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : doc.status === "Rejected"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {doc.status === "Verified" && <CheckCircle2 className="w-3 h-3" />}
                    {doc.status === "Pending" && <RefreshCw className="w-3 h-3 animate-spin" />}
                    {doc.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {doc.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{doc.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded on {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setIsPreviewOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#005BBB] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    title="Preview Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(doc.id, doc.fileName)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-[28px] bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-[#005BBB] flex items-center justify-center mx-auto">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Documents Found in Vault
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload your Resume, 10th / 12th marks cards, and degree certificates to complete your HR verification.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold shadow-md hover:bg-[#004494] transition-colors"
          >
            Upload Document Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl relative"
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Upload Supporting Document
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select document category and upload PDF, PNG, or JPG (max 10MB).
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as VaultDocument["category"])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="Resume">Official Resume / CV (PDF)</option>
                <option value="Photo">Passport Photo (JPEG/PNG)</option>
                <option value="Marksheet 10th">10th Standard Marksheet</option>
                <option value="Marksheet 12th">12th / Pre-University Marksheet</option>
                <option value="Degree Marksheet">Degree Semesters Marksheet</option>
                <option value="Aadhaar Card">Aadhaar Card (Govt ID)</option>
                <option value="College ID">Institutional College ID</option>
                <option value="Certificate">Technical Certification / Award</option>
              </select>
            </div>

            {/* Drag & Drop File Input */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#005BBB] dark:hover:border-[#14B8FF] rounded-2xl p-8 text-center cursor-pointer transition-colors space-y-2 bg-slate-50/50 dark:bg-slate-900/40"
            >
              <UploadCloud className="w-8 h-8 text-[#005BBB] mx-auto" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag file here
              </div>
              <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-3xl w-full p-6 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedDoc.fileName}
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedDoc.category} • {selectedDoc.fileSize}
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-[400px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              {selectedDoc.format === "PDF" ? (
                <iframe
                  src={selectedDoc.fileUrl}
                  className="w-full h-full min-h-[500px]"
                  title="Document Preview"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedDoc.fileUrl}
                  alt={selectedDoc.fileName}
                  className="max-h-[500px] object-contain mx-auto"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={selectedDoc.fileUrl}
                download={selectedDoc.fileName}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
