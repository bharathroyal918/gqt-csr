"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  FileText,
  FileCheck2,
  Users,
  Award,
  History,
  MessageSquare,
  FileCode,
  Globe,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Student } from "@/types";

export default function AdminStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { students, updateStudent } = useApp();
  const studentId = params?.id as string;

  const student = students.find((s) => s.id === studentId || s.studentId === studentId);
  const [activeTab, setActiveTab] = useState("personal");

  if (!student) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">Student profile not found.</p>
        <Link href="/admin/students">
          <Button variant="outline">Back to Directory</Button>
        </Link>
      </div>
    );
  }

  const handleOverrideStatus = (newStatus: Student["status"]) => {
    updateStudent(student.id, { status: newStatus });
    toast.success(`Admin pipeline status updated to "${newStatus}"`, {
      description: "Audit trail recorded with Super Admin digital signature.",
    });
  };

  const tabs = [
    { id: "personal", label: "1. Personal Details", icon: <User className="w-4 h-4" /> },
    { id: "academic", label: "2. Academic Record", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "documents", label: "3. Verified Documents", icon: <FileText className="w-4 h-4" /> },
    { id: "exam", label: "4. Exam History", icon: <FileCheck2 className="w-4 h-4" /> },
    { id: "interview", label: "5. Interview History", icon: <Users className="w-4 h-4" /> },
    { id: "offer", label: "6. Offer History", icon: <Award className="w-4 h-4" /> },
    { id: "timeline", label: "7. Activity Timeline", icon: <History className="w-4 h-4" /> },
    { id: "communication", label: "8. Communication", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "resume", label: "9. Resume Preview", icon: <FileCode className="w-4 h-4" /> },
    { id: "portfolio", label: "10. Social & Code", icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Master Directory
        </Link>
        <span className="text-xs text-muted-foreground font-mono">
          Global ID: {student.id}
        </span>
      </div>

      {/* Hero Header Card */}
      <Card className="border border-border/60 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={student.fullName}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-primary/30 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{student.fullName}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                  {student.studentId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {student.graduateType} in {student.branch} • Class of {student.passingYear}
              </p>
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                {student.collegeName} (USN: <span className="font-mono">{student.usn}</span>)
              </p>
            </div>
          </div>

          {/* Admin Override Controls */}
          <div className="bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Super Admin Status Override
            </p>
            <div className="flex items-center gap-2">
              <select
                value={student.status}
                onChange={(e) => handleOverrideStatus(e.target.value as Student["status"])}
                className="h-9 px-3 text-xs rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Registered">Registered</option>
                <option value="Hall Ticket Generated">Hall Ticket Generated</option>
                <option value="Exam Completed">Exam Completed</option>
                <option value="Qualified">Qualified</option>
                <option value="Disqualified">Disqualified</option>
                <option value="HR Interview Scheduled">HR Interview Scheduled</option>
                <option value="HR Selected">HR Selected</option>
                <option value="HR On Hold">HR On Hold</option>
                <option value="HR Rejected">HR Rejected</option>
                <option value="Offer Sent">Offer Sent</option>
                <option value="Offer Accepted">Offer Accepted</option>
                <option value="Offer Rejected">Offer Rejected</option>
              </select>
              <Button size="sm" onClick={() => toast.success("Status logged in immutable forensic audit")}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Menu */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Personal Details */}
      {activeTab === "personal" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">1. Personal & Contact Information</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Full Name</span>
              <span className="font-bold text-foreground text-sm">{student.fullName}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Gender & DOB</span>
              <span className="font-semibold text-foreground">{student.gender || "—"}{student.dob ? ` • ${student.dob}` : ""}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Aadhaar (Last 4 Digits)</span>
              <span className="font-mono font-bold text-foreground">{student.aadhaarLast4 ? `XXXX-XXXX-${student.aadhaarLast4}` : "—"}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Email Address</span>
              <span className="font-semibold text-foreground">{student.email}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Mobile Number</span>
              <span className="font-semibold text-foreground">{student.mobile}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">WhatsApp Number</span>
              <span className="font-semibold text-foreground">{student.whatsappNumber || student.mobile}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">City & District</span>
              <span className="font-semibold text-foreground">{[student.city, student.district].filter(Boolean).join(", ") || "—"}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">PIN Code</span>
              <span className="font-mono font-semibold text-foreground">{student.pincode || "—"}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Registration Timestamp</span>
              <span className="font-semibold text-foreground">{new Date(student.registeredAt).toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Academic Details */}
      {activeTab === "academic" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">2. University & Academic Record</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">University</span>
              <span className="font-semibold text-foreground">{student.university || "—"}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Institution</span>
              <span className="font-semibold text-foreground">{student.collegeName}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">University Seat Number (USN)</span>
              <span className="font-mono font-bold text-foreground text-sm">{student.usn}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Degree / Branch</span>
              <span className="font-semibold text-foreground">{student.graduateType} — {student.branch}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Current Semester / Batch</span>
              <span className="font-semibold text-foreground">{student.semester ? `Semester ${student.semester}` : "Semester N/A"} • Batch of {student.passingYear}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground block mb-0.5">Aggregate Percentage / CGPA</span>
              <span className="font-bold text-primary text-sm">{student.percentage ? `${student.percentage}%` : "Percentage N/A"} {student.cgpa != null ? `(${student.cgpa} CGPA)` : ""}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Documents */}
      {activeTab === "documents" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">3. Uploaded & Verified Documents</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Student Resume PDF</p>
                <p className="text-[11px] text-muted-foreground">Uploaded on Registration • 184 KB</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Resume downloaded")}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            </div>
            <div className="p-4 border rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">College ID Card Scan</p>
                <p className="text-[11px] text-muted-foreground">Verified by Faculty Coordinator</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("College ID viewed")}>
                <Eye className="w-3.5 h-3.5 mr-1" /> View
              </Button>
            </div>
            <div className="p-4 border rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">7th Sem Marksheet</p>
                <p className="text-[11px] text-muted-foreground">VTU Online Grade Sheet</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Marksheet downloaded")}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download
              </Button>
            </div>
            <div className="p-4 border rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Aadhaar Card (Masked)</p>
                <p className="text-[11px] text-muted-foreground">Identity Proof Verified</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("ID proof viewed")}>
                <Eye className="w-3.5 h-3.5 mr-1" /> View
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: Exam History */}
      {activeTab === "exam" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">4. Online CSR Assessment History</CardTitle>
          <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">GQT Statewide CSR Technical Exam 2025</h4>
                <p className="text-xs text-muted-foreground">Proctored Online Session • 60 Minutes</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                {student.examResult ? `Qualified (Score: ${student.examResult.marksObtained != null ? `${student.examResult.marksObtained}/50` : "Score Pending"})` : "Assessment Enrolled"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
              <div><strong className="text-muted-foreground">Java / Python:</strong> 18/20</div>
              <div><strong className="text-muted-foreground">SQL & Data:</strong> 12/15</div>
              <div><strong className="text-muted-foreground">Logical Reasoning:</strong> 12/15</div>
            </div>
            <div className="pt-2 text-[11px] text-muted-foreground">
              Proctoring audit: 0 camera focus lost events, 0 tab switch flags. Clean session.
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Interview History */}
      {activeTab === "interview" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">5. HR & Technical Interview Evaluations</CardTitle>
          <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Round 1: Technical & Behavioral Evaluation</h4>
                <p className="text-xs text-muted-foreground">Interviewer: Hitha, Kusuma (Lead Recruiter)</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Recommended for Offer
              </span>
            </div>
            <div className="p-3 bg-background rounded-xl border text-xs text-muted-foreground">
              <strong className="text-foreground">Interviewer Remarks: </strong>
              Candidate demonstrated strong foundational understanding of OOPs, RESTful API design, and SQL querying. Communicates clearly and showed strong enthusiasm for GQT CSR upskilling program.
            </div>
          </div>
        </Card>
      )}

      {/* Tab 6: Offer History */}
      {activeTab === "offer" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">6. Corporate Offer Letter Status</CardTitle>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-emerald-400">Offer Letter Released</h4>
            <p className="text-xs text-muted-foreground">Designation: Associate Software Engineer Trainee</p>
            <p className="text-xs text-muted-foreground">Compensation: ₹4,50,000 PA CTC</p>
            <p className="text-xs text-muted-foreground">Issued Date: Feb 12, 2025 • Acceptance Deadline: Feb 28, 2025</p>
            <div className="pt-2 flex gap-2">
              <Button size="sm" onClick={() => toast.success("Offer Letter PDF generated")}>Download Offer Letter</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 7: Activity Timeline */}
      {activeTab === "timeline" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">7. Realtime Candidate Lifecycle Timeline</CardTitle>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground">Candidate Registered on Platform</p>
                <p className="text-muted-foreground">{new Date(student.registeredAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground">Hall Ticket Generated & Exam Assigned</p>
                <p className="text-muted-foreground">Automated System Trigger</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground">Exam Completed & Auto-Evaluated</p>
                <p className="text-muted-foreground">{student.examResult?.marksObtained != null ? `Score: ${student.examResult.marksObtained}/50` : "Evaluation In Progress"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-foreground">HR Interview Shortlisted</p>
                <p className="text-muted-foreground">Assigned to Lead Recruiter</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 8: Communication Timeline */}
      {activeTab === "communication" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">8. Candidate Communication Logs</CardTitle>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="font-semibold text-foreground">WhatsApp Notification: Exam Slot Confirmation</p>
              <p className="text-muted-foreground text-[11px]">Sent to {student.mobile} • Delivered & Read</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="font-semibold text-foreground">Email: Welcome to GQT CSR Drive</p>
              <p className="text-muted-foreground text-[11px]">Sent to {student.email} • Delivered</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 9: Resume Preview */}
      {activeTab === "resume" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">9. Candidate Resume Preview</CardTitle>
            <Button size="sm" variant="outline" onClick={() => toast.success("Resume downloaded")}>
              <Download className="w-4 h-4 mr-1" /> Download PDF
            </Button>
          </div>
          <div className="border border-border/60 rounded-2xl p-8 bg-muted/20 min-h-[400px] flex flex-col items-center justify-center text-center space-y-3">
            <FileCode className="w-12 h-12 text-primary/60" />
            <div>
              <p className="font-bold text-foreground">{student.fullName} — Resume.pdf</p>
              <p className="text-xs text-muted-foreground">Embedded PDF Preview Rendered</p>
            </div>
            <Button onClick={() => toast.info("Opening full resume viewer")}>Open Full Screen Preview</Button>
          </div>
        </Card>
      )}

      {/* Tab 10: Social & Code */}
      {activeTab === "portfolio" && (
        <Card className="rounded-3xl border border-border/60 bg-card/80 p-6 space-y-4">
          <CardTitle className="text-base font-bold">10. Developer Portfolios & Social Profiles</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {student.githubUrl ? (
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 border rounded-2xl hover:border-primary transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-foreground">GitHub Profile</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{student.githubUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            ) : (
              <div className="p-4 border rounded-2xl bg-muted/20 flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-xs text-foreground">GitHub Profile</p>
                  <p className="text-[11px] text-muted-foreground">Not provided</p>
                </div>
              </div>
            )}

            {student.linkedinUrl ? (
              <a
                href={student.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 border rounded-2xl hover:border-primary transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-foreground">LinkedIn Network</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{student.linkedinUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            ) : (
              <div className="p-4 border rounded-2xl bg-muted/20 flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-xs text-foreground">LinkedIn Network</p>
                  <p className="text-[11px] text-muted-foreground">Not provided</p>
                </div>
              </div>
            )}

            {student.portfolioUrl ? (
              <a
                href={student.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 border rounded-2xl hover:border-primary transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-xs text-foreground">Personal Portfolio</p>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{student.portfolioUrl}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary" />
              </a>
            ) : (
              <div className="p-4 border rounded-2xl bg-muted/20 flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-xs text-foreground">Personal Portfolio</p>
                  <p className="text-[11px] text-muted-foreground">Not provided</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
