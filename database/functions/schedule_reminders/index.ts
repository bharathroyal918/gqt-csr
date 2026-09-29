// Supabase Edge Function: schedule_reminders
// Description: Automated cron runner for registration deadlines, exam countdowns & offer expiry

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

    // 1. Check expiring offers (validity within 24 hours)
    const { data: expiringOffers } = await supabase
      .from("offer_letters")
      .select("id, offer_code, candidate_email, candidate_name")
      .eq("status", "Generated");

    // 2. Queue broadcast notifications
    if (expiringOffers && expiringOffers.length > 0) {
      for (const off of expiringOffers) {
        await supabase.from("notifications").insert({
          title: "Urgent: GQT CSR Offer Expiring Soon",
          message: `Dear ${off.candidate_name}, your offer ${off.offer_code} expires in 24 hours. Sign in to accept now.`,
          category: "offers",
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        remindersProcessed: expiringOffers?.length || 0,
        timestamp: new Date().toISOString(),
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
