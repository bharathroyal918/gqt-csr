"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  Code,
  Share2,
  Globe,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Maximize2,
  ShieldAlert,
  Star,
  ArrowLeft,
  Check,
  Send,
  Eye,
  FileCheck2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  History,
  X
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import Link from "next/link";
import { toast } from "sonner";

interface QuestionAttempt {
  id: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  maxMarks: number;
}

interface TimelineEvent {
  id: string;
  title: string;
  category: "Registration" | "Exam" | "Telemetry" | "Interview" | "Decision" | "Offer";
  timestamp: string;
  description: string;
  status: "Completed" | "Current" | "Pending";
}

const SAMPLE_QUESTIONS: QuestionAttempt[] = [
  {
    id: "Q-01",
    topic: "Core Java & Memory Model",
    difficulty: "Medium",
    questionText: "What happens when an object becomes eligible for Garbage Collection in Java, and how does the G1 collector handle Eden generation evacuation?",
    studentAnswer: "When no live thread has references in root set, it is marked for collection. G1 collector evacuates live objects from Eden regions into Survivor regions concurrently.",
    correctAnswer: "Objects unreachable from GC Roots are reclaimed. G1 copies surviving Eden objects into Survivor or Tenured regions with bounded pauses.",
    isCorrect: true,
    marksAwarded: 5,
    maxMarks: 5,
  },
  {
    id: "Q-02",
    topic: "Spring Boot Microservices & Resilience",
    difficulty: "Hard",
    questionText: "Explain the difference between Circuit Breaker patterns (Resilience4j) in HALF_OPEN vs OPEN states when microservices experience timeout cascades.",
    studentAnswer: "OPEN state rejects all incoming calls immediately. HALF_OPEN state permits a configurable trial batch of requests to evaluate downstream recovery.",
    correctAnswer: "In OPEN state, calls fail fast or fallback without network roundtrip. In HALF_OPEN, limited probe requests determine if the circuit should CLOSE or re-OPEN.",
    isCorrect: true,
    marksAwarded: 5,
    maxMarks: 5,
  },
  {
    id: "Q-03",
    topic: "Agentic AI & LangChain Architecture",
    difficulty: "Hard",
    questionText: "In an autonomous ReAct loop, how does the agent recover from a tool call hallucination error when querying an SQL database schema?",
    studentAnswer: "The observation error is fed back into the prompt buffer. The agent analyzes the syntax exception and formulates an amended query.",
    correctAnswer: "The LLM receives the runtime database error message in its scratchpad context, self-corrects the schema keys, and re-invokes the SQL tool.",
    isCorrect: true,
    marksAwarded: 5,
    maxMarks: 5,
  },
  {
    id: "Q-04",
    topic: "Data Structures & Complexity",
    difficulty: "Medium",
    questionText: "What is the worst-case space complexity of Dijkstra's algorithm implemented using an adjacency list and binary Min-Heap?",
    studentAnswer: "O(V + E) space complexity for storing the graph adjacency lists and the vertex distances.",
    correctAnswer: "O(V + E) space complexity for the priority queue and adjacency representations.",
    isCorrect: true,
    marksAwarded: 5,
    maxMarks: 5,
  },
  {
    id: "Q-05",
    topic: "SQL Indexing & Query Optimization",
    difficulty: "Hard",
    questionText: "Why can a B-Tree index fail to optimize a query with WHERE column_name LIKE '%searchTerm'?",
    studentAnswer: "Because it lacks prefix matching, requiring a full index scan.",
    correctAnswer: "Leading wildcard searches cannot utilize B-Tree order properties and require a full table or index scan.",
    isCorrect: true,
    marksAwarded: 5,
    maxMarks: 5,
  },
];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: "EV-01",
    title: "Student Registration Verified",
    category: "Registration",
    timestamp: "2026-09-12 10:15 AM",
    description: "Registered under RV College of Engineering. Academic records and Aadhaar documents verified by Faculty Coordinator.",
    status: "Completed",
  },
  {
    id: "EV-02",
    title: "Assessment Environment Launched",
    category: "Exam",
    timestamp: "2026-09-24 10:55 AM",
    description: "Candidate initiated proctored assessment session. Webcam, audio stream, and fullscreen mode calibrated.",
    status: "Completed",
  },
  {
    id: "EV-03",
    title: "Anti-Cheating Telemetry Clean",
    category: "Telemetry",
    timestamp: "2026-09-24 11:35 AM",
    description: "0 tab switches, 0 clipboard copy events, 0 multi-face intrusions detected throughout 48 minutes.",
    status: "Completed",
  },
  {
    id: "EV-04",
    title: "Exam Submitted & Auto-Graded",
    category: "Exam",
    timestamp: "2026-09-24 11:45 AM",
    description: "Score: 94 / 100 (94th percentile). Met and exceeded 60% benchmark cutoff. Status changed to Pending Review.",
    status: "Completed",
  },
  {
    id: "EV-05",
    title: "Technical Interview Slot Allocated",
    category: "Interview",
    timestamp: "2026-09-24 12:30 PM",
    description: "Scheduled for 1-on-1 video evaluation with Lead Recruiter Priya Nair via Google Meet.",
    status: "Current",
  },
];

