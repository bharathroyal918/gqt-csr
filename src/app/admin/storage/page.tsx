"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { StorageBucketStat, StorageFileItem } from "@/types";
import {
  HardDrive,
  FolderLock,
  Download,
  Trash2,
  Eye,
  Search,
  Upload,
  FileText,
  Image,
  Music,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminStoragePage() {
  const buckets = AdminService.getStorageBuckets();
  const [selectedBucket, setSelectedBucket] = useState<string>("all");
  const [files, setFiles] = useState<StorageFileItem[]>(() =>
    AdminService.getStorageFiles()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<StorageFileItem | null>(null);

  const filteredFiles = files.filter((f) => {
    const matchBucket = selectedBucket === "all" || f.bucket === selectedBucket;
    const matchSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.bucket.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBucket && matchSearch;
  });

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("File deleted from Supabase Storage bucket");
  };

  const handleDownloadFile = (file: StorageFileItem) => {
    toast.success(`Downloading ${file.name}`, {
      description: `Size: ${file.size} • Signed URL generated.`,
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("image")) return <Image className="w-4 h-4 text-purple-600" />;
    if (mimeType.includes("audio")) return <Music className="w-4 h-4 text-amber-600" />;
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              S3-Compatible Object Store
            </span>
            <span className="text-xs text-blue-200">Supabase Storage Private & Public Buckets</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Storage Management & File Explorer
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Audit candidate resumes, signed LOIs, question bank assets, institutional MoUs, call audio recordings, and generate cryptographic signed URLs.
          </p>
        </div>

        <button
          onClick={() => toast.info("Drag and drop files into any bucket below")}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Upload className="w-4 h-4 text-[#005BBB]" />
          Upload Assets
        </button>
      </div>

      {/* 8 Storage Buckets Carousel / Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-600" />
          Configured Supabase Storage Buckets ({buckets.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {buckets.map((bkt) => {
            const isSelected = selectedBucket === bkt.name;
            return (
              <button
                key={bkt.id}
                onClick={() => setSelectedBucket(isSelected ? "all" : bkt.name)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-50/70 dark:bg-slate-800 border-[#005BBB] ring-2 ring-blue-500/20 shadow-md"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                    {bkt.name}
                  </span>
                  {bkt.isPrivate ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      <Unlock className="w-2.5 h-2.5" /> Public
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {bkt.formattedSize}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {bkt.filesCount.toLocaleString()} files
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {bkt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* File Explorer Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-blue-600" />
              File Explorer ({filteredFiles.length} Objects)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered by bucket: <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedBucket}</strong>
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search file name, uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3">Bucket</th>
                <th className="py-2.5 px-3 text-right">Size</th>
                <th className="py-2.5 px-3">Uploaded By</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(file.mimeType)}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {file.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-blue-600 dark:text-cyan-400">
                      {file.bucket}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                    {file.size}
                  </td>

                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                    {file.uploadedBy}
                  </td>

                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadFile(file)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile.mimeType)}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {previewFile.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Bucket:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{previewFile.bucket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{previewFile.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MIME Type:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{previewFile.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Uploaded By:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{previewFile.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encrypted URL:</span>
                <span className="font-mono text-[10px] text-blue-600 dark:text-cyan-400 truncate max-w-[220px]">
                  {previewFile.url}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadFile(previewFile)}
                className="px-5 py-2 bg-[#001B4D] hover:bg-[#003366] text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Object
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
