"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Tabs } from "@/components/common/Tabs";
import { toast } from "sonner";
import {
  Briefcase,
  History,
  Building2,
  Users,
  GraduationCap,
  FileCheck2,
  Award,
  MessageSquare,
  BarChart3,
  Settings,
  ArrowLeft,
  QrCode,
  Share2,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  UserCheck,
  ChevronRight
} from "lucide-react";

export default function CSRDriveDetailsPage() {
  const params = useParams();
  const { drives, colleges, students } = useApp();
  const driveId = params?.driveId as string;

  const drive = drives.find((d) => d.id === driveId || d.driveCode === driveId) || drives[0];
  const [activeTab, setActiveTab] = useState("overview");

  if (!drive) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">CSR Drive not found.</p>
        <Link href="/csr-manager/drives">
          <Button variant="outline">Back to Drives</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: <Briefcase className="w-4 h-4" /> },
    { id: "timeline", label: "Timeline", icon: <History className="w-4 h-4" /> },
    { id: "colleges", label: "Colleges", icon: <Building2 className="w-4 h-4" /> },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    { id: "registration", label: "Registration & QR", icon: <QrCode className="w-4 h-4" /> },
    { id: "exam", label: "Exam Control", icon: <FileCheck2 className="w-4 h-4" /> },
    { id: "interview", label: "Interviews", icon: <UserCheck className="w-4 h-4" /> },
    { id: "offer", label: "Offer Letters", icon: <Award className="w-4 h-4" /> },
    { id: "communication", label: "Communication", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "settings", label: "Drive Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/csr-manager/drives"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives Hub
        </Link>
        <span className="text-xs font-mono text-muted-foreground">
          Global ID: {drive.id}
        </span>
      </div>

      {/* Hero Banner */}
      <Card className="border border-border/60 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                {drive.driveCode || drive.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                {drive.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{drive.name}</h1>
            <p className="text-xs text-muted-foreground">
              {drive.academicYear} • Category: {drive.category} • Mode: {drive.mode}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toast.success("Public QR code link copied to clipboard")}
              className="gap-1 text-xs"
            >
              <Share2 className="w-3.5 h-3.5" /> Share QR Pass
            </Button>
            <Button
              onClick={() => toast.info("Refreshing Supabase Realtime synchronization")}
              className="bg-primary text-white text-xs"
            >
              Sync Pipeline
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Progress Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-medium">1. Registration Progress</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{drive.metrics?.registeredStudents || 380} Registered</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Target: 500 Candidates (76%)</p>
            </Card>
            <Card className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-medium">2. Examination Progress</p>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{drive.metrics?.qualifiedStudents || 168} Qualified</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Cutoff: 60% Aggregate</p>
            </Card>
            <Card className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-medium">3. Interview Selection</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{drive.metrics?.interviewSelected || 0} Selected</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">HR Lead: {drive.assignments?.hrLeadName || "Unassigned"}</p>
            </Card>
            <Card className="border border-border/60 bg-card/70 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-muted-foreground font-medium">4. Offer Acceptance</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{drive.metrics?.acceptedOffers || 0} Accepted</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Realized Conversions</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/60 bg-card/80 rounded-3xl p-5 space-y-3 text-xs">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Key Drive Milestones
              </CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">Registration Period</span>
                  <span className="font-semibold text-foreground">{drive.schedule?.regStart || "—"} to {drive.schedule?.regEnd || "—"}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">Online Examination</span>
                  <span className="font-semibold text-foreground">{drive.schedule?.examDate || "—"}{drive.schedule?.examTime ? ` (${drive.schedule.examTime})` : ""}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">Interview Window</span>
                  <span className="font-semibold text-foreground">{drive.schedule?.interviewDate || "—"}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-muted/40 rounded-xl">
                  <span className="text-muted-foreground">Corporate Joining Date</span>
                  <span className="font-semibold text-foreground">{drive.schedule?.joiningDate || "—"}</span>
                </div>
              </div>
            </Card>

            <Card className="border border-border/60 bg-card/80 rounded-3xl p-5 space-y-3 text-xs">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Participating Institutions ({drive.metrics?.collegesCount || (drive as any).collegeIds?.length || 0})
              </CardTitle>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {colleges.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-2.5 bg-muted/30 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.district} • Principal: {c.principal?.name}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Timeline */}
      {activeTab === "timeline" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Realtime Drive Execution Timeline
          </CardTitle>
          <div className="space-y-4 text-xs pt-2">
            {[
              { title: "Drive Created & Initialized", status: "Done", date: "Jan 10, 2025", desc: "Syllabus and eligibility rules committed by CSR Manager." },
              { title: "Colleges Assigned & Contacted", status: "Done", date: "Jan 15, 2025", desc: "12 Karnataka colleges invited for bilateral participation." },
              { title: "College MoUs Ratified", status: "Done", date: "Jan 25, 2025", desc: "Institutional MoUs signed by college principals." },
              { title: "Registration Gateway Opened", status: "Done", date: "Feb 01, 2025", desc: "QR codes generated and broadcasted on campus WhatsApp groups." },
              { title: "Registration Window Closed", status: "Done", date: "Feb 15, 2025", desc: "380 student registrations locked for exam proctoring." },
              { title: "Exam Published & Proctoring Live", status: "Active", date: "Feb 18, 2025", desc: "Technical paper Set A dispatched to students." },
              { title: "HR Interview Panels", status: "Upcoming", date: "Feb 20, 2025", desc: "Lead HR interviews scheduled for qualified cohort." },
              { title: "Offer Letters Released", status: "Upcoming", date: "Feb 28, 2025", desc: "Digital LOI generated and sent for candidate acceptance." },
              { title: "Drive Completed & Audited", status: "Upcoming", date: "Mar 10, 2025", desc: "Final board report submission." },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  event.status === "Done" ? "bg-emerald-500 text-white" : event.status === "Active" ? "bg-primary text-white animate-pulse" : "bg-muted text-muted-foreground"
                }`}>
                  {event.status === "Done" ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className="flex-1 pb-3 border-b border-border/40">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground text-sm">{event.title}</span>
                    <span className="text-[11px] text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 3: Colleges */}
      {activeTab === "colleges" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Enrolled Institutions</CardTitle>
            <Link href="/csr-manager/colleges">
              <Button size="sm" variant="outline" className="text-xs">Manage All Colleges</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.map((c) => (
              <div key={c.id} className="p-4 border rounded-2xl bg-card space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-foreground">{c.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    {c.status}
                  </span>
                </div>
                <p className="text-muted-foreground">{c.district}, Karnataka • Principal: {c.principal?.name}</p>
                <div className="pt-2 border-t flex justify-between text-muted-foreground">
                  <span>PTO: {c.placementOfficer?.name}</span>
                  <span className="font-semibold text-foreground">{c.eligibleStudentsCount || 350} Eligible</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab 4: Students */}
      {activeTab === "students" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">Registered Candidates ({students.length})</CardTitle>
            <Link href="/csr-manager/candidates">
              <Button size="sm" variant="outline" className="text-xs">
                Open Full Candidate Pipeline →
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 uppercase tracking-wider text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">USN</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {students.slice(0, 8).map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{s.fullName}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.usn}</td>
                    <td className="p-3">{s.collegeName}</td>
                    <td className="p-3 font-semibold text-primary">{s.branch}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 5: Registration & QR */}
      {activeTab === "registration" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" /> Dynamic Student Registration Portal & QR
          </CardTitle>
          <div className="p-6 bg-muted/20 border border-border/60 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                <QrCode className="w-28 h-28 text-black" />
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-base text-foreground">Official Onboarding QR Pass</h3>
                <p className="text-muted-foreground font-mono">https://csr.gqt.in/register/{drive.driveCode || drive.id}</p>
                <p className="text-emerald-400 font-semibold pt-1">Accepting online submissions • Instant Hall Ticket release</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button onClick={() => toast.success("QR code image downloaded")}>
                <Download className="w-4 h-4 mr-1" /> Download High-Res QR
              </Button>
              <Button variant="outline" onClick={() => toast.success("Direct link copied")}>
                <Share2 className="w-4 h-4 mr-1" /> Copy Shareable URL
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 6: Exam Control */}
      {activeTab === "exam" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-primary" /> Examination Proctoring & Question Set
          </CardTitle>
          <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
            <p><strong className="text-foreground">Assigned Assessment:</strong> Karnataka State CSR Exam — Set A</p>
            <p><strong className="text-foreground">Question Bank:</strong> QB-J01 (Java, Python, Testing, SQL, Logical Aptitude)</p>
            <p><strong className="text-foreground">Time Limit & Cutoff:</strong> 60 Minutes • 60% Qualifying Cutoff</p>
            <p><strong className="text-foreground">Anti-Cheat Mode:</strong> Active AI Webcam Proctoring + Tab Lock</p>
          </div>
        </Card>
      )}

      {/* Tab 7: Interviews */}
      {activeTab === "interview" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" /> HR Recruiter Panel Allocation
          </CardTitle>
          <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
            <p><strong className="text-foreground">Lead Recruiter:</strong> {drive.assignments?.hrLeadName || "Unassigned"}</p>
            <p><strong className="text-foreground">Interview Queue:</strong> {drive.metrics?.interviewSelected || 0} Candidates in Interview Phase</p>
            <p><strong className="text-foreground">Slot Format:</strong> Technical Depth + Culture Alignment</p>
          </div>
        </Card>
      )}

      {/* Tab 8: Offer Letter */}
      {activeTab === "offer" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" /> Corporate Offer Letter Template & Generation
          </CardTitle>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 text-emerald-400">
            <h4 className="font-bold text-sm">GQT CSR Letter of Intent (LOI)</h4>
            <p className="text-muted-foreground">Compensation: Competitive CSR Package • Role: Associate Software Engineer</p>
            <p className="text-muted-foreground">Joining Date: {drive.schedule?.joiningDate || "—"}</p>
          </div>
        </Card>
      )}

      {/* Tab 9: Communication */}
      {activeTab === "communication" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Drive Communication Center
          </CardTitle>
          <div className="space-y-2">
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="font-bold text-foreground">WhatsApp Announcement: Exam Passes Released</p>
              <p className="text-muted-foreground text-[11px]">Dispatched to 380 candidate mobile numbers • Delivered</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl">
              <p className="font-bold text-foreground">Email to Placement Officers: Lab Schedule Verification</p>
              <p className="text-muted-foreground text-[11px]">Sent to 12 college PTO emails • 11 Confirmed</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 10: Reports */}
      {activeTab === "reports" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Campaign Performance & Audit Reports
            </CardTitle>
            <Link href="/csr-manager/reports">
              <Button size="sm" variant="outline" className="text-xs">
                Open Full CSR Reports Hub →
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" onClick={() => toast.success("Exported Registration Roster to Excel")}>
              Download Candidate Census
            </Button>
            <Button variant="outline" onClick={() => toast.success("Exported Exam Scores to PDF")}>
              Download Exam Scorecard Audit
            </Button>
            <Button variant="outline" onClick={() => toast.success("Exported Placed Roster to CSV")}>
              Download Placed Candidate Roster
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 11: Settings */}
      {activeTab === "settings" && (
        <Card className="border border-border/60 bg-card/80 rounded-3xl p-6 space-y-4 text-xs">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Drive Lifecycle Controls
          </CardTitle>
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Lock Candidate Registrations</p>
                <p className="text-muted-foreground text-[11px]">Prevents any further student submissions</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.info("Registrations closed")}>Close Gateway</Button>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-rose-400">Conclude & Archive Campaign</p>
                <p className="text-muted-foreground text-[11px]">Marks drive as Completed and triggers final compliance archive</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => toast.success("Drive archived successfully")}>Conclude Drive</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
