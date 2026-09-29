"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Code,
  Image as ImageIcon,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  Layers,
  Clock,
  Tag,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export const QUESTION_CATEGORIES = [
  "Java Full Stack",
  "Python Full Stack",
  "MERN Stack",
  "Software Testing",
  "SQL",
  "Aptitude",
  "Logical Reasoning",
  "Data Analytics",
  "Data Science",
  "AI Fundamentals",
  "Communication Skills",
  "Soft Skills",
] as const;

export const QUESTION_TYPES = [
  "MCQ",
  "Multiple Correct",
  "True / False",
  "Code Output",
  "Fill in the Blank",
  "Match the Following",
  "Programming Question",
  "SQL Query Question",
  "Case Study Question",
  "Image Based Question",
] as const;

export default function CreateQuestionPage() {
  const router = useRouter();
  const { currentUser } = useApp();

  const [questionId] = useState(`Q-${Math.floor(1000 + Math.random() * 9000)}`);
  const [questionType, setQuestionType] = useState<string>("MCQ");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<string>("Java Full Stack");
  const [subcategory, setSubcategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [topic, setTopic] = useState("");
  const [marks, setMarks] = useState<number>(2);
  const [negativeMarks, setNegativeMarks] = useState<number>(0.5);
  const [timeEstimate, setTimeEstimate] = useState<number>(90); // seconds
  const [explanation, setExplanation] = useState("");
  const [hints, setHints] = useState("");
  const [tags, setTags] = useState("java, spring, oop");
  const [status, setStatus] = useState<"Draft" | "Published" | "Archived">("Published");
  const [version] = useState(1);

  // Dynamic Options Builder (A, B, C, D, E...)
  const [options, setOptions] = useState<string[]>([
    "Initial Option A",
    "Initial Option B",
    "Initial Option C",
    "Initial Option D",
  ]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 6) {
      toast.warning("Maximum 6 options supported per question.");
      return;
    }
    setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.warning("Minimum 2 options are mandatory.");
      return;
    }
    const newOpts = options.filter((_, i) => i !== index);
    setOptions(newOpts);
    setCorrectAnswers(correctAnswers.filter((a) => a !== index).map((a) => (a > index ? a - 1 : a)));
  };

  const handleOptionTextChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleToggleCorrectAnswer = (index: number) => {
    if (questionType === "Multiple Correct") {
      if (correctAnswers.includes(index)) {
        if (correctAnswers.length === 1) {
          toast.warning("At least one correct answer must be designated.");
          return;
        }
        setCorrectAnswers(correctAnswers.filter((a) => a !== index));
      } else {
        setCorrectAnswers([...correctAnswers, index]);
      }
    } else {
      setCorrectAnswers([index]);
    }
  };

  const handleSubmit = (e: React.FormEvent, publishStatus: "Draft" | "Published" | "Archived") => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Question title and description cannot be empty.");
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      toast.error("Please fill in all options before saving.");
      return;
    }
    if (correctAnswers.length === 0) {
      toast.error("Please select at least one correct answer.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        publishStatus === "Published"
          ? "Question Published to Active Repository"
          : "Question Draft Saved",
        {
          description: `ID: ${questionId} • Category: ${category} • Difficulty: ${difficulty}`,
        }
      );
      router.push("/admin/question-bank");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-bank"
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Create Examination Question
              </h1>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {questionId} • v{version}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Author rich interactive questions with syntax highlighting, formulas, and anti-cheating difficulty weights.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => handleSubmit(e, "Draft")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={(e) => handleSubmit(e, "Published")}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSubmitting ? "Publishing..." : "Publish to Question Bank"}
          </Button>
        </div>
      </div>

      {/* Main Authoring Form */}
      <form onSubmit={(e) => handleSubmit(e, status)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Content & Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Question Core Content */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Question Stem & Problem Statement
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-semibold">Question Type:</span>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Question Title / Short Summary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Java String Pool & Intern Memory Allocation"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Full Problem Statement / Question Text <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the question clearly with all prerequisite constraints and specifications..."
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Optional Code Snippet Block */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-primary" />
                    Source Code Snippet (Optional)
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">Syntax: Java / Python / SQL / JS</span>
                </div>
                <textarea
                  rows={4}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder={`// Insert reproducible code block\npublic class Solution {\n  public static void main(String[] args) {\n    // logic\n  }\n}`}
                  className="w-full text-xs p-3 rounded-xl border border-border bg-slate-950 text-emerald-400 font-mono focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Optional Diagram / Image URL */}
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  Illustration / Diagram Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://gqt-storage.supabase.co/question-images/arch-diagram.png"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Dynamic Options Builder */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Answer Options Builder
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click the radio or checkbox indicator to designate correct answer keys.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {options.map((option, index) => {
                const isCorrect = correctAnswers.includes(index);
                const letter = String.fromCharCode(65 + index);

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs"
                        : "bg-background border-border hover:border-muted-foreground/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleCorrectAnswer(index)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isCorrect
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                      }`}
                      title={isCorrect ? "Correct Option Key" : "Mark as Correct"}
                    >
                      {letter}
                    </button>

                    <input
                      type="text"
                      required
                      value={option}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                      placeholder={`Enter answer text for Option ${letter}...`}
                      className="flex-1 text-xs p-2 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleToggleCorrectAnswer(index)}
                      className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 transition-colors ${
                        isCorrect
                          ? "text-emerald-500 hover:text-emerald-600"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {isCorrect ? "✓ Correct" : "Mark Correct"}
                    </button>

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-muted-foreground hover:text-rose-500 p-1 shrink-0"
                        title="Delete Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Card 3: Solution Explanation & Hints */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                Comprehensive Solution & Explanations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Detailed Explanation (Displayed during Candidate Result Review)
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why the designated option is accurate, citing language specifications or algorithmic complexity..."
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Optional Candidate Hints
                </label>
                <input
                  type="text"
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  placeholder="e.g. Consider memory reference equality vs value identity in String pool"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Metadata, Taxonomy & Scoring Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">Taxonomy & Domain Track</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Category / Domain</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-semibold"
                >
                  {QUESTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Subcategory</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Memory Management, Concurrency"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. JVM Internals"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        difficulty === diff
                          ? diff === "Easy"
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                            : diff === "Medium"
                            ? "bg-amber-500/20 border-amber-500 text-amber-500"
                            : "bg-rose-500/20 border-rose-500 text-rose-500"
                          : "bg-background border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">Scoring & Timing Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Marks (+)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-bold text-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Negative (-)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-bold text-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground flex items-center justify-between mb-1">
                  <span>Estimated Time</span>
                  <span className="text-muted-foreground">{timeEstimate} seconds</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. java, spring, oop"
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none font-bold"
                >
                  <option value="Draft">Draft (Private to Admin)</option>
                  <option value="Published">Published (Available for Paper Generation)</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Action Trigger Card */}
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Supabase Repository Guard</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                All authored questions are cryptographically versioned. Published items will be instantly eligible for random question paper generator pools.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full"
                isLoading={isSubmitting}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save &amp; Commit Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
