"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  FileText,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  Sliders,
  Download,
  Share2,
  Printer,
  Copy,
  Edit3,
  Send,
  Eye,
  Shuffle,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

interface PaperQuestionItem {
  number: number;
  id: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const SAMPLE_PAPER_QUESTIONS: PaperQuestionItem[] = [
  {
    number: 1,
    id: "Q-J01",
    category: "Java Full Stack",
    difficulty: "Easy",
    marks: 2,
    question: "Which of the following access specifiers allows class members to be visible only within the same package and subclasses in other packages?",
    options: ["public", "protected", "default (package-private)", "private"],
    correctAnswer: 1,
  },
  {
    number: 2,
    id: "Q-J02",
    category: "Java Full Stack",
    difficulty: "Medium",
    marks: 2,
    question: "What is the expected behavior when calling Thread.sleep() inside a synchronized method block in Java?",
    options: [
      "The thread releases the object monitor immediately",
      "The thread sleeps while holding the object monitor lock",
      "An IllegalMonitorStateException is thrown",
      "The thread terminates execution permanently",
    ],
    correctAnswer: 1,
  },
  {
    number: 3,
    id: "Q-S01",
    category: "SQL",
    difficulty: "Medium",
    marks: 2,
    question: "Which query correctly returns the second highest salary from the Employee table?",
    options: [
      "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee)",
      "SELECT salary FROM Employee ORDER BY salary DESC LIMIT 2",
      "SELECT salary FROM Employee GROUP BY salary HAVING COUNT(*) > 1",
      "SELECT TOP 2 salary FROM Employee",
    ],
    correctAnswer: 0,
  },
  {
    number: 4,
    id: "Q-L01",
    category: "Logical Reasoning",
    difficulty: "Easy",
    marks: 1,
    question: "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that code?",
    options: ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "EOJDJEFN"],
    correctAnswer: 0,
  },
  {
    number: 5,
    id: "Q-A01",
    category: "Aptitude",
    difficulty: "Hard",
    marks: 3,
    question: "A train running at 54 km/hr takes 20 seconds to pass a platform. Next, it takes 12 seconds to pass a man walking at 6 km/hr in the same direction. Find length of platform.",
    options: ["140 meters", "120 meters", "180 meters", "200 meters"],
    correctAnswer: 0,
  },
];

export default function QuestionPaperDetailPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const paperId = resolvedParams.paperId;

  const [paperTitle, setPaperTitle] = useState("Karnataka CSR Statewide Technical Assessment - Set Alpha");
  const [course] = useState("Full Stack Java Cloud Development & Agentic AI");
  const [graduateType] = useState("BE / B.Tech");
  const [duration] = useState(60);
  const [totalQuestions] = useState(50);
  const [totalMarks] = useState(100);
  const [cutoffPercentage] = useState(50);
  const [status, setStatus] = useState<"Published" | "Draft">("Published");

  const [showAnswerKeys, setShowAnswerKeys] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handlePublishToggle = () => {
    const next = status === "Published" ? "Draft" : "Published";
    setStatus(next);
    toast.success(`Question Paper status updated to ${next}`, {
      description: `Paper ${paperId} state synchronized with examination engine.`,
    });
  };

  const handleClonePaper = () => {
    toast.success(`Cloned Paper as Set Beta (${paperId}-CLONE)`, {
      description: "Seed re-randomized for next examination shift.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-papers"
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                {paperTitle}
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {paperId}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  status === "Published"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Course: <span className="font-semibold text-foreground">{course}</span> • Eligibility: {graduateType}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print / PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Copy className="w-4 h-4" />}
            onClick={handleClonePaper}
          >
            Clone Paper
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublishToggle}
          >
            {status === "Published" ? "Unpublish to Draft" : "Publish to Live"}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Duration</span>
          <span className="text-xl font-black text-foreground mt-1 block flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" /> {duration} Minutes
          </span>
          <span className="text-[10px] text-muted-foreground">Sticky Proctor Timer</span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Total Questions</span>
          <span className="text-xl font-black text-foreground mt-1 block">
            {totalQuestions} Questions
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold">Randomized Sequence</span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Maximum Score</span>
          <span className="text-xl font-black text-primary mt-1 block">
            {totalMarks} Marks
          </span>
          <span className="text-[10px] text-muted-foreground">Negative Marks Enabled</span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Cutoff Passing Score</span>
          <span className="text-xl font-black text-emerald-500 mt-1 block">
            {cutoffPercentage}% ({Math.round(totalMarks * (cutoffPercentage / 100))} Marks)
          </span>
          <span className="text-[10px] text-emerald-500 font-semibold">Interview Shortlist Gate</span>
        </Card>
      </div>

      {/* Difficulty Breakdown & Topic Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" /> Difficulty Distribution
            </span>
            <span className="text-xs font-mono text-muted-foreground">50 Questions</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-muted">
            <div style={{ width: "40%" }} className="bg-emerald-500" title="Easy (40%)" />
            <div style={{ width: "40%" }} className="bg-amber-500" title="Medium (40%)" />
            <div style={{ width: "20%" }} className="bg-rose-500" title="Hard (20%)" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold">
              <span>20 Easy</span>
              <span className="block text-[10px] font-normal">40%</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold">
              <span>20 Medium</span>
              <span className="block text-[10px] font-normal">40%</span>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold">
              <span>10 Hard</span>
              <span className="block text-[10px] font-normal">20%</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-5 space-y-3">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" /> Covered Examination Topics
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "Java 21 Fundamentals (12 Qs)",
              "OOP Architecture (8 Qs)",
              "Spring Boot & REST APIs (8 Qs)",
              "PostgreSQL & Complex Joins (7 Qs)",
              "Logical Deductions & Puzzles (8 Qs)",
              "Quantitative Aptitude (7 Qs)",
            ].map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{topic}</span>
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Generated Paper Questions Inspection Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Question Items Inspection &amp; Answer Keys
            </CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnswerKeys}
                  onChange={(e) => setShowAnswerKeys(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span>Show Designated Answer Keys</span>
              </label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {SAMPLE_PAPER_QUESTIONS.map((q) => (
            <div
              key={q.number}
              className="p-4 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                    {q.number}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">[{q.id}]</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                    {q.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.difficulty === "Easy"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : q.difficulty === "Medium"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-rose-500/10 text-rose-500"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="font-bold text-primary">{q.marks} Marks</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {q.options.map((opt, optIdx) => {
                  const isKey = q.correctAnswer === optIdx;
                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        showAnswerKeys && isKey
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold"
                          : "bg-background border-border text-foreground"
                      }`}
                    >
                      <span>
                        <strong className="mr-1.5">{String.fromCharCode(65 + optIdx)}.</strong>
                        {opt}
                      </span>
                      {showAnswerKeys && isKey && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">
                          KEY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
