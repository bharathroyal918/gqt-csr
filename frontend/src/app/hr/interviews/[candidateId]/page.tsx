"use client";

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  FileText,
  ExternalLink,
  Globe,
  Award,
  ShieldCheck,
  Building2,
  Calendar,
  Send,
  Save,
  Sparkles,
  ChevronRight,
  Download,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Check,
  Layers,
  Code
} from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5 text-blue-600" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import {
  convertStudentToCandidateProfile,
  CandidateFullProfile,
  TechnicalRubrics,
  HrRubrics
} from "@/lib/recruitment/recruitmentData";
import Link from "next/link";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ candidateId: string }>;
}

export default function CandidateReviewWorkspacePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const candidateId = resolvedParams.candidateId;
  const { students, updateStudent, logAuditAction } = useApp();

  const matchedStudent =
    students.find((s) => s.id === candidateId || s.studentId === candidateId || s.email === candidateId);

  const initialCandidate = React.useMemo(() => {
    return matchedStudent
      ? convertStudentToCandidateProfile(matchedStudent)
      : ({
        id: candidateId,
        studentId: candidateId,
        fullName: "Candidate",
        photoUrl: "",
        email: "",
        mobile: "",
        whatsapp: "",
        collegeId: "",
        collegeName: "",
        usn: "",
        university: "",
        graduateType: "",
        branch: "",
        semester: 0,
        passingYear: 0,
        cgpa: 0,
        tenthPercentage: 0,
        twelfthPercentage: 0,
        city: "",
        district: "",
        state: "",
        preferredTrainingMode: "",
        appliedDriveId: "",
        appliedDriveName: "",
        appliedRole: "",
        appliedAt: new Date().toISOString(),
        status: "",
        currentStage: "",
        aptitudeScore: 0,
        aptitudePercentile: 0,
        technicalScore: 0,
        hrScore: 0,
        overallScore: 0,
        projects: [],
        timeline: [],
      } as unknown as CandidateFullProfile);
  }, [matchedStudent, candidateId]);

  const [candidate, setCandidate] = useState<CandidateFullProfile>(initialCandidate);

  useEffect(() => {
    if (matchedStudent) {
      setCandidate(convertStudentToCandidateProfile(matchedStudent));
    }
  }, [matchedStudent]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "exam" | "resume" | "projects" | "links" | "timeline"
  >("overview");

  // Live Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Technical Rubrics State (1 - 10)
  const [techRubrics, setTechRubrics] = useState<TechnicalRubrics>(
    candidate.technicalEvaluation || {
      programmingKnowledge: 0,
      domainKnowledge: 0,
      sqlDatabase: 0,
      problemSolving: 0,
      debugging: 0,
      apiKnowledge: 0,
      aiConcepts: 0,
      testingKnowledge: 0,
      dataStructures: 0,
      projectExplanation: 0,
      codingLogic: 0,
      overallScore: 0,
      remarks: "",
    }
  );

  // HR Rubrics State (1 - 10)
  const [hrRubrics, setHrRubrics] = useState<HrRubrics>(
    candidate.hrEvaluation || {
      communication: 0,
      confidence: 0,
      presentation: 0,
      englishArticulation: 0,
      teamwork: 0,
      leadership: 0,
      learningAbility: 0,
      careerInterest: 0,
      availability: 0,
      overallScore: 0,
      remarks: "",
    }
  );

  // Recalculate averages when sliders change
  const handleTechChange = (key: keyof TechnicalRubrics, val: number | string) => {
    setTechRubrics((prev) => {
      const next = { ...prev, [key]: val };
      if (typeof val === "number") {
        const scores = [
          next.programmingKnowledge,
          next.domainKnowledge,
          next.sqlDatabase,
          next.problemSolving,
          next.debugging,
          next.apiKnowledge,
          next.aiConcepts,
          next.testingKnowledge,
          next.dataStructures,
          next.projectExplanation,
          next.codingLogic,
        ];
        const avg = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
        next.overallScore = avg;
      }
      return next;
    });
  };

  const handleHrChange = (key: keyof HrRubrics, val: number | string) => {
    setHrRubrics((prev) => {
      const next = { ...prev, [key]: val };
      if (typeof val === "number") {
        const scores = [
          next.communication,
          next.confidence,
          next.presentation,
          next.englishArticulation,
          next.teamwork,
          next.leadership,
          next.learningAbility,
          next.careerInterest,
          next.availability,
        ];
        const avg = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
        next.overallScore = avg;
      }
      return next;
    });
  };

  // Notes state & autosave
  const [notesSummary, setNotesSummary] = useState(candidate.interviewNotes?.summary || "");
  const [strengths, setStrengths] = useState(
    candidate.interviewNotes?.strengths.join(", ") || ""
  );
  const [weaknesses, setWeaknesses] = useState(
    candidate.interviewNotes?.weaknesses.join(", ") || ""
  );
  const [lastAutosaved, setLastAutosaved] = useState("Just now");

  const handleManualSaveNotes = () => {
    setLastAutosaved(new Date().toLocaleTimeString());
    toast.success("Interview rubrics and notes autosaved!");
  };

  // Decision Modal States
  const [decisionModal, setDecisionModal] = useState<"Selected" | "Rejected" | "Hold" | "Not Attended" | null>(null);
  const [proposedRole, setProposedRole] = useState("Associate Software Engineer - Java & Agentic AI");
  const [proposedCtc, setProposedCtc] = useState("₹ 6.50 LPA");
  const [proposedBatch, setProposedBatch] = useState("2026 Batch Alpha");
  const [decisionReason, setDecisionReason] = useState("");
  const [followUpDate, setFollowUpDate] = useState("2026-10-02");

  // Handle final decision execution
  const handleExecuteDecision = () => {
    if (!decisionModal) return;

    if (decisionModal === "Rejected" && !decisionReason.trim()) {
      toast.error("Please specify rejection reasoning.");
      return;
    }

    const timestamp = new Date().toISOString();
    const updatedCandidate: CandidateFullProfile = {
      ...candidate,
      status: decisionModal === "Selected" ? "Selected" : decisionModal,
      technicalEvaluation: techRubrics,
      hrEvaluation: hrRubrics,
      interviewNotes: {
        strengths: strengths.split(",").map((s) => s.trim()),
        weaknesses: weaknesses.split(",").map((w) => w.trim()),
        summary: notesSummary,
        lastSaved: timestamp,
      },
      decision: {
        outcome: decisionModal,
        reason: decisionReason,
        followUpDate: decisionModal === "Hold" ? followUpDate : undefined,
        decidedBy: "HR Panel Lead",
        timestamp,
        notes: notesSummary || decisionReason,
      },
      offerData:
        decisionModal === "Selected"
          ? {
            joiningRole: proposedRole,
            course: candidate.selectedCourse,
            batch: proposedBatch,
            joiningDate: "",
            reportingTime: "",
            reportingLocation: "",
            trainingCenter: "",
            ctc: proposedCtc,
            stipend: "",
            offerStatus: "Pending Offer",
            remarks: "Selected by Technical & HR Panel with high distinction.",
          }
          : undefined,
    };

    setCandidate(updatedCandidate);

    // Sync into global AppContext for real-time reflection across portals
    updateStudent(candidate.id, {
      status:
        decisionModal === "Selected"
          ? "HR Selected"
          : decisionModal === "Rejected"
            ? "HR Rejected"
            : decisionModal === "Hold"
              ? "HR On Hold"
              : "Not Attended",
    });

    logAuditAction(
      `CANDIDATE_${decisionModal.toUpperCase()}`,
      "HR Interview",
      candidate.id,
      `Marked ${candidate.fullName} as ${decisionModal}. Tech Score: ${techRubrics.overallScore}, HR Score: ${hrRubrics.overallScore}.`
    );

    setDecisionModal(null);
    toast.success(`Candidate marked as ${decisionModal}!`, {
      description:
        decisionModal === "Selected"
          ? "Candidate moved to Offer Preparation Queue."
          : `Candidate status updated to ${decisionModal}.`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar Header with Candidate Identity, Timer, and Meeting Room */}
      <div className="bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-4 lg:p-5 rounded-2xl shadow-xl border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {candidate.photoUrl && candidate.photoUrl.trim() !== "" ? (
            <img
              src={candidate.photoUrl}
              alt={candidate.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#14B8FF] shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#14B8FF]/20 text-[#14B8FF] border-2 border-[#14B8FF] flex items-center justify-center text-xl font-bold shadow-md">
              {candidate.fullName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">{candidate.fullName}</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
                {candidate.status}
              </span>
            </div>
            <p className="text-white/80 text-xs mt-0.5">
              {candidate.usn} • {candidate.collegeName} • {candidate.selectedCourse}
            </p>
          </div>
        </div>

        {/* Live Timer & Meeting Room Quick Links */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-black/30 border border-white/20 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-[#14B8FF]" />
            <span className="font-mono text-sm font-bold tracking-wider">{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded hover:bg-white/10 text-white/80"
              title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="p-1 rounded hover:bg-white/10 text-white/80"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {candidate.interviewSlot?.meetingLink && (
            <a
              href={candidate.interviewSlot.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg transition-colors"
            >
              <Video className="w-4 h-4" />
              Join Video Room
            </a>
          )}

          <Link href="/hr/candidates">
            <Button variant="outline" size="sm" className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20">
              Pipeline Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Split-Screen Layout: Left 60% Tabs Profile, Right 40% Evaluation & Sticky Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Panel: Tabs for Candidate Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-card border border-border p-1.5 rounded-xl overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview & Academics" },
              { id: "exam", label: "Exam & Telemetry" },
              { id: "resume", label: "Resume Review" },
              { id: "projects", label: "Projects & GitHub" },
              { id: "links", label: "Portfolios" },
              { id: "timeline", label: "Audit Timeline" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW & ACADEMIC */}
          {activeTab === "overview" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Academic & Institution Dossier
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">Degree / Stream</span>
                  <span className="font-semibold text-foreground">{candidate.graduateType} in {candidate.branch}</span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">Cumulative CGPA</span>
                  <span className="font-bold text-primary text-sm">{candidate.cgpa} / 10.0</span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">Graduation Year</span>
                  <span className="font-semibold text-foreground">{candidate.passingYear} (Sem {candidate.semester})</span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">10th / Secondary</span>
                  <span className="font-semibold text-foreground">{candidate.tenthPercentage}%</span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">12th / PUC</span>
                  <span className="font-semibold text-foreground">{candidate.twelfthPercentage}%</span>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[11px]">Training Mode Pref</span>
                  <span className="font-semibold text-foreground">{candidate.preferredTrainingMode}</span>
                </div>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                <p><strong>University:</strong> {candidate.university}</p>
                <p><strong>Campus Location:</strong> {candidate.city}, {candidate.district}, {candidate.state}</p>
                <p><strong>Contact Email:</strong> {candidate.email} | <strong>Mobile:</strong> {candidate.mobile}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground block mb-2">Technical Skills & Stacks</span>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: EXAM & TELEMETRY */}
          {activeTab === "exam" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Online Examination Performance</h3>
                  <p className="text-xs text-muted-foreground">Automated scoring and anti-malpractice telemetry audit</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-primary">{candidate.exam.score}/100</span>
                  <span className="text-xs text-muted-foreground block">Cutoff: {candidate.exam.cutoff}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
                <div className="p-2.5 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[10px]">Statewide Rank</span>
                  <span className="font-bold text-sm text-primary">#{candidate.exam.statewideRank}</span>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[10px]">College Rank</span>
                  <span className="font-bold text-sm text-foreground">#{candidate.exam.collegeRank}</span>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[10px]">Percentile</span>
                  <span className="font-bold text-sm text-foreground">{candidate.exam.percentile}%</span>
                </div>
                <div className="p-2.5 bg-muted/40 rounded-lg">
                  <span className="text-muted-foreground block text-[10px]">Time Taken</span>
                  <span className="font-bold text-sm text-foreground">{candidate.exam.timeTakenMinutes} mins</span>
                </div>
              </div>

              {/* Section Analysis */}
              <div>
                <span className="text-xs font-bold text-foreground block mb-2">Sectional Competency Breakdown</span>
                <div className="space-y-2">
                  {candidate.exam.sectionAnalysis.map((sec) => (
                    <div key={sec.section} className="text-xs">
                      <div className="flex justify-between font-medium mb-1">
                        <span className="text-foreground">{sec.section}</span>
                        <span className="text-muted-foreground">{sec.score}/{sec.total} ({sec.accuracy}%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${sec.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-Malpractice Telemetry */}
              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Proctoring Telemetry
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {candidate.exam.telemetryStatus}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Violations detected: {candidate.exam.violationsCount} • Tab switches: {candidate.exam.tabSwitchCount} • Fullscreen exits: 0. Exam conducted under strict anti-malpractice lockdown.
                </p>
              </div>
            </Card>
          )}

          {/* TAB 3: RESUME REVIEW */}
          {activeTab === "resume" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Digital Resume & Verified Credentials
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                  onClick={() => toast.success(`Downloading official resume for ${candidate.fullName}`)}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </Button>
              </div>

              <div className="p-6 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
                <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">Digital Resume Preview (Authenticated)</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                  Resume uploaded during CSR Drive Registration and cryptographically hashed with the placement records.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs"
                    onClick={() => toast.info("Opening fullscreen document reader...")}
                  >
                    Open Document Reader
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: PROJECTS & GITHUB */}
          {activeTab === "projects" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                Uploaded Projects & GitHub Repositories
              </h3>

              <div className="space-y-3">
                {candidate.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-foreground">{proj.title}</h4>
                      {proj.rating && (
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          {proj.rating}/5.0
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{proj.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-border mt-2">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        Source Code
                      </a>
                      {proj.liveDemoUrl && (
                        <a
                          href={proj.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {candidate.projects.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No custom projects uploaded by candidate.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* TAB 5: LINKS & PORTFOLIOS */}
          {activeTab === "links" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground">External Profiles & Portfolios</h3>
              <div className="space-y-3">
                {candidate.githubUrl && (
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <GithubIcon className="w-5 h-5 text-foreground" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">GitHub Profile</p>
                        <p className="text-[11px] text-muted-foreground">{candidate.githubUrl}</p>
                      </div>
                    </div>
                    <a href={candidate.githubUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="text-xs">
                        Open <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                )}

                {candidate.linkedinUrl && (
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <LinkedinIcon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">LinkedIn Profile</p>
                        <p className="text-[11px] text-muted-foreground">{candidate.linkedinUrl}</p>
                      </div>
                    </div>
                    <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="text-xs">
                        Open <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                )}

                {candidate.portfolioUrl && (
                  <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Personal Portfolio</p>
                        <p className="text-[11px] text-muted-foreground">{candidate.portfolioUrl}</p>
                      </div>
                    </div>
                    <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline" className="text-xs">
                        Open <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* TAB 6: TIMELINE */}
          {activeTab === "timeline" && (
            <Card className="p-5 bg-card border border-border shadow-sm rounded-xl space-y-4">
              <h3 className="font-bold text-sm text-foreground">Candidate Forensic Journey</h3>
              <div className="space-y-3">
                {candidate.timeline.map((evt) => (
                  <div key={evt.id} className="flex gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{evt.title}</span>
                        <span className="text-[10px] text-muted-foreground">{evt.timestamp}</span>
                        <span className="text-[10px] px-1.5 rounded bg-muted text-muted-foreground font-mono">{evt.actor}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel: Sticky Evaluation Rubrics & Decision Center (40%) */}
        <div className="lg:col-span-5 space-y-4 sticky top-4">
          {/* Technical Evaluation Rubrics (1-10) */}
          <Card className="p-4 bg-card border border-border shadow-sm rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Code className="w-4 h-4 text-primary" />
                Technical Rubrics (1–10)
              </span>
              <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                Score: {techRubrics.overallScore}/10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: "programmingKnowledge", label: "Programming Core" },
                { key: "domainKnowledge", label: "Domain Track (Java/Py/MERN)" },
                { key: "sqlDatabase", label: "SQL & RDBMS Concepts" },
                { key: "problemSolving", label: "Algorithmic Problem Solving" },
                { key: "debugging", label: "Debugging & Tracing" },
                { key: "apiKnowledge", label: "API & Microservices" },
                { key: "aiConcepts", label: "AI & Modern Tools" },
                { key: "dataStructures", label: "Data Structures & Time Complex" },
                { key: "codingLogic", label: "Clean Code Logic" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground truncate w-48">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={techRubrics[key as keyof TechnicalRubrics] as number}
                      onChange={(e) => handleTechChange(key as keyof TechnicalRubrics, Number(e.target.value))}
                      className="w-24 accent-primary"
                    />
                    <span className="font-bold text-foreground w-5 text-right">
                      {techRubrics[key as keyof TechnicalRubrics]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Technical Remarks</label>
              <textarea
                value={techRubrics.remarks}
                onChange={(e) => handleTechChange("remarks", e.target.value)}
                rows={2}
                placeholder="Candidate's technical strengths, coding speed, depth..."
                className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
              />
            </div>
          </Card>

          {/* HR Evaluation Rubrics (1-10) */}
          <Card className="p-4 bg-card border border-border shadow-sm rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                HR Evaluation Rubrics (1–10)
              </span>
              <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950">
                Score: {hrRubrics.overallScore}/10
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: "communication", label: "Communication Skills" },
                { key: "confidence", label: "Confidence & Poise" },
                { key: "presentation", label: "Presentation" },
                { key: "englishArticulation", label: "English Articulation" },
                { key: "teamwork", label: "Teamwork & Collaboration" },
                { key: "learningAbility", label: "Learning Agility" },
                { key: "availability", label: "Relocation & Availability" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground truncate w-48">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={hrRubrics[key as keyof HrRubrics] as number}
                      onChange={(e) => handleHrChange(key as keyof HrRubrics, Number(e.target.value))}
                      className="w-24 accent-emerald-600"
                    />
                    <span className="font-bold text-foreground w-5 text-right">
                      {hrRubrics[key as keyof HrRubrics]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Interview Notes Editor with Autosave */}
          <Card className="p-4 bg-card border border-border shadow-sm rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Interview Notes & Observations</span>
              <button
                onClick={handleManualSaveNotes}
                className="text-[10px] text-primary hover:underline flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Autosaved: {lastAutosaved}
              </button>
            </div>
            <textarea
              value={notesSummary}
              onChange={(e) => setNotesSummary(e.target.value)}
              rows={2}
              placeholder="Key conversational highlights, cultural fit observations..."
              className="w-full text-xs p-2 rounded-lg border border-border bg-background text-foreground"
            />
          </Card>

          {/* Sticky Decision Engine Buttons */}
          <Card className="p-4 bg-card border-2 border-primary/20 shadow-lg rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Recruitment Decision Engine
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
                onClick={() => setDecisionModal("Selected")}
              >
                <CheckCircle2 className="w-4 h-4" />
                SELECTED
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5"
                onClick={() => setDecisionModal("Rejected")}
              >
                <XCircle className="w-4 h-4" />
                REJECTED
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="text-xs font-bold bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center gap-1.5"
                onClick={() => setDecisionModal("Hold")}
              >
                <AlertCircle className="w-4 h-4" />
                HOLD
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold text-purple-600 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 flex items-center justify-center gap-1.5"
                onClick={() => setDecisionModal("Not Attended")}
              >
                <Clock className="w-4 h-4" />
                NOT ATTENDED
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modals for Decisions */}
      {decisionModal && (
        <Modal
          isOpen={!!decisionModal}
          onClose={() => setDecisionModal(null)}
          title={`Confirm Decision: ${decisionModal.toUpperCase()} — ${candidate.fullName}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              You are about to commit the final hiring decision for <strong>{candidate.fullName}</strong> ({candidate.usn}). This action synchronizes directly into database, the Student Portal, and the CSR Manager Dashboard.
            </p>

            {decisionModal === "Selected" && (
              <div className="space-y-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
                <div>
                  <label className="font-semibold block mb-1">Recommended Job Role</label>
                  <input
                    type="text"
                    value={proposedRole}
                    onChange={(e) => setProposedRole(e.target.value)}
                    className="w-full p-2 rounded border border-border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Proposed Package (CTC)</label>
                    <input
                      type="text"
                      value={proposedCtc}
                      onChange={(e) => setProposedCtc(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Assigned Batch</label>
                    <input
                      type="text"
                      value={proposedBatch}
                      onChange={(e) => setProposedBatch(e.target.value)}
                      className="w-full p-2 rounded border border-border bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {decisionModal === "Rejected" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground block">Mandatory Rejection Feedback *</label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  rows={3}
                  placeholder="Detail candidate technical or cultural gaps..."
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>
            )}

            {decisionModal === "Hold" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Follow-up Re-evaluation Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-2 rounded border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Reason for Hold</label>
                  <textarea
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    rows={2}
                    placeholder="e.g. Needs secondary technical interview on distributed systems..."
                    className="w-full p-2 rounded border border-border bg-background"
                  />
                </div>
              </div>
            )}

            {decisionModal === "Not Attended" && (
              <div className="space-y-2 text-xs">
                <label className="font-semibold block">Absence Reason / Reschedule Note</label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Candidate experienced campus power outage; reschedule requested..."
                  className="w-full p-2 rounded border border-border bg-background"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setDecisionModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteDecision}
                className={
                  decisionModal === "Selected"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : decisionModal === "Rejected"
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-[#005BBB]"
                }
              >
                Confirm Decision
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
