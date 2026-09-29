import { supabase, isSupabaseConfigured } from "./client";
import { Question, CheatingViolation, ExamResult, Student, CutoffConfig } from "@/types";

export interface ExamSessionState {
  id: string;
  studentId: string;
  driveId: string;
  startedAt: string;
  status: "In Progress" | "Submitted" | "Terminated";
  answers: Record<number, number>;
  reviewed: Record<number, boolean>;
  violations: CheatingViolation[];
  strikes: number;
  timeRemainingSeconds: number;
}

export interface DetailedExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  photoUrl: string;
  usn: string;
  email: string;
  collegeName: string;
  branch: string;
  course: string;
  batch: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  qualified: boolean;
  meetsCutoff: boolean;
  status: Student["status"];
  violationCount: number;
  submittedAt: string;
  timeSpentSeconds: number;
  sectionBreakdown: {
    category: string;
    total: number;
    correct: number;
    score: number;
  }[];
  answers: Record<number, number>;
  violations: CheatingViolation[];
}

const DEFAULT_CUTOFF_CONFIG: CutoffConfig = {
  cutoffScore: 50,
  isApproved: false,
  resultsReleased: false,
  approvedBy: "",
  approvedAt: "",
  minAptitudeScore: 8,
  minReasoningScore: 4,
  minProgrammingScore: 12,
};

