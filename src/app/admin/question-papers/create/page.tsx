"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Shuffle,
  ShieldCheck,
  Send,
  Eye,
  FileText,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function CreateQuestionPaperPage() {
  const router = useRouter();
  const { drives } = useApp();

  const [paperName, setPaperName] = useState("Karnataka CSR Statewide Technical Assessment 2026 - Set Alpha");
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || "drv-1");
  const [course, setCourse] = useState("Full Stack Java Cloud Development & Agentic AI");
  const [graduateType, setGraduateType] = useState("BE / B.Tech");
  const [duration, setDuration] = useState<number>(60);
  const [totalQuestions, setTotalQuestions] = useState<number>(50);
  const [totalMarks, setTotalMarks] = useState<number>(100);
  const [cutoffPercentage, setCutoffPercentage] = useState<number>(50);

  // Anti-cheating & Randomization
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);

  // Difficulty Distribution
  const [easyCount, setEasyCount] = useState<number>(20);
  const [mediumCount, setMediumCount] = useState<number>(20);
  const [hardCount, setHardCount] = useState<number>(10);

  // Selected Domain Pools
  const [pools, setPools] = useState<string[]>([
    "Java Full Stack",
    "SQL",
    "Logical Reasoning",
    "Aptitude",
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(true);

  const sumCount = easyCount + mediumCount + hardCount;
  const isCountValid = sumCount === totalQuestions;

  const handlePoolToggle = (name: string) => {
    if (pools.includes(name)) {
      if (pools.length === 1) {
        toast.warning("At least one question domain pool must be designated.");
        return;
      }
      setPools(pools.filter((p) => p !== name));
    } else {
      setPools([...pools, name]);
    }
  };

  const handleGeneratePreview = () => {
    if (!isCountValid) {
      toast.error(`Difficulty counts sum (${sumCount}) must equal Total Questions (${totalQuestions})`);
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsPreviewGenerated(true);
      toast.success("Randomized Paper Sequence Synthesized!", {
        description: `Seed: ${Math.floor(Math.random() * 999999)} • Shuffled across ${pools.length} domains.`,
      });
    }, 600);
  };

  const handleSavePaper = (status: "Published" | "Draft") => {
    if (!isCountValid) {
      toast.error("Please ensure difficulty distribution matches total questions.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(status === "Published" ? "Question Paper Published!" : "Draft Paper Saved", {
        description: `Paper "${paperName}" is now registered in Supabase examination engine.`,
      });
      router.push("/admin/question-papers");
    }, 700);
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
                Question Paper Generator
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Randomized Seed Engine
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Synthesize randomized examination sets with difficulty quotas, dynamic question pools, and auto-shuffling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSavePaper("Draft")}
            disabled={isGenerating}
          >
            Save Draft Paper
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => handleSavePaper("Published")}
            disabled={isGenerating}
          >
            Publish Question Paper
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Specifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Parameters */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Paper Metadata &amp; Drive Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Examination Paper Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground font-semibold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Assigned CSR Drive</label>
                  <select
                    value={selectedDriveId}
                    onChange={(e) => setSelectedDriveId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-semibold"
                  >
                    {drives.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Course Track</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-semibold"
                  >
                    <option value="Full Stack Java Cloud Development & Agentic AI">Full Stack Java & Agentic AI</option>
                    <option value="Python Full Stack Development & Data Science">Python Full Stack & AI</option>
                    <option value="MERN Cloud Microservices">MERN Cloud Microservices</option>
                    <option value="Software Quality Assurance & Automation">QA & Automation Testing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Graduate Eligibility</label>
                  <select
                    value={graduateType}
                    onChange={(e) => setGraduateType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-semibold"
                  >
                    <option value="BE / B.Tech">BE / B.Tech</option>
                    <option value="BE / MCA">BE / MCA</option>
                    <option value="All Engineering & MCA">All Engineering & MCA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Total Questions</label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={totalQuestions}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTotalQuestions(val);
                      // Auto-proportion
                      setEasyCount(Math.round(val * 0.4));
                      setMediumCount(Math.round(val * 0.4));
                      setHardCount(val - Math.round(val * 0.4) * 2);
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="10"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Cutoff (%)</label>
                  <input
                    type="number"
                    min="30"
                    max="90"
                    value={cutoffPercentage}
                    onChange={(e) => setCutoffPercentage(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground font-bold text-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Difficulty Quota Distribution */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" />
                    Difficulty Distribution Engine
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Designate exact quotas. The randomized engine pulls questions satisfying these exact boundaries.
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isCountValid
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  }`}
                >
                  {sumCount} / {totalQuestions} Questions {isCountValid ? "✓ Valid" : "✗ Mismatch"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500 uppercase">Easy Tier</span>
                    <span className="text-xs font-mono font-bold text-foreground">{easyCount} Qs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalQuestions}
                    value={easyCount}
                    onChange={(e) => setEasyCount(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <p className="text-[10px] text-muted-foreground">Fundamentals, definition checks, output predictions</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500 uppercase">Medium Tier</span>
                    <span className="text-xs font-mono font-bold text-foreground">{mediumCount} Qs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalQuestions}
                    value={mediumCount}
                    onChange={(e) => setMediumCount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-[10px] text-muted-foreground">Core algorithms, multi-clause SQL, applied reasoning</p>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-500 uppercase">Hard Tier</span>
                    <span className="text-xs font-mono font-bold text-foreground">{hardCount} Qs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalQuestions}
                    value={hardCount}
                    onChange={(e) => setHardCount(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                  <p className="text-[10px] text-muted-foreground">Complex concurrency, distributed systems, deep optimization</p>
                </div>
              </div>

              {/* Graphical Bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-muted">
                <div style={{ width: `${(easyCount / totalQuestions) * 100}%` }} className="bg-emerald-500" title="Easy" />
                <div style={{ width: `${(mediumCount / totalQuestions) * 100}%` }} className="bg-amber-500" title="Medium" />
                <div style={{ width: `${(hardCount / totalQuestions) * 100}%` }} className="bg-rose-500" title="Hard" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Question Domain Pools */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Included Question Domain Pools
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  "Java Full Stack",
                  "Python Full Stack",
                  "SQL",
                  "Logical Reasoning",
                  "Aptitude",
                  "Software Testing",
                  "AI Fundamentals",
                  "Data Analytics",
                  "Soft Skills",
                ].map((pool) => {
                  const isChecked = pools.includes(pool);
                  return (
                    <div
                      key={pool}
                      onClick={() => handlePoolToggle(pool)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? "bg-primary/10 border-primary text-foreground"
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xs font-bold">{pool}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 rounded text-primary focus:ring-primary pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Anti-Malpractice Controls & Seed Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">Anti-Cheating & Randomization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Seed-based Question Shuffling</span>
                  <span className="text-muted-foreground text-[11px]">Every candidate receives distinct sequence</span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Option Order Shuffling</span>
                  <span className="text-muted-foreground text-[11px]">Option A/B/C/D positions randomized</span>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">Negative Marking Scheme</span>
                  <span className="text-muted-foreground text-[11px]">Deduct marks on inaccurate responses</span>
                </div>
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Random Sequence Generator Trigger */}
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Synthesis Engine Status</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Click below to synthesize a live test sequence across {pools.length} domains and test distribution limits.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-card hover:bg-muted"
                isLoading={isGenerating}
                leftIcon={<Shuffle className="w-4 h-4 text-primary" />}
                onClick={handleGeneratePreview}
              >
                Synthesize &amp; Preview Paper
              </Button>
            </CardContent>
          </Card>

          {/* Paper Specification Summary */}
          <Card className="p-4 text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">Paper Summary</span>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-bold text-foreground">{duration} Minutes</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Total Questions:</span>
              <span className="font-bold text-foreground">{totalQuestions} Questions</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Total Marks:</span>
              <span className="font-bold text-primary">{totalMarks} Marks</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/60">
              <span className="text-muted-foreground">Passing Cutoff:</span>
              <span className="font-bold text-emerald-500">{cutoffPercentage}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Pools Included:</span>
              <span className="font-bold text-foreground">{pools.length} Tracks</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
