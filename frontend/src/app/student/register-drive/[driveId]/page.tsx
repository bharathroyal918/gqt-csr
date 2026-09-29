"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  User,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterDriveWizardPage({
  params,
}: {
  params: Promise<{ driveId: string }>;
}) {
  const resolvedParams = React.use(params);
  const driveId = resolvedParams.driveId || "";
  const router = useRouter();
  const { colleges } = useApp();

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedStudentId, setGeneratedStudentId] = useState("");

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [aadhaarLast4, setAadhaarLast4] = useState("");

  // Step 2: Academic Details
  const [collegeName, setCollegeName] = useState("");
  const [university, setUniversity] = useState("");
  const [usn, setUsn] = useState("");
  const [graduateType, setGraduateType] = useState("B.E.");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [passingYear, setPassingYear] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [backlogs, setBacklogs] = useState("0");

  // Step 3: Professional Details
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState("");
  const [certifications, setCertifications] = useState("");
  const [projectsSummary, setProjectsSummary] = useState("");

  // Step 4: Documents
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [collegeIdUploaded, setCollegeIdUploaded] = useState(false);

  // Step 5: Declaration
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [proctorAccepted, setProctorAccepted] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!fullName || !email || !mobile)) {
      toast.error("Please fill in all mandatory personal details.");
      return;
    }
    if (step === 2 && (!usn || !collegeName || !cgpa)) {
      toast.error("Please fill in university USN and academic metrics.");
      return;
    }
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !proctorAccepted) {
      toast.error("Please accept the terms and proctoring regulations.");
      return;
    }

    const newId = `GQT-2026-STU-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedStudentId(newId);
    setIsSubmitted(true);
    toast.success("CSR Drive Registration successfully submitted and verified!");
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Card className="p-8 bg-white border border-slate-200 shadow-xl rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Registration Successfully Submitted!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your registration for <strong>{driveId}</strong> at <strong>{collegeName}</strong> has been authenticated and entered into the student evaluation ledger.
          </p>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl inline-block text-left space-y-2 text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Student Candidate ID:</span>
              <strong className="font-mono text-[#005BBB] text-sm">{generatedStudentId}</strong>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">University USN:</span>
              <strong className="font-mono text-slate-900">{usn}</strong>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Assigned Drive Code:</span>
              <strong className="font-mono text-slate-900">{driveId}</strong>
            </div>
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Verification Status:</span>
              <span className="font-bold text-emerald-600">Approved & Enrolled</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <Button
              variant="outline"
              onClick={() => toast.success("Downloading Registration Slip PDF...")}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download Registration Slip
            </Button>
            <Link href="/student/dashboard">
              <Button variant="cyan">
                Go to Student Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
            Multi-Step Candidate Onboarding
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">CSR Drive Candidate Registration</h1>
          <p className="text-white/80 text-xs mt-0.5">Campaign: {driveId} • 100% Sponsored GQT Industry Program</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { num: 1, title: "Personal" },
          { num: 2, title: "Academic" },
          { num: 3, title: "Professional" },
          { num: 4, title: "Documents" },
          { num: 5, title: "Declaration" },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition-all ${
              step === s.num
                ? "bg-[#005BBB] text-white border-[#005BBB] font-bold shadow-md"
                : step > s.num
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-white text-slate-400 border-slate-200"
            }`}
          >
            <div className="text-[10px] font-mono">Step {s.num}</div>
            <div className="truncate">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Wizard Form Card */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b">Step 1 — Personal & Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={aadhaarLast4}
                    onChange={(e) => setAadhaarLast4(e.target.value)}
                    placeholder="e.g. 8821"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b">Step 2 — Institutional & Academic Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College / Institution *</label>
                  <select
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
                  >
                    {colleges.map((col: any) => (
                      <option key={col.id} value={col.name}>
                        {col.name} ({col.district})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">University USN / Roll Number *</label>
                  <input
                    type="text"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    placeholder="e.g. 1RV22CS101"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Graduate Degree</label>
                  <select
                    value={graduateType}
                    onChange={(e) => setGraduateType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
                  >
                    <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc">B.Sc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Engineering Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passing Year</label>
                  <input
                    type="text"
                    value={passingYear}
                    onChange={(e) => setPassingYear(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative CGPA *</label>
                  <input
                    type="text"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 8.92"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-bold text-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Active Backlogs</label>
                  <input
                    type="number"
                    value={backlogs}
                    onChange={(e) => setBacklogs(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Professional Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b">Step 3 — Professional Portfolios & Skillset</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio Website</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills & Programming Languages</label>
                <input
                  type="text"
                  value={technicalSkills}
                  onChange={(e) => setTechnicalSkills(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Capstone Projects Summary</label>
                <textarea
                  rows={3}
                  value={projectsSummary}
                  onChange={(e) => setProjectsSummary(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Upload Documents */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b">Step 4 — Document Upload & Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                  <UploadCloud className="w-8 h-8 text-[#005BBB] mx-auto mb-2" />
                  <span className="font-bold block">Resume (PDF)</span>
                  <p className="text-[10px] text-slate-400 mt-1">Rahul_Resume.pdf (Verified)</p>
                </div>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                  <User className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <span className="font-bold block">Passport Photo</span>
                  <p className="text-[10px] text-slate-400 mt-1">Photo.jpg (Verified)</p>
                </div>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                  <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <span className="font-bold block">College ID Card</span>
                  <p className="text-[10px] text-slate-400 mt-1">College_ID.pdf (Verified)</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Declaration & Consent */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b">Step 5 — Declaration & Digital Consent</h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#005BBB] focus:ring-[#005BBB]"
                  />
                  <span>
                    I hereby certify that all academic details, marksheets, and identity parameters entered are truthful and authenticated by my college training and placement cell.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={proctorAccepted}
                    onChange={(e) => setProctorAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-[#005BBB] focus:ring-[#005BBB]"
                  />
                  <span>
                    I consent to online webcam video proctoring, tab switch monitoring, and automatic evaluation rules during the GQT CSR online assessment round.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button variant="outline" type="button" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button variant="cyan" type="button" onClick={handleNext}>
                Next Step
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button variant="cyan" type="submit">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Submit Application
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
