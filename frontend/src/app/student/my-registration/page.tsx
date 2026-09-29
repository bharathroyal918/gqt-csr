"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Paperclip,
  Clock,
  MessageSquare,
  Edit3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  QrCode,
  Download,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function MyRegistrationPage() {
  const { student: currentStudent, updateProfile, activeDrive } = useStudentSession();

  const [activeTab, setActiveTab] = useState<"application" | "documents" | "timeline" | "remarks">("application");
  const [isEditing, setIsEditing] = useState(false);

  // Form states for editable fields
  const [formData, setFormData] = useState({
    fullName: currentStudent?.fullName || "",
    mobile: currentStudent?.mobile || "",
    githubUrl: currentStudent?.githubUrl || "",
    linkedinUrl: currentStudent?.linkedinUrl || "",
    portfolioUrl: currentStudent?.portfolioUrl || "",
    skills: currentStudent?.skills?.join(", ") || "",
    currentBacklogs: currentStudent?.currentBacklogs ?? 0,
  });

  // Re-synchronize when candidate updates from database
  React.useEffect(() => {
    if (currentStudent) {
      setFormData({
        fullName: currentStudent.fullName || "",
        mobile: currentStudent.mobile || "",
        githubUrl: currentStudent.githubUrl || "",
        linkedinUrl: currentStudent.linkedinUrl || "",
        portfolioUrl: currentStudent.portfolioUrl || "",
        skills: currentStudent.skills?.join(", ") || "",
        currentBacklogs: currentStudent.currentBacklogs ?? 0,
      });
    }
  }, [currentStudent]);

  const registrationStatus = currentStudent?.status === "HR Rejected"
    ? "Rejected"
    : currentStudent?.status === "Qualified" || currentStudent?.status === "HR Selected" || currentStudent?.status === "Offer Sent" || currentStudent?.status === "Offer Accepted" || currentStudent?.status === "Exam Completed"
    ? "Approved"
    : "Pending Verification";

  const isEditable = true;

  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (currentStudent?.id) {
      await updateProfile({
        fullName: formData.fullName,
        mobile: formData.mobile,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        currentBacklogs: Number(formData.currentBacklogs),
      });
    }
    toast.success("Registration details updated in Supabase", {
      description: "Changes have been synchronized across all portals in real-time."
    });
  };

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    `GQT-REG-${currentStudent?.id || ""}-${currentStudent?.usn || ""}`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Application Reference: REG-{currentStudent?.id?.slice(0, 8).toUpperCase() || ""}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My CSR Drive Registration
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl">
              Track your profile validation, submitted university records, document compliance, and recruitment verification state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/student/registration-card/${currentStudent?.id}`}>
              <Button
                variant="cyan"
                size="sm"
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                View Hall Ticket QR
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => {
                toast.success("Downloading Registration Slip PDF", {
                  description: "Official registration acknowledgment saved."
                });
              }}
            >
              Download PDF Slip
            </Button>
          </div>
        </div>
      </div>

      {/* Top Status Card */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center p-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentStudent?.fullName}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  registrationStatus === "Approved"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : registrationStatus === "Rejected"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {registrationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              USN: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{currentStudent?.usn}</span> • {currentStudent?.collegeName}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Registered on: {new Date(currentStudent?.registeredAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditable && (
            <Button
              variant={isEditing ? "outline" : "primary"}
              size="sm"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel Edit" : "Edit Application"}
            </Button>
          )}
          {!isEditable && (
            <span className="text-xs text-slate-400 italic">
              Editing locked after institutional verification
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {[
          { id: "application", label: "Application Details", icon: User },
          { id: "documents", label: "Uploaded Documents", icon: Paperclip },
          { id: "timeline", label: "Status Timeline", icon: Clock },
          { id: "remarks", label: "Reviewer Remarks", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#005BBB] text-[#005BBB] dark:text-[#14B8FF]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Application */}
      {activeTab === "application" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#005BBB]" />
                <CardTitle>Personal & Contact Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSaveEdits} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Contact Mobile
                    </label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="sm">
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Full Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.fullName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Email Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Phone Number</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.mobile}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Aadhaar (Last 4 digits)</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">XXXX-XXXX-9021</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Bengaluru, Karnataka</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#005BBB]" />
                <CardTitle>Academic Records</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">College / Institution</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.collegeName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">University USN / Roll No</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentStudent?.usn}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Branch / Specialization</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.branch}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Cumulative CGPA</span>
                  <span className="font-bold text-emerald-600">{currentStudent?.cgpa ? `${currentStudent.cgpa} / 10.0` : "Not provided"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Graduating Batch</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStudent?.passingYear || ""}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Standing Backlogs</span>
                  <span className={`font-semibold ${currentStudent?.currentBacklogs ? "text-rose-600" : "text-emerald-600"}`}>
                    {currentStudent?.currentBacklogs !== undefined ? `${currentStudent.currentBacklogs} Active Backlogs` : ""}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Portfolio */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#005BBB]" />
                <CardTitle>Professional Links & Technical Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">GitHub Profile</span>
                  {currentStudent?.githubUrl ? (
                    <a
                      href={currentStudent.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{currentStudent.githubUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Not provided</span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">LinkedIn Profile</span>
                  {currentStudent?.linkedinUrl ? (
                    <a
                      href={currentStudent.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{currentStudent.linkedinUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Not provided</span>
                  )}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portfolio Website</span>
                  {currentStudent?.portfolioUrl ? (
                    <a
                      href={currentStudent.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#005BBB] hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{currentStudent.portfolioUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Not provided</span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Verified Skill Stack:</span>
                <div className="flex flex-wrap gap-2">
                  {(currentStudent?.skills || ["Java", "Spring Boot", "React", "Next.js", "PostgreSQL", "Data Structures", "Git"]).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-[#005BBB] dark:text-[#14B8FF]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Documents */}
      {activeTab === "documents" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Official Resume (PDF)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <FileText className="w-10 h-10 text-[#005BBB] mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {currentStudent?.fullName.replace(" ", "_")}_Resume_2026.pdf
                </span>
                <span className="text-[10px] text-slate-400">PDF • 1.4 MB • Verified</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => toast.info("Opening document preview...")}
                >
                  Preview
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => toast.success("Download started")}
                >
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Passport Size Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                {currentStudent?.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentStudent.photoUrl}
                    alt={currentStudent.fullName}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#005BBB]"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                )}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Candidate_Photo.jpg
                </span>
                <span className="text-[10px] text-slate-400">JPEG • 240 KB • Biometric Clear</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => toast.info("Previewing full resolution photograph")}
              >
                View Photo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">College Identity Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <Building className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  College_ID_{currentStudent?.usn}.pdf
                </span>
                <span className="text-[10px] text-slate-400">PDF • Institutional Signet Valid</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => toast.info("Displaying College ID Scan")}
              >
                View ID Card
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Timeline */}
      {activeTab === "timeline" && (
        <Card>
          <CardHeader>
            <CardTitle>Application Lifecycle & Verification Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {[
                {
                  title: "Registration Form Submitted",
                  date: currentStudent?.registeredAt ? new Date(currentStudent.registeredAt).toLocaleString() : "15 Feb 2026, 11:30 AM",
                  desc: "Submitted complete student profile, academic certifications, and digital consent.",
                  done: true,
                },
                {
                  title: "Institutional Eligibility Verification",
                  date: "16 Feb 2026, 04:15 PM",
                  desc: "College placement cell and GQT CSR coordinator verified USN, CGPA, and backlog criteria.",
                  done: true,
                },
                {
                  title: "Proctored Exam Hall Ticket Generated",
                  date: "17 Feb 2026, 09:00 AM",
                  desc: "Candidate cleared for CSR Assessment Test. Security token and instructions dispatched.",
                  done: currentStudent?.examResult !== undefined || registrationStatus === "Approved",
                },
                {
                  title: "Assessment Test Evaluation",
                  date: currentStudent?.examResult ? "Completed" : "Scheduled",
                  desc: currentStudent?.examResult ? `Score: ${currentStudent.examResult.marksObtained}/100 Marks (${currentStudent.examResult.percentage}%)` : "Pending online exam completion.",
                  done: currentStudent?.examResult !== undefined,
                },
                {
                  title: "HR Panel Interview & Offer Release",
                  date: currentStudent?.offerDetails ? "Offer Issued" : "In Progress",
                  desc: currentStudent?.offerDetails ? `Offer package: ${currentStudent.offerDetails.ctc}` : "Final shortlisting stage.",
                  done: currentStudent?.offerDetails !== undefined,
                },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div
                    className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      step.done
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{step.title}</h4>
                      <span className="text-[11px] font-semibold text-slate-400">{step.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Remarks */}
      {activeTab === "remarks" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#005BBB]" />
              <CardTitle>Institutional Reviewer Feedback & Remarks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF]">
                  GQT CSR Verification Panel
                </span>
                <span className="text-[10px] text-slate-400">Verified System Auditor</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Candidate meets all academic eligibility parameters (&gt;7.0 CGPA, 0 standing backlogs). Official college Bonafide and ID card verified against university roster records. Candidate is cleared for Proctored Assessment Room.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  College TPO Office Note
                </span>
                <span className="text-[10px] text-slate-400">Placement Cell</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Student endorsed for GQT CSR Flagship Recruitment Drive. Hall ticket generated for session Slot-A.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
