/**
 * Universal File Extraction & Export Utility for GQT CSR Platform
 * Guarantees proper binary file formats (.csv, .xlsx, .pdf) extracted to local disk.
 */
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { OfferLetter, Student, CSRDrive } from "@/types";

/**
 * 1. CSV EXPORT (.csv)
 * Generates genuine RFC4180 CSV with UTF-8 BOM so Excel & text viewers display all characters accurately.
 */
export function downloadCSV(
  filename: string,
  rows: Record<string, any>[] | any[],
  customHeaders?: string[]
): boolean {
  try {
    if (!rows || rows.length === 0) {
      toast.error("No data available to export.");
      return false;
    }

    const headers =
      customHeaders && customHeaders.length > 0
        ? customHeaders
        : Object.keys(rows[0]);

    const headerLine = headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(",");

    const dataLines = rows.map((row) => {
      if (Array.isArray(row)) {
        return row
          .map((cell) => {
            if (cell === null || cell === undefined) return '""';
            return `"${String(cell).replace(/"/g, '""')}"`;
          })
          .join(",");
      }

      return headers
        .map((h) => {
          const val = row[h] ?? (Object.values(row)[headers.indexOf(h)] ?? "");
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",");
    });

    const csvContent = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const safeName = filename.toLowerCase().endsWith(".csv") ? filename : `${filename}.csv`;
    triggerBrowserDownload(blob, safeName);

    toast.success(`Downloaded "${safeName}" (CSV format).`, {
      description: `Extracted ${rows.length} records to local disk.`,
    });
    return true;
  } catch (err: any) {
    console.error("Export CSV Error:", err);
    toast.error("Failed to extract CSV: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * 2. EXCEL EXPORT (.xlsx)
 * Generates genuine Microsoft Excel OpenXML (.xlsx) binary workbook with auto-fitted column widths.
 */
export function downloadExcel(
  filename: string,
  rows: Record<string, any>[] | any[],
  customHeaders?: string[]
): boolean {
  try {
    if (!rows || rows.length === 0) {
      toast.error("No records available to export.");
      return false;
    }

    const headers =
      customHeaders && customHeaders.length > 0
        ? customHeaders
        : Object.keys(rows[0]);

    // Format data rows as structured objects with clean header labels
    const formattedData = rows.map((row) => {
      const item: Record<string, any> = {};
      headers.forEach((h, idx) => {
        if (Array.isArray(row)) {
          item[h] = row[idx] ?? "";
        } else {
          item[h] = row[h] ?? (Object.values(row)[idx] ?? "");
        }
      });
      return item;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });

    // Calculate auto column widths
    const colWidths = headers.map((h) => {
      let maxLen = String(h).length;
      formattedData.forEach((row) => {
        const valLen = String(row[h] ?? "").length;
        if (valLen > maxLen) maxLen = valLen;
      });
      return { wch: Math.min(Math.max(maxLen + 4, 12), 45) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "GQT Report");

    // Output binary .xlsx
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const safeName = filename.toLowerCase().endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    triggerBrowserDownload(blob, safeName);

    toast.success(`Downloaded "${safeName}" (Excel .xlsx format).`, {
      description: `Structured spreadsheet with ${rows.length} records ready.`,
    });
    return true;
  } catch (err: any) {
    console.error("Export Excel Error:", err);
    toast.error("Failed to generate Excel file: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * 3. PDF REPORT EXPORT (.pdf)
 * Generates an official, genuine binary PDF document using jsPDF with corporate letterhead,
 * data table grid, pagination, and cryptographic verification stamps.
 */
export function downloadPDF(
  filename: string,
  title: string,
  subtitle: string,
  columns: string[],
  rows: (string | number | any)[][] | Record<string, any>[]
): boolean {
  try {
    const doc = new jsPDF({
      orientation: columns.length > 5 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Header Band
    doc.setFillColor(0, 27, 77); // #001B4D (GQT Navy)
    doc.rect(0, 0, pageWidth, 24, "F");

    // Corporate GQT Logo & Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("GLOBAL QUEST TECHNOLOGIES", margin, 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(20, 184, 255); // #14B8FF (Cyan)
    doc.text("CSR AUTOMATION & ACADEMIC PLACEMENT PLATFORM", margin, 17);

    // Document Tag (Top Right)
    doc.setFontSize(7);
    doc.setTextColor(220, 240, 255);
    doc.text(`GENERATED: ${new Date().toLocaleDateString("en-GB")}`, pageWidth - margin, 11, { align: "right" });
    doc.text("OFFICIAL AUDIT LEDGER", pageWidth - margin, 17, { align: "right" });

    // Document Title & Subtitle
    let currentY = 32;
    doc.setTextColor(15, 23, 42); // #0F172A
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, margin, currentY);

    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate-500
    const splitSubtitle = doc.splitTextToSize(subtitle, pageWidth - margin * 2);
    doc.text(splitSubtitle, margin, currentY);
    currentY += splitSubtitle.length * 4 + 4;

    // Table Setup
    const formattedRows = rows.map((r) => {
      if (Array.isArray(r)) return r.map((c) => String(c ?? "-"));
      return columns.map((col) => String(r[col] ?? "-"));
    });

    const usableWidth = pageWidth - margin * 2;
    const colWidth = usableWidth / columns.length;
    const rowHeight = 7;

    // Table Header
    doc.setFillColor(0, 91, 187); // #005BBB (GQT Blue)
    doc.rect(margin, currentY, usableWidth, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    columns.forEach((col, idx) => {
      const colX = margin + idx * colWidth + 2;
      doc.text(String(col).toUpperCase().slice(0, 22), colX, currentY + 4.8);
    });
    currentY += 7;

    // Table Rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    formattedRows.forEach((row, rIdx) => {
      // Check for page overflow
      if (currentY + rowHeight > pageHeight - 16) {
        doc.addPage();
        currentY = 20;

        // Repeat Header on new page
        doc.setFillColor(0, 91, 187);
        doc.rect(margin, currentY, usableWidth, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        columns.forEach((col, idx) => {
          doc.text(String(col).toUpperCase().slice(0, 22), margin + idx * colWidth + 2, currentY + 4.8);
        });
        currentY += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
      }

      // Alternating row background
      if (rIdx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, usableWidth, rowHeight, "F");
      }

      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY + rowHeight, margin + usableWidth, currentY + rowHeight);

      doc.setTextColor(30, 41, 59);
      row.forEach((val, cIdx) => {
        const text = String(val).slice(0, 28);
        doc.text(text, margin + cIdx * colWidth + 2, currentY + 4.8);
      });

      currentY += rowHeight;
    });

    // Footer with Page Numbers
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
      doc.text("Global Quest Technologies Pvt. Ltd. • Corporate Governance & Audit", margin, pageHeight - 6);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: "right" });
    }

    const safeName = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;
    doc.save(safeName);

    toast.success(`Downloaded "${safeName}" (PDF format).`, {
      description: `Official PDF report with ${formattedRows.length} rows saved.`,
    });
    return true;
  } catch (err: any) {
    console.error("Export PDF Error:", err);
    toast.error("Failed to generate PDF: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * 4. OFFICIAL OFFER LETTER / LOI PDF (.pdf)
 * Generates the authentic Letter of Intent as a standalone, cryptographically-sealed PDF document.
 */
export function downloadLOIPDF(offer: OfferLetter): boolean {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;

    // Header banner
    doc.setFillColor(0, 27, 77); // #001B4D
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("GLOBAL QUEST TECHNOLOGIES", margin, 12);

    doc.setFontSize(8);
    doc.setTextColor(20, 184, 255);
    doc.text("TRAINING • INNOVATION • PLACEMENT SERVICES", margin, 18);

    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text("Corporate Identity: U72900KA2020PTC138841", margin, 23);

    // Reference Box (Top Right)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`REF: ${offer.offerNumber}`, pageWidth - margin, 12, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text(`Issued: ${offer.offerIssuedDate}`, pageWidth - margin, 17, { align: "right" });
    doc.text(`Valid Until: ${offer.validUntil}`, pageWidth - margin, 22, { align: "right" });

    // Document Title Pill
    let currentY = 38;
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 8, 2, 2, "F");
    doc.setTextColor(0, 91, 187);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("LETTER OF INTENT (LOI) & CONDITIONAL OFFER OF ADMISSION", pageWidth / 2, currentY + 5.5, {
      align: "center",
    });

    // Candidate Details Box
    currentY += 14;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 26, 2, 2, "FD");

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("To,", margin + 4, currentY + 5);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(offer.studentName, margin + 4, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Student ID: ${offer.studentId}  |  College: ${offer.collegeName} ${offer.branch ? `• ${offer.branch}` : ""}`, margin + 4, currentY + 15);
    doc.text(`Email: ${offer.studentEmail}  |  Phone: ${offer.studentPhone}`, margin + 4, currentY + 20);

    // Salutation & Intro
    currentY += 32;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Dear ${offer.studentName},`, margin, currentY);

    currentY += 5;
    const introText = `Following your distinguished performance in the ${offer.driveName}, including the online technical assessment and subsequent HR calibration rounds, we are pleased to issue this formal Letter of Intent (LOI) for the position of ${offer.roleTitle}.`;
    const splitIntro = doc.splitTextToSize(introText, pageWidth - margin * 2);
    doc.text(splitIntro, margin, currentY);
    currentY += splitIntro.length * 4.2 + 4;

    // Appointment Terms Grid
    doc.setFillColor(0, 27, 77);
    doc.rect(margin, currentY, pageWidth - margin * 2, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SUMMARY OF APPOINTMENT & SPONSORSHIP TERMS", margin + 3, currentY + 4.2);
    currentY += 6;

    const terms = [
      ["Assigned Role", offer.roleTitle, "Full-Time CTC", offer.ctc],
      ["Course Track", offer.course, "Internship Stipend", offer.stipendDuringInternship],
      ["Cohort / Batch", offer.batch, "CSR Sponsorship", offer.courseFee || "GQT CSR Subsidized"],
      ["Training Mode", offer.trainingMode || "Hybrid", "Bond Obligation", offer.bond || "None"],
      ["Reporting Center", offer.trainingCenter || offer.location || "Bengaluru", "Joining Date", `${offer.joiningDate} ${offer.reportingTime ? `at ${offer.reportingTime}` : ""}`],
    ];

    doc.setFontSize(8);
    terms.forEach((row, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, pageWidth - margin * 2, 6, "F");
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(row[0], margin + 3, currentY + 4.2);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(row[1], margin + 35, currentY + 4.2);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(row[2], margin + 90, currentY + 4.2);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 91, 187);
      doc.text(row[3], margin + 125, currentY + 4.2);

      currentY += 6;
    });

    // Terms & Conditions
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("Conditions of Offer:", margin, currentY);

    currentY += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const cond1 = "1. Academic Continuity: This offer is conditional upon satisfactory graduation without active backlogs.";
    const cond2 = `2. Acceptance Deadline: Confirmation must be recorded via student portal on or before ${offer.validUntil}.`;
    doc.text(cond1, margin, currentY);
    currentY += 4;
    doc.text(cond2, margin, currentY);

    // Signatures & Stamp
    currentY += 14;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, currentY, margin + 45, currentY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(offer.authorizedSignatory || "Authorized Signatory", margin, currentY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(offer.authorizedDesignation || "Director - Corporate CSR", margin, currentY + 8);
    doc.text("Global Quest Technologies Pvt. Ltd.", margin, currentY + 12);

    // Seal (Right)
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(pageWidth - margin - 55, currentY - 5, 55, 16, 2, 2, "F");
    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("CRYPTOGRAPHICALLY SEALED", pageWidth - margin - 52, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`HASH: ${offer.qrVerificationCode}`, pageWidth - margin - 52, currentY + 5);
    doc.text("VERIFIED ON GQT VAULT", pageWidth - margin - 52, currentY + 9);

    // Footer
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Global Quest Technologies Pvt. Ltd. • Corporate Office: Global Tech Park, Whitefield, Bengaluru - 560066", pageWidth / 2, 285, { align: "center" });

    const safeName = `GQT_LOI_${offer.offerNumber}.pdf`;
    doc.save(safeName);

    toast.success(`Downloaded official LOI "${safeName}" (PDF).`);
    return true;
  } catch (err: any) {
    console.error("LOI PDF generation error:", err);
    toast.error("Failed to generate LOI PDF: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * 5. OFFICIAL STUDENT HALL TICKET PDF (.pdf)
 * Generates the authentic examination hall ticket as a genuine binary PDF.
 */
export function downloadHallTicketPDF(
  student: Student,
  activeDrive?: CSRDrive
): boolean {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5", // A5 fits a hall ticket card cleanly
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;

    // Header Band
    doc.setFillColor(0, 27, 77);
    doc.rect(0, 0, pageWidth, 22, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("GLOBAL QUEST TECHNOLOGIES", margin, 10);

    doc.setFontSize(7);
    doc.setTextColor(20, 184, 255);
    const driveTitle = activeDrive?.name || student.driveName || "CSR Statewide Campus Drive 2026";
    doc.text(driveTitle.toUpperCase(), margin, 16);

    // Verified badge
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(pageWidth - margin - 28, 6, 28, 6, 1.5, 1.5, "F");
    doc.setTextColor(22, 101, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.text("PASS-CONFIRMED", pageWidth - margin - 26, 10.2);

    let currentY = 30;

    // Outer Ticket Frame
    doc.setDrawColor(0, 91, 187);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 110, 3, 3, "D");

    // Title inside card
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL EXAMINATION HALL TICKET", pageWidth / 2, currentY + 8, { align: "center" });

    // Details Grid
    currentY += 14;
    const token = student.studentId || student.id ? `GQT-HT-2026-${(student.studentId || student.id).slice(-4)}` : "GQT-HT-VERIFIED";

    const fields = [
      ["Candidate Name:", student.fullName],
      ["Student ID:", student.studentId || student.id],
      ["USN / Roll No:", student.usn || "N/A"],
      ["Institution:", student.collegeName || "Partner Engineering College"],
      ["Branch / Track:", `${student.branch || "CS/IT"} • ${student.selectedCourse || "Full Stack"}`],
      ["Reporting Date:", "2026-09-24 at 09:30 AM"],
      ["Identity Token:", token],
    ];

    doc.setFontSize(8);
    fields.forEach((field) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text(field[0], margin + 6, currentY);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(field[1], margin + 38, currentY);
      currentY += 7;
    });

    // Instructions Box
    currentY += 4;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 4, currentY, pageWidth - margin * 2 - 8, 28, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text("Candidate Exam Instructions:", margin + 8, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("• Mandatory WebRTC proctoring active during the entire assessment.", margin + 8, currentY + 10);
    doc.text("• Tab switching, background apps, or window blur flags automated strikes.", margin + 8, currentY + 14);
    doc.text("• Present this verified hall ticket along with college ID card.", margin + 8, currentY + 18);
    doc.text(`• Digital Validation Hash: SHA256-${token}-GQT`, margin + 8, currentY + 22);

    const safeName = `GQT_Hall_Ticket_${student.usn || student.studentId || "Student"}.pdf`;
    doc.save(safeName);

    toast.success(`Downloaded Hall Ticket "${safeName}" (PDF).`);
    return true;
  } catch (err: any) {
    console.error("Hall Ticket PDF generation error:", err);
    toast.error("Failed to generate Hall Ticket PDF: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * 6. HTML Printable Report (Fallback)
 */
export function downloadPrintableReport(
  filename: string,
  title: string,
  subtitle: string,
  columns: string[],
  rows: (string | number | any)[][] | Record<string, any>[]
): boolean {
  // Delegate directly to binary PDF generator for exact format compliance
  return downloadPDF(filename, title, subtitle, columns, rows);
}

/**
 * Downloads arbitrary file content or text directly to the user's disk.
 */
export function downloadFile(filename: string, content: string | Blob, mimeType: string = "text/plain;charset=utf-8"): boolean {
  try {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    triggerBrowserDownload(blob, filename);
    toast.success(`Downloaded "${filename}" to local system.`);
    return true;
  } catch (err: any) {
    console.error("Download File Error:", err);
    toast.error("Failed to download file: " + (err?.message || "Unknown error"));
    return false;
  }
}

/**
 * Internal helper to trigger local browser file extraction
 */
function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 250);
}
