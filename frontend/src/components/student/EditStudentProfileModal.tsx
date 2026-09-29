"use client";

import React, { useState, useEffect } from "react";
import { Student } from "@/types";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Phone,
  BookOpen,
  MapPin,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface EditStudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onUpdated?: (updated: Student) => void;
}

export function EditStudentProfileModal({
  isOpen,
  onClose,
  student,
  onUpdated,
}: EditStudentProfileModalProps) {
  const { colleges, drives, updateStudent, updateCurrentUserProfile } = useApp();

  const [fullName, setFullName] = useState(student.fullName || "");
  const [usn, setUsn] = useState(student.usn || "");
  const [email, setEmail] = useState(student.email || "");
  const [mobile, setMobile] = useState(student.mobile || "");
  const [collegeId, setCollegeId] = useState(student.collegeId || "");
  const [collegeName, setCollegeName] = useState(student.collegeName || "");
  const [branch, setBranch] = useState(student.branch || "");
  const [semester, setSemester] = useState(student.semester || 0);
  const [cgpa, setCgpa] = useState(student.cgpa || 0);
  const [percentage, setPercentage] = useState(student.percentage || 0);
  const [selectedCourse, setSelectedCourse] = useState(student.selectedCourse || "");
  const [preferredTrainingMode, setPreferredTrainingMode] = useState(student.preferredTrainingMode || "");
  const [city, setCity] = useState(student.city || "");
  const [district, setDistrict] = useState(student.district || "");
  const [passingYear, setPassingYear] = useState(student.passingYear || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if student prop changes
  useEffect(() => {
    if (student) {
      setFullName(student.fullName || "");
      setUsn(student.usn || "");
      setEmail(student.email || "");
      setMobile(student.mobile || "");
      setCollegeId(student.collegeId || "");
      setCollegeName(student.collegeName || "");
      setBranch(student.branch || "");
      setSemester(student.semester || 0);
      setCgpa(student.cgpa || 0);
      setPercentage(student.percentage || 0);
      setSelectedCourse(student.selectedCourse || "");
      setPreferredTrainingMode(student.preferredTrainingMode || "");
      setCity(student.city || "");
      setDistrict(student.district || "");
      setPassingYear(student.passingYear || 0);
    }
  }, [student]);

  const handleCollegeSelected = (selectedId: string) => {
    setCollegeId(selectedId);
    const found = colleges.find((c) => c.id === selectedId);
    if (found) {
      setCollegeName(found.name);
      if (found.district && !district) {
        setDistrict(found.district);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!usn.trim()) {
      toast.error("USN / Registration Number is required.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Saving student particulars to Supabase database...");

    try {
      const updates: Partial<Student> = {
        fullName: fullName.trim(),
        usn: usn.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        collegeId,
        collegeName,
        branch,
        semester: Number(semester),
        cgpa: Number(cgpa),
        percentage: Number(percentage) || (Number(cgpa) > 0 ? Math.round(Number(cgpa) * 9.5 * 10) / 10 : 0),
        selectedCourse,
        preferredTrainingMode: preferredTrainingMode as any,
        city,
        district,
        passingYear: Number(passingYear),
      };

      const result = await updateStudent(student.id, updates);

      if (result.success) {
        await updateCurrentUserProfile({
          name: updates.fullName,
          email: updates.email,
          phone: updates.mobile,
          department: updates.branch,
          collegeName: updates.collegeName,
          collegeId: updates.collegeId,
        });

        if (typeof window !== "undefined") {
          if (updates.fullName) localStorage.setItem("gqt_user_name", updates.fullName);
          if (updates.email) localStorage.setItem("gqt_user_email", updates.email);
        }

        const merged: Student = { ...student, ...updates };
        if (onUpdated) onUpdated(merged);

        toast.success("Profile Updated in Database!", {
          id: toastId,
          description: "All details stored dynamically and synchronized across portals.",
        });
        onClose();
      } else {
        toast.error(result.error || "Failed to update student profile in database.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to persist profile changes.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCourses = drives[0]?.courses || [
    " Agentic AI with Java Full Stack ",
    " Agentic AI with Python Full Stack ",
    " Agentic AI with Web Full Stack ",
    " Agentic AI with Testing Full Stack ",
    "Agentic AI with Data Analytics & Python ",
    "Agentic AI with Data Science & GenAI",
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Student Particulars & Academic Details"
      description="Enter your real university and personal credentials. All entries are validated and saved dynamically to Supabase."
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto px-1 py-2">
        {/* Basic Personal Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            Basic Personal Particulars
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Bharath Royal"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                University USN / Reg No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
                placeholder="e.g. 23785A3102"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. bharath@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Mobile / WhatsApp Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            University Academic Profile
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                College / Institution <span className="text-rose-500">*</span>
              </label>
              <select
                value={collegeId}
                onChange={(e) => handleCollegeSelected(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value="">Select Partner College</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.collegeCode || c.district ? `(${[c.collegeCode, c.district].filter(Boolean).join(" - ")})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Current Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Passing Year
                </label>
                <select
                  value={passingYear}
                  onChange={(e) => setPassingYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                  <option value={2030}>2030</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Cumulative CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCgpa(val);
                    if (val > 0) setPercentage(Math.round(val * 9.5 * 10) / 10);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CSR Drive & Training Track */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            CSR Drive & Course Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Selected Course Track
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {availableCourses.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Preferred Training Mode
              </label>
              <select
                value={preferredTrainingMode}
                onChange={(e) => setPreferredTrainingMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                {/* <option value="Hybrid">Hybrid (Classroom + Virtual Lab)</option> */}
                <option value="Offline Campus">Offline Campus Centers</option>
                <option value="Virtual Live">Virtual Live Interactive</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                District (Karnataka)
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="text-xs font-bold bg-[#005BBB] hover:bg-[#004494] text-white flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Saving to Supabase..." : "Save Changes to Database"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
