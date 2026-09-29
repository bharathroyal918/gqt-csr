const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function check() {
  console.log('--- DYNAMIC DATABASE QUERY ---');

  // Query live students from Supabase
  const { data: students, error: stuErr } = await supabase
    .from('students')
    .select('id, student_id, full_name, email, usn, college_id, branch, status, selected_course, preferred_training_mode')
    .order('created_at', { ascending: false });

  if (stuErr) {
    console.error('Error fetching students:', stuErr.message);
  } else {
    console.log(`Total Students in Supabase: ${students.length}`);
    students.forEach((s, idx) => {
      console.log(`[${idx + 1}] ${s.full_name} (${s.usn}) - ${s.email} | Status: ${s.status} | College ID: ${s.college_id}`);
    });
  }

  // Query live colleges from Supabase
  const { data: colleges, error: colErr } = await supabase
    .from('colleges')
    .select('id, college_code, name, district, status')
    .order('name', { ascending: true });

  if (colErr) {
    console.error('Error fetching colleges:', colErr.message);
  } else {
    console.log(`Total Partner Colleges in Supabase: ${colleges.length}`);
    colleges.forEach((c, idx) => {
      console.log(`[${idx + 1}] ${c.college_code} - ${c.name} (${c.district})`);
    });
  }

  // Query live drives from Supabase
  const { data: drives, error: drvErr } = await supabase
    .from('drives')
    .select('id, drive_code, name, status, batch');

  if (drvErr) {
    console.error('Error fetching drives:', drvErr.message);
  } else {
    console.log(`Total CSR Drives in Supabase: ${drives.length}`);
    drives.forEach((d, idx) => {
      console.log(`[${idx + 1}] ${d.drive_code} - ${d.name} (${d.status})`);
    });
  }
}

check();
