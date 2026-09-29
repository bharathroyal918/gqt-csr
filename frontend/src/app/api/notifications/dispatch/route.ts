import { NextResponse } from "next/server";
import { NotificationDispatchSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validated = NotificationDispatchSchema.parse(json);

    // Simulated multi-channel dispatch
    const channelsDispatched: string[] = [];

    if (validated.channels.includes("in_app")) {
      channelsDispatched.push("Supabase Realtime Channel: broadcast");
    }
    if (validated.channels.includes("email")) {
      channelsDispatched.push("SMTP Outbound Gateway");
    }
    if (validated.channels.includes("whatsapp")) {
      channelsDispatched.push("Meta WhatsApp Cloud API");
    }

    return NextResponse.json({
      success: true,
      notificationId: `NOTIF-${Date.now()}`,
      channels: channelsDispatched,
      recipient: validated.userId || validated.targetRole || "All Portals",
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.errors || err.message || "Invalid payload" },
      { status: 400 }
    );
  }
}
