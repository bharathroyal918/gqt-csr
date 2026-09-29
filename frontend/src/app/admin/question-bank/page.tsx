"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle2,
  Code,
  Image as ImageIcon,
  CheckSquare,
  History,
  ShieldCheck,
  Download
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export interface QuestionBankItem {
  id: string;
  category: "Java" | "Python" | "Testing" | "AI" | "SQL" | "Logical" | "Aptitude" | "Data Analytics" | "Data Science";
  difficulty: "Easy" | "Medium" | "Hard";
  questionText: string;
  codeSnippet?: string;
  imageUrl?: string;
  options: string[];
  correctAnswers: number[]; // indices
  marks: number;
  negativeMarks: number;
  approved: boolean;
  version: number;
  lastEditedBy: string;
}

const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: "QB-J01",
    category: "Java",
    difficulty: "Medium",
    questionText: "What is the output of the following Java program regarding String intern pool behavior?",
    codeSnippet: `String s1 = new String("GQT");\nString s2 = s1.intern();\nString s3 = "GQT";\nSystem.out.println(s1 == s2);\nSystem.out.println(s2 == s3);`,
    options: ["true, true", "false, true", "false, false", "Compilation Error"],
    correctAnswers: [1],
    marks: 2,
    negativeMarks: 0.5,
    approved: true,
    version: 3,
    lastEditedBy: "Super Admin",
  },
  {
    id: "QB-P01",
    category: "Python",
    difficulty: "Easy",
    questionText: "Which of the following Python data structures are immutable?",
    options: ["List", "Tuple", "Dictionary", "Frozenset"],
    correctAnswers: [1, 3],
    marks: 2,
    negativeMarks: 0,
    approved: true,
    version: 1,
    lastEditedBy: "Divya.H",
  },
  {
    id: "QB-AI01",
    category: "AI",
    difficulty: "Hard",
    questionText: "In transformer attention mechanisms, why is scaled dot-product attention divided by sqrt(d_k)?",
    options: [
      "To prevent vanishing gradients when dot products grow large in high dimensions",
      "To normalize eigenvalues to identity",
      "To convert logits into Gaussian normal distribution",
      "To enforce causal masking during decoding",
    ],
    correctAnswers: [0],
    marks: 3,
    negativeMarks: 1,
    approved: true,
    version: 2,
    lastEditedBy: "Super Admin",
  },
  {
    id: "QB-S01",
    category: "SQL",
    difficulty: "Medium",
    questionText: "Which clause should be utilized to filter records after aggregate groupings have been computed?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correctAnswers: [1],
    marks: 1,
    negativeMarks: 0.25,
    approved: true,
    version: 1,
    lastEditedBy: "Kiran",
  },
  {
    id: "QB-L01",
    category: "Logical",
    difficulty: "Easy",
    questionText: "If CODING is represented as DPEJOH, how is LOGICAL encoded?",
    options: ["MPHJDMB", "MPHKDMB", "MOHJDMB", "LOHJDMB"],
    correctAnswers: [0],
    marks: 1,
    negativeMarks: 0,
    approved: true,
    version: 1,
    lastEditedBy: "Super Admin",
  },
  {
    id: "QB-DA01",
    category: "Data Analytics",
    difficulty: "Medium",
    questionText: "What metric is most resilient to outliers when evaluating skewed salary distributions?",
    options: ["Mean", "Median", "Standard Deviation", "Variance"],
    correctAnswers: [1],
    marks: 1,
    negativeMarks: 0,
    approved: false,
    version: 1,
    lastEditedBy: "Sneha Rao",
  },
];

const CATEGORIES = [
  "Java",
  "Python",
  "Testing",
  "AI",
  "SQL",
  "Logical",
  "Aptitude",
  "Data Analytics",
  "Data Science",
] as const;

