"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Search,
  Eye,
  Archive,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Sliders,
  Send
} from "lucide-react";

interface QuestionPaper {
  id: string;
  paperTitle: string;
  course: string;
  graduateType: string;
  questionCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  timeLimitMinutes: number;
  cutoffPercentage: number;
  negativeMarking: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  status: "Published" | "Draft" | "Archived";
  createdAt: string;
}

const INITIAL_PAPERS: QuestionPaper[] = [
  {
    id: "QP-2025-01",
    paperTitle: "Karnataka CSR Statewide Technical Assessment - Set A",
    course: "Full Stack Java Development",
    graduateType: "BE / B.Tech",
    questionCount: 50,
    easyCount: 20,
    mediumCount: 20,
    hardCount: 10,
    timeLimitMinutes: 60,
    cutoffPercentage: 60,
    negativeMarking: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    status: "Published",
    createdAt: "2025-02-10",
  },
  {
    id: "QP-2025-02",
    paperTitle: "AI & Python Data Analytics Entrance - Set B",
    course: "Artificial Intelligence & Data Analytics",
    graduateType: "BE / MCA",
    questionCount: 40,
    easyCount: 15,
    mediumCount: 15,
    hardCount: 10,
    timeLimitMinutes: 45,
    cutoffPercentage: 65,
    negativeMarking: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    status: "Published",
    createdAt: "2025-02-12",
  },
  {
    id: "QP-2025-03",
    paperTitle: "Core Software Testing & Automation Screening",
    course: "Software Testing & QA",
    graduateType: "B.Sc / BCA / BE",
    questionCount: 30,
    easyCount: 15,
    mediumCount: 10,
    hardCount: 5,
    timeLimitMinutes: 40,
    cutoffPercentage: 55,
    negativeMarking: false,
    shuffleQuestions: true,
    shuffleOptions: false,
    status: "Draft",
    createdAt: "2025-02-14",
  },
];

