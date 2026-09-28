"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RegistrationStepHeader } from "@/components/student/registration/RegistrationStepHeader";
import { useStudentRegistration } from "@/context/StudentRegistrationContext";
import { studentAuthService } from "@/services/studentAuth.service";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/providers/AuthProvider";
import {
  User,
  GraduationCap,
  Building2,
  FileText,
  Upload,
  Trash2,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Share2,
  Code2,
  Globe,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentRegisterStep4And5ProfilePage() {
  const router = useRouter();
  const { colleges, drives } = useApp();
  const { loginWithRole } = useAuth();
  const { loginWithRole: appLoginWithRole } = useApp();
  const { state, updateState } = useStudentRegistration();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const collegeIdInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState(state.fullName || "");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(state.gender || "Male");
  const [photoUrl, setPhotoUrl] = useState(state.photoUrl || "");
  const [collegeId, setCollegeId] = useState(state.collegeId || colleges[0]?.id || "");
  const [collegeName, setCollegeName] = useState(state.collegeName || colleges[0]?.name || "");
  const [university, setUniversity] = useState(state.university || "");
  const [branch, setBranch] = useState(state.branch || "");
  const [usn, setUsn] = useState(state.usn || "");
  const [passingYear, setPassingYear] = useState(state.passingYear || new Date().getFullYear());
  const [semester, setSemester] = useState(state.semester || 1);
  const [cgpa, setCgpa] = useState(state.cgpa || 0);
  const [percentage, setPercentage] = useState(state.percentage || 0);
  const [address, setAddress] = useState(state.address || "");
  const [district, setDistrict] = useState(state.district || "");
  const [pincode, setPincode] = useState(state.pincode || "");
  const [linkedinUrl, setLinkedinUrl] = useState(state.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = useState(state.githubUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(state.portfolioUrl || "");

  // Documents
  const [resumeName, setResumeName] = useState("");
  const [resumeDataUrl, setResumeDataUrl] = useState(state.resumeUrl || "");
  const [collegeIdName, setCollegeIdName] = useState("");
  const [collegeIdDataUrl, setCollegeIdDataUrl] = useState(state.collegeIdCardUrl || "");
  const [aadhaarName, setAadhaarName] = useState("");
  const [aadhaarDataUrl, setAadhaarDataUrl] = useState(state.aadhaarCardUrl || "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCollegeChange = (cId: string) => {
    const col = colleges.find((c) => c.id === cId);
    setCollegeId(cId);
    if (col) {
      setCollegeName(col.name);
      setDistrict(col.district || "");
    }
  };

  // Photo Upload Handler (Converts to Data URL for instant preview & persistence)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result);
        toast.success("Profile photo uploaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Resume Upload Handler
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume file exceeds 10MB limit.");
      return;
    }
    setResumeName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setResumeDataUrl(reader.result);
        toast.success(`Resume attached: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // College ID Upload Handler
  const handleCollegeIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCollegeIdName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCollegeIdDataUrl(reader.result);
        toast.success(`College ID card attached: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Aadhaar Upload Handler
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAadhaarName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAadhaarDataUrl(reader.result);
        toast.success(`Aadhaar document attached: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!usn.trim()) {
      toast.error("Please enter your University USN / Roll number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        registrationNumber: state.registrationNumber,
        email: state.email || "",
        mobile: state.mobile || "",
        whatsappNumber: state.mobile,
        dob: state.dob || "",
        password: state.password || "",
        fullName: fullName.trim(),
        gender,
        photoUrl,
        collegeId,
        collegeName,
        university,
        branch,
        usn: usn.trim().toUpperCase(),
        passingYear,
        semester,
        graduateType: "",
        cgpa,
        percentage,
        address,
        city: "",
        district,
        pincode,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        driveId: state.driveId,
        driveName: state.driveName,
        selectedCourse: state.selectedCourse,
        batch: state.batch,
        preferredTrainingMode: state.preferredTrainingMode,
        referralSource: state.referralSource,
        resumeUrl: resumeDataUrl,
        collegeIdCardUrl: collegeIdDataUrl,
        aadhaarCardUrl: aadhaarDataUrl,
        aadhaarLast4: state.mobile ? state.mobile.slice(-4) : "0000",
      };

      const res = await studentAuthService.completeRegistration(payload);

      if (!res.success || !res.student) {
        toast.error("Registration submission failed", { description: res.error });
        setIsSubmitting(false);
        return;
      }

      // Sync role into Auth context
      await loginWithRole("student", payload.email, payload.password);
      appLoginWithRole("student", payload.email);

      // Save state to context
      updateState({
        currentStep: 6,
        ...payload,
        registeredStudent: res.student,
      });

      toast.success("Student Registration Successfully Completed!", {
        description: `Student ID ${res.student.studentId} generated.`,
      });

      router.push("/student/register/success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration error";
      toast.error("Submission Error", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] flex flex-col">
      <RegistrationStepHeader currentStep={4} />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white dark:bg-[#111C3A] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Steps 4 & 5 of 6 — Candidate Profile & Document Vault
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Complete Your Student Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              All details are synced with your Karnataka CSR examination record and verified by Global Quest HR.
            </p>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-8">
            {/* 1. Profile Photo & Core Identity */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-6">
              {/* Photo Avatar */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-[#005BBB] flex items-center justify-center shadow-md">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Student Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#005BBB] text-white hover:bg-blue-600 shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Upload Photograph"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Photo Instructions */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Passport Photograph <span className="text-rose-500">*</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload a clear, forward-facing color photograph (JPEG/PNG, max 5MB). This image appears on your official exam hall ticket.
                </p>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {photoUrl ? "Change Photo" : "Upload Passport Photo"}
                </button>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Bharath Royal"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Academic Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Academic Background & Enrollment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* College */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Enrolled Engineering College <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={collegeId}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.district})
                      </option>
                    ))}
                  </select>
                </div>

                {/* University USN */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    University USN / Roll No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={usn}
                    onChange={(e) => setUsn(e.target.value.toUpperCase())}
                    placeholder="1RV22CS045"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Engineering Branch <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Science & Engineering">Information Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                    <option value="Data Science & Engineering">Data Science & Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Current Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value={8}>8th Semester (Final Year)</option>
                    <option value={7}>7th Semester</option>
                    <option value={6}>6th Semester</option>
                    <option value={5}>5th Semester</option>
                    <option value={4}>4th Semester</option>
                    <option value={3}>3rd Semester</option>
                    <option value={2}>2nd Semester</option>
                    <option value={1}>1st Semester</option>
                  </select>
                </div>

                {/* Passing Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Graduation Year
                  </label>
                  <select
                    value={passingYear}
                    onChange={(e) => setPassingYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  >
                    <option value={2029}>2029 (Appearing)</option>
                    <option value={2028}>2028 (Appearing)</option>
                    <option value={2027}>2027</option>
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Cumulative CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                    placeholder="8.50"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                {/* Percentage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Equivalent Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                    placeholder="82.5"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                {/* Affiliated University */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    University Board
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Portfolio & Profiles */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Technical Profiles & Portfolio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://myportfolio.dev"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Document Upload Vault */}
            <div id="documents" className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Step 5 — Document Vault & Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attach required verification documents.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Supabase Vault Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Resume */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#005BBB]" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Latest Resume (PDF)
                        </span>
                      </div>
                      {resumeDataUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {resumeName || (resumeDataUrl ? "Resume Attached" : "Upload standard PDF resume (max 10MB)")}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {resumeDataUrl ? "Replace" : "Upload"}
                    </button>
                    {resumeDataUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setResumeDataUrl("");
                          setResumeName("");
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeUpload}
                    />
                  </div>
                </div>

                {/* 2. College ID */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          College ID Card
                        </span>
                      </div>
                      {collegeIdDataUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {collegeIdName || (collegeIdDataUrl ? "ID Card Attached" : "Front scan of university student ID card")}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => collegeIdInputRef.current?.click()}
                      className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {collegeIdDataUrl ? "Replace" : "Upload"}
                    </button>
                    {collegeIdDataUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCollegeIdDataUrl("");
                          setCollegeIdName("");
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <input
                      ref={collegeIdInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleCollegeIdUpload}
                    />
                  </div>
                </div>

                {/* 3. Aadhaar Verification */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Government ID / Aadhaar
                        </span>
                      </div>
                      {aadhaarDataUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {aadhaarName || (aadhaarDataUrl ? "Aadhaar Attached" : "Masked Aadhaar or Government ID proof")}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => aadhaarInputRef.current?.click()}
                      className="text-xs font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {aadhaarDataUrl ? "Replace" : "Upload"}
                    </button>
                    {aadhaarDataUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setAadhaarDataUrl("");
                          setAadhaarName("");
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <input
                      ref={aadhaarInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleAadhaarUpload}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Submission */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200">
                <input
                  type="checkbox"
                  required
                  id="agree-terms"
                  defaultChecked={true}
                  className="mt-0.5 w-4 h-4 rounded text-[#005BBB] focus:ring-[#005BBB] cursor-pointer"
                />
                <label htmlFor="agree-terms" className="cursor-pointer leading-relaxed">
                  I hereby declare that all academic credentials, USN, marks, and personal documents provided above are genuine. I understand that any fraudulent information will result in immediate disqualification from the Global Quest Technologies CSR Drive.
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Supabase Account & Synchronizing Portal Queues...
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration & Issue Hall Ticket</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/student/register/password")}
                  className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Password Settings</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
