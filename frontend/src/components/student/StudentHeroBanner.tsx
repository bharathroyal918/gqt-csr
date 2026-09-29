"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Sparkles, QrCode, FileCheck, Award } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Student, ExamResult } from "@/types";
import { toast } from "sonner";

interface StudentHeroBannerProps {
  student: Student;
  greeting: string;
  registrationNumber: string;
  profileCompletion: number;
  initials: string;
  examResult: ExamResult | null;
  onEditProfile: () => void;
  onOpenHallTicket: () => void;
  onUploadAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string; error?: string }>;
}

export function StudentHeroBanner({
  student,
  greeting,
  registrationNumber,
  profileCompletion,
  initials,
  examResult,
  onEditProfile,
  onOpenHallTicket,
  onUploadAvatar,
}: StudentHeroBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Processing and updating profile photo...");

    try {
      const res = await onUploadAvatar(file);
      if (res.success) {
        toast.success("Profile avatar updated successfully!", {
          id: toastId,
          description: "Synced across all CSR portals.",
        });
      } else {
        toast.error(res.error || "Failed to upload avatar.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const collegeDisplay = student.collegeName?.trim();
  const branchDisplay = student.branch?.trim();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Avatar and Student Particulars */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Interactive Square Avatar */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-2xl font-black text-white relative">
              {student.photoUrl && student.photoUrl.trim() !== "" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={student.photoUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}

              {/* Upload Hover Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Change Profile Photo"
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>{isUploading ? "Syncing..." : "Change"}</span>
              </button>
            </div>

            {/* Status Verified Checkmark Badge */}
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[11px] text-white font-bold shadow-md"
              title="Verified Student Identity"
            >
              ✓
            </span>
          </div>

          {/* Profile Identity Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {student.passingYear
                  ? `Academic Year ${student.passingYear - 1} – ${student.passingYear}`
                  : student.batch
                  ? `Batch ${student.batch}`
                  : "CSR Recruitment Drive"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {student.status}
              </span>
              <span className="text-white/60 text-xs font-mono">
                ID: {student.studentId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {greeting}{student.fullName ? `, ${student.fullName}` : ""}!
            </h1>

            {(collegeDisplay || branchDisplay) && (
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-light">
                {collegeDisplay && <span>{collegeDisplay}</span>}
                {collegeDisplay && branchDisplay && <span className="mx-2 text-white/50">•</span>}
                {branchDisplay && <span className="text-white font-medium">{branchDisplay}</span>}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-cyan-200 pt-1">
              {student.usn && (
                <span>USN: <strong className="font-mono text-white">{student.usn}</strong></span>
              )}
              {student.usn && registrationNumber && <span>•</span>}
              {registrationNumber && (
                <span>Reg: <strong className="font-mono text-white">{registrationNumber}</strong></span>
              )}
              {student.selectedCourse && (
                <>
                  {(student.usn || registrationNumber) && <span>•</span>}
                  <span className="text-white/90">{student.selectedCourse}</span>
                </>
              )}
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-2 max-w-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-blue-100 font-semibold">
                <span>Profile Completion</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header Action Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={onEditProfile}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Edit Particulars</span>
          </Button>

          <Button
            variant="outline"
            onClick={onOpenHallTicket}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold backdrop-blur-md flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-cyan-300" />
            <span>Hall Ticket</span>
          </Button>

          {examResult ? (
            <Link href="/student/result">
              <Button
                variant="primary"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Scorecard ({examResult.marksObtained}/60)</span>
              </Button>
            </Link>
          ) : (
            <Link href="/student/exam">
              <Button
                variant="cyan"
                className="text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Launch Assessment</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
