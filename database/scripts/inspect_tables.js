const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const { getSupabaseCredentials } = require('./getEnv');
const { url, key } = getSupabaseCredentials();

const supabase = createClient(url, key);

async function inspectMore() {
  const tables = [
    'drives',
    'offers',
    'crm_interactions',
    'crm_follow_ups',
    'tasks',
    'exam_submissions',
    'student_answers',
    'interviews',
    'student_documents',
    'student_status_history',
    'batches',
    'announcements'
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

inspectMore();
