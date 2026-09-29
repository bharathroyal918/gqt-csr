import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { documentType, studentId, offerId, metadata } = body;

    if (!documentType) {
      return NextResponse.json(
        { error: "documentType is required ('offer_letter' | 'registration_slip' | 'scorecard' | 'certificate')" },
        { status: 400 }
      );
    }

    const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;
    const generatedUrl = `/api/pdf/download/${docId}.pdf`;

    return NextResponse.json({
      success: true,
      documentId: docId,
      documentType,
      pdfUrl: generatedUrl,
      qrVerificationCode: `VERIFY-GQT-${Date.now()}`,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
