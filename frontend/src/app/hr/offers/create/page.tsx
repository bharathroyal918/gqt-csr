"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  ArrowLeft,
  Sparkles,
  FileCheck2,
  Calendar,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Eye,
  CheckCircle2,
  UserCheck,
  QrCode,
  Download,
  Users
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { OfferLetterDocument } from "@/components/offer/OfferLetterDocument";
import { INITIAL_OFFER_TEMPLATES, INITIAL_BATCHES } from "@/lib/offer/offerData";
import { OfferLetter } from "@/types";
import { toast } from "sonner";

// Pre-qualified candidates pool from HR Pipeline
const CANDIDATE_POOL = [
  {
    id: "stu-004",
    name: "Aakash M. Gowda",
    usn: "1DS22CS045",
    email: "[EMAIL_ADDRESS]",
    phone: "+91 98453 44556",
    college: "Dayananda Sagar College of Engineering (DSCE)",
    branch: "Computer Science and Engineering",
    course: "Java Full Stack + Agentic AI",
    interviewRating: 4.8,
    status: "Selected",
  },
  {
    id: "stu-005",
    name: "Deepa N. Kulkarni",
    usn: "2GI22IS022",
    email: "[EMAIL_ADDRESS]",
    phone: "+91 98454 55667",
    college: "KLS Gogte Institute of Technology (GIT), Belagavi",
    branch: "Information Science and Engineering",
    course: "Python Full Stack + AI/ML",
    interviewRating: 4.9,
    status: "Selected",
  },
  {
    id: "stu-006",
    name: "Rohan S. Bharadwaj",
    usn: "4NM22AI018",
    email: "[EMAIL_ADDRESS]",
    phone: "+91 98455 66778",
    college: "NMAM Institute of Technology (Nitte)",
    branch: "Artificial Intelligence and Machine Learning",
    course: "AI Full Stack & Autonomous Agents",
    interviewRating: 4.7,
    status: "Selected",
  },
];

