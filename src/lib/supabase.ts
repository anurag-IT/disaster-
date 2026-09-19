import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Config Check:');
console.log('  URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('  Key:', supabaseAnonKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using demo mode with seed data.');
} else {
  console.log('✅ Supabase configured successfully!');
  console.log('   URL:', supabaseUrl);
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = Boolean(supabase);
