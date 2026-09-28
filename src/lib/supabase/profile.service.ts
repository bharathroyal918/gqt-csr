import { supabase, isSupabaseConfigured } from "./client";
import { Student, StudentStatus } from "@/types";
import { COLLEGE_NAME_MAP, DRIVE_NAME_MAP } from "./services";

export interface StudentProfileData {
  student: Student;
  registrationNumber: string;
  academicYear: string;
  profileCompletionPercentage: number;
  driveDetails?: {
    name: string;
    mode: string;
    examDate: string;
    venue: string;
  };
  statusHistory: Array<{
    stage: string;
    status: string;
    timestamp: string;
    notes?: string;
  }>;
}

/**
 * Image processing: compress and center-crop to exact square JPEG
 */
export async function processSquareAvatar(
  file: File,
  maxDimension = 400
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height);
        const targetSize = Math.min(size, maxDimension);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        // Draw cropped center square
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size,
          0,
          0,
          targetSize,
          targetSize
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
              resolve({ blob, dataUrl });
            } else {
              reject(new Error("Blob compression failed"));
            }
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = () => reject(new Error("Image decoding failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

export const profileService = {
  /**
   * Resolve authenticated student directly from Supabase Auth + database
   */
  async resolveAuthenticatedStudent(): Promise<Student | null> {
    if (!isSupabaseConfigured) return null;

    try {
      // 1. Get Supabase Auth user and stored local credentials
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const savedEmail = typeof window !== "undefined" ? localStorage.getItem("gqt_user_email") : null;
      const savedId = typeof window !== "undefined" ? localStorage.getItem("gqt_user_id") : null;
      const savedName = typeof window !== "undefined" ? localStorage.getItem("gqt_user_name") : null;

      // Determine if auth user is an actual student or an admin/staff account
      const isAuthUserStudent = Boolean(
        user &&
        (user.user_metadata?.role === "student" ||
          (!user.email?.toLowerCase().includes("admin") && !user.email?.toLowerCase().includes("staff")))
      );

      const targetEmail = isAuthUserStudent ? user?.email || savedEmail : savedEmail;
      const targetId = isAuthUserStudent ? user?.id || savedId : savedId;

      // 2. Fetch student by email, id, USN, or name from Supabase
      if (targetEmail) {
        const { data } = await supabase
          .from("students")
          .select("*")
          .or(`email.ilike.${targetEmail.trim()},usn.ilike.${targetEmail.trim()}`)
          .limit(1);

        if (data && data.length > 0) {
          const student = this.mapDbRowToStudent(data[0]);
          this.syncLocalSession(student);
          return student;
        }
      }

      if (targetId) {
        const { data } = await supabase
          .from("students")
          .select("*")
          .eq("id", targetId)
          .limit(1);

        if (data && data.length > 0) {
          const student = this.mapDbRowToStudent(data[0]);
          this.syncLocalSession(student);
          return student;
        }
      }

      if (savedName && !savedName.toLowerCase().includes("admin") && !savedName.toLowerCase().includes("staff")) {
        const { data } = await supabase
          .from("students")
          .select("*")
          .ilike("full_name", `%${savedName.trim()}%`)
          .limit(1);

        if (data && data.length > 0) {
          const student = this.mapDbRowToStudent(data[0]);
          this.syncLocalSession(student);
          return student;
        }
      }

      // 3. Check student_registrations table if students table didn't match
      if (targetEmail) {
        const { data: regRows } = await supabase
          .from("student_registrations")
          .select("*")
          .ilike("email", targetEmail.trim())
          .limit(1);

        if (regRows && regRows.length > 0) {
          const student = this.mapDbRowToStudent(regRows[0]);
          this.syncLocalSession(student);
          return student;
        }
      }

      // 4. If user is authenticated in Supabase but no row exists yet in students table
      if (user && isAuthUserStudent) {
        const studentId = user.user_metadata?.student_id || `GQT-2026-${user.id.slice(0, 4).toUpperCase()}`;
        return {
          id: user.id,
          studentId,
          fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
          email: user.email || "",
          mobile: user.user_metadata?.mobile || "",
          whatsappNumber: user.user_metadata?.whatsapp_number || user.user_metadata?.mobile || "",
          gender: user.user_metadata?.gender || "",
          dob: user.user_metadata?.dob || "",
          collegeId: user.user_metadata?.college_id || "",
          collegeName: user.user_metadata?.college_name || "",
          usn: user.user_metadata?.usn || "",
          university: user.user_metadata?.university || "",
          graduateType: user.user_metadata?.graduate_type || "",
          branch: user.user_metadata?.branch || "",
          semester: Number(user.user_metadata?.semester || 0),
          passingYear: Number(user.user_metadata?.passing_year || 0),
          cgpa: Number(user.user_metadata?.cgpa || 0),
          percentage: Number(user.user_metadata?.percentage || 0),
          aadhaarLast4: user.user_metadata?.aadhaar_last4 || "",
          city: user.user_metadata?.city || "",
          district: user.user_metadata?.district || "",
          pincode: user.user_metadata?.pincode || "",
          preferredTrainingMode: user.user_metadata?.preferred_training_mode || "",
          driveId: user.user_metadata?.drive_id || "",
          driveName: user.user_metadata?.drive_name || "",
          selectedCourse: user.user_metadata?.selected_course || "",
          batch: user.user_metadata?.batch || "",
          referralSource: user.user_metadata?.referral_source || "",
          termsAccepted: true,
          status: "Registered",
          registeredAt: user.created_at || new Date().toISOString(),
          photoUrl: user.user_metadata?.avatar_url || "",
        };
      }

      return null;
    } catch (err) {
      console.warn("Error resolving authenticated student from Supabase:", err);
      return null;
    }
  },

  syncLocalSession(student: Student) {
    if (typeof window === "undefined" || !student) return;
    try {
      localStorage.setItem("gqt_active_role", "student");
      localStorage.setItem("gqt_role", "student");
      if (student.email) localStorage.setItem("gqt_user_email", student.email);
      if (student.fullName) localStorage.setItem("gqt_user_name", student.fullName);
      if (student.id) localStorage.setItem("gqt_user_id", student.id);
    } catch { }
  },

  /**
   * Upload avatar to Supabase Storage bucket 'student-photos', crop square, and sync across tables
   */
  async uploadAndSyncAvatar(
    student: Student,
    file: File
  ): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
    try {
      // 1. Process & compress to square JPEG
      const { blob, dataUrl } = await processSquareAvatar(file, 400);

      const fileName = `avatar_${student.studentId || student.id}_${Date.now()}.jpg`;
      const filePath = `${student.id}/${fileName}`;
      let finalAvatarUrl = dataUrl;

      // 2. Upload to Supabase Storage
      if (isSupabaseConfigured) {
        try {
          const { error: uploadError } = await supabase.storage
            .from("student-photos")
            .upload(filePath, blob, {
              upsert: true,
              contentType: "image/jpeg",
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("student-photos")
              .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
              finalAvatarUrl = urlData.publicUrl;
            }
          } else {
            console.warn("Storage upload warning, using local preview:", uploadError);
          }
        } catch (storageErr) {
          console.warn("Storage exception:", storageErr);
        }

        // 3. Update database tables (students, profiles, student_registrations)
        const updatePayload = {
          photo_url: finalAvatarUrl,
          updated_at: new Date().toISOString(),
        };

        // Update students table
        await supabase
          .from("students")
          .update(updatePayload)
          .or(`id.eq.${student.id},email.eq.${student.email},usn.eq.${student.usn}`);

        // Update student_registrations table
        await supabase
          .from("student_registrations")
          .update(updatePayload)
          .or(`student_id.eq.${student.studentId},email.eq.${student.email}`)
          .maybeSingle();

        // Update profiles table if matching user profile exists
        await supabase
          .from("profiles")
          .update({ avatar_url: finalAvatarUrl, updated_at: new Date().toISOString() })
          .eq("email", student.email)
          .maybeSingle();

        // 4. Log audit activity
        try {
          await supabase.from("activities").insert([
            {
              actor_id: student.id,
              actor_name: student.fullName,
              actor_role: "student",
              action: "AVATAR_UPDATED",
              target_type: "Profile",
              target_id: student.id,
              description: `Uploaded and verified photograph.`,
              metadata: { photoUrl: finalAvatarUrl },
              created_at: new Date().toISOString(),
            },
          ]);
        } catch { }
      }

      return { success: true, avatarUrl: finalAvatarUrl };
    } catch (err: any) {
      console.error("Avatar upload exception:", err);
      return { success: false, error: err.message || "Failed to process and upload avatar" };
    }
  },

  /**
   * Calculate student profile completion percentage dynamically
   */
  calculateProfileCompletion(student: Student): number {
    let completedPoints = 0;
    const totalPoints = 10;

    if (student.fullName) completedPoints++;
    if (student.photoUrl && student.photoUrl.trim() !== "") completedPoints++;
    if (student.email) completedPoints++;
    if (student.mobile) completedPoints++;
    if (student.collegeName) completedPoints++;
    if (student.usn) completedPoints++;
    if (student.branch) completedPoints++;
    if (student.percentage || student.cgpa) completedPoints++;
    if (student.selectedCourse) completedPoints++;
    if (student.resumeUrl) completedPoints++;

    return Math.round((completedPoints / totalPoints) * 100);
  },

  /**
   * Record Hall Ticket Download timestamp
   */
  async recordHallTicketDownload(studentId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const now = new Date().toISOString();
      await supabase
        .from("students")
        .update({
          hall_ticket_downloaded_at: now,
          updated_at: now,
        })
        .eq("id", studentId);

      await supabase.from("activities").insert([
        {
          actor_id: studentId,
          actor_role: "student",
          action: "HALL_TICKET_DOWNLOADED",
          target_type: "Exam",
          target_id: studentId,
          description: "Downloaded verified QR Hall Ticket PDF.",
          created_at: now,
        },
      ]);
    } catch (err) {
      console.warn("Record hall ticket download error:", err);
    }
  },

  /**
   * Helper to map DB record into Student interface
   */
  mapDbRowToStudent(row: Record<string, any>): Student {
    return {
      id: row.id || row.student_id || "",
      studentId: row.student_id || row.studentId || (row.id ? `GQT-2026-${String(row.id).slice(-4)}` : ""),
      fullName: row.full_name || row.fullName || "",
      photoUrl: row.photo_url || row.photoUrl || row.avatar_url || "",
      gender: row.gender || "",
      dob: row.dob || "",
      mobile: row.mobile || "",
      whatsappNumber: row.whatsapp_number || row.whatsappNumber || row.mobile || "",
      email: row.email || "",
      collegeId: row.college_id || row.collegeId || "",
      collegeName:
        row.college_name ||
        row.collegeName ||
        (row.college_id && COLLEGE_NAME_MAP[row.college_id]) ||
        "",
      usn: row.usn || "",
      university: row.university || "",
      graduateType: row.graduate_type || row.graduateType || row.degree || "",
      branch: row.branch || "",
      semester: Number(row.semester || 0),
      passingYear: Number(row.passing_year || row.year_of_passing || 0),
      cgpa: Number(row.cgpa || 0),
      percentage: Number(row.percentage || 0),
      linkedinUrl: row.linkedin_url || row.linkedinUrl || "",
      githubUrl: row.github_url || row.githubUrl || "",
      portfolioUrl: row.portfolio_url || row.portfolioUrl || "",
      resumeUrl: row.resume_url || row.resumeUrl || "",
      aadhaarLast4: row.aadhaar_last4 || "",
      city: row.city || "",
      district: row.district || "",
      pincode: row.pincode || "",
      preferredTrainingMode: row.preferred_training_mode || row.preferredTrainingMode || "",
      driveId: row.drive_id || row.driveId || "",
      driveName:
        row.drive_name ||
        row.driveName ||
        (row.drive_id && DRIVE_NAME_MAP[row.drive_id]) ||
        "",
      selectedCourse: row.selected_course || row.selectedCourse || "",
      batch: row.batch || row.batch_code || "",
      referralSource: row.referral_source || "",
      termsAccepted: row.terms_accepted ?? true,
      registeredAt: row.registered_at || row.created_at || new Date().toISOString(),
      status: (row.status as StudentStatus) || "Registered",
    };
  },
};
