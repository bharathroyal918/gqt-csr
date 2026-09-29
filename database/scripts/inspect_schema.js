const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function inspect() {
  const tables = [
    'students',
    'colleges',
    'csr_drives',
    'interviews',
    'offer_letters',
    'activities',
    'notifications',
    'profiles',
    'users',
    'questions',
    'exam_results',
    'attendance',
    'audit_logs',
    'helpdesk_tickets'
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`[${t}] ERROR:`, error.message);
    } else {
      console.log(`[${t}] COLUMNS:`, data && data.length > 0 ? Object.keys(data[0]).join(', ') : '(Empty table - exists)');
    }
  }
}

inspect();
