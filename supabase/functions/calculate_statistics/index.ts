// Supabase Edge Function: calculate_statistics
// Description: Computes drive, college, and district analytics snapshots

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

    const { data: driveStats, error: driveErr } = await supabase
      .from("active_drive_students_view")
      .select("*");

    const { data: collegeStats, error: collegeErr } = await supabase
      .from("college_dashboard_view")
      .select("*")
      .limit(10);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        drives: driveStats || [],
        colleges: collegeStats || [],
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
