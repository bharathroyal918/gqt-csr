"use client";

import React, { useState } from "react";
import {
  Award,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Building2,
  Briefcase,
  Sparkles,
  Save,
  Check,
  Eye,
  FileText
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { getLiveCandidateProfiles, CandidateFullProfile } from "@/lib/recruitment/recruitmentData";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

export default function OfferPreparationQueuePage() {
  const { sendOfferLetter, students } = useApp();
  const liveSelected = React.useMemo(() => {
    return getLiveCandidateProfiles(students).filter((c) => c.status === "Selected" || c.status === "Offer Sent" || c.status === "Offer Accepted");
  }, [students]);

  const [candidates, setCandidates] = useState<CandidateFullProfile[]>(liveSelected);

  React.useEffect(() => {
    setCandidates(liveSelected);
    if (!selectedCandidate && liveSelected.length > 0) {
      setSelectedCandidate(liveSelected[0]);
    }
  }, [liveSelected]);

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateFullProfile | null>(liveSelected[0] || null);

  // Form states
  const [roleTitle, setRoleTitle] = useState(
    selectedCandidate?.offerData?.joiningRole || selectedCandidate?.selectedCourse || ""
  );
  const [batch, setBatch] = useState(selectedCandidate?.offerData?.batch || selectedCandidate?.batch || "");
  const [joiningDate, setJoiningDate] = useState(selectedCandidate?.offerData?.joiningDate || "");
  const [reportingTime, setReportingTime] = useState(selectedCandidate?.offerData?.reportingTime || "");
  const [reportingLocation, setReportingLocation] = useState(
    selectedCandidate?.offerData?.reportingLocation || selectedCandidate?.collegeName || ""
  );
  const [trainingCenter, setTrainingCenter] = useState(
    selectedCandidate?.offerData?.trainingCenter || ""
  );
  const [ctc, setCtc] = useState(selectedCandidate?.offerData?.ctc || "");
  const [stipend, setStipend] = useState(selectedCandidate?.offerData?.stipend || "");
  const [remarks, setRemarks] = useState(
    selectedCandidate?.offerData?.remarks || ""
  );

  const handleSelectCandidate = (cand: CandidateFullProfile) => {
    setSelectedCandidate(cand);
    setRoleTitle(cand.offerData?.joiningRole || cand.selectedCourse || "");
    setBatch(cand.offerData?.batch || cand.batch || "");
    setJoiningDate(cand.offerData?.joiningDate || "");
    setReportingTime(cand.offerData?.reportingTime || "");
    setReportingLocation(cand.offerData?.reportingLocation || cand.collegeName || "");
    setTrainingCenter(cand.offerData?.trainingCenter || "");
    setCtc(cand.offerData?.ctc || "");
    setStipend(cand.offerData?.stipend || "");
    setRemarks(cand.offerData?.remarks || "");
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id
          ? {
              ...c,
              offerData: {
                joiningRole: roleTitle,
                course: c.selectedCourse,
                batch,
                joiningDate,
                reportingTime,
                reportingLocation,
                trainingCenter,
                ctc,
                stipend,
                offerStatus: "Draft Offer",
                remarks,
              },
            }
          : c
      )
    );

    toast.success(`Draft offer saved for ${selectedCandidate.fullName}!`);
  };

  const handleSendToAdminApproval = () => {
    if (!selectedCandidate) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidate.id
          ? {
              ...c,
              offerData: {
                joiningRole: roleTitle,
                course: c.selectedCourse,
                batch,
                joiningDate,
                reportingTime,
                reportingLocation,
                trainingCenter,
                ctc,
                stipend,
                offerStatus: "Offer Generated",
                remarks,
              },
            }
          : c
      )
    );

    toast.success("Offer Sent for Super Admin Approval!", {
      description: `Cryptographic LOI queued for ${selectedCandidate.fullName}. Super Admin notified.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Employment Letter Generation
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Offer Preparation Queue</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Configure role titles, stipend, CTC packages, reporting centers, and dispatch formal Global Quest Technologies Letters of Intent (LOI) to selected students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hr/candidates/selected">
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Selected Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Split Layout: Left candidate selector, Right offer preparation form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 4 Cols: Queue List */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="p-3.5 bg-card border border-border shadow-sm rounded-xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">Selected Candidates</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {candidates.length}
              </span>
            </div>

            <div className="space-y-2">
              {candidates.map((c) => {
                const isCurrent = selectedCandidate?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCandidate(c)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isCurrent
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <img src={c.photoUrl} alt={c.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div className="overflow-hidden">
                        <p className="font-bold text-foreground truncate">{c.fullName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{c.usn}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/60">
                      <span className="text-muted-foreground">{c.collegeName.split(" ")[0]}</span>
                      <span
                        className={`font-semibold ${
                          c.offerData?.offerStatus === "Offer Generated" || c.offerData?.offerStatus === "Offer Sent"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      >
                        {c.offerData?.offerStatus || "Pending Offer"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 8 Cols: Offer Form */}
        <div className="lg:col-span-8">
          {selectedCandidate ? (
            <Card className="p-6 bg-card border border-border shadow-sm rounded-xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">Prepare Offer Letter & Terms</h2>
                  <p className="text-xs text-muted-foreground">
                    Candidate: <strong>{selectedCandidate.fullName}</strong> ({selectedCandidate.usn}) • {selectedCandidate.collegeName}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Assessment: {selectedCandidate.exam.score}/100{selectedCandidate.technicalEvaluation?.overallScore ? ` • Interview: ${selectedCandidate.technicalEvaluation.overallScore}/10` : ""}
                </span>
              </div>

              <form onSubmit={handleSaveDraft} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Assigned Joining Role *</label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Course Track & Batch *</label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Joining Date *</label>
                    <input
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Reporting Time *</label>
                    <input
                      type="text"
                      value={reportingTime}
                      onChange={(e) => setReportingTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      placeholder="09:00 AM"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Full-Time Compensation (CTC) *</label>
                    <input
                      type="text"
                      value={ctc}
                      onChange={(e) => setCtc(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      placeholder="₹ 6.50 LPA"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Monthly Internship Stipend *</label>
                    <input
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      placeholder="₹ 18,000 / month"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Reporting Location *</label>
                    <input
                      type="text"
                      value={reportingLocation}
                      onChange={(e) => setReportingLocation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Training Center *</label>
                    <input
                      type="text"
                      value={trainingCenter}
                      onChange={(e) => setTrainingCenter(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Special Terms & Offer Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button type="submit" variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Save className="w-3.5 h-3.5" />
                    Save Draft
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={handleSendToAdminApproval}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send to Admin Approval & LOI Issuance
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-12 text-center bg-card border border-border rounded-xl">
              <Award className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold text-sm text-foreground">No candidate selected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select a student from the left panel to configure employment terms and generate official offer letters.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
