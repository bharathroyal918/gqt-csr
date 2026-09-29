// Supabase Edge Function: evaluate_exam
// Description: Evaluates candidate answers against master answer keys, calculates score & triggers qualification status

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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sessionId, studentId, driveId } = await req.json();

    if (!sessionId || !studentId) {
      return new Response(
        JSON.stringify({ error: "Missing sessionId or studentId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call database function calculate_exam_score
    const { data, error } = await supabaseClient.rpc("calculate_exam_score", {
      p_session_id: sessionId,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Exam evaluated successfully",
        evaluation: data,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Failed to evaluate exam" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
