import { supabase, isSupabaseConfigured } from "./client";

export interface VaultDocument {
  id: string;
  studentId: string;
  name: string;
  category: "Resume" | "Photo" | "Marksheet 10th" | "Marksheet 12th" | "Degree Marksheet" | "Aadhaar Card" | "College ID" | "Offer Letter" | "Certificate";
  fileName: string;
  fileSize: string;
  format: string;
  uploadedAt: string;
  status: "Verified" | "Pending" | "Rejected";
  storageBucket: string;
  fileUrl: string;
}

export const documentService = {
  /**
   * Upload file to Supabase Storage and register in database
   */
  async uploadStudentDocument(
    studentId: string,
    category: VaultDocument["category"],
    file: File
  ): Promise<{ success: boolean; document?: VaultDocument; error?: string }> {
    const fileExt = file.name.split(".").pop() || "pdf";
    const bucket =
      category === "Resume"
        ? "student-resumes"
        : category === "Photo"
        ? "student-photos"
        : "student-documents";

    const filePath = `${studentId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    let publicUrl = "";

    if (isSupabaseConfigured) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) {
          console.warn("Storage upload warning:", uploadError);
        }

        // Get public or signed URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        publicUrl = urlData?.publicUrl || URL.createObjectURL(file);
      } catch (err: any) {
        console.warn("Supabase storage exception, using object url fallback:", err);
        publicUrl = URL.createObjectURL(file);
      }
    } else {
      publicUrl = URL.createObjectURL(file);
    }

    const docId = `doc-${Date.now()}`;
    const newDoc: VaultDocument = {
      id: docId,
      studentId,
      name: `${category} Document`,
      category,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      format: fileExt.toUpperCase(),
      uploadedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
      storageBucket: bucket,
      fileUrl: publicUrl,
    };

    // Record in Supabase database
    if (isSupabaseConfigured) {
      try {
        // Table 1: student_documents
        await supabase.from("student_documents").insert([
          {
            id: docId,
            student_id: studentId,
            document_type: category.toLowerCase().replace(/ /g, "_"),
            document_name: file.name,
            file_url: publicUrl,
            is_verified: false,
          },
        ]);
      } catch {}

      try {
        // Table 2: documents
        await supabase.from("documents").insert([
          {
            id: docId,
            title: `${category} - ${file.name}`,
            category: category === "Resume" ? "Resume" : "Report",
            file_type: fileExt.toUpperCase(),
            file_size: newDoc.fileSize,
            file_url: publicUrl,
            uploaded_by: studentId,
          },
        ]);
      } catch {}

      try {
        // Log activity
        await supabase.from("activities").insert([
          {
            actor_name: "Student",
            actor_role: "student",
            action_type: "DOCUMENT_UPLOAD",
            description: `Uploaded ${category} (${file.name}) to Document Vault.`,
            metadata: { studentId, category, fileName: file.name },
          },
        ]);
      } catch {}
    }

    // Cache locally
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gqt_documents_${studentId}`);
        const list: VaultDocument[] = stored ? JSON.parse(stored) : [];
        list.unshift(newDoc);
        localStorage.setItem(`gqt_documents_${studentId}`, JSON.stringify(list));
      } catch {}
    }

    return { success: true, document: newDoc };
  },

  /**
   * Fetch student's uploaded documents
   */
  async getStudentDocuments(studentId: string): Promise<VaultDocument[]> {
    let list: VaultDocument[] = [];

    // Local cached documents
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gqt_documents_${studentId}`);
        if (stored) list = JSON.parse(stored);
      } catch {}
    }

    // Fetch from Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("student_documents")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const dbDocs: VaultDocument[] = data.map((d: any) => ({
            id: d.id,
            studentId: d.student_id,
            name: d.document_name,
            category: (d.document_type || "Resume") as VaultDocument["category"],
            fileName: d.document_name,
            fileSize: "1.2 MB",
            format: "PDF",
            uploadedAt: new Date(d.created_at || Date.now()).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            status: d.is_verified ? "Verified" : "Pending",
            storageBucket: "student-documents",
            fileUrl: d.file_url,
          }));

          // Merge distinct by ID
          const existingIds = new Set(list.map((item) => item.id));
          dbDocs.forEach((doc) => {
            if (!existingIds.has(doc.id)) list.push(doc);
          });
        }
      } catch {}
    }

    return list;
  },

  /**
   * Delete student document
   */
  async deleteStudentDocument(studentId: string, docId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from("student_documents").delete().eq("id", docId);
        await supabase.from("documents").delete().eq("id", docId);
      } catch {}
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`gqt_documents_${studentId}`);
        if (stored) {
          const list: VaultDocument[] = JSON.parse(stored);
          const filtered = list.filter((d) => d.id !== docId);
          localStorage.setItem(`gqt_documents_${studentId}`, JSON.stringify(filtered));
        }
      } catch {}
    }

    return true;
  },
};
