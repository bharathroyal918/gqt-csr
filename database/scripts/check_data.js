const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function checkData() {
  const { data: stus, error: e1 } = await supabase.from('students').select('*');
  console.log('Students in DB:', stus?.length, e1 ? e1.message : '');
  if (stus && stus.length > 0) {
    console.log('Sample student:', {
      id: stus[0].id,
      name: stus[0].full_name,
      email: stus[0].email,
      usn: stus[0].usn,
      college_id: stus[0].college_id,
      status: stus[0].status,
      drive_id: stus[0].drive_id
    });
  }

  const { data: cols, error: e2 } = await supabase.from('colleges').select('id, name, college_code, status');
  console.log('Colleges in DB:', cols?.length, e2 ? e2.message : '', cols);

  const { data: drvs, error: e3 } = await supabase.from('drives').select('id, drive_code, name, status');
  console.log('Drives in DB:', drvs?.length, e3 ? e3.message : '', drvs);

  const { data: ints, error: e4 } = await supabase.from('interviews').select('*');
  console.log('Interviews in DB:', ints?.length, e4 ? e4.message : '');

  const { data: offs, error: e5 } = await supabase.from('offers').select('*');
  console.log('Offers in DB:', offs?.length, e5 ? e5.message : '');
}

checkData();
