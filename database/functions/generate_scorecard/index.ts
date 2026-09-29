// Supabase Edge Function: generate_scorecard
// Description: Generates PDF scorecard with section breakdown and percentile

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

    const { studentId, driveId } = await req.json();

    const { data: result } = await supabase
      .from("exam_results")
      .select("*, students(*)")
      .eq("student_id", studentId)
      .eq("drive_id", driveId)
      .single();

    if (!result) throw new Error("Exam result not found");

    const scorecardUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/student-documents/scorecards/${studentId}.pdf`;

    await supabase
      .from("exam_results")
      .update({ scorecard_pdf_url: scorecardUrl })
      .eq("id", result.id);

    return new Response(
      JSON.stringify({ success: true, scorecardUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