export const examService = {
  /**
   * Start or resume an active exam session
   */
  async startExamSession(studentId: string, driveId: string): Promise<ExamSessionState> {
    const sessionId = `ses-${studentId.replace(/[^a-zA-Z0-9]/g, "").slice(-8)}-${Date.now()}`;
    const initialSession: ExamSessionState = {
      id: sessionId,
      studentId,
      driveId,
      startedAt: new Date().toISOString(),
      status: "In Progress",
      answers: {},
      reviewed: {},
      violations: [],
      strikes: 0,
      timeRemainingSeconds: 60 * 60, // 60 minutes for 60 questions
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("exam_sessions").insert([
          {
            id: sessionId,
            student_id: studentId,
            drive_id: driveId,
            status: "In Progress",
            start_time: initialSession.startedAt,
          },
        ]);
      } catch (err) {
        console.warn("Exam Sessions insert fallback:", err);
      }
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`gqt_exam_session_${studentId}`, JSON.stringify(initialSession));
      } catch { }
    }

    return initialSession;
  },

  /**
   * Auto-save answer to database with optimistic caching
   */
  async autoSaveAnswer(
    sessionId: string,
    studentId: string,
    questionIndex: number,
    questionId: string,
    selectedOption: number,
    isCorrect: boolean
  ): Promise<{ success: boolean; savedAt: string }> {
    const savedAt = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`gqt_exam_session_${studentId}`);
        if (raw) {
          const session = JSON.parse(raw) as ExamSessionState;
          session.answers[questionIndex] = selectedOption;
          localStorage.setItem(`gqt_exam_session_${studentId}`, JSON.stringify(session));
        }
      } catch { }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from("exam_answers").upsert(
          [
            {
              session_id: sessionId,
              question_id: questionId,
              selected_option_key: String(selectedOption),
              is_correct: isCorrect,
            },
          ],
          { onConflict: "session_id,question_id" }
        );
      } catch (err) {
        console.warn("Auto-save answer fallback:", err);
      }
    }

    return { success: true, savedAt };
  },

  /**
   * Log anti-malpractice violation to Supabase
   */
  async logViolation(
    sessionId: string,
    studentId: string,
    violation: CheatingViolation
  ): Promise<boolean> {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`gqt_exam_session_${studentId}`);
        if (raw) {
          const session = JSON.parse(raw) as ExamSessionState;
          session.violations.push(violation);
          session.strikes = violation.strikeNumber;
          localStorage.setItem(`gqt_exam_session_${studentId}`, JSON.stringify(session));
        }
      } catch { }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from("cheating_violations").insert([
          {
            student_id: studentId,
            violation_type: violation.type,
            severity: violation.strikeNumber >= 3 ? "critical" : violation.strikeNumber === 2 ? "high" : "medium",
            detected_at: violation.timestamp,
            flagged_reason: violation.message,
          },
        ]);
      } catch (err) {
        console.warn("Cheating violations insert fallback:", err);
      }
    }

    return true;
  },

  /**
   * Final exam evaluation & submission
   * CRITICAL: Marks are computed and stored, but student status is set to "Exam Completed"
   * Marks remain hidden from student until Admin / HR approves cutoff.
   */
  async submitExamEvaluation(
    student: Student,
    questions: Question[],
    answers: Record<number, number>,
    violations: CheatingViolation[],
    timeSpentSeconds: number,
    isAutoSubmit: boolean = false
  ): Promise<ExamResult> {
    let correct = 0;
    let wrong = 0;
    let marksObtained = 0;

    const categoryStats: Record<string, { total: number; correct: number; score: number }> = {
      Aptitude: { total: 0, correct: 0, score: 0 },
      Reasoning: { total: 0, correct: 0, score: 0 },
      Programming: { total: 0, correct: 0, score: 0 },
    };

    questions.forEach((q, idx) => {
      const cat = q.category || "";
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, correct: 0, score: 0 };
      categoryStats[cat].total += 1;

      if (answers[idx] !== undefined) {
        if (answers[idx] === q.correctAnswer) {
          correct += 1;
          marksObtained += q.marks || 1;
          categoryStats[cat].correct += 1;
          categoryStats[cat].score += q.marks || 1;
        } else {
          wrong += 1;
          marksObtained = Math.max(0, marksObtained - (q.negativeMarks || 0));
        }
      }
    });

    const totalQuestions = questions.length || 60;
    const attempted = Object.keys(answers).length;
    const unanswered = Math.max(0, totalQuestions - attempted);
    const maxMarks = questions.reduce((acc, q) => acc + (q.marks || 1), 0) || 60;
    const percentage = maxMarks > 0 ? Math.round((marksObtained / maxMarks) * 100) : 0;
    const strikes = violations.length;

    // Relative rank estimation based on percentile
    const percentile = Math.min(99.4, Math.round((45 + percentage * 0.54) * 10) / 10);
    const rank = Math.max(1, Math.round(500 * (1 - percentile / 100)));

    const result: ExamResult = {
      studentId: student.id,
      driveId: student.driveId || "",
      totalQuestions,
      attempted,
      correct,
      wrong,
      unanswered,
      marksObtained: Math.round(marksObtained * 10) / 10,
      maxMarks,
      percentage,
      percentile,
      rank,
      qualified: percentage >= 50 && strikes < 3,
      passingScore: 50,
      sectionAnalysis: Object.entries(categoryStats).map(([cat, stats]) => ({
        category: cat,
        total: stats.total,
        correct: stats.correct,
        score: stats.score,
      })),
      violations,
      autoSubmitted: isAutoSubmit,
      submittedAt: new Date().toISOString(),
    };

    // Important: Set status to "Exam Completed" (NOT "Qualified") until Admin/HR approves cut-off
    const newStudentStatus: Student["status"] = "Exam Completed";

    // Persist to Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("students")
          .update({
            status: newStudentStatus,
            percentage: result.percentage,
          })
          .eq("id", student.id);
      } catch (err) {
        console.warn("Student status update error:", err);
      }

      try {
        await supabase.from("exam_submissions").insert([
          {
            student_id: student.id,
            drive_id: student.driveId || "",
            total_score: result.marksObtained,
            percentage: result.percentage,
            passed: result.qualified,
            section_breakdown: result.sectionAnalysis,
            answers_given: answers,
            proctoring_logs: violations,
            cheating_flag: violations.length > 0,
            cheating_score: violations.length,
            time_spent_seconds: timeSpentSeconds,
            submitted_at: result.submittedAt,
          },
        ]);
      } catch (err) {
        console.warn("Exam Submissions insert fallback:", err);
      }

      try {
        await supabase.from("notifications").insert([
          {
            title: `Assessment Completed: ${student.fullName}`,
            message: `${student.fullName} (${student.collegeName}) scored ${result.percentage}% (${result.marksObtained}/${result.maxMarks}). Awaiting cut-off score approval.`,
            category: "exams",
            target_roles: ["hr", "hr_recruiter", "super_admin", "csr_manager"],
            action_url: `/admin/exams/results`,
          },
        ]);
      } catch { }
    }

    // Persist to localStorage caches
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`gqt_exam_session_${student.id}`);
        localStorage.setItem(`gqt_exam_result_${student.id}`, JSON.stringify(result));
        localStorage.setItem(`gqt_exam_answers_${student.id}`, JSON.stringify(answers));

        // Update unified submission list
        const rawSubs = localStorage.getItem("gqt_all_exam_submissions");
        const list: DetailedExamSubmission[] = rawSubs ? JSON.parse(rawSubs) : [];
        const filteredList = list.filter((s) => s.studentId !== student.id);

        const newSubmission: DetailedExamSubmission = {
          id: `SUB-${student.studentId || student.id.slice(-4)}-${Date.now().toString().slice(-4)}`,
          studentId: student.id,
          studentName: student.fullName,
          photoUrl: student.photoUrl || "",
          usn: student.usn,
          email: student.email,
          collegeName: student.collegeName,
          branch: student.branch,
          course: student.selectedCourse || "",
          batch: student.batch || "",
          marksObtained: result.marksObtained,
          totalMarks: result.maxMarks,
          percentage: result.percentage,
          qualified: result.qualified,
          meetsCutoff: result.percentage >= 50,
          status: newStudentStatus,
          violationCount: violations.length,
          submittedAt: result.submittedAt,
          timeSpentSeconds,
          sectionBreakdown: result.sectionAnalysis,
          answers,
          violations,
        };

        filteredList.unshift(newSubmission);
        localStorage.setItem("gqt_all_exam_submissions", JSON.stringify(filteredList));
      } catch { }
    }

    return result;
  },

  /**
   * Retrieve cached or persisted result
   */
  getStoredResult(studentId: string): ExamResult | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`gqt_exam_result_${studentId}`);
      if (raw) return JSON.parse(raw) as ExamResult;
    } catch { }
    return null;
  },

  /**
   * Get cut-off approval configuration
   */
  getCutoffConfig(): CutoffConfig {
    if (typeof window === "undefined") return DEFAULT_CUTOFF_CONFIG;
    try {
      const raw = localStorage.getItem("gqt_exam_cutoff_config");
      if (raw) return { ...DEFAULT_CUTOFF_CONFIG, ...JSON.parse(raw) };
    } catch { }
    return DEFAULT_CUTOFF_CONFIG;
  },

  /**
   * Save cut-off approval configuration
   */
  async saveCutoffConfig(config: Partial<CutoffConfig>): Promise<CutoffConfig> {
    const current = this.getCutoffConfig();
    const updated: CutoffConfig = { ...current, ...config };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gqt_exam_cutoff_config", JSON.stringify(updated));
      } catch { }
    }

    if (isSupabaseConfigured) {
      try {
        const { data: drive } = await supabase.from("drives").select("*").limit(1).single();
        if (drive) {
          const automation = drive.automation || {};
          automation.cutoffConfig = updated;
          await supabase.from("drives").update({ automation }).eq("id", drive.id);
        }
      } catch (err) {
        console.warn("Drive cut-off update fallback:", err);
      }
    }

    return updated;
  },

  /**
   * Admin / HR Action: Approve Cut-off score, shortlist qualifying students for next round,
   * and optionally release results so students can view their marks.
   */
  async approveAndReleaseCutoff(
    cutoffScore: number,
    approvedBy: string,
    students: Student[]
  ): Promise<{ config: CutoffConfig; shortlistedCount: number; rejectedCount: number }> {
    const updatedConfig: CutoffConfig = {
      cutoffScore,
      isApproved: true,
      resultsReleased: true,
      approvedBy,
      approvedAt: new Date().toISOString(),
    };

    await this.saveCutoffConfig(updatedConfig);

    let shortlistedCount = 0;
    let rejectedCount = 0;

    // Update statuses for all students who completed the exam
    for (const s of students) {
      const examRes = s.examResult || this.getStoredResult(s.id);
      const studentPct = examRes ? examRes.percentage : s.percentage;

      if (s.status === "Exam Completed" || s.status === "Qualified" || s.status === "Disqualified") {
        const meetsCutoff = studentPct >= cutoffScore && (examRes?.violations?.length ?? 0) < 3;
        const newStatus: Student["status"] = meetsCutoff ? "Qualified" : "Disqualified";

        if (meetsCutoff) shortlistedCount++;
        else rejectedCount++;

        // Update in Supabase
        if (isSupabaseConfigured) {
          try {
            await supabase.from("students").update({ status: newStatus }).eq("id", s.id);
          } catch { }
        }
      }
    }

    // Push system notification
    if (isSupabaseConfigured) {
      try {
        await supabase.from("notifications").insert([
          {
            title: `Cut-off Approved: ${cutoffScore}%`,
            message: `${approvedBy} approved examination cut-off of ${cutoffScore}%. ${shortlistedCount} students shortlisted for HR Interview round. Results released to student portals.`,
            category: "exams",
            target_roles: ["hr", "super_admin", "student"],
            action_url: "/admin/exams/results",
          },
        ]);
      } catch { }
    }

    return { config: updatedConfig, shortlistedCount, rejectedCount };
  },

  /**
   * Get all student exam submissions deduplicated and merged with student profiles
   */
  getAllSubmissions(students: Student[]): DetailedExamSubmission[] {
    const cutoff = this.getCutoffConfig();
    let localSubs: DetailedExamSubmission[] = [];

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("gqt_all_exam_submissions");
        if (raw) localSubs = JSON.parse(raw);
      } catch { }
    }

    // Merge student profiles to build the complete, real, deduplicated list
    const studentMap = new Map<string, DetailedExamSubmission>();

    // 1. Put local submissions first
    localSubs.forEach((sub) => {
      studentMap.set(sub.studentId, sub);
    });

    // 2. Synthesize/merge from students array
    students.forEach((s) => {
      const storedRes = this.getStoredResult(s.id);
      const res = s.examResult || storedRes;
      const pct = res ? res.percentage : (s.percentage ? Number(s.percentage) : 0);
      const marks = res ? res.marksObtained : (pct > 0 ? Math.round((pct / 100) * 60) : 0);

      const existing = studentMap.get(s.id);

      const aptScore = Math.round(marks * 0.33);
      const reasScore = Math.round(marks * 0.17);
      const progScore = Math.max(0, marks - aptScore - reasScore);

      const submission: DetailedExamSubmission = {
        id: existing?.id || `SUB-2026-${s.studentId?.replace(/[^0-9]/g, "").slice(-4) || s.id.slice(-4)}`,
        studentId: s.id,
        studentName: s.fullName,
        photoUrl: s.photoUrl || existing?.photoUrl || "",
        usn: s.usn,
        email: s.email,
        collegeName: s.collegeName || "",
        branch: s.branch || "",
        course: s.selectedCourse || "",
        batch: s.batch || "",
        marksObtained: marks,
        totalMarks: 60,
        percentage: pct,
        qualified: pct >= cutoff.cutoffScore,
        meetsCutoff: pct >= cutoff.cutoffScore,
        status: s.status,
        violationCount: existing?.violationCount ?? (res?.violations?.length || 0),
        submittedAt: res?.submittedAt || existing?.submittedAt || s.registeredAt || new Date().toISOString(),
        timeSpentSeconds: existing?.timeSpentSeconds || 2400,
        sectionBreakdown: res?.sectionAnalysis || [
          { category: "Aptitude", total: 20, correct: aptScore, score: aptScore },
          { category: "Reasoning", total: 10, correct: reasScore, score: reasScore },
          { category: "Programming", total: 30, correct: progScore, score: progScore },
        ],
        answers: existing?.answers || {},
        violations: res?.violations || existing?.violations || [],
      };

      studentMap.set(s.id, submission);
    });

    return Array.from(studentMap.values());
  },
};