export default function AdminQuestionBankPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>(INITIAL_QUESTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [historyQuestion, setHistoryQuestion] = useState<QuestionBankItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "Java" as QuestionBankItem["category"],
    difficulty: "Medium" as QuestionBankItem["difficulty"],
    questionText: "",
    codeSnippet: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    marks: 2,
    negativeMarks: 0.5,
  });

  const filtered = questions.filter((q) => {
    const matchesCat = selectedCategory === "all" || q.category === selectedCategory;
    const matchesDiff = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  const handleToggleApproval = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, approved: !q.approved } : q))
    );
    toast.success("Question approval status updated");
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText) {
      toast.error("Question text is required");
      return;
    }
    const newQ: QuestionBankItem = {
      id: `QB-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      difficulty: formData.difficulty,
      questionText: formData.questionText,
      codeSnippet: formData.codeSnippet || undefined,
      options: formData.options,
      correctAnswers: [formData.correctAnswerIndex],
      marks: formData.marks,
      negativeMarks: formData.negativeMarks,
      approved: true,
      version: 1,
      lastEditedBy: "Super Admin",
    };
    setQuestions([newQ, ...questions]);
    setIsCreateOpen(false);
    toast.success(`Question ${newQ.id} added to Question Bank`);
  };

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Imported 24 questions from CSV batch file");
    setIsCsvModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Academic Item Banking
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Enterprise Question Bank
          </h1>
          <p className="text-sm text-muted-foreground">
            Author, inspect, and approve multiple-choice, code snippet, and scenario problems across 9 specialized technology tracks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/question-bank/import">
            <Button
              variant="outline"
              className="border-border hover:bg-muted gap-2"
            >
              <Upload className="w-4 h-4" /> Bulk Excel/CSV Import
            </Button>
          </Link>
          <Link href="/admin/question-bank/create">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
            >
              <Plus className="w-4 h-4" /> Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Questions</p>
            <p className="text-2xl font-bold text-foreground mt-1">{questions.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Approved / Verified</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {questions.filter((q) => q.approved).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Pending Verification</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {questions.filter((q) => !q.approved).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Domain Tracks</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{CATEGORIES.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:bg-muted"
          }`}
        >
          All Domains
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by text or ID..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Questions Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">ID & Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Question Prompt</th>
                <th className="p-4 text-center">Marks</th>
                <th className="p-4 text-center">Version</th>
                <th className="p-4 text-center">Approval Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-mono text-xs font-bold text-primary">{q.id}</span>
                    <div className="text-xs font-semibold text-foreground">{q.category}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        q.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : q.difficulty === "Medium"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-xs max-w-md">
                    <p className="line-clamp-2 text-foreground font-medium">{q.questionText}</p>
                    {q.codeSnippet && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary mt-1 font-mono bg-primary/10 px-1.5 py-0.5 rounded">
                        <Code className="w-3 h-3" /> Code Snippet Included
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center text-xs">
                    <div className="font-bold text-foreground">+{q.marks}</div>
                    {q.negativeMarks > 0 && (
                      <div className="text-[10px] text-rose-400">-{q.negativeMarks}</div>
                    )}
                  </td>
                  <td className="p-4 text-center text-xs font-mono text-muted-foreground">
                    v{q.version}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleApproval(q.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${
                        q.approved
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {q.approved ? "Approved" : "Pending Review"}
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPreviewQuestion(q)}
                        title="Preview Question"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setHistoryQuestion(q)}
                        title="Audit & Version History"
                        className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-400"
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Preview Question Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title={`Question Preview (${previewQuestion.id})`}
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-primary">{previewQuestion.category} • {previewQuestion.difficulty}</span>
              <span className="text-muted-foreground">+{previewQuestion.marks} / -{previewQuestion.negativeMarks} marks</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{previewQuestion.questionText}</p>
            {previewQuestion.codeSnippet && (
              <pre className="p-3 bg-zinc-950 text-emerald-400 text-xs rounded-xl overflow-x-auto font-mono">
                {previewQuestion.codeSnippet}
              </pre>
            )}
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase">Options</p>
              {previewQuestion.options.map((opt, i) => {
                const isCorrect = previewQuestion.correctAnswers.includes(i);
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold" : "bg-card border-border"
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewQuestion(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Version History Modal */}
      {historyQuestion && (
        <Modal
          isOpen={!!historyQuestion}
          onClose={() => setHistoryQuestion(null)}
          title={`Audit & Version History: ${historyQuestion.id}`}
        >
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-muted/40 rounded-xl space-y-1">
              <p className="font-bold text-foreground">v{historyQuestion.version} (Current)</p>
              <p className="text-muted-foreground">Updated by {historyQuestion.lastEditedBy} on 2025-02-14</p>
            </div>
            <div className="p-3 bg-card border rounded-xl space-y-1 opacity-70">
              <p className="font-bold text-foreground">v{historyQuestion.version - 1} (Historical Snapshot)</p>
              <p className="text-muted-foreground">Initial problem created during statewide syllabus authoring</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setHistoryQuestion(null)}>Done</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <Modal
          isOpen={isCsvModalOpen}
          onClose={() => setIsCsvModalOpen(false)}
          title="Bulk Excel / CSV Question Import"
        >
          <form onSubmit={handleCsvImport} className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-border p-6 rounded-2xl text-center space-y-2">
              <Upload className="w-8 h-8 text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">Select .csv or .xlsx question file formatted with GQT Exam Schema</p>
              <input type="file" accept=".csv,.xlsx" className="text-xs mx-auto" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCsvModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Import Batch</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Question Modal */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Author New Exam Problem"
        >
          <form onSubmit={handleCreateQuestion} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Domain Track</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Question Text *</label>
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                rows={3}
                placeholder="Enter problem statement..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Optional Code Snippet</label>
              <textarea
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                rows={3}
                placeholder="public class Solution { ... }"
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-border bg-background text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Answer Options</label>
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswerIndex === idx}
                    onChange={() => setFormData({ ...formData, correctAnswerIndex: idx })}
                  />
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...formData.options];
                      newOpts[idx] = e.target.value;
                      setFormData({ ...formData, options: newOpts });
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="h-8 text-xs"
                    required
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Save Question</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
