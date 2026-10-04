import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_URL.startsWith('http') && 
    !SUPABASE_URL.includes('your-project-ref') &&
    SUPABASE_SERVICE_ROLE_KEY &&
    !SUPABASE_SERVICE_ROLE_KEY.includes('your-service-role-key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

if (isSupabaseConfigured()) {
  console.log('⚡ Connected to Supabase at:', SUPABASE_URL);
} else {
  console.log('ℹ️  Supabase credentials not yet configured in server/.env (using SQLite production database)');
}
