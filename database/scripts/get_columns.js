const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function checkColumns() {
  const tables = ['interviews', 'offers', 'exam_submissions', 'notifications', 'tasks', 'crm_interactions', 'helpdesk_tickets'];
  for (const t of tables) {
    // Try inserting a dummy with invalid column to see error or select with rpc
    const { data, error } = await supabase.from(t).insert({ __dummy_col__: 'test' });
    if (error) {
      console.log(`[${t}] hints/message:`, error.message);
    }
  }
}

checkColumns();