export default function AdminQuestionPapersPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>(INITIAL_PAPERS);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);

  // Generator form
  const [formData, setFormData] = useState({
    paperTitle: "",
    course: "Full Stack Java Development",
    graduateType: "BE / B.Tech",
    questionCount: 50,
    easyPercent: 40,
    mediumPercent: 40,
    hardPercent: 20,
    timeLimitMinutes: 60,
    cutoffPercentage: 60,
    negativeMarking: true,
    shuffleQuestions: true,
    shuffleOptions: true,
  });

  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paperTitle) {
      toast.error("Please enter a question paper title");
      return;
    }
    const easyCount = Math.round((formData.questionCount * formData.easyPercent) / 100);
    const mediumCount = Math.round((formData.questionCount * formData.mediumPercent) / 100);
    const hardCount = formData.questionCount - easyCount - mediumCount;

    const newPaper: QuestionPaper = {
      id: `QP-${Date.now().toString().slice(-4)}`,
      paperTitle: formData.paperTitle,
      course: formData.course,
      graduateType: formData.graduateType,
      questionCount: formData.questionCount,
      easyCount,
      mediumCount,
      hardCount,
      timeLimitMinutes: formData.timeLimitMinutes,
      cutoffPercentage: formData.cutoffPercentage,
      negativeMarking: formData.negativeMarking,
      shuffleQuestions: formData.shuffleQuestions,
      shuffleOptions: formData.shuffleOptions,
      status: "Published",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setPapers([newPaper, ...papers]);
    setIsGeneratorOpen(false);
    toast.success(`Question paper "${newPaper.paperTitle}" assembled and published!`);
  };

  const handleArchive = (id: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Archived" } : p))
    );
    toast.info("Paper archived");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Automated Paper Generation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Question Paper Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Synthesize randomized examination sets with algorithmic difficulty distribution, anti-cheat shuffling, and cutoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/question-papers/create">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate Question Paper
            </Button>
          </Link>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {papers.map((p) => (
          <Card key={p.id} className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="border-b border-border/40 pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{p.id}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    p.status === "Published"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : p.status === "Draft"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-2 line-clamp-2">
                {p.paperTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">Track: <span className="font-semibold text-foreground">{p.course}</span></p>
                <p className="text-muted-foreground">Eligibility: <span className="font-semibold text-foreground">{p.graduateType}</span></p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-[10px] text-muted-foreground">Questions</p>
                  <p className="font-bold text-foreground">{p.questionCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Time Limit</p>
                  <p className="font-bold text-blue-400">{p.timeLimitMinutes}m</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Cutoff</p>
                  <p className="font-bold text-emerald-400">{p.cutoffPercentage}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Mix: {p.easyCount}E / {p.mediumCount}M / {p.hardCount}H</span>
                <span>{p.negativeMarking ? "Neg Marking On" : "No Neg Marking"}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Link href={`/admin/question-papers/${p.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 text-xs">
                    <Eye className="w-3.5 h-3.5 mr-1" /> Preview Paper
                  </Button>
                </Link>
                {p.status !== "Archived" && (
                  <Button size="sm" variant="ghost" onClick={() => handleArchive(p.id)} className="h-8 text-xs text-rose-400">
                    <Archive className="w-3.5 h-3.5 mr-1" /> Archive
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generator Modal */}
      <Modal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        title="AI Question Paper Synthesis Engine"
      >
        <form onSubmit={handleCreatePaper} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Paper Title *</label>
            <Input
              value={formData.paperTitle}
              onChange={(e) => setFormData({ ...formData, paperTitle: e.target.value })}
              placeholder="e.g. CSR Karnataka Phase 1 Exam 2025"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Target Course</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="Full Stack Java Development">Full Stack Java Development</option>
                <option value="Python & AI Engineering">Python & AI Engineering</option>
                <option value="Software Testing & QA">Software Testing & QA</option>
                <option value="Data Analytics & SQL">Data Analytics & SQL</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Graduate Type</label>
              <select
                value={formData.graduateType}
                onChange={(e) => setFormData({ ...formData, graduateType: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="BE / B.Tech">BE / B.Tech</option>
                <option value="MCA / M.Tech">MCA / M.Tech</option>
                <option value="BCA / B.Sc">BCA / B.Sc</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Total Questions</label>
              <Input
                type="number"
                value={formData.questionCount}
                onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Time (Minutes)</label>
              <Input
                type="number"
                value={formData.timeLimitMinutes}
                onChange={(e) => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Cutoff (%)</label>
              <Input
                type="number"
                value={formData.cutoffPercentage}
                onChange={(e) => setFormData({ ...formData, cutoffPercentage: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="p-3 bg-muted/40 rounded-xl space-y-2 text-xs">
            <p className="font-semibold text-foreground">Anti-Cheat Shuffling & Penalties</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={(e) => setFormData({ ...formData, negativeMarking: e.target.checked })}
                />
                Negative Marking
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shuffleQuestions}
                  onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                />
                Shuffle Questions
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                />
                Shuffle Options
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsGeneratorOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white">Assemble & Publish</Button>
          </div>
        </form>
      </Modal>

      {/* Preview Paper Modal */}
      {previewPaper && (
        <Modal
          isOpen={!!previewPaper}
          onClose={() => setPreviewPaper(null)}
          title={`Paper Blueprint: ${previewPaper.paperTitle}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-bold text-foreground">{previewPaper.course}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Difficulty Spread</p>
                <p className="font-bold text-foreground">{previewPaper.easyCount} Easy, {previewPaper.mediumCount} Medium, {previewPaper.hardCount} Hard</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration & Cutoff</p>
                <p className="font-bold text-foreground">{previewPaper.timeLimitMinutes} Mins • {previewPaper.cutoffPercentage}% Qualifying</p>
              </div>
              <div>
                <p className="text-muted-foreground">Anti-Cheat Protections</p>
                <p className="font-bold text-emerald-400">Randomized Question & Option Permutation</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewPaper(null)}>Close Blueprint</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
