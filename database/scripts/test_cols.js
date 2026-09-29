const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function testOffer() {
  const testOffer = {
    id: "off-001",
    offer_number: "GQT/OFFER/2026/001",
    student_id: "std-1790247326265",
    drive_id: "10000000-0000-0000-0000-000000000001",
    role_title: "Associate Software Engineer",
    course: "Java Full Stack + Agentic AI",
    batch: "2026",
    ctc: "₹ 6.50 LPA",
    status: "Sent",
    qr_verification_code: "GQT-VERIFY-001"
  };
  const { data: o, error: oe } = await supabase.from('offers').upsert([testOffer]).select();
  console.log('Test offer with qr_verification_code:', oe ? oe.message : 'OK', o);
}

testOffer();
