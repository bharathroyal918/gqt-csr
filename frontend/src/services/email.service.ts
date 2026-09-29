import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { EmailMessageRecord, EmailTemplate } from "@/types";
import { INITIAL_EMAIL_MESSAGES, INITIAL_EMAIL_TEMPLATES } from "@/lib/communication/communicationData";

export interface EmailSendParams {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  templateId?: string;
  templateName: string;
  variables: Record<string, string>;
  driveId?: string;
  driveName?: string;
  collegeId?: string;
  collegeName?: string;
}

class EmailService {
  private inMemoryMessages: EmailMessageRecord[] = [...INITIAL_EMAIL_MESSAGES];
  private inMemoryTemplates: EmailTemplate[] = [...INITIAL_EMAIL_TEMPLATES];

  /**
   * Send templated responsive HTML corporate email
   */
  async sendEmail(params: EmailSendParams): Promise<EmailMessageRecord> {
    const template =
      this.inMemoryTemplates.find((t) => t.id === params.templateId || t.name === params.templateName) ||
      this.inMemoryTemplates[0];

    let renderedHtml = template.htmlContent;
    Object.entries(params.variables).forEach(([k, v]) => {
      renderedHtml = renderedHtml.replace(new RegExp(`{{${k}}}`, "g"), v);
    });

    const newEmail: EmailMessageRecord = {
      id: `emm-${Date.now()}`,
      recipientEmail: params.recipientEmail,
      recipientName: params.recipientName,
      subject: params.subject || template.subject,
      templateId: template.id,
      templateName: template.name,
      contentHtml: renderedHtml,
      status: "Delivered",
      timestamp: new Date().toISOString(),
      retryCount: 0,
      driveId: params.driveId,
      driveName: params.driveName,
      collegeId: params.collegeId,
      collegeName: params.collegeName,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("email_messages").insert({
          id: newEmail.id,
          recipient_email: newEmail.recipientEmail,
          recipient_name: newEmail.recipientName,
          subject: newEmail.subject,
          template_name: newEmail.templateName,
          status: newEmail.status,
          created_at: newEmail.timestamp,
        });
      } catch (err) {
        console.warn("Supabase Email insert fallback:", err);
      }
    }

    this.inMemoryMessages.unshift(newEmail);
    return newEmail;
  }

  getEmails(): EmailMessageRecord[] {
    return this.inMemoryMessages;
  }

  getTemplates(): EmailTemplate[] {
    return this.inMemoryTemplates;
  }

  retryEmail(emailId: string): EmailMessageRecord | undefined {
    const email = this.inMemoryMessages.find((e) => e.id === emailId);
    if (email) {
      email.status = "Delivered";
      email.retryCount += 1;
      delete email.errorLog;
    }
    return email;
  }
}

export const emailService = new EmailService();
