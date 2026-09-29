"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Search,
  Layers,
  Sparkles,
  Archive,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface ImportedQuestionPreview {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  optionsCount: number;
  correctAnswer: string;
  isDuplicate: boolean;
  hasWarning: boolean;
  status: "Valid" | "Duplicate Warning" | "Invalid Format";
}

const MOCK_PARSED_QUESTIONS: ImportedQuestionPreview[] = [
  {
    id: "IMP-01",
    title: "Explain difference between ArrayList and LinkedList memory traversal",
    category: "Java Full Stack",
    difficulty: "Medium",
    type: "MCQ",
    optionsCount: 4,
    correctAnswer: "Option B",
    isDuplicate: false,
    hasWarning: false,
    status: "Valid",
  },
  {
    id: "IMP-02",
    title: "What is the Big-O time complexity of Python dict lookups on average?",
    category: "Python Full Stack",
    difficulty: "Easy",
    type: "MCQ",
    optionsCount: 4,
    correctAnswer: "Option A",
    isDuplicate: false,
    hasWarning: false,
    status: "Valid",
  },
  {
    id: "IMP-03",
    title: "SQL query using RANK() vs DENSE_RANK() window function behavior",
    category: "SQL",
    difficulty: "Hard",
    type: "SQL Query Question",
    optionsCount: 4,
    correctAnswer: "Option C",
    isDuplicate: true,
    hasWarning: true,
    status: "Duplicate Warning",
  },
  {
    id: "IMP-04",
    title: "Logical deduction: Seating arrangement of 6 engineers facing North",
    category: "Logical Reasoning",
    difficulty: "Medium",
    type: "MCQ",
    optionsCount: 4,
    correctAnswer: "Option D",
    isDuplicate: false,
    hasWarning: false,
    status: "Valid",
  },
  {
    id: "IMP-05",
    title: "Transformer multi-head self-attention projection matrix calculation",
    category: "AI Fundamentals",
    difficulty: "Hard",
    type: "Multiple Correct",
    optionsCount: 4,
    correctAnswer: "Option A & C",
    isDuplicate: false,
    hasWarning: false,
    status: "Valid",
  },
];

export default function ImportQuestionsPage() {
  const router = useRouter();

  const [fileName, setFileName] = useState<string | null>("GQT_Question_Bank_Batch2026.xlsx");
  const [fileSize, setFileSize] = useState<string>("148 KB");
  const [parsedData, setParsedData] = useState<ImportedQuestionPreview[]>(MOCK_PARSED_QUESTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterType, setFilterType] = useState<"All" | "Valid" | "Duplicate">("All");

  const validCount = parsedData.filter((q) => q.status === "Valid").length;
  const duplicateCount = parsedData.filter((q) => q.isDuplicate).length;

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${Math.round(file.size / 1024)} KB`);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        toast.success(`Successfully parsed ${file.name}`, {
          description: "5 questions detected with duplicate analysis complete.",
        });
      }, 700);
    }
  };

  const handleBulkPublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Bulk Published ${validCount} Questions to Question Bank`, {
        description: "Supabase repository records created with active version tags.",
      });
      router.push("/admin/question-bank");
    }, 800);
  };

  const handleBulkArchive = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.info(`Archived ${parsedData.length} imported questions as staging drafts.`);
      router.push("/admin/question-bank");
    }, 600);
  };

  const handleDownloadTemplate = (type: "csv" | "xlsx") => {
    toast.success(`Downloading GQT Question Bank ${type.toUpperCase()} Template`, {
      description: "Includes column schemas: Title, Category, Difficulty, Type, OptionA-D, CorrectAnswer, Marks, Explanation.",
    });
  };

  const filteredQuestions = parsedData.filter((q) => {
    if (filterType === "Valid") return q.status === "Valid";
    if (filterType === "Duplicate") return q.isDuplicate;
    return true;
  });

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
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Bulk Import Question Bank
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload spreadsheets (Excel / CSV) with automatic duplicate detection, schema validation, and bulk publishing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleDownloadTemplate("xlsx")}
          >
            Download Excel Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleDownloadTemplate("csv")}
          >
            Download CSV Template
          </Button>
        </div>
      </div>

      {/* Upload Zone & Stats Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-8 text-center bg-card/50 hover:bg-card transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h3 className="font-extrabold text-sm text-foreground">
                Drop your questions spreadsheet here, or browse files
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv) up to 25MB.
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  id="spreadsheet-input"
                  className="hidden"
                  onChange={handleFileDrop}
                />
                <label
                  htmlFor="spreadsheet-input"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-md"
                >
                  Select File from Computer
                </label>
              </div>

              {fileName && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>{fileName}</span>
                  <span className="text-muted-foreground">({fileSize})</span>
                  <span className="text-emerald-500 font-bold ml-1">✓ Loaded</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation & Duplicate Detection Metrics */}
        <div className="space-y-4">
          <Card className="p-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Import Audit Engine
            </span>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-500 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valid for Import</span>
                </div>
                <span className="text-base font-black text-emerald-500">{validCount} Questions</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Duplicate Warnings</span>
                </div>
                <span className="text-base font-black text-amber-500">{duplicateCount} Flagged</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted border border-border text-xs">
                <span className="text-muted-foreground">Total Parsed</span>
                <span className="font-bold text-foreground">{parsedData.length} Items</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              isLoading={isProcessing}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleBulkPublish}
            >
              Bulk Publish {validCount} Questions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              isLoading={isProcessing}
              leftIcon={<Archive className="w-4 h-4" />}
              onClick={handleBulkArchive}
            >
              Save as Staging Drafts
            </Button>
          </Card>
        </div>
      </div>

      {/* Parsed Questions Preview Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                Parsed Questions Preview &amp; Verification
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect parsed records, answer keys, and duplicate markers before saving into live bank.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(["All", "Valid", "Duplicate"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                    filterType === tab
                      ? "bg-primary text-white border-primary"
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Question Statement</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Difficulty</th>
                <th className="px-4 py-3">Options</th>
                <th className="px-4 py-3">Key Answer</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{q.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground max-w-sm truncate" title={q.title}>
                    {q.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{q.category}</td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{q.optionsCount} opts</td>
                  <td className="px-4 py-3 font-bold text-foreground">{q.correctAnswer}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        q.status === "Valid"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {q.status === "Valid" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{q.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
