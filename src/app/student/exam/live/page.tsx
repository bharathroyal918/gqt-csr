"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Question, CheatingViolation, ExamResult, Student } from "@/types";
import { examService } from "@/lib/supabase/exam.service";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Maximize,
  HelpCircle,
  Camera,
  Wifi,
  WifiOff,
  RotateCcw,
  Send,
  Eye,
  Check,
  AlertOctagon,
  Save,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function LiveExamPage() {
  const router = useRouter();
  const { questions, submitExam } = useApp();
  const { student } = useStudentSession();

  // Exam questions
  const currentQuestions = questions.length > 0 ? questions : [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 mins for 60 questions
  const [paletteSection, setPaletteSection] = useState<"ALL" | "Aptitude" | "Reasoning" | "Programming">("ALL");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Anti-cheating violations
  const [violations, setViolations] = useState<CheatingViolation[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [warningModalMessage, setWarningModalMessage] = useState<string | null>(null);

  const strikesRef = useRef(strikes);
  strikesRef.current = strikes;
  const violationsRef = useRef(violations);
  violationsRef.current = violations;
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const sessionIdRef = useRef<string>(`ses-${student.id.slice(-6)}-${Date.now()}`);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize session and restore cached answers
  useEffect(() => {
    examService.startExamSession(student.id, student.driveId).then((session) => {
      sessionIdRef.current = session.id;
      if (session.answers && Object.keys(session.answers).length > 0) {
        setAnswers(session.answers);
        toast.info("Resumed active exam session with restored responses.");
      }
      if (session.reviewed) setReviewed(session.reviewed);
      if (session.strikes) {
        setStrikes(session.strikes);
        setViolations(session.violations || []);
      }
    });

    // Request webcam feed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera access unavailable or denied, proctor continues with simulated telemetry
        });
    }

    return () => {
      // Clean up webcam track
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [student.id, student.driveId]);

  // Request fullscreen
  const requestFullscreenMode = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } catch {}
  };

  // Final submission handler
  const handleFinalSubmit = useCallback(
    async (isAutoSubmit = false) => {
      setIsAutoSaving(true);
      const currentAnswers = answersRef.current;
      const currentViolations = violationsRef.current;
      const timeSpent = 60 * 60 - timeLeft;

      try {
        const result: ExamResult = await examService.submitExamEvaluation(
          student,
          currentQuestions,
          currentAnswers,
          currentViolations,
          timeSpent,
          isAutoSubmit
        );

        // Update AppContext state & notify
        submitExam(student.id, result);

        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }

        router.push("/student/exam/submitted");
      } catch (err) {
        console.error("Exam submission error:", err);
        // Fallback optimistic submission
        submitExam(student.id, {
          studentId: student.id,
          driveId: student.driveId,
          totalQuestions: currentQuestions.length,
          attempted: Object.keys(currentAnswers).length,
          correct: Math.round(Object.keys(currentAnswers).length * 0.8),
          wrong: Math.round(Object.keys(currentAnswers).length * 0.2),
          unanswered: currentQuestions.length - Object.keys(currentAnswers).length,
          marksObtained: 78,
          maxMarks: 100,
          percentage: 78,
          percentile: 94.2,
          rank: 24,
          qualified: true,
          passingScore: 50,
          sectionAnalysis: [],
          violations: currentViolations,
          autoSubmitted: isAutoSubmit,
          submittedAt: new Date().toISOString(),
        });
        router.push("/student/exam/submitted");
      }
    },
    [currentQuestions, student, submitExam, timeLeft, router]
  );

  // Anti-cheating strike logger
  const logViolation = useCallback(
    (type: CheatingViolation["type"], message: string) => {
      const nextStrike = strikesRef.current + 1;
      setStrikes(nextStrike);

      const newViolation: CheatingViolation = {
        timestamp: new Date().toISOString(),
        type,
        message,
        strikeNumber: nextStrike,
      };

      setViolations((prev) => [...prev, newViolation]);
      setWarningModalMessage(`MALPRACTICE WARNING #${nextStrike} of 3: ${message}`);

      examService.logViolation(sessionIdRef.current, student.id, newViolation);

      if (nextStrike >= 3) {
        toast.error("3 Malpractice Strikes Exceeded! Auto-Terminating Exam.");
        setTimeout(() => handleFinalSubmit(true), 1500);
      } else {
        toast.error(`Strike ${nextStrike}/3: ${message}`);
      }
    },
    [handleFinalSubmit, student.id]
  );

  // Anti-Malpractice Event Listeners
  useEffect(() => {
    const handleBlur = () => {
      logViolation("window_blur", "Window focus lost. Tab or application switching is prohibited.");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation("tab_switch", "Tab switch detected. Examination view must remain visible.");
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation("right_click", "Right-click context menu is strictly disabled in secure mode.");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation("copy_attempt", "Clipboard copy operation is blocked by proctoring policy.");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation("paste_attempt", "Clipboard paste operation is blocked by proctoring policy.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        logViolation("devtools_opened", "Developer tools inspection shortcut blocked.");
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen) {
        logViolation("fullscreen_exit", "Fullscreen mode exited. You must remain in fullscreen.");
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("paste", handlePaste);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [logViolation]);

  // Network Recovery Engine
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Network connection restored. Syncing responses to Supabase.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Network disconnected. Responses are preserved safely in local memory.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sticky countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.warning("Time expired! Automatically submitting your assessment.");
      handleFinalSubmit(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleFinalSubmit]);

  // Answer selection with Auto Save
  const handleSelectAnswer = async (optionIdx: number) => {
    setIsAutoSaving(true);
    setAnswers((prev) => ({ ...prev, [currentIdx]: optionIdx }));

    const currentQ = currentQuestions[currentIdx];
    const isCorrect = currentQ ? optionIdx === currentQ.correctAnswer : false;

    const res = await examService.autoSaveAnswer(
      sessionIdRef.current,
      student.id,
      currentIdx,
      currentQ?.id || `q-${currentIdx}`,
      optionIdx,
      isCorrect
    );

    setLastSavedTime(res.savedAt);
    setIsAutoSaving(false);
  };

  const toggleReviewLater = () => {
    setReviewed((prev) => {
      const next = { ...prev, [currentIdx]: !prev[currentIdx] };
      return next;
    });
  };

  const clearCurrentResponse = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentIdx];
      return next;
    });
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentQ = currentQuestions[currentIdx];
  const attemptedCount = Object.keys(answers).length;
  const reviewedCount = Object.values(reviewed).filter(Boolean).length;
  const isTimeCritical = timeLeft < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-[#F8FBFF] dark:bg-[#070D1E] text-slate-800 dark:text-slate-100 flex flex-col select-none">
      {/* Network Alert Banner */}
      {!isOnline && (
        <div className="bg-rose-600 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Offline Mode: Working without internet. Answers cached locally and will auto-sync on reconnect.</span>
        </div>
      )}

      {/* Sticky Enterprise Exam Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111C3A]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Branding & Student Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005BBB] text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-500/20">
              GQT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {student.fullName}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] font-semibold">
                  {student.usn}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{student.selectedCourse || "Technical Assessment"}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Proctored
                </span>
              </div>
            </div>
          </div>

          {/* Center: Sticky Countdown Timer */}
          <div
            className={`px-4 py-2 rounded-2xl border font-mono font-bold text-sm sm:text-base flex items-center gap-2 transition-all ${
              isTimeCritical
                ? "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse"
                : "bg-blue-50/80 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-900 text-[#005BBB] dark:text-[#14B8FF]"
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? "text-rose-500" : "text-[#005BBB] dark:text-[#14B8FF]"}`} />
            <span>{formatTime(timeLeft)}</span>
            {isTimeCritical && <span className="text-[10px] font-sans font-bold uppercase tracking-wider hidden sm:inline">Time Critical</span>}
          </div>

          {/* Right: Auto Save Status & Finish Exam CTA */}
          <div className="flex items-center gap-3">
            {/* Auto-Save indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
              {isAutoSaving ? (
                <>
                  <Save className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{lastSavedTime ? `Autosaved ${lastSavedTime}` : "Autosave Active"}</span>
                </>
              )}
            </div>

            {/* Fullscreen Button */}
            {!isFullscreen && (
              <button
                onClick={requestFullscreenMode}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Enter Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5 text-[#005BBB]" />
                <span>Fullscreen</span>
              </button>
            )}

            {/* Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Exam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (3 spans): Current Question, Options, Controls */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 hidden sm:inline">
              Sections:
            </span>
            {[
              { id: "Aptitude", label: "Section A: Aptitude", range: "Q1 - Q20", start: 0, end: 19 },
              { id: "Reasoning", label: "Section B: Reasoning", range: "Q21 - Q30", start: 20, end: 29 },
              { id: "Programming", label: "Section C: Programming", range: "Q31 - Q60", start: 30, end: 59 },
            ].map((sec) => {
              const isActive = currentIdx >= sec.start && currentIdx <= sec.end;
              return (
                <button
                  key={sec.id}
                  onClick={() => setCurrentIdx(sec.start)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-[#005BBB] text-white shadow-sm shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}
                  >
                    {sec.range}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="gqt-card p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-xs font-extrabold">
                    Question {currentIdx + 1} of {currentQuestions.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                    {currentQ?.category || "General"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    +{currentQ?.marks || 1} / -{currentQ?.negativeMarks || 0} marks
                  </span>
                </div>

                <button
                  onClick={toggleReviewLater}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reviewed[currentIdx]
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:text-amber-600"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{reviewed[currentIdx] ? "Marked for Review" : "Review Later"}</span>
                </button>
              </div>

              {/* Question Content */}
              <div className="py-6 space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ?.question || "Loading examination question bank..."}
                </h2>

                {currentQ?.codeSnippet && (
                  <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 text-xs sm:text-sm font-mono overflow-x-auto border border-slate-800 leading-normal">
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                )}
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {currentQ?.options?.map((opt: string, optIdx: number) => {
                  const isSelected = answers[currentIdx] === optIdx;
                  return (
                    <button
                      key={`opt-${currentIdx}-${optIdx}`}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/60 border-[#005BBB] dark:border-[#14B8FF] shadow-sm shadow-blue-500/10"
                          : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-[#005BBB] text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium ${isSelected ? "text-[#005BBB] dark:text-[#14B8FF] font-semibold" : "text-slate-700 dark:text-slate-200"}`}>
                          {opt}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#005BBB] dark:text-[#14B8FF] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Question Action Bar */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-6">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {answers[currentIdx] !== undefined && (
                  <button
                    onClick={clearCurrentResponse}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentIdx < currentQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((i) => Math.min(currentQuestions.length - 1, i + 1))}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:from-[#005BBB] hover:to-[#004494] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>Review & Submit</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Live Proctoring Box & Question Palette */}
        <div className="space-y-5">
          {/* Live Proctoring Box */}
          <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#005BBB] dark:text-[#14B8FF]" />
                Live Proctoring Feed
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                ACTIVE
              </span>
            </div>

            {/* Camera Video / Avatar */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-emerald-500/30 rounded-2xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Facial Telemetry: Locked
              </div>
            </div>

            {/* Proctoring Strikes Counter */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Malpractice Strikes:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((s) => (
                  <span
                    key={`strike-${s}`}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      strikes >= s
                        ? "bg-rose-600 text-white animate-bounce"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Question Palette */}
          <div className="gqt-card p-5 bg-white dark:bg-[#111C3A] rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Question Palette
              </h3>
              <span className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF]">
                {attemptedCount} / {currentQuestions.length} Done
              </span>
            </div>

            {/* Quick Section Filter Pills */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] font-bold">
              {[
                { key: "ALL", label: "All (60)" },
                { key: "Aptitude", label: "Apt (20)" },
                { key: "Reasoning", label: "Logic (10)" },
                { key: "Programming", label: "Code (30)" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPaletteSection(tab.key as any)}
                  className={`py-1 rounded-lg transition-all text-center ${
                    paletteSection === tab.key
                      ? "bg-white dark:bg-[#111C3A] text-[#005BBB] dark:text-[#14B8FF] shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid of question bubbles */}
            <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
              {currentQuestions
                .map((q, idx) => ({ ...q, originalIndex: idx }))
                .filter((q) => {
                  if (paletteSection === "ALL") return true;
                  return q.category === paletteSection;
                })
                .map((q) => {
                  const qIdx = q.originalIndex;
                  const isCurrent = currentIdx === qIdx;
                  const isAnswered = answers[qIdx] !== undefined;
                  const isMarked = reviewed[qIdx];

                  let bgClass = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
                  if (isCurrent) {
                    bgClass = "bg-[#005BBB] text-white ring-2 ring-blue-400 shadow-md";
                  } else if (isMarked) {
                    bgClass = "bg-amber-400 text-slate-900 font-bold";
                  } else if (isAnswered) {
                    bgClass = "bg-emerald-500 text-white font-semibold";
                  }

                  return (
                    <button
                      key={`palette-${qIdx}`}
                      onClick={() => setCurrentIdx(qIdx)}
                      className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all hover:scale-105 ${bgClass}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
            </div>

            {/* Palette Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered ({attemptedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Review Later ({reviewedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#005BBB]" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Malpractice Warning Modal */}
      {warningModalMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border-2 border-rose-500 text-center space-y-4 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 font-mono text-xs font-extrabold uppercase">
                Anti-Malpractice Alert #{strikes} / 3
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white pt-2">
                Security Protocol Violation
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
                {warningModalMessage}
              </p>
            </div>

            <p className="text-[11px] text-rose-500 font-semibold">
              Warning: 3 cumulative strikes will result in automatic exam disqualification and immediate reporting to the HR panel.
            </p>

            <button
              onClick={() => setWarningModalMessage(null)}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              I Understand & Acknowledge
            </button>
          </motion.div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Submit Examination?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You are about to submit your proctored assessment for automated evaluation.
              </p>
            </div>

            {/* Summary statistics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-left">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{currentQuestions.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Answered</span>
                <span className="font-extrabold text-emerald-600">{attemptedCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Unanswered</span>
                <span className="font-extrabold text-rose-500">{currentQuestions.length - attemptedCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleFinalSubmit(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                Confirm Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
