const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function inspectColumns() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'interviews' });
  if (error) {
    // Alternatively test with insert empty or invalid
    console.log('rpc error:', error.message);
  } else {
    console.log('Columns:', data);
  }

  // Check services.ts for how interviews and offers are mapped
  const { data: d1, error: e1 } = await supabase.from('interviews').insert([{}]).select();
  console.log('insert interview error:', e1?.message);

  const { data: d2, error: e2 } = await supabase.from('offers').insert([{}]).select();
  console.log('insert offer error:', e2?.message);
}

inspectColumns();
