"use client";

import React from "react";
import { Printer, Download } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Student, CSRDrive } from "@/types";
import { toast } from "sonner";
import { downloadHallTicketPDF } from "@/lib/exportUtils";

interface StudentHallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  activeDrive?: CSRDrive;
  initials: string;
  onRecordDownload: () => Promise<void>;
}

export function StudentHallTicketModal({
  isOpen,
  onClose,
  student,
  activeDrive,
  initials,
  onRecordDownload,
}: StudentHallTicketModalProps) {
  const collegeDisplay = student.collegeName?.trim() || "";
  const driveDisplay = activeDrive?.name || student.driveName || "";
  const academicYearDisplay = activeDrive?.academicYear || "";
  const token = student.studentId || student.id ? `GQT-HT-2026-${(student.studentId || student.id).slice(-4)}` : "GQT-HT";

  const handlePrint = async () => {
    toast.success("Hall Ticket Download Initiated", {
      description: "Recording digital timestamp in Supabase audit vault.",
    });
    await onRecordDownload();
    window.print();
  };

  const handleDownloadTicket = async () => {
    await onRecordDownload();
    downloadHallTicketPDF(student, activeDrive);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Examination Hall Ticket">
      <div className="space-y-4 pt-2">
        {/* Printable Ticket Container */}
        <div id="printable-hall-ticket" className="p-5 border-2 border-primary/30 rounded-2xl bg-background space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-xs">
                GQT
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider">
                  Global Quest Technologies
                </h4>
                <p className="text-[10px] text-muted-foreground">{driveDisplay} ({academicYearDisplay})</p>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              PASS-CONFIRMED
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Photo & QR */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center font-bold text-xl text-foreground">
                {student.photoUrl && student.photoUrl.trim() !== "" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              {/* Digital QR Block */}
              <div className="w-20 h-20 bg-slate-900 text-white rounded-xl p-1.5 flex flex-col items-center justify-center text-center font-mono text-[7px]">
                <span className="text-cyan-400 font-bold">VERIFIED</span>
                <div className="grid grid-cols-4 gap-1 my-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-xs ${i % 2 === 0 ? "bg-white" : "bg-slate-700"}`} />
                  ))}
                </div>
                <span className="text-[6px] truncate max-w-[70px]">{student.usn || student.studentId || ""}</span>
              </div>
            </div>

            {/* Candidate particulars */}
            <div className="space-y-1 text-xs w-full">
              <p><strong className="text-foreground">Candidate:</strong> {student.fullName}</p>
              {student.usn ? (
                <p><strong className="text-foreground">USN:</strong> <span className="font-mono">{student.usn}</span></p>
              ) : null}
              {student.studentId ? (
                <p><strong className="text-foreground">Student ID:</strong> <span className="font-mono">{student.studentId}</span></p>
              ) : null}
              {collegeDisplay ? (
                <p><strong className="text-foreground">College:</strong> {collegeDisplay}</p>
              ) : null}
              {student.selectedCourse ? (
                <p><strong className="text-foreground">Track:</strong> {student.selectedCourse}</p>
              ) : null}
            </div>
          </div>

          <div className="p-3 bg-muted/40 rounded-xl text-[10px] text-muted-foreground space-y-1">
            <p>• Mandatory WebRTC camera and fullscreen monitoring active during evaluation.</p>
            <p>• Any tab switch or window blur registers an automated strike.</p>
            <p>• Verified digital identity token: <strong>{token}</strong></p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Close
          </Button>
          <Button variant="outline" onClick={handleDownloadTicket} className="flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Download Ticket</span>
          </Button>
          <Button variant="primary" onClick={handlePrint} className="flex items-center gap-1.5 cursor-pointer">
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
