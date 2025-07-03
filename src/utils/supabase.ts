import { createClient } from '@supabase/supabase-js';
// import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_ADMIN_DASHBOARD_API_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ADMIN_DASHBOARD_ANON_KEY as string;

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);