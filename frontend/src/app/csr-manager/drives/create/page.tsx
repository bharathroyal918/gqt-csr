"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import {
  Briefcase,
  Layers,
  GraduationCap,
  Calendar,
  Users,
  MessageSquare,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Share2,
  Save,
  Download,
  Building2,
  Lock,
  Upload,
  Clock,
  ShieldCheck
} from "lucide-react";
import { CSRDrive } from "@/types";

export default function CreateCSRDriveWizardPage() {
  const router = useRouter();
  const { addDrive, colleges } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Drive Information
  const [driveId] = useState(`drv-${Date.now().toString().slice(-4)}`);
  const [driveCode] = useState(`GQT-CSR-2025-${Math.floor(100 + Math.random() * 900)}`);
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [driveName, setDriveName] = useState("");
  const [category, setCategory] = useState<CSRDrive["category"]>("CSR Flagship");
  const [trainingMode, setTrainingMode] = useState<CSRDrive["mode"]>("Hybrid");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");

  // Step 2: Eligibility Rules
  const [graduateTypes, setGraduateTypes] = useState<string[]>(["BE", "B.Tech", "MCA"]);
  const [eligibleBranches, setEligibleBranches] = useState<string[]>(["Computer Science", "Information Science", "AI & ML", "ECE"]);
  const [passingYear, setPassingYear] = useState(2025);
  const [minPercentage, setMinPercentage] = useState(60);
  const [minCgpa, setMinCgpa] = useState(6.5);
  const [maxBacklogs, setMaxBacklogs] = useState(1);
  const [backlogAllowed, setBacklogAllowed] = useState(true);
  const [genderEligibility, setGenderEligibility] = useState("All");
  const [districtRestriction, setDistrictRestriction] = useState("All Karnataka Districts");

  // Step 3: Course Configuration
  const [selectedCourses, setSelectedCourses] = useState([
    {
      courseName: "Agentic AI Java Full Stack",
      batchName: "GQT-AI-JAVA-B1",
      duration: "16 Weeks",
      seats: 120,
      trainer: "Naveen Reddy & Senior Arch Team",
      questionBankId: "QB-J01",
      interviewPanel: "Hitha, Kusuma",
      offerTemplate: "tpl-em-03",
    },
    {
      courseName: "Agentic AI Python Full Stack",
      batchName: "GQT-AI-PY-B1",
      duration: "16 Weeks",
      seats: 80,
      trainer: "AI Solutions Division",
      questionBankId: "QB-AI01",
      interviewPanel: "Divya.H",
      offerTemplate: "tpl-em-03",
    },
  ]);

  // Step 4: Schedule Configuration
  const [regStartDate, setRegStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [regEndDate, setRegEndDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]);
  const [examDate, setExamDate] = useState(new Date(Date.now() + 16 * 86400000).toISOString().split("T")[0]);
  const [examStartTime, setExamStartTime] = useState("10:00");
  const [examEndTime, setExamEndTime] = useState("12:00");
  const [interviewStartDate, setInterviewStartDate] = useState(new Date(Date.now() + 18 * 86400000).toISOString().split("T")[0]);
  const [interviewEndDate, setInterviewEndDate] = useState(new Date(Date.now() + 22 * 86400000).toISOString().split("T")[0]);
  const [offerDate, setOfferDate] = useState(new Date(Date.now() + 25 * 86400000).toISOString().split("T")[0]);
  const [joiningDate, setJoiningDate] = useState("2025-07-15");
  const [timezone] = useState("Asia/Kolkata (IST)");

  // Step 5: HR Assignment
  const [leadHr, setLeadHr] = useState("Hitha, Kusuma");
  const [backupHr, setBackupHr] = useState("Divya.H");
  const [ptoLead, setPtoLead] = useState("Prof. Chandrasekhar (RVCE)");
  const [facultyCoordinator, setFacultyCoordinator] = useState("Dr. Suma Swamy");
  const [assignedCollegesCount, setAssignedCollegesCount] = useState(12);

  // Step 6: Communication Templates
  const [waTemplate, setWaTemplate] = useState("wa_exam_reminder_v2");
  const [emailTemplate, setEmailTemplate] = useState("email_registration_success");
  const [reminderTemplate, setReminderTemplate] = useState("email_exam_reminder");
  const [offerTemplate, setOfferTemplate] = useState("email_offer_letter");

  // Step 7: Automation Settings
  const [autoSettings, setAutoSettings] = useState({
    enableRegistration: true,
    enableExam: true,
    enableAntiCheating: true,
    enableInterview: true,
    enableOfferLetter: true,
    enableWhatsappGroup: true,
    enableEmailReminder: true,
    enableNotifications: true,
    enableResumeUpload: true,
    enablePortfolioUpload: true,
  });

  const toggleAutoSetting = (key: keyof typeof autoSettings) => {
    setAutoSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = [
    { num: 1, title: "Drive Info", icon: Briefcase },
    { num: 2, title: "Eligibility", icon: GraduationCap },
    { num: 3, title: "Courses", icon: Layers },
    { num: 4, title: "Schedule", icon: Calendar },
    { num: 5, title: "HR Panels", icon: Users },
    { num: 6, title: "Templates", icon: MessageSquare },
    { num: 7, title: "Automation", icon: Sliders },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !driveName) {
      toast.error("Please enter a CSR Drive Name");
      return;
    }
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinalPublish = (isDraft = false) => {
    const newDrive: CSRDrive = {
      id: driveId,
      driveCode,
      name: driveName,
      academicYear,
      category,
      mode: trainingMode,
      status: isDraft ? "Draft" : "Registration Open",
      description: description || "Statewide Karnataka CSR Campus Drive",
      location: "Bengaluru, Karnataka",
      venue: "Main Campus Auditorium & Online Proctored",
      district: districtRestriction,
      state: "Karnataka",
      courses: selectedCourses.map((c) => c.courseName),
      batch: String(passingYear),
      eligibleDepartments: eligibleBranches,
      graduationTypes: graduateTypes as any,
      semesterEligibility: [7, 8],
      backlogAllowed,
      maxBacklogs,
      minPercentage,
      minCgpa,
      schedule: {
        regStart: regStartDate,
        regEnd: regEndDate,
        examDate,
        examTime: `${examStartTime} - ${examEndTime}`,
        interviewDate: interviewStartDate,
        offerDate,
        joiningDate,
      },
      assignments: {
        hrLeadId: "usr-hr-01",
        hrLeadName: leadHr,
        panelMembers: [leadHr, backupHr],
        trainer: "Tech Training Team",
        placementManager: "Kiran",
        questionBankId: "QB-J01",
        offerLetterTemplateId: offerTemplate,
      },
      automation: {
        registrationLink: `https://csr.gqt.in/register/${driveCode}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://csr.gqt.in/register/${driveCode}`,
        whatsappGroupEnabled: autoSettings.enableWhatsappGroup,
        reminderEnabled: autoSettings.enableEmailReminder,
        autoInterviewScheduling: autoSettings.enableInterview,
        autoOfferLetter: autoSettings.enableOfferLetter,
      },
      metrics: {
        collegesCount: assignedCollegesCount,
        registeredStudents: 0,
        examAttended: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0,
      },
    };

    addDrive(newDrive);
    toast.success(
      isDraft ? `Draft saved for "${driveName}"` : `CSR Drive "${driveName}" published live!`,
      {
        description: `QR Registration Link generated: https://csr.gqt.in/register/${driveCode}`,
      }
    );
    router.push(`/csr-manager/drives`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/csr-manager/drives"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives Hub
        </Link>
        <span className="text-xs font-mono text-primary font-semibold">
          Wizard ID: {driveCode}
        </span>
      </div>

      {/* Progress Stepper */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between overflow-x-auto gap-2 py-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl cursor-pointer transition-all whitespace-nowrap text-xs font-semibold ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : isDone
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? "bg-white text-primary" : isDone ? "bg-emerald-500 text-white" : "bg-muted"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span>{s.title}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        {/* Step 1: Drive Information */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" /> Step 1 — Campaign Core Identity
              </CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Drive ID (System Generated)</label>
                  <Input value={driveId} disabled className="font-mono bg-muted/40" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Drive Code (Public Handle)</label>
                  <Input value={driveCode} disabled className="font-mono font-bold text-primary bg-muted/40" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">CSR Drive Name *</label>
                <Input
                  value={driveName}
                  onChange={(e) => setDriveName(e.target.value)}
                  placeholder="e.g. Karnataka State CSR Flagship Campus Drive 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Drive Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="CSR Flagship">CSR Flagship</option>
                    <option value="Women in Tech">Women in Tech</option>
                    <option value="Rural Engineering Uplift">Rural Engineering Uplift</option>
                    <option value="Tier-2/3 Excellence">Tier-2/3 Excellence</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Training Mode</label>
                  <select
                    value={trainingMode}
                    onChange={(e) => setTrainingMode(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="Hybrid">Hybrid (On-Campus + Virtual Live)</option>
                    <option value="Offline Campus">Offline Campus Only</option>
                    <option value="Virtual Live">Virtual Live Cloud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Campaign Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Official initiative overview for participating colleges and candidates..."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border border-border bg-background text-foreground"
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Eligibility Rules */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Step 2 — Candidate Eligibility Rules
              </CardTitle>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Eligible Graduate Degrees</label>
                <div className="flex gap-2 flex-wrap">
                  {["BE", "B.Tech", "MCA", "BCA", "B.Sc", "M.Sc", "Diploma"].map((deg) => (
                    <label
                      key={deg}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                        graduateTypes.includes(deg) ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={graduateTypes.includes(deg)}
                        onChange={() =>
                          setGraduateTypes((prev) =>
                            prev.includes(deg) ? prev.filter((d) => d !== deg) : [...prev, deg]
                          )
                        }
                      />
                      {deg}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Eligible Engineering Branches</label>
                <div className="flex gap-2 flex-wrap">
                  {["Computer Science", "Information Science", "AI & ML", "Data Science", "ECE", "EEE", "Mechanical", "Civil"].map((br) => (
                    <label
                      key={br}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                        eligibleBranches.includes(br) ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={eligibleBranches.includes(br)}
                        onChange={() =>
                          setEligibleBranches((prev) =>
                            prev.includes(br) ? prev.filter((b) => b !== br) : [...prev, br]
                          )
                        }
                      />
                      {br}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Passing Year</label>
                  <Input type="number" value={passingYear} onChange={(e) => setPassingYear(parseInt(e.target.value) || 2025)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Min Percentage</label>
                  <Input type="number" value={minPercentage} onChange={(e) => setMinPercentage(parseInt(e.target.value) || 60)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Min CGPA</label>
                  <Input type="number" step="0.1" value={minCgpa} onChange={(e) => setMinCgpa(parseFloat(e.target.value) || 6.0)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Max Backlogs</label>
                  <Input type="number" value={maxBacklogs} onChange={(e) => setMaxBacklogs(parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Course Configuration */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Step 3 — Course Curriculum & Batch Allocation
              </CardTitle>

              <div className="space-y-3">
                {selectedCourses.map((c, i) => (
                  <div key={i} className="p-4 border rounded-2xl bg-card space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-foreground">{c.courseName}</span>
                      <span className="font-mono text-primary font-bold">{c.batchName} ({c.seats} Seats)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-muted-foreground">
                      <div>Trainer: <strong className="text-foreground">{c.trainer}</strong></div>
                      <div>Assessment Bank: <strong className="text-foreground">{c.questionBankId}</strong></div>
                      <div>Interviewer: <strong className="text-foreground">{c.interviewPanel}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Schedule Configuration */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Step 4 — Schedule Milestones
              </CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Registration Start</label>
                  <Input type="date" value={regStartDate} onChange={(e) => setRegStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Registration End</label>
                  <Input type="date" value={regEndDate} onChange={(e) => setRegEndDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Exam Date</label>
                  <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Exam Start Time</label>
                  <Input type="time" value={examStartTime} onChange={(e) => setExamStartTime(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Exam End Time</label>
                  <Input type="time" value={examEndTime} onChange={(e) => setExamEndTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Interview Window Start</label>
                  <Input type="date" value={interviewStartDate} onChange={(e) => setInterviewStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Interview Window End</label>
                  <Input type="date" value={interviewEndDate} onChange={(e) => setInterviewEndDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Tentative Joining Date</label>
                  <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: HR Assignment */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Step 5 — HR Recruiter & Institutional Assignments
              </CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Lead HR Recruiter</label>
                  <select
                    value={leadHr}
                    onChange={(e) => setLeadHr(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="Hitha, Kusuma">Hitha, Kusuma (Lead Recruiter)</option>
                    <option value="Divya.H">Divya.H (Senior Recruiter)</option>
                    <option value="Sneha Rao">Sneha Rao (Regional Recruiter)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Backup HR Recruiter</label>
                  <select
                    value={backupHr}
                    onChange={(e) => setBackupHr(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="Divya.H">Divya.H</option>
                    <option value="Arun Kumar">Arun Kumar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground">Lead Placement Officer (PTO)</label>
                  <Input value={ptoLead} onChange={(e) => setPtoLead(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Faculty Coordinator</label>
                  <Input value={facultyCoordinator} onChange={(e) => setFacultyCoordinator(e.target.value)} />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 6: Templates */}
        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Step 6 — Communication Blueprints
              </CardTitle>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">WhatsApp Broadcast Template</label>
                  <select
                    value={waTemplate}
                    onChange={(e) => setWaTemplate(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="wa_exam_reminder_v2">WhatsApp Exam Reminder with Quick CTA</option>
                    <option value="wa_offer_alert">WhatsApp Offer Alert Notification</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Email Registration Blueprint</label>
                  <select
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
                  >
                    <option value="email_registration_success">Registration Confirmation (HTML)</option>
                    <option value="email_exam_reminder">Exam Proctoring Pass (HTML)</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 7: Automation Settings */}
        {currentStep === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-md space-y-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> Step 7 — Autonomous Platform Automation
              </CardTitle>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { key: "enableRegistration", label: "Auto Student Self-Registration" },
                  { key: "enableExam", label: "Automated Proctor Exam Delivery" },
                  { key: "enableAntiCheating", label: "AI Browser & Eye-Tracking Proctoring" },
                  { key: "enableInterview", label: "Autonomous Interview Slot Booking" },
                  { key: "enableOfferLetter", label: "Auto Offer Generation on Selection" },
                  { key: "enableWhatsappGroup", label: "WhatsApp Candidate Cohort Bot Sync" },
                  { key: "enableEmailReminder", label: "Dynamic Email Reminder Cron" },
                  { key: "enableResumeUpload", label: "Resume PDF Requirement" },
                ].map((item) => (
                  <label
                    key={item.key}
                    onClick={() => toggleAutoSetting(item.key as any)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      autoSettings[item.key as keyof typeof autoSettings]
                        ? "bg-primary/10 border-primary/30 text-foreground font-semibold"
                        : "bg-card border-border text-muted-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={autoSettings[item.key as keyof typeof autoSettings]}
                      readOnly
                    />
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        autoSettings[item.key as keyof typeof autoSettings] ? "text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                  </label>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Final Step: Preview & Publish */}
        {currentStep === 8 && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="border border-border/60 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-primary font-bold">{driveCode}</span>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">{driveName}</h2>
                  <p className="text-xs text-muted-foreground">{academicYear} • {category} • {trainingMode}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Launch
                </span>
              </div>

              {/* QR Preview Box */}
              <div className="p-4 bg-background/80 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
                    <QrCode className="w-16 h-16 text-black" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground">Dynamic Registration QR Pass</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">https://csr.gqt.in/register/{driveCode}</p>
                    <p className="text-[11px] text-emerald-400 mt-1">Direct student onboarding gateway</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.success("QR code downloaded")}>
                    <Download className="w-3.5 h-3.5 mr-1" /> Download QR
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("Registration link copied to clipboard")}>
                    <Share2 className="w-3.5 h-3.5 mr-1" /> Copy Link
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-muted/40 rounded-xl">
                  <p className="text-muted-foreground">Lead Recruiter</p>
                  <p className="font-bold text-foreground">{leadHr}</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <p className="text-muted-foreground">Exam Window</p>
                  <p className="font-bold text-foreground">{examDate} ({examStartTime})</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-xl">
                  <p className="text-muted-foreground">Target Institutions</p>
                  <p className="font-bold text-foreground">{assignedCollegesCount} Colleges Enrolled</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Previous Step
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {currentStep < 8 ? (
            <Button onClick={handleNext} className="bg-primary text-white gap-2">
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleFinalPublish(true)} className="gap-2">
                <Save className="w-4 h-4" /> Save as Draft
              </Button>
              <Button
                onClick={() => handleFinalPublish(false)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 gap-2"
              >
                <Sparkles className="w-4 h-4" /> Publish Campaign Live
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
