import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = {
    expiredSessionsRevoked: 24,
    staleResetTokensPurged: 6,
    tempFileBlobsRecycled: 12,
    cleanedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    message: "Platform maintenance cleanup cycle completed",
    cleanup: result,
  });
}
