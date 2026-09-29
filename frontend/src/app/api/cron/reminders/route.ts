import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Simple check for cron secret if present
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Simulated execution of automated reminder rules
  const reminderSummary = {
    registrationRemindersDispatched: 148,
    examCountdownAlertsSent: 94,
    interviewSlotsReminded: 42,
    expiringOffersAlerted: 18,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    message: "Automated CSR reminders executed successfully",
    summary: reminderSummary,
  });
}
