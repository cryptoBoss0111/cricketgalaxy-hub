
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://swiftskcxeoyomwwmkms.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3aWZ0c2tjeGVveW9td3dta21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjc1MDIsImV4cCI6MjA1Nzk0MzUwMn0.54r22gXPj3NoQJCTfXcA-bBBGk9d5d_1D2ZzvEUZXY0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

// Generate a unique filename for uploads
export const generateUniqueFileName = (fileName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Upload file to storage
export const uploadImageToStorage = async (file: File, bucketName = 'article_images') => {
  const uniqueFileName = generateUniqueFileName(file.name);
  
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .upload(uniqueFileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    throw error;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(uniqueFileName);
  
  return publicUrl;
};
