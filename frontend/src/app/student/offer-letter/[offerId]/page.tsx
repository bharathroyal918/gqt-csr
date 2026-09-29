"use client";

import React, { use } from "react";
import StudentOfferLetterPage from "../page";

interface PageProps {
  params: Promise<{ offerId: string }>;
}

export default function StudentSpecificOfferPage({ params }: PageProps) {
  // Unwrap params using React.use for Next.js 15+
  const unwrappedParams = use(params);
  // Re-uses the student offer view with contextual param
  return <StudentOfferLetterPage />;
}
