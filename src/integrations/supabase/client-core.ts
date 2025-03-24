
// This file contains the core Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://swiftskcxeoyomwwmkms.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWZ0c2tjeGVveW9td3dta21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjc1MDIsImV4cCI6MjA1Nzk0MzUwMn0.54r22gXPj3NoQJCTfXcA-bBBGk9d5d_1D2ZzvEUZXY0";

// Create and export the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
    detectSessionInUrl: true, // Detect session in URL for OAuth
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
