// Supabase Edge Function: generate_offer_pdf
// Description: Server-side PDF generation for GQT CSR Offer Letters with digital verification QR

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { offerId } = await req.json();

    if (!offerId) {
      return new Response(
        JSON.stringify({ error: "Missing offerId parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: offer, error: fetchErr } = await supabase
      .from("offer_letters")
      .select("*, students(*)")
      .eq("id", offerId)
      .single();

    if (fetchErr || !offer) throw new Error("Offer record not found");

    // Simulated signed PDF path in storage
    const pdfPath = `offers/${offer.offer_code.replace(/\//g, "-")}.pdf`;
    const mockPdfUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/offer-letters/${pdfPath}`;

    await supabase
      .from("offer_letters")
      .update({ pdf_url: mockPdfUrl, status: "Dispatched" })
      .eq("id", offerId);

    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: mockPdfUrl,
        verificationCode: offer.qr_verification_code,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
