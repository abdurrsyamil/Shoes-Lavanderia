import { createClient } from '@supabase/supabase-js';

const HARDCODED_URL = "YOUR_SUPABASE_URL";
const HARDCODED_KEY = "YOUR_SUPABASE_ANON_KEY";

const SUPABASE_URL = localStorage.getItem("SAC_SUPABASE_URL") || (import.meta as any).env.VITE_SUPABASE_URL || HARDCODED_URL;
const SUPABASE_ANON_KEY = localStorage.getItem("SAC_SUPABASE_ANON_KEY") || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || HARDCODED_KEY;

export let supabaseClient: any = null;

if (
  SUPABASE_URL && 
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully with URL:", SUPABASE_URL);
  } catch (err) {
    console.error("Failed to initialize Supabase:", err);
  }
} else {
  console.log("Running in Developer Local Fallback Mode (No valid Supabase credentials configured).");
}