export default function ReviewCandidateDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const resolvedParams = React.use(params);
  const studentId = resolvedParams.studentId || "";

  // Decision State
  const [currentDecision, setCurrentDecision] = useState<
    "Pending Review" | "Selected" | "Rejected" | "Hold" | "Not Attended"
  >("Pending Review");

  const [activeCenterTab, setActiveCenterTab] = useState<"questions" | "profile" | "timeline">("questions");
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>(["Q-01", "Q-02"]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE);

  // Resume Modal State
  const [isFullscreenResumeOpen, setIsFullscreenResumeOpen] = useState(false);

  // Decision Modal
  const [decisionModalType, setDecisionModalType] = useState<
    "Selected" | "Rejected" | "Hold" | "Not Attended" | null
  >(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [decisionRemarks, setDecisionRemarks] = useState("");
  const [rating, setRating] = useState(5);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleConfirmDecision = () => {
    if (!decisionReason || !decisionRemarks) {
      toast.error("Please provide both a reason and detailed remarks.");
      return;
    }

    if (decisionModalType) {
      setCurrentDecision(decisionModalType);

      // Append new event to timeline
      const newEvent: TimelineEvent = {
        id: `EV-${Date.now().toString().slice(-3)}`,
        title: `HR Decision: ${decisionModalType.toUpperCase()}`,
        category: "Decision",
        timestamp: "Just now",
        description: `Marked as ${decisionModalType} by HR Recruiter Priya Nair. Rating: ${rating}/5 Stars. Reason: "${decisionReason}".`,
        status: "Completed",
      };

      setTimelineEvents([newEvent, ...timelineEvents]);

      toast.success(
        `Candidate marked as ${decisionModalType}! Updated Supabase records and notified CSR Manager & Super Admin.`
      );
      setDecisionModalType(null);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/hr/students">
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Pipeline
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Candidate Evaluation Dossier</h1>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                {studentId}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              CSR Flagship Campus Drive 2026 • Verified Online Assessment Attempt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Current Status:</span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              currentDecision === "Selected"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : currentDecision === "Rejected"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : currentDecision === "Hold"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : currentDecision === "Not Attended"
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {currentDecision}
          </span>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Student Profile & Resume Preview (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl text-center">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200"
              alt="Rahul Verma"
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-[#005BBB] shadow-md"
            />
            <h2 className="text-lg font-bold text-slate-900 mt-3">Rahul Verma</h2>
            <p className="text-xs text-slate-500 font-mono">1RV22CS101</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#005BBB] text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              RV College of Engineering
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Branch:</span>
                <p className="font-semibold text-slate-800">Computer Science & Engg</p>
              </div>
              <div>
                <span className="text-slate-400">Course Track:</span>
                <p className="font-semibold text-[#005BBB]">Agentic AI Java Full Stack</p>
              </div>
              <div>
                <span className="text-slate-400">Undergraduate CGPA:</span>
                <p className="font-bold text-slate-900">8.92 / 10.00</p>
              </div>
              <div>
                <span className="text-slate-400">Active Backlogs:</span>
                <p className="font-bold text-emerald-600">0 (Clean Record)</p>
              </div>
            </div>

            {/* Social & Portfolio Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="GitHub"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                title="LinkedIn"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://portfolio.dev"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                title="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </Card>

          {/* Resume Preview Box */}
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-[#005BBB]" />
                Resume Vault (PDF)
              </div>
              <button
                onClick={() => toast.success("Downloading Rahul_Verma_Resume.pdf...")}
                className="text-slate-500 hover:text-[#005BBB]"
                title="Download Resume"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="h-44 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center p-3">
              <FileCheck2 className="w-10 h-10 text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Rahul_Verma_Resume.pdf</p>
              <span className="text-[10px] text-slate-400">Verified ATS Score: 92/100</span>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs h-7"
                onClick={() => setIsFullscreenResumeOpen(true)}
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Fullscreen Preview
              </Button>
            </div>
          </Card>
        </div>

        {/* CENTER PANEL: Score Card, Question Review, Profile & Timeline (6 Columns) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Exam Score Summary Card */}
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                <span className="text-[11px] text-slate-500">Overall Score</span>
                <p className="text-2xl font-bold text-[#005BBB] mt-0.5">94 / 100</p>
                <span className="text-[10px] text-teal-600 font-bold">94th Percentile</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                <span className="text-[11px] text-slate-500">Correct Answers</span>
                <p className="text-2xl font-bold text-emerald-600 mt-0.5">19 / 20</p>
                <span className="text-[10px] text-slate-400">1 Skipped</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                <span className="text-[11px] text-slate-500">Benchmark Cutoff</span>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">60%</p>
                <span className="text-[10px] text-emerald-600 font-bold">CLEARED (+34%)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                <span className="text-[11px] text-slate-500">Time Taken</span>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">48m 20s</p>
                <span className="text-[10px] text-slate-400">Limit: 60m</span>
              </div>
            </div>
          </Card>

          {/* Navigation Tabs (3 Tabs) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveCenterTab("questions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeCenterTab === "questions"
                  ? "bg-[#005BBB] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Question Review ({SAMPLE_QUESTIONS.length})
            </button>
            <button
              onClick={() => setActiveCenterTab("profile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeCenterTab === "profile"
                  ? "bg-[#005BBB] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Student Profile Dossier
            </button>
            <button
              onClick={() => setActiveCenterTab("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeCenterTab === "timeline"
                  ? "bg-[#005BBB] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Activity Timeline ({timelineEvents.length})
            </button>
          </div>

          {activeCenterTab === "questions" ? (
            /* Question-by-Question Accordion Review */
            <div className="space-y-3">
              {SAMPLE_QUESTIONS.map((q, idx) => {
                const isExpanded = expandedQuestions.includes(q.id);
                return (
                  <Card
                    key={q.id}
                    className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl"
                  >
                    <div
                      className="flex items-start justify-between gap-3 cursor-pointer select-none"
                      onClick={() => toggleQuestion(q.id)}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                              {q.topic}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                q.difficulty === "Hard"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-900 mt-1 leading-relaxed">
                            {q.questionText}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          +{q.marksAwarded} / {q.maxMarks}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-0.5">Candidate&apos;s Submitted Answer:</span>
                          <p className="text-slate-800 leading-relaxed font-mono text-[11px]">{q.studentAnswer}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                          <span className="font-bold text-emerald-900 block mb-0.5">Evaluated Benchmark Key:</span>
                          <p className="text-emerald-800 leading-relaxed font-mono text-[11px]">{q.correctAnswer}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : activeCenterTab === "profile" ? (
            /* Student Academic & Project Dossier (Comprehensive from Supabase) */
            <div className="space-y-4 text-xs text-slate-800">
              <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-[#005BBB]" />
                  1. Personal & Contact Details
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Full Name:</span>
                    <p className="font-semibold text-slate-900">Rahul Verma</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Official Email:</span>
                    <p className="font-semibold text-slate-900">rahul.verma@rvce.edu.in</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone Number:</span>
                    <p className="font-semibold text-slate-900">+91 98450 12891</p>
                  </div>
                  <div>
                    <span className="text-slate-400">District:</span>
                    <p className="font-semibold text-slate-900">Bengaluru Urban, Karnataka</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#005BBB]" />
                  2. Academic Qualifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400">10th Class</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">94.2%</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400">12th / PUC</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">92.0%</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400">Engineering CGPA</span>
                    <p className="font-bold text-[#005BBB] text-sm mt-0.5">8.92 / 10</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400">Passing Batch</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">2026</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#005BBB]" />
                  3. Key Technical Projects & Capstones
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Autonomous Multi-Agent DevOps Orchestrator</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">LangGraph • Python</span>
                  </div>
                  <p className="text-slate-600">Built using LangGraph, Python, Docker & Kubernetes. Self-heals CI/CD pipeline test regressions by analyzing stack traces.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">High-Throughput E-Commerce Microservices</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Spring Boot 3 • Kafka</span>
                  </div>
                  <p className="text-slate-600">Spring Boot 3, Kafka, Redis caching, and PostgreSQL handling 15,000 requests/sec with event sourcing.</p>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#005BBB]" />
                  4. Professional Certifications
                </h4>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  <li>Oracle Certified Professional: Java SE 17 Developer</li>
                  <li>AWS Certified Solutions Architect — Associate</li>
                  <li>DeepLearning.AI: Multi-Agent Systems with AutoGen</li>
                </ul>
              </Card>
            </div>
          ) : (
            /* Student Activity Timeline (Realtime Timeline from Prompt 4) */
            <div className="space-y-3">
              <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#005BBB]" />
                  Student Lifecycle & Evaluation Activity Timeline
                </h4>
                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {timelineEvents.map((evt) => (
                    <div key={evt.id} className="relative flex items-start gap-3 pl-8 text-xs">
                      <span
                        className={`absolute left-2 w-3.5 h-3.5 rounded-full border-2 border-white -translate-x-1/2 mt-0.5 ${
                          evt.status === "Completed"
                            ? "bg-emerald-500"
                            : evt.status === "Current"
                            ? "bg-[#005BBB] ring-2 ring-[#005BBB]/20 animate-pulse"
                            : "bg-slate-300"
                        }`}
                      />
                      <div className="flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">{evt.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Proctoring Violations & Anti-Cheating Telemetry (3 Columns) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Anti-Cheating Telemetry</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Tab Switch Count</span>
                <span className="font-bold text-emerald-600">0</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Fullscreen Violations</span>
                <span className="font-bold text-emerald-600">0</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Clipboard Copy Attempts</span>
                <span className="font-bold text-emerald-600">0 (Blocked)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Paste Attempts</span>
                <span className="font-bold text-emerald-600">0 (Blocked)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Webcam Multi-Face Flags</span>
                <span className="font-bold text-emerald-600">0</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Automated Termination</span>
                <span className="font-bold text-slate-800">None (Healthy)</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Assessment conducted under 100% video proctoring compliance. Integrity score: 99.8%.</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Fullscreen Resume Modal Preview */}
      {isFullscreenResumeOpen && (
        <Modal
          isOpen={isFullscreenResumeOpen}
          onClose={() => setIsFullscreenResumeOpen(false)}
          title="Candidate Resume Dossier (PDF)"
          subtitle="Rahul_Verma_Resume.pdf • ATS Score: 92/100"
          size="xl"
        >
          <div className="space-y-4 text-slate-800 text-xs">
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl space-y-4 font-sans shadow-inner max-h-[500px] overflow-y-auto">
              <div className="text-center pb-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">RAHUL VERMA</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Bengaluru, Karnataka • +91 98450 12891 • rahul.verma@rvce.edu.in • github.com/rahulverma
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005BBB] border-b pb-1 mb-2">Education</h4>
                <div className="flex justify-between font-semibold">
                  <span>R.V. College of Engineering, Bengaluru</span>
                  <span>2022 - 2026</span>
                </div>
                <p className="text-slate-600">B.E. in Computer Science & Engineering (CGPA: 8.92 / 10.0)</p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005BBB] border-b pb-1 mb-2">Technical Skills</h4>
                <p className="text-slate-700 leading-relaxed">
                  <strong>Languages & Frameworks:</strong> Java, Spring Boot 3, Python, LangChain, React, Next.js, Node.js, TypeScript<br />
                  <strong>Database & Cloud:</strong> PostgreSQL, Redis, MongoDB, AWS (EC2, S3, RDS), Docker, Kubernetes
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#005BBB] border-b pb-1 mb-2">Experience & Projects</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-slate-800">Autonomous Multi-Agent DevOps Orchestrator:</span>
                    <p className="text-slate-600">Formulated multi-agent feedback loop in Python to self-heal failed build tests.</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">High-Throughput E-Commerce Microservices:</span>
                    <p className="text-slate-600">Engineered distributed checkout service handling 15,000 requests/sec with zero downtime.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" onClick={() => setIsFullscreenResumeOpen(false)}>
                Close Preview
              </Button>
              <Button
                variant="cyan"
                onClick={() => {
                  toast.success("Downloaded Rahul_Verma_Resume.pdf");
                  setIsFullscreenResumeOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* STICKY HR DECISION PANEL (MOST IMPORTANT REQUIREMENT) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#005BBB] animate-ping" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Official HR Recruiter Decision</h4>
              <p className="text-xs text-slate-500">
                Select an outcome to automatically advance candidate through the live recruitment database.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="cyan"
              className="font-bold text-xs h-9 px-4 shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setDecisionModalType("Selected")}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              SELECTED
            </Button>

            <Button
              variant="outline"
              className="font-bold text-xs h-9 px-4 text-amber-700 border-amber-300 hover:bg-amber-50"
              onClick={() => setDecisionModalType("Hold")}
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              HOLD
            </Button>

            <Button
              variant="outline"
              className="font-bold text-xs h-9 px-4 text-rose-700 border-rose-300 hover:bg-rose-50"
              onClick={() => setDecisionModalType("Rejected")}
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              REJECTED
            </Button>

            <Button
              variant="secondary"
              className="font-bold text-xs h-9 px-4 text-purple-700"
              onClick={() => setDecisionModalType("Not Attended")}
            >
              <Clock className="w-4 h-4 mr-1.5" />
              NOT ATTENDED
            </Button>
          </div>
        </div>
      </div>

      {/* Decision Confirmation Modal */}
      {decisionModalType && (
        <Modal
          isOpen={!!decisionModalType}
          onClose={() => setDecisionModalType(null)}
          title={`Confirm HR Decision: ${decisionModalType.toUpperCase()}`}
          subtitle={`Candidate: Rahul Verma (${studentId}) • RV College of Engineering`}
          size="md"
        >
          <div className="space-y-4 text-slate-800 text-xs">
            <div
              className={`p-3 rounded-lg border text-xs font-semibold ${
                decisionModalType === "Selected"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : decisionModalType === "Rejected"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {decisionModalType === "Selected" &&
                "Confirming 'SELECTED' will update student_status = selected, create an interview record, log activity, and notify Admin & CSR Manager."}
              {decisionModalType === "Rejected" &&
                "Confirming 'REJECTED' will update student_status = rejected, archive candidate into Rejected Students table, and log stage of elimination."}
              {decisionModalType === "Hold" &&
                "Confirming 'HOLD' will move candidate to Hold Queue for secondary technical review."}
              {decisionModalType === "Not Attended" &&
                "Confirming 'NOT ATTENDED' will mark absenteeism and save attendance logs."}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluation Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Decision Reason *</label>
              <input
                type="text"
                placeholder="e.g. Exceptional Java memory concepts and 94% test score"
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confidential HR Remarks *</label>
              <textarea
                rows={3}
                placeholder="Detailed feedback regarding candidate's project depth, problem solving, and technical alignment..."
                value={decisionRemarks}
                onChange={(e) => setDecisionRemarks(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setDecisionModalType(null)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                onClick={handleConfirmDecision}
                className={
                  decisionModalType === "Selected"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : decisionModalType === "Rejected"
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : ""
                }
              >
                Confirm {decisionModalType}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
