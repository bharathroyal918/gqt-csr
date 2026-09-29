"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CSRDrive } from "@/types";
import {
  Briefcase,
  Layers,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  QrCode,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateDrivePage() {
  const router = useRouter();
  const { addDrive, users, currentUser } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState(() => {
    const hrUser = users.find((u) => u.role.toLowerCase().includes("hr")) || users[0] || { id: currentUser.id, name: currentUser.name, role: currentUser.role };
    const trainerUser = users.find((u) => u.role.toLowerCase().includes("trainer")) || users[1] || users[0] || { name: currentUser.name };
    const managerUser = users.find((u) => u.role.toLowerCase().includes("manager") || u.role.toLowerCase().includes("coordinator")) || users[0] || { name: currentUser.name };
    return {
      name: "Karnataka State-wide Engineering Drive 2026",
      driveCode: `GQT-CSR-2026-0${Math.floor(4 + Math.random() * 5)}`,
      academicYear: "2025-2026",
      category: "CSR Flagship" as CSRDrive["category"],
      mode: "Hybrid" as CSRDrive["mode"],
      description:
        "Enterprise CSR recruitment initiative providing fully sponsored skilling and high-growth technology internships.",
      location: "Bengaluru & Regional Hubs",
      venue: "GQT Innovation Hub & Partner Campus Labs",
      district: "Bengaluru Urban",
      state: "Karnataka",

      // Courses & Eligibility
      courses: ["Java Full Stack + Agentic AI", "Python Data Science & GenAI"],
      batch: "2026 Batch",
      eligibleDepartments: ["Computer Science", "Information Science", "AIML", "Electronics & Comm."],
      graduationTypes: ["BE", "B.Tech", "MCA"] as CSRDrive["graduationTypes"],
      semesterEligibility: [7, 8],
      backlogAllowed: true,
      maxBacklogs: 2,
      minPercentage: 60,
      minCgpa: 6.5,

      // Schedule
      regStart: "2026-09-01",
      regEnd: "2026-10-01",
      examDate: "2026-10-08",
      examTime: "10:30 AM IST",
      interviewDate: "2026-10-18",
      offerDate: "2026-10-28",
      joiningDate: "2026-11-15",

      // Assignments
      hrLeadId: hrUser.id || currentUser.id,
      hrLeadName: `${hrUser.name} (${hrUser.role})`,
      panelMembers: users.slice(0, 2).map((u) => u.name),
      trainer: `${trainerUser.name} (Technical Lead)`,
      placementManager: managerUser.name,
      questionBankId: "qb-fullstack-2026",
      offerLetterTemplateId: "tmpl-offer-enterprise-2026",

      // Automation
      whatsappGroupEnabled: true,
      whatsappGroupName: "College + GQT CSR 2026 Coordination",
      reminderEnabled: true,
      autoInterviewScheduling: true,
      autoOfferLetter: true,
    };
  });

  const handleNext = () => setStep((s) => Math.min(5, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const regLink = `https://csr.globalquesttechnologies.com/student/register?drive=${formData.driveCode.toLowerCase()}`;

    addDrive({
      driveCode: formData.driveCode,
      academicYear: formData.academicYear,
      name: formData.name,
      category: formData.category,
      mode: formData.mode,
      status: "Registration Open",
      description: formData.description,
      location: formData.location,
      venue: formData.venue,
      district: formData.district,
      state: formData.state,
      courses: formData.courses,
      batch: formData.batch,
      eligibleDepartments: formData.eligibleDepartments,
      graduationTypes: formData.graduationTypes,
      semesterEligibility: formData.semesterEligibility,
      backlogAllowed: formData.backlogAllowed,
      maxBacklogs: formData.maxBacklogs,
      minPercentage: formData.minPercentage,
      minCgpa: formData.minCgpa,
      schedule: {
        regStart: formData.regStart,
        regEnd: formData.regEnd,
        examDate: formData.examDate,
        examTime: formData.examTime,
        interviewDate: formData.interviewDate,
        offerDate: formData.offerDate,
        joiningDate: formData.joiningDate,
      },
      assignments: {
        hrLeadId: formData.hrLeadId,
        hrLeadName: formData.hrLeadName,
        panelMembers: formData.panelMembers,
        trainer: formData.trainer,
        placementManager: formData.placementManager,
        questionBankId: formData.questionBankId,
        offerLetterTemplateId: formData.offerLetterTemplateId,
      },
      automation: {
        registrationLink: regLink,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(regLink)}`,
        whatsappGroupEnabled: formData.whatsappGroupEnabled,
        whatsappGroupName: formData.whatsappGroupName,
        whatsappGroupLink: "https://chat.whatsapp.com/GQT-CSR-AUTO-INVITE",
        reminderEnabled: formData.reminderEnabled,
        autoInterviewScheduling: formData.autoInterviewScheduling,
        autoOfferLetter: formData.autoOfferLetter,
      },
      metrics: {
        collegesCount: 15,
        registeredStudents: 0,
        examAttended: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0,
      },
    });

    router.push("/portal/drives");
  };

  const steps = [
    { num: 1, label: "Drive Details" },
    { num: 2, label: "Courses & Eligibility" },
    { num: 3, label: "Schedule" },
    { num: 4, label: "Assignments" },
    { num: 5, label: "Automation" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Link href="/portal/drives" className="hover:text-[#005BBB]">CSR Drives</Link>
          <span>/</span>
          <span className="text-[#0F172A] dark:text-white font-semibold">New Drive Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
          Create New CSR Recruitment Drive
        </h1>
      </div>

      {/* Stepper Indicator */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.num
                      ? "bg-[#005BBB] text-white shadow-md shadow-blue-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-semibold ${
                    step >= s.num ? "text-[#0F172A] dark:text-white" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step > s.num ? "bg-[#005BBB]" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Form Container */}
      <div className="gqt-card p-6 sm:p-8 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: DRIVE DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                1. Basic CSR Drive Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    CSR Drive Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Drive Code (Auto Generated)
                  </label>
                  <input
                    type="text"
                    value={formData.driveCode}
                    onChange={(e) => setFormData({ ...formData, driveCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Drive Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CSRDrive["category"] })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="CSR Flagship" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">CSR Flagship</option>
                    <option value="Women in Tech" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Women in Tech</option>
                    <option value="Rural Engineering Uplift" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Rural Engineering Uplift</option>
                    <option value="Tier-2/3 Excellence" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Tier-2/3 Excellence</option>
                    <option value="General" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as CSRDrive["mode"] })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="Hybrid" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Hybrid (Campus + Virtual)</option>
                    <option value="Offline Campus" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Offline Campus Physical</option>
                    <option value="Virtual Live" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Virtual Live</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Location & Hub Venues
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Description & Objectives
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: COURSES & ELIGIBILITY */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                2. Course Configuration & Eligibility Criteria
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Target Batch
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Eligible Degrees
                  </label>
                  <input
                    type="text"
                    value={formData.graduationTypes.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        graduationTypes: e.target.value.split(",").map((s) => s.trim()) as CSRDrive["graduationTypes"],
                      })
                    }
                    placeholder="BE, B.Tech, MCA"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Minimum Academic % Cutoff
                  </label>
                  <input
                    type="number"
                    value={formData.minPercentage}
                    onChange={(e) => setFormData({ ...formData, minPercentage: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                      Allow Active / History Backlogs?
                    </span>
                    <span className="text-[11px] text-slate-400">
                      If enabled, students with backlogs up to the limit can register
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.backlogAllowed}
                      onChange={(e) => setFormData({ ...formData, backlogAllowed: e.target.checked })}
                      className="w-4 h-4 rounded text-[#005BBB]"
                    />
                    {formData.backlogAllowed && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">Max:</span>
                        <input
                          type="number"
                          value={formData.maxBacklogs}
                          onChange={(e) => setFormData({ ...formData, maxBacklogs: parseInt(e.target.value) || 0 })}
                          className="w-14 px-2 py-1 bg-white dark:bg-[#111C3A] border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-center font-bold text-[#0F172A] dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                3. Recruitment & Examination Schedule
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Registration Window Starts
                  </label>
                  <input
                    type="date"
                    value={formData.regStart}
                    onChange={(e) => setFormData({ ...formData, regStart: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.regEnd}
                    onChange={(e) => setFormData({ ...formData, regEnd: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Assessment / Exam Date
                  </label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Exam Slot Time
                  </label>
                  <input
                    type="text"
                    value={formData.examTime}
                    onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
                    placeholder="10:30 AM IST"
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    HR Interview Date
                  </label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Offer Release Date
                  </label>
                  <input
                    type="date"
                    value={formData.offerDate}
                    onChange={(e) => setFormData({ ...formData, offerDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ASSIGNMENTS */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                4. HR Panel & Trainer Assignment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    HR Recruitment Lead
                  </label>
                  <select
                    value={formData.hrLeadName}
                    onChange={(e) => setFormData({ ...formData, hrLeadName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={`${u.name} (${u.role})`} className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Lead Technical Trainer
                  </label>
                  <input
                    type="text"
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Examination Question Bank
                  </label>
                  <select
                    value={formData.questionBankId}
                    onChange={(e) => setFormData({ ...formData, questionBankId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="qb-fullstack-2026" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Standard Java + SQL + Agentic AI Bank (40 Qs)</option>
                    <option value="qb-women-tech-ai" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Women in Tech AI & Data Track (40 Qs)</option>
                    <option value="qb-rural-tech-uplift" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Core Engineering & Aptitude Bank (40 Qs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Offer Letter Template
                  </label>
                  <select
                    value={formData.offerLetterTemplateId}
                    onChange={(e) => setFormData({ ...formData, offerLetterTemplateId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="tmpl-offer-enterprise-2026" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">GQT Enterprise Full-time Letterhead (₹6.5 LPA)</option>
                    <option value="tmpl-offer-internship" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">GQT 6-Month Skilling & Stipend Letter</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AUTOMATION */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                5. WhatsApp & Lifecycle Automation
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                        Auto Create College WhatsApp Coordination Group
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Formula: College + GQT + Academic Year (e.g., RVCE + GQT CSR 2026)
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.whatsappGroupEnabled}
                    onChange={(e) => setFormData({ ...formData, whatsappGroupEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-[#005BBB]" />
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                        Generate Dynamic QR Code & College Registration Link
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Sharable in college circulars, student notice boards, and emails
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#005BBB] text-white text-[10px] font-bold">
                    AUTO ACTIVE
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] dark:text-white block">
                        Automated HR Interview Queueing & Digital Offer Generation
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Students who score ≥ 50% automatically advance to HR Kanban slots
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoInterviewScheduling}
                    onChange={(e) => setFormData({ ...formData, autoInterviewScheduling: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-extrabold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Launch CSR Drive Live
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