export default function CreateOfferLetterPage() {
  const router = useRouter();

  // Mode: Form vs Live PDF Preview
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // Selected candidate
  const [selectedCandidateId, setSelectedCandidateId] = useState(CANDIDATE_POOL[0].id);

  // Form Fields
  const [selectedTemplateId, setSelectedTemplateId] = useState(INITIAL_OFFER_TEMPLATES[0].id);
  const [roleTitle, setRoleTitle] = useState("Associate Software Engineer - Java & Cloud");
  const [batchName, setBatchName] = useState("2026 Batch Alpha — Java Cloud");
  const [joiningDate, setJoiningDate] = useState("2026-07-01");
  const [reportingTime, setReportingTime] = useState("09:00 AM");
  const [location, setLocation] = useState("Bengaluru, Karnataka");
  const [trainingCenter, setTrainingCenter] = useState("GQT Advanced Learning Center, Whitefield, Bengaluru");
  const [trainingMode, setTrainingMode] = useState<"Offline Campus" | "Virtual Live" | "Hybrid">("Hybrid");
  const [trainingType, setTrainingType] = useState<"CSR Sponsored" | "Paid" | "Hybrid">("CSR Sponsored");
  const [courseFee, setCourseFee] = useState("₹ 75,000 (100% CSR Subsidized)");
  const [csrSponsorship, setCsrSponsorship] = useState("Global Quest Technologies CSR Foundation");
  const [ctc, setCtc] = useState("₹ 6.50 LPA");
  const [stipend, setStipend] = useState("₹ 18,000 / month");
  const [bond, setBond] = useState("None (Zero Bond Policy)");
  const [validUntil, setValidUntil] = useState("2026-10-15");
  const [deliveryChannel, setDeliveryChannel] = useState<"Student Portal" | "Email" | "WhatsApp" | "Both">("Both");
  const [hrExecutive, setHrExecutive] = useState("Priya Nair (Senior HR Lead)");
  const [remarks, setRemarks] = useState("Selected via Karnataka State-wide CSR Drive with distinction score.");

  // Configuration Switches
  const [enableQR, setEnableQR] = useState(true);
  const [enableSignature, setEnableSignature] = useState(true);
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [enableAcceptance, setEnableAcceptance] = useState(true);

  // Candidate details
  const candidate = CANDIDATE_POOL.find((c) => c.id === selectedCandidateId) || CANDIDATE_POOL[0];
  const autoOfferNumber = `GQT/OFFER/2026/${Math.floor(100 + Math.random() * 900)}`;

  // Construct draft object for live preview
  const draftOffer: OfferLetter = {
    id: `off-draft-${Date.now()}`,
    offerNumber: autoOfferNumber,
    studentId: candidate.id,
    studentName: candidate.name,
    studentEmail: candidate.email,
    studentPhone: candidate.phone,
    collegeName: candidate.college,
    driveName: "Karnataka State-wide CSR Engineering Drive 2026",
    roleTitle,
    course: candidate.course,
    branch: candidate.branch,
    batch: batchName,
    ctc,
    stipendDuringInternship: stipend,
    location,
    reportingTime,
    trainingCenter,
    trainingMode,
    trainingType,
    courseFee,
    csrSponsorship,
    bond,
    hrExecutive,
    joiningDate,
    offerIssuedDate: new Date().toISOString().split("T")[0],
    validUntil,
    status: "Generated",
    qrVerificationCode: enableQR ? `GQT-VERIFY-2026-${candidate.id.toUpperCase()}-SECURE` : "",
    digitalSignatureUrl: enableSignature ? "/images/signatures/director-signature.png" : "",
    authorizedSignatory: "G.R. Narendra Reddy",
    authorizedDesignation: "Director - Talent Enablement & CSR",
    companySealUrl: "/images/signatures/gqt-seal.png",
    watermarkEnabled: enableWatermark,
    remarks,
    deliveryChannel,
  };

  const handleSaveDraft = () => {
    toast.success("Offer Letter saved as Draft!", {
      description: `Offer ID: ${autoOfferNumber} created for ${candidate.name}`,
    });
    router.push("/hr/offer-queue");
  };

  const handleGenerateAndSend = () => {
    toast.success("Offer Letter Dispatched Successfully!", {
      description: `Dispatched to ${candidate.name} via ${deliveryChannel}. Live tracking enabled.`,
    });
    router.push("/hr/offer-queue");
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link
            href="/hr/offer-queue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Offer Queue
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="w-7 h-7 text-[#005BBB]" />
            Generate Enterprise Offer Letter
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Issue cryptographically stamped Letters of Intent with automated QR verification and zero-bond CSR sponsorship.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "form"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Configuration Form
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === "preview"
                ? "bg-[#005BBB] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live LOI Preview
          </button>
        </div>
      </div>

      {activeTab === "preview" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Interactive A4 Document Preview</h4>
                <p className="text-xs text-muted-foreground">
                  Official letter preview for candidate {candidate.name} ({autoOfferNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("form")}>
                Edit Details
              </Button>
              <Button variant="primary" size="sm" onClick={handleGenerateAndSend} className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Dispatch Offer Now
              </Button>
            </div>
          </div>

          <OfferLetterDocument offer={draftOffer} showActions={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Candidate Selector */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#005BBB]" />
                1. Select Selected Candidate
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-foreground">Choose from Selected Students Queue</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {CANDIDATE_POOL.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidateId(c.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedCandidateId === c.id
                          ? "border-[#005BBB] bg-[#005BBB]/5 ring-1 ring-[#005BBB]"
                          : "border-border hover:bg-muted/50"
                        }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{c.name}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                            {c.usn}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            ★ {c.interviewRating} / 5.0
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{c.college}</p>
                        <p className="text-[11px] font-medium text-[#005BBB]">{c.course}</p>
                      </div>

                      <div className="text-right">
                        {selectedCandidateId === c.id ? (
                          <div className="w-6 h-6 rounded-full bg-[#005BBB] text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-border" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 2. Offer Details & Role Assignment */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#005BBB]" />
                2. Role & Corporate Offer Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Select Reusable Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {INITIAL_OFFER_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.title} (v{tmpl.version})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Joining Role Title</label>
                  <Input
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Associate Software Engineer - Java"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned Batch Code</label>
                  <select
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {INITIAL_BATCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.batchCode} — {b.name} ({b.enrolledCount}/{b.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Joining Date</label>
                  <Input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Reporting Time</label>
                  <Input
                    value={reportingTime}
                    onChange={(e) => setReportingTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Training Center Location</label>
                  <Input
                    value={trainingCenter}
                    onChange={(e) => setTrainingCenter(e.target.value)}
                    placeholder="Center address"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Training Delivery Mode</label>
                  <select
                    value={trainingMode}
                    onChange={(e) => setTrainingMode(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="Hybrid">Hybrid (Classroom + Virtual Labs)</option>
                    <option value="Offline Campus">Offline Campus Only</option>
                    <option value="Virtual Live">Virtual Live Online</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Assigned HR Lead</label>
                  <Input
                    value={hrExecutive}
                    onChange={(e) => setHrExecutive(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </Card>

            {/* 3. Package & CSR Sponsorship */}
            <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                3. Financial Terms & CSR Sponsorship
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Sponsorship Model</label>
                  <select
                    value={trainingType}
                    onChange={(e) => setTrainingType(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="CSR Sponsored">100% CSR Sponsored (GQT Foundation)</option>
                    <option value="Hybrid">Corporate Co-sponsored</option>
                    <option value="Paid">Direct Corporate Placement</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Sponsor Granting Body</label>
                  <Input
                    value={csrSponsorship}
                    onChange={(e) => setCsrSponsorship(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Annual CTC Upon Completion</label>
                  <Input
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    placeholder="₹ 6.50 LPA"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Internship Stipend (Monthly)</label>
                  <Input
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="₹ 18,000 / month"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Course Fee Subsidy Amount</label>
                  <Input
                    value={courseFee}
                    onChange={(e) => setCourseFee(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Employment Service Bond</label>
                  <Input
                    value={bond}
                    onChange={(e) => setBond(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Special Conditions / Remarks</label>
                <Input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Additional terms or performance incentives..."
                  className="text-xs"
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Security & Actions (1 col) */}
          <div className="space-y-6">
            {/* Security & Features */}
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#005BBB]" />
                Security & Verification
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">QR Verification Hash</p>
                    <p className="text-[10px] text-muted-foreground">Unique tamper-proof public verify token</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableQR}
                    onChange={(e) => setEnableQR(e.target.checked)}
                    className="w-4 h-4 accent-[#005BBB]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">Digital Director Signature</p>
                    <p className="text-[10px] text-muted-foreground">Apply G.R. Narendra Reddy's signature</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSignature}
                    onChange={(e) => setEnableSignature(e.target.checked)}
                    className="w-4 h-4 accent-[#005BBB]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">GQT Watermark</p>
                    <p className="text-[10px] text-muted-foreground">Anti-counterfeit diagonal mark</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                    className="w-4 h-4 accent-[#005BBB]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div>
                    <p className="text-xs font-bold text-foreground">Student Portal Acceptance</p>
                    <p className="text-[10px] text-muted-foreground">Enable digital acceptance modal</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAcceptance}
                    onChange={(e) => setEnableAcceptance(e.target.checked)}
                    className="w-4 h-4 accent-[#005BBB]"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Offer Expiry Deadline</label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Dispatch Notification Channel</label>
                <select
                  value={deliveryChannel}
                  onChange={(e) => setDeliveryChannel(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Both">Portal + Email + WhatsApp</option>
                  <option value="Student Portal">Student Portal Only</option>
                  <option value="Email">Email Only</option>
                  <option value="WhatsApp">WhatsApp Only</option>
                </select>
              </div>
            </Card>

            {/* Action Bar */}
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-[#001B4D] text-white border-none shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold">Ready to Dispatch</h4>
              </div>
              <p className="text-xs text-white/80">
                Generated Letter: <span className="font-mono text-cyan-300 font-bold">{autoOfferNumber}</span>
              </p>

              <div className="space-y-2 pt-2">
                <Button
                  variant="cyan"
                  className="w-full flex items-center justify-center gap-2 text-xs py-2.5"
                  onClick={handleGenerateAndSend}
                >
                  <Send className="w-4 h-4" />
                  Generate & Send Offer Letter
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 text-xs text-white border-white/20 hover:bg-white/10"
                  onClick={handleSaveDraft}
                >
                  Save as Draft
                </Button>

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2 text-xs text-white/70 hover:text-white"
                  onClick={() => setActiveTab("preview")}
                >
                  <Eye className="w-4 h-4" />
                  Preview A4 Document First
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
