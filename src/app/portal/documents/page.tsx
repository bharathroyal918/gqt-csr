"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DocumentItem } from "@/types";
import {
  FolderLock,
  FileText,
  UploadCloud,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { documents, uploadDocument } = useApp();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", "MOU", "Resume", "Offer Letter", "Report", "Certificate"];

  const filteredDocs = documents.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.title.toLowerCase().includes(q) ||
      d.entityName.toLowerCase().includes(q) ||
      d.fileName.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading verified document: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Document Vault & Digital Archives
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized repository for bilateral MoUs, candidate resumes, offer letters, and audit certifications.
          </p>
        </div>

        <button
          onClick={() => toast.info("Drag and drop file upload window opened")}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Category Folders Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === cat
                ? "bg-[#005BBB] text-white shadow-xs"
                : "bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat === "all" ? "All Vault Records" : cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, college, or student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {doc.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v{doc.version}.0</span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#005BBB] dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>

              <h4 className="font-bold text-xs text-[#0F172A] dark:text-white line-clamp-2 leading-snug">
                {doc.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                {doc.entityName}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-0.5">
                <p>Size: <span className="font-semibold text-slate-600 dark:text-slate-300">{doc.fileSize}</span></p>
                <p>Uploaded: <span className="font-semibold">{new Date(doc.uploadedAt).toLocaleDateString()}</span></p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => toast.info(`Previewing ${doc.fileName}...`)}
                className="text-xs font-bold text-slate-500 hover:text-[#005BBB] dark:hover:text-blue-400 flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>

              <button
                onClick={() => handleDownload(doc.fileName)}
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
