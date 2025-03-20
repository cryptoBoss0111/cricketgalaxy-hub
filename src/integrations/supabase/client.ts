
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
  if (!file) {
    throw new Error('No file provided');
  }
  
  const uniqueFileName = generateUniqueFileName(file.name);
  
  // Check for active session
  const { data: sessionData } = await supabase.auth.getSession();
  const isAuthenticated = !!sessionData.session;
  
  if (!isAuthenticated && bucketName !== 'public') {
    // For non-public buckets, ensure we're authenticated
    console.error("Authentication required for uploads");
    throw new Error("You must be logged in to upload files");
  }
  
  try {
    console.log(`Uploading file to ${bucketName}/${uniqueFileName}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(uniqueFileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Upload failed with no error details");
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(uniqueFileName);
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Get published articles for the public site
export const getPublishedArticles = async (category?: string, limit = 10) => {
  let query = supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching published articles:", error);
    throw error;
  }
  
  return data || [];
};

// Get a specific article by ID (for public viewing)
export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
  
  return data;
};
