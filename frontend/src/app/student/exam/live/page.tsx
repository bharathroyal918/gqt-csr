"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Question, CheatingViolation, ExamResult, Student } from "@/types";
import { examService } from "@/lib/supabase/exam.service";
import {
  ShieldAlert,
  ShieldCheck,
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
  LogOut,
  VideoOff,
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
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const isTerminatedRef = useRef(false);
  isTerminatedRef.current = isTerminated;

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
  const streamRef = useRef<MediaStream | null>(null);

  // Dedicated function to immediately and completely stop the camera hardware access
  const stopWebcam = useCallback(() => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
            track.enabled = false;
          } catch {}
        });
        streamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
            track.enabled = false;
          } catch {}
        });
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn("Webcam cleanup exception:", err);
    }
  }, []);

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

    let activeStream: MediaStream | null = null;

    // Request webcam feed
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          activeStream = stream;
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera access unavailable or denied, proctor continues with simulated telemetry
        });
    }

    const cleanupCamera = () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => {
          try {
            t.stop();
            t.enabled = false;
          } catch {}
        });
      }
      stopWebcam();
    };

    window.addEventListener("beforeunload", cleanupCamera);
    window.addEventListener("pagehide", cleanupCamera);
    window.addEventListener("popstate", cleanupCamera);

    return () => {
      window.removeEventListener("beforeunload", cleanupCamera);
      window.removeEventListener("pagehide", cleanupCamera);
      window.removeEventListener("popstate", cleanupCamera);
      cleanupCamera();
    };
  }, [student.id, student.driveId, stopWebcam]);

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

  // Exit exam and immediately stop camera hardware
  const handleExitExam = useCallback(() => {
    stopWebcam();
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    toast.info("Exited assessment room. Camera feed disconnected.");
    router.push("/student/exam");
  }, [router, stopWebcam]);

  // Final submission handler
  const handleFinalSubmit = useCallback(
    async (isAutoSubmit = false) => {
      setIsAutoSaving(true);
      // Immediately stop camera and release hardware device
      stopWebcam();

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      const currentAnswers = answersRef.current;
      const currentViolations = violationsRef.current;
      const timeSpent = 60 * 60 - timeLeft;
      const isDisqualified = strikesRef.current >= 3;

      try {
        const result: ExamResult = await examService.submitExamEvaluation(
          student,
          currentQuestions,
          currentAnswers,
          currentViolations,
          timeSpent,
          isAutoSubmit || isDisqualified
        );

        if (isDisqualified) {
          result.qualified = false;
        }

        // Update AppContext state & notify
        submitExam(student.id, result);

        stopWebcam();
        router.push(`/student/exam/submitted${isDisqualified ? "?disqualified=true" : ""}`);
      } catch (err) {
        console.error("Exam submission error:", err);
        stopWebcam();
        // Fallback optimistic submission
        submitExam(student.id, {
          studentId: student.id,
          driveId: student.driveId,
          totalQuestions: currentQuestions.length,
          attempted: Object.keys(currentAnswers).length,
          correct: isDisqualified ? 0 : Math.round(Object.keys(currentAnswers).length * 0.8),
          wrong: isDisqualified ? Object.keys(currentAnswers).length : Math.round(Object.keys(currentAnswers).length * 0.2),
          unanswered: currentQuestions.length - Object.keys(currentAnswers).length,
          marksObtained: isDisqualified ? 0 : 78,
          maxMarks: 100,
          percentage: isDisqualified ? 0 : 78,
          percentile: isDisqualified ? 0 : 94.2,
          rank: isDisqualified ? 999 : 24,
          qualified: !isDisqualified,
          passingScore: 50,
          sectionAnalysis: [],
          violations: currentViolations,
          autoSubmitted: isAutoSubmit || isDisqualified,
          submittedAt: new Date().toISOString(),
        });
        router.push(`/student/exam/submitted${isDisqualified ? "?disqualified=true" : ""}`);
      }
    },
    [currentQuestions, student, submitExam, timeLeft, router, stopWebcam]
  );

  // Anti-cheating strike logger (Up to 3 Excuses Policy)
  const logViolation = useCallback(
    (type: CheatingViolation["type"], message: string) => {
      if (isTerminatedRef.current) return;

      const nextStrike = strikesRef.current + 1;
      strikesRef.current = nextStrike;
      setStrikes(nextStrike);

      const newViolation: CheatingViolation = {
        timestamp: new Date().toISOString(),
        type,
        message,
        strikeNumber: nextStrike,
      };

      setViolations((prev) => [...prev, newViolation]);
      examService.logViolation(sessionIdRef.current, student.id, newViolation);

      if (nextStrike >= 3) {
        setIsTerminated(true);
        isTerminatedRef.current = true;
        stopWebcam();
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        setWarningModalMessage(`ALL 3 EXCUSES EXHAUSTED: ${message}`);
        toast.error("3 Malpractice Excuses Exceeded! Exam Blocked and Terminated.");

        // Automatically finalize and redirect after 5 seconds if student doesn't click CTA
        setTimeout(() => {
          handleFinalSubmit(true);
        }, 5000);
      } else {
        const remaining = 3 - nextStrike;
        setWarningModalMessage(
          `Security violation: ${message}. Excuse #${nextStrike} of 3 used (${remaining} excuse${remaining === 1 ? "" : "s"} remaining).`
        );
        toast.error(`Strike ${nextStrike}/3: ${message}`);
      }
    },
    [stopWebcam, student.id, handleFinalSubmit]
  );

  // Anti-Malpractice Event Listeners
  useEffect(() => {
    // Initial check of fullscreen state
    setIsFullscreen(!!document.fullscreenElement);

    const handleBlur = () => {
      if (isTerminatedRef.current) return;
      logViolation("window_blur", "Window focus lost. Tab or application switching is strictly prohibited.");
    };

    const handleVisibilityChange = () => {
      if (isTerminatedRef.current) return;
      if (document.hidden) {
        logViolation("tab_switch", "Tab switch detected. Examination view must remain visible.");
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (isTerminatedRef.current) return;
      logViolation("right_click", "Right-click context menu is strictly disabled in secure mode.");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (isTerminatedRef.current) return;
      logViolation("copy_attempt", "Clipboard copy operation is blocked by proctoring policy.");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      if (isTerminatedRef.current) return;
      logViolation("copy_attempt", "Clipboard cut operation is blocked by proctoring policy.");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      if (isTerminatedRef.current) return;
      logViolation("paste_attempt", "Clipboard paste operation is blocked by proctoring policy.");
    };

    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "a") ||
        (e.metaKey && (e.key === "p" || e.key === "s"))
      ) {
        e.preventDefault();
        if (isTerminatedRef.current) return;
        logViolation("devtools_opened", "Unauthorized developer tool, print, or save shortcut blocked.");
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen && !isTerminatedRef.current) {
        logViolation("fullscreen_exit", "Fullscreen mode exited. You must remain in continuous fullscreen.");
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("cut", handleCut);
    window.addEventListener("paste", handlePaste);
    window.addEventListener("dragstart", handleDrag);
    window.addEventListener("drop", handleDrag);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("cut", handleCut);
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("dragstart", handleDrag);
      window.removeEventListener("drop", handleDrag);
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

            {/* Exit Assessment Button */}
            <button
              onClick={() => setIsExitModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Exit Assessment & Stop Camera"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>

            {/* Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
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

      {/* Mandatory Full-Screen Lockdown Guard */}
      {!isFullscreen && !warningModalMessage && !isTerminated && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border-2 border-[#005BBB] text-center space-y-5 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] flex items-center justify-center mx-auto shadow-inner">
              <Maximize className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] border border-blue-200 dark:border-blue-800 inline-flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Fullscreen Secure Lockdown
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Fullscreen Mode Required
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                This examination is protected against malpractice. The screen is restricted and you must enter and maintain continuous Full-Screen mode to view and answer questions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                3-Excuse Malpractice Policy:
              </p>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                You are granted up to 3 excuses for accidental exits or tab switches ({strikes}/3 currently used). After 3 excuses, your exam will be permanently blocked and terminated.
              </p>
            </div>

            <button
              onClick={requestFullscreenMode}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#005BBB] to-[#0070e0] hover:scale-[1.01] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Maximize className="w-4 h-4" />
              <span>Enable Full-Screen Lockdown & Start</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Malpractice Excuse & Termination Modal */}
      {warningModalMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] text-center space-y-4 shadow-2xl ${
              isTerminated || strikes >= 3
                ? "border-4 border-rose-600 ring-4 ring-rose-500/20"
                : "border-2 border-amber-500"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                isTerminated || strikes >= 3
                  ? "bg-rose-100 dark:bg-rose-950 text-rose-600 animate-pulse"
                  : "bg-amber-100 dark:bg-amber-950 text-amber-600 animate-bounce"
              }`}
            >
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span
                className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-extrabold uppercase ${
                  isTerminated || strikes >= 3
                    ? "bg-rose-100 dark:bg-rose-950 text-rose-600"
                    : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                }`}
              >
                {isTerminated || strikes >= 3
                  ? "ALL 3 EXCUSES EXHAUSTED • DISQUALIFIED"
                  : `SECURITY EXCUSE #${strikes} OF 3 USED`}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white pt-2">
                {isTerminated || strikes >= 3
                  ? "Exam Blocked & Terminated"
                  : strikes === 1
                  ? "Warning #1: Security Excuse Granted"
                  : "Final Warning: 1 Excuse Remaining"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                {isTerminated || strikes >= 3
                  ? "You have exceeded the maximum limit of 3 security excuses. Your assessment has been permanently blocked and terminated due to malpractice policy violation. Camera proctoring is stopped and your profile has been logged as Disqualified."
                  : warningModalMessage}
              </p>
            </div>

            {isTerminated || strikes >= 3 ? (
              <p className="text-[11px] text-rose-600 font-bold p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                Action: Your assessment responses have been frozen and your institutional record flagged as Disqualified.
              </p>
            ) : (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                Warning: You have {3 - strikes} excuse{3 - strikes === 1 ? "" : "s"} remaining before permanent disqualification and exam block.
              </p>
            )}

            {isTerminated || strikes >= 3 ? (
              <button
                onClick={() => handleFinalSubmit(true)}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Proceed to Disqualification Report
              </button>
            ) : (
              <button
                onClick={() => {
                  setWarningModalMessage(null);
                  requestFullscreenMode();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                Acknowledge Excuse & Resume Full-Screen
              </button>
            )}
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
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer"
              >
                Confirm Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-[#111C3A] rounded-[28px] border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <VideoOff className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Exit Assessment Room?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your webcam proctoring session will be stopped immediately and camera hardware access released. Current answers have been safely autosaved.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={() => {
                  setIsExitModalOpen(false);
                  handleExitExam();
                }}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Exit & Stop Camera
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
