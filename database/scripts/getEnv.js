const fs = require('fs');
const path = require('path');

function getEnvContent() {
  const candidatePaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'frontend', '.env.local'),
    path.resolve(process.cwd(), 'frontend', '.env'),
    path.resolve(__dirname, '../../frontend/.env.local'),
    path.resolve(__dirname, '../../frontend/.env'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env')
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }

  throw new Error('Could not find .env.local or .env in candidate paths.');
}

function getSupabaseCredentials() {
  const envContent = getEnvContent();
  const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key, envContent };
}

module.exports = { getEnvContent, getSupabaseCredentials };
