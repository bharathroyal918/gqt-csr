"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { GQTLogo } from "@/components/common/GQTLogo";
import { ProgressRing } from "@/components/common/ProgressRing";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  FileText,
  Upload,
  Save,
  CheckCircle2,
  ArrowLeft,
  Globe,
  Code,
  Link2,
  ShieldCheck,
  QrCode,
  Lock,
  Paperclip,
  FolderGit2,
  Award,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

import { useStudentSession } from "@/hooks/useStudentSession";

export default function StudentProfilePage() {
  const {
    currentUser,
    updateStudent,
    updateCurrentUserProfile,
    updateCurrentUserPassword,
  } = useApp();

  const { student, updateProfile: updateStudentProfile, uploadAvatar } = useStudentSession();

  const [activeTab, setActiveTab] = useState<
    "personal" | "academic" | "skills" | "projects" | "social" | "documents" | "security"
  >("personal");

  const [formData, setFormData] = useState({
    // Personal
    photoUrl: student.photoUrl,
    fullName: student.fullName,
    gender: (student.gender as "Male" | "Female" | "Other"),
    dob: student.dob,
    email: student.email,
    mobile: student.mobile,
    whatsappNumber: student.whatsappNumber,
    city: student.city,
    district: student.district,
    state: student.state,
    pincode: student.pincode,
    aadhaarLast4: student.aadhaarLast4,

    // Academic
    collegeName: student.collegeName,
    university: student.university,
    usn: student.usn,
    graduateType: student.graduateType,
    branch: student.branch,
    semester: student.semester,
    passingYear: student.passingYear,
    cgpa: student.cgpa,
    percentage: student.percentage,
    currentBacklogs: student.currentBacklogs,

    // Skills
    skills: Array.isArray(student.skills) ? student.skills.join(", ") : "",
    programmingLanguages: Array.isArray(student.programmingLanguages) ? student.programmingLanguages.join(", ") : "",
    certifications: Array.isArray(student.certifications) ? student.certifications.join(", ") : "",

    // Projects
    projectTitle: student.projectTitle,
    projectTech: student.projectTech,
    projectSummary: student.projectSummary,
    projectUrl: student.projectUrl,

    // Social Links
    githubUrl: student.githubUrl,
    linkedinUrl: student.linkedinUrl,
    portfolioUrl: student.portfolioUrl,
    leetcodeUrl: student.leetcodeUrl,
    codeforcesUrl: student.codeforcesUrl,

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync state whenever student updates from database
  useEffect(() => {
    if (!student) return;
    setFormData((prev) => ({
      ...prev,
      photoUrl: student.photoUrl || prev.photoUrl,
      fullName: student.fullName || prev.fullName,
      gender: (student.gender as "Male" | "Female" | "Other") || prev.gender,
      dob: student.dob || prev.dob,
      email: student.email || prev.email,
      mobile: student.mobile || prev.mobile,
      whatsappNumber: student.whatsappNumber || prev.whatsappNumber || student.mobile,
      city: student.city || prev.city,
      district: student.district || prev.district,
      pincode: student.pincode || prev.pincode,
      aadhaarLast4: student.aadhaarLast4 || prev.aadhaarLast4,
      collegeName: student.collegeName || prev.collegeName,
      university: student.university || prev.university,
      usn: student.usn || prev.usn,
      graduateType: student.graduateType || prev.graduateType,
      branch: student.branch || prev.branch,
      semester: student.semester || prev.semester,
      passingYear: student.passingYear || prev.passingYear,
      cgpa: student.cgpa || prev.cgpa,
      percentage: student.percentage || prev.percentage,
      currentBacklogs: student.currentBacklogs ?? prev.currentBacklogs,
      githubUrl: student.githubUrl || prev.githubUrl,
      linkedinUrl: student.linkedinUrl || prev.linkedinUrl,
      portfolioUrl: student.portfolioUrl || prev.portfolioUrl,
    }));
  }, [student]);

  const [isSaving, setIsSaving] = useState(false);

  // Profile completion scoring engine
  const hasPhoto = !!formData.photoUrl;
  const hasResume = true;
  const hasAcademic = !!(formData.collegeName && formData.usn && formData.cgpa);
  const hasGitHub = !!formData.githubUrl && formData.githubUrl.includes("github.com");
  const hasLinkedIn = !!formData.linkedinUrl && formData.linkedinUrl.includes("linkedin.com");
  const hasProjects = !!formData.projectTitle;
  const hasDocuments = true;

  let completion = 0;
  if (hasPhoto) completion += 15;
  if (hasResume) completion += 15;
  if (hasAcademic) completion += 20;
  if (hasGitHub) completion += 10;
  if (hasLinkedIn) completion += 10;
  if (hasProjects) completion += 15;
  if (hasDocuments) completion += 15;

  const missingFields: string[] = [];
  if (!formData.portfolioUrl) missingFields.push("Portfolio Website URL");
  if (!formData.leetcodeUrl) missingFields.push("LeetCode/HackerRank profile");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const studentId = student?.id;
      if (!studentId) {
        toast.error("Unable to save: No active student session detected.");
        setIsSaving(false);
        return;
      }
      const studentPayload = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        whatsappNumber: formData.whatsappNumber,
        city: formData.city,
        district: formData.district,
        pincode: formData.pincode,
        collegeName: formData.collegeName,
        branch: formData.branch,
        usn: formData.usn,
        cgpa: Number(formData.cgpa),
        percentage: Number(formData.percentage),
        skills: typeof formData.skills === "string" ? formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        photoUrl: formData.photoUrl,
      };

      await updateStudent(studentId, studentPayload);
      await updateStudentProfile(studentPayload);

      await updateCurrentUserProfile({
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        avatar: formData.photoUrl,
        department: formData.branch,
      });

      if (formData.newPassword) {
        await updateCurrentUserPassword(formData.newPassword);
        setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      }
      toast.success("Profile saved and synchronized with database!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-gradient-to-r from-[#005BBB] to-[#001B4D] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {formData.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={formData.photoUrl}
                  alt={formData.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 border-2 border-white/30 shadow-lg flex items-center justify-center text-xl font-black text-white">
                  {formData.fullName
                    ? formData.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : "ST"}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px]">
                ✓
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-cyan-200 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>USN: {formData.usn} • Verified Profile</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                {formData.fullName}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-blue-100 max-w-xl">
                {formData.collegeName} • {formData.branch} • Batch {formData.passingYear}
              </p>
            </div>
          </div>

          {/* Profile Strength Widget */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <ProgressRing percentage={completion} size={64} strokeWidth={6} color="#14B8FF" />
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-200 block">Profile Strength</span>
              <span className="text-lg font-black text-white">{completion}% Complete</span>
              <span className="text-[10px] text-blue-200 block">
                {completion === 100 ? "Ready for Shortlisting" : "Add portfolio to hit 100%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 pb-px">
        {[
          { id: "personal", label: "Personal", icon: User },
          { id: "academic", label: "Academic", icon: GraduationCap },
          { id: "skills", label: "Skills", icon: Code },
          { id: "projects", label: "Projects", icon: FolderGit2 },
          { id: "social", label: "Social Links", icon: Link2 },
          { id: "documents", label: "Documents", icon: Paperclip },
          { id: "security", label: "Security", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 px-1 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? "border-[#005BBB] text-[#005BBB] dark:text-[#14B8FF]"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Personal */}
        {activeTab === "personal" && (
          <Card>
            <CardHeader>
              <CardTitle>Personal & Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" | "Other" })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    State & Pincode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-2/3 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-1/3 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Academic */}
        {activeTab === "academic" && (
          <Card>
            <CardHeader>
              <CardTitle>Academic Qualifications & University Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    College / Institution Name
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Affiliated University
                  </label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    USN / University Roll Number
                  </label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Branch / Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Current Semester
                    </label>
                    <input
                      type="number"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Passing Year
                    </label>
                    <input
                      type="number"
                      value={formData.passingYear}
                      onChange={(e) => setFormData({ ...formData, passingYear: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Cumulative CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Active Backlogs
                    </label>
                    <input
                      type="number"
                      value={formData.currentBacklogs}
                      onChange={(e) => setFormData({ ...formData, currentBacklogs: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Skills */}
        {activeTab === "skills" && (
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills & Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Programming Languages
                </label>
                <input
                  type="text"
                  value={formData.programmingLanguages}
                  onChange={(e) => setFormData({ ...formData, programmingLanguages: e.target.value })}
                  placeholder="Java, Python, C++, SQL"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Technical Frameworks & Tools
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, Next.js, Spring Boot, Docker, Kafka"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Certifications & Badges
                </label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="AWS Cloud Practitioner, HackerRank 5-Star Java"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Projects */}
        {activeTab === "projects" && (
          <Card>
            <CardHeader>
              <CardTitle>Software Engineering Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Featured Project Title
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Technologies Used
                </label>
                <input
                  type="text"
                  value={formData.projectTech}
                  onChange={(e) => setFormData({ ...formData, projectTech: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Project Description & Key Contributions
                </label>
                <textarea
                  rows={3}
                  value={formData.projectSummary}
                  onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  GitHub Repository Link
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-[#005BBB]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 5: Social Links */}
        {activeTab === "social" && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Links & Portfolios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Personal Portfolio Website
                </label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  LeetCode / HackerRank Profile
                </label>
                <input
                  type="url"
                  value={formData.leetcodeUrl}
                  onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 6: Documents */}
        {activeTab === "documents" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recruiter Verified Documents</CardTitle>
                <Link href="/student/documents" className="text-xs font-bold text-[#005BBB] hover:underline">
                  Manage Document Vault →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#005BBB]" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Resume (PDF)</span>
                    <span className="text-[11px] text-slate-400">Verified • 1.4 MB</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">✓ Uploaded</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Passport Size Photo</span>
                    <span className="text-[11px] text-slate-400">JPEG • Biometric verified</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">✓ Uploaded</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">College ID Card</span>
                    <span className="text-[11px] text-slate-400">Institutional Seal Verified</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">✓ Uploaded</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 7: Security */}
        {activeTab === "security" && (
          <Card>
            <CardHeader>
              <CardTitle>Security & Password Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-[#005BBB] dark:text-[#14B8FF] block mb-0.5">Session Security</span>
                Single active login session allowed per candidate during examination hours.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111C3A] rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-400">
            {missingFields.length > 0 ? (
              <span>Suggestion: Add {missingFields.join(" and ")} to achieve 100% rating</span>
            ) : (
              <span className="text-emerald-600 font-bold">✓ Profile 100% verified & completed</span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
