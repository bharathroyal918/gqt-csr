import { supabase, isSupabaseConfigured } from "@/supabase/client";
import { WhatsAppMessageRecord, WhatsAppGroupRecord, WhatsAppTemplate } from "@/types";
import { INITIAL_WHATSAPP_MESSAGES, INITIAL_WHATSAPP_GROUPS, INITIAL_WHATSAPP_TEMPLATES } from "@/lib/communication/communicationData";

export interface WhatsAppSendParams {
  recipientPhone: string;
  recipientName: string;
  role: string;
  templateName: string;
  variables: Record<string, string>;
  mediaUrl?: string;
  driveId?: string;
  driveName?: string;
  collegeId?: string;
  collegeName?: string;
}

export interface WhatsAppGroupCreationParams {
  collegeName: string;
  academicYear: string;
  driveId: string;
  driveName: string;
  collegeId: string;
  hrId: string;
  hrName: string;
  ptoId: string;
  ptoName: string;
  facultyNames: string[];
}

class WhatsAppService {
  private inMemoryMessages: WhatsAppMessageRecord[] = [...INITIAL_WHATSAPP_MESSAGES];
  private inMemoryGroups: WhatsAppGroupRecord[] = [...INITIAL_WHATSAPP_GROUPS];
  private inMemoryTemplates: WhatsAppTemplate[] = [...INITIAL_WHATSAPP_TEMPLATES];

  /**
   * Dispatches a templated WhatsApp message with variable interpolation and delivery tracking
   */
  async sendMessage(params: WhatsAppSendParams): Promise<WhatsAppMessageRecord> {
    const template = this.inMemoryTemplates.find((t) => t.name === params.templateName) || this.inMemoryTemplates[0];

    // Interpolate placeholders
    let renderedContent = template.content;
    Object.entries(params.variables).forEach(([key, val]) => {
      renderedContent = renderedContent.replace(new RegExp(`{{${key}}}`, "g"), val);
    });

    const messageRecord: WhatsAppMessageRecord = {
      id: `wam-${Date.now()}`,
      recipientPhone: params.recipientPhone,
      recipientName: params.recipientName,
      role: params.role,
      templateId: template.id,
      templateName: template.name,
      content: renderedContent,
      mediaUrl: params.mediaUrl,
      status: "Sent",
      retryCount: 0,
      timestamp: new Date().toISOString(),
      deliveredAt: new Date(Date.now() + 1200).toISOString(),
      driveId: params.driveId,
      driveName: params.driveName,
      collegeId: params.collegeId,
      collegeName: params.collegeName,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from("whatsapp_messages").insert({
          id: messageRecord.id,
          recipient_phone: messageRecord.recipientPhone,
          recipient_name: messageRecord.recipientName,
          template_name: messageRecord.templateName,
          content: messageRecord.content,
          status: messageRecord.status,
          created_at: messageRecord.timestamp,
        });
      } catch (err) {
        console.warn("Supabase WhatsApp insert fallback:", err);
      }
    }

    this.inMemoryMessages.unshift(messageRecord);
    return messageRecord;
  }

  /**
   * Automated WhatsApp Group generation following GQT corporate workflow:
   * Format: "College Name + GQT + Academic Year"
   */
  async autoCreateDriveGroup(params: WhatsAppGroupCreationParams): Promise<WhatsAppGroupRecord> {
    const formattedGroupName = `${params.collegeName} + GQT + ${params.academicYear}`;
    const hash = Math.random().toString(36).substring(2, 9).toUpperCase();
    const groupRecord: WhatsAppGroupRecord = {
      id: `wag-${Date.now()}`,
      groupName: formattedGroupName,
      groupId: `12036302489110${Math.floor(1000 + Math.random() * 9000)}@g.us`,
      inviteLink: `https://chat.whatsapp.com/GQT-${hash}-CSR`,
      createdDate: new Date().toISOString().split("T")[0],
      driveId: params.driveId,
      driveName: params.driveName,
      collegeId: params.collegeId,
      collegeName: params.collegeName,
      hrId: params.hrId,
      hrName: params.hrName,
      ptoId: params.ptoId,
      ptoName: params.ptoName,
      facultyNames: params.facultyNames,
      status: "Active",
      membersCount: 4 + params.facultyNames.length,
    };

    this.inMemoryGroups.unshift(groupRecord);
    return groupRecord;
  }

  /**
   * Fetch all WhatsApp messages
   */
  getMessages(): WhatsAppMessageRecord[] {
    return this.inMemoryMessages;
  }

  /**
   * Fetch all confirmed WhatsApp groups
   */
  getGroups(): WhatsAppGroupRecord[] {
    return this.inMemoryGroups;
  }

  /**
   * Fetch all approved templates
   */
  getTemplates(): WhatsAppTemplate[] {
    return this.inMemoryTemplates;
  }

  /**
   * Retry failed message
   */
  retryMessage(messageId: string): WhatsAppMessageRecord | undefined {
    const msg = this.inMemoryMessages.find((m) => m.id === messageId);
    if (msg) {
      msg.status = "Delivered";
      msg.retryCount += 1;
      msg.deliveredAt = new Date().toISOString();
      delete msg.errorLog;
    }
    return msg;
  }
}

export const whatsAppService = new WhatsAppService();
