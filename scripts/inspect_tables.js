const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

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
