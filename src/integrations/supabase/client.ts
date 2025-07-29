import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ibtqysxchuqcqcafbyzo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidHF5c3hjaHVxY3FjYWZieXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTI2ODksImV4cCI6MjA2OTI4ODY4OX0.51ABZfrIUef9YD2NM6HdMIW4SLoHnifdyUsk2TG7xXc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});