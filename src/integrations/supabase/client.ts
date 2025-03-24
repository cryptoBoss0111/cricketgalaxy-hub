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

// Force refresh the session before each major operation
export const refreshSession = async (): Promise<boolean> => {
  try {
    console.log("Attempting to refresh session token...");
    
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session to refresh");
      return false;
    }
    
    // Only try to refresh if we have a session
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Failed to refresh session:", error.message);
      return false;
    }
    
    if (data.session) {
      console.log("Session refreshed successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return false;
  }
};

// Check if current user is an admin
export const isAdminUser = async (): Promise<boolean> => {
  try {
    // First check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      console.log("No active session found");
      return false;
    }
    
    // If token is close to expiry, refresh it
    const expiresAt = sessionData.session.expires_at * 1000; // convert to milliseconds
    const now = Date.now();
    const timeToExpiry = expiresAt - now;
    
    if (timeToExpiry < 300000) { // less than 5 minutes
      console.log("Token close to expiry, refreshing session...");
      await refreshSession();
    }
    
    console.log("Found active session, checking if user is admin");
    
    // Get current user ID
    const currentUserId = sessionData.session.user.id;
    if (!currentUserId) {
      console.log("No user ID in session");
      return false;
    }
    
    console.log("Checking if user ID is admin:", currentUserId);
    
    // Query the admins table directly
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', currentUserId)
      .maybeSingle();
      
    if (adminError) {
      console.error("Admin query error:", adminError.message);
      return false;
    }
    
    if (adminData) {
      console.log("User confirmed as admin in database");
      // Store admin info for faster checks
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ 
        id: currentUserId,
        role: 'admin'
      }));
      return true;
    } else {
      console.log("User is not an admin");
      // Clear any stale admin tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Generate a unique filename for uploads
export const generateUniqueFileName = (fileName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Upload file to storage with improved error handling and retry logic
export const uploadImageToStorage = async (file: File, bucketName = 'article_images') => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Generate unique filename
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomString}.${extension}`;
  
  console.log(`Uploading file ${fileName} to ${bucketName}...`);
  
  // Try upload with exponential backoff (3 attempts)
  let attempt = 0;
  const maxAttempts = 3;
  
  while (attempt < maxAttempts) {
    attempt++;
    
    try {
      // Set up CORS headers for fetch request
      const uploadOptions = {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      };
      
      console.log(`Attempt ${attempt}/${maxAttempts} - Uploading to Supabase Storage...`);
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, uploadOptions);
      
      if (error) {
        console.error(`Storage upload error (attempt ${attempt}/${maxAttempts}):`, error);
        
        // If not the last attempt, wait before retrying
        if (attempt < maxAttempts) {
          const backoffMs = Math.pow(2, attempt) * 500; // Exponential backoff
          console.log(`Retrying upload in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        
        throw error;
      }
      
      if (!data) {
        if (attempt < maxAttempts) {
          const backoffMs = Math.pow(2, attempt) * 500;
          console.log(`No data returned, retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        throw new Error("Upload failed with no error details");
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      console.log("Image uploaded successfully, public URL:", publicUrl);
      return publicUrl;
    } catch (err) {
      console.error(`Upload attempt ${attempt} failed with error:`, err);
      if (attempt >= maxAttempts) {
        throw err;
      }
      // Otherwise continue to next attempt
    }
  }
  
  throw new Error("All upload attempts failed");
};

// Get published articles for the public site
export const getPublishedArticles = async (category?: string, limit = 10) => {
  try {
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
    
    if (!data || data.length === 0) {
      console.log("No articles found, returning mock data");
      // Return mock data when no data is found
      return [
        {
          id: 'mock-article-1',
          title: 'India vs Australia: 3rd Test Preview',
          excerpt: 'Preview of the upcoming test match between India and Australia',
          featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'Match Previews',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-2',
          title: 'Top 10 Players to Watch in IPL 2025',
          excerpt: 'The rising stars to keep an eye on in this IPL season',
          featured_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
          category: 'IPL',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-3',
          title: 'Women\'s World Cup Final Recap',
          excerpt: 'Highlights from the thrilling Women\'s World Cup final',
          featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'Women\'s Cricket',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-4',
          title: 'England\'s Tour of India: What to Expect',
          excerpt: 'Preview of the upcoming England tour of India',
          featured_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
          category: 'Match Previews',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-5',
          title: 'IPL 2025 Auction Analysis',
          excerpt: 'Breaking down the results of the IPL 2025 auction',
          featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'IPL',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    // Return mock data on error
    return [
      {
        id: 'mock-error-article-1',
        title: 'India vs Australia: 3rd Test Preview',
        excerpt: 'Preview of the upcoming test match between India and Australia',
        featured_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
        category: 'Match Previews',
        content: 'Full content of the article goes here',
        published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-error-article-2',
        title: 'Top 10 Players to Watch in IPL 2025',
        excerpt: 'The rising stars to keep an eye on in this IPL season',
        featured_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
        category: 'IPL',
        content: 'Full content of the article goes here',
        published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};

// Get a specific article by ID (for public viewing)
export const getArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
    
    if (!data) {
      console.error("No article found with ID:", id);
      return null;
    }
    
    // Process any data transformations needed
    return {
      ...data,
      // Format dates or other fields if needed
      published_at: data.published_at || data.created_at,
      // Ensure featured_image is available (use cover_image as fallback)
      featured_image: data.featured_image || data.cover_image,
      // Default excerpt if none is provided
      excerpt: data.excerpt || data.meta_description || 'Read this exciting cricket article...'
    };
  } catch (error) {
    console.error("Error in getArticleById:", error);
    throw error;
  }
};

// Get player profiles
export const getPlayerProfiles = async (searchQuery?: string, teamFilter?: string, roleFilter?: string) => {
  let query = supabase
    .from('player_profiles')
    .select('*')
    .order('name');
  
  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }
  
  if (roleFilter) {
    query = query.eq('role', roleFilter);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching player profiles:", error);
    throw error;
  }
  
  // Apply search query filtering in-memory if provided
  let filteredData = data || [];
  if (searchQuery && searchQuery.trim() !== '') {
    const searchLower = searchQuery.toLowerCase();
    filteredData = filteredData.filter(player => 
      player.name.toLowerCase().includes(searchLower) ||
      player.team.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredData;
};

// Create or update player profile
export const upsertPlayerProfile = async (playerData: any) => {
  const { id, ...otherData } = playerData;
  const method = id ? 'update' : 'insert';
  
  if (method === 'update') {
    const { data, error } = await supabase
      .from('player_profiles')
      .update({
        ...otherData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('player_profiles')
      .insert({
        ...otherData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Delete player profile
export const deletePlayerProfile = async (id: string) => {
  const { error } = await supabase
    .from('player_profiles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Get upcoming matches
export const getUpcomingMatches = async () => {
  const { data, error } = await supabase
    .from('upcoming_matches')
    .select('*')
    .order('match_time', { ascending: true });
  
  if (error) {
    console.error("Error fetching upcoming matches:", error);
    throw error;
  }
  
  return data || [];
};

// Create or update match
export const upsertMatch = async (matchData: any) => {
  const { id, ...otherData } = matchData;
  const method = id ? 'update' : 'insert';
  
  if (method === 'update') {
    const { data, error } = await supabase
      .from('upcoming_matches')
      .update({
        ...otherData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('upcoming_matches')
      .insert({
        ...otherData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Delete match
export const deleteMatch = async (id: string) => {
  const { error } = await supabase
    .from('upcoming_matches')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Get fantasy picks with additional filtering options
export const getFantasyPicks = async (matchId?: string, limit?: number) => {
  let query = supabase
    .from('fantasy_picks')
    .select('*');
  
  if (matchId) {
    query = query.eq('match_id', matchId);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
    
  query = query.order('points_prediction', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching fantasy picks:', error);
    throw new Error('Failed to fetch fantasy picks');
  }
  
  return data || [];
};

// Create or update fantasy pick
export const upsertFantasyPick = async (pick: any) => {
  // Ensure created_at and updated_at are set properly
  const now = new Date().toISOString();
  const payload = {
    ...pick,
    updated_at: now
  };
  
  // For new picks, add created_at
  if (!pick.id) {
    payload.created_at = now;
  }
  
  const { data, error } = await supabase
    .from('fantasy_picks')
    .upsert(payload)
    .select();
  
  if (error) {
    console.error('Error upserting fantasy pick:', error);
    throw new Error('Failed to save fantasy pick');
  }
  
  return data?.[0];
};

// Delete fantasy pick
export const deleteFantasyPick = async (id: string) => {
  const { error } = await supabase
    .from('fantasy_picks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting fantasy pick:', error);
    throw new Error('Failed to delete fantasy pick');
  }
  
  return true;
};

// Get navigation items
export const getNavigationItems = async () => {
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error("Error fetching navigation items:", error);
    throw error;
  }
  
  return data || [];
};

// Update navigation item order
export const updateNavigationOrder = async (items: any[]) => {
  // Update each item with its new order index
  for (let i = 0; i < items.length; i++) {
    const { error } = await supabase
      .from('navigation_items')
      .update({ order_index: i + 1 })
      .eq('id', items[i].id);
    
    if (error) {
      console.error(`Error updating item ${items[i].id}:`, error);
      throw error;
    }
  }
  
  return true;
};

// Get all media files
export const getMediaFiles = async (bucketName = 'article_images') => {
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .list();
  
  if (error) {
    console.error("Error fetching media files:", error);
    throw error;
  }
  
  // Add public URLs to each file
  const filesWithUrls = data.map(file => {
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(file.name);
    
    return {
      ...file,
      publicUrl
    };
  });
  
  return filesWithUrls || [];
};

// Delete media file
export const deleteMediaFile = async (fileName: string, bucketName = 'article_images') => {
  const { error } = await supabase
    .storage
    .from(bucketName)
    .remove([fileName]);
  
  if (error) {
    console.error("Error deleting media file:", error);
    throw error;
  }
  
  return true;
};

// Get top stories
export const getTopStories = async () => {
  try {
    const { data, error } = await supabase
      .from('top_stories')
      .select('id, article_id, order_index, featured, articles(id, title, excerpt, featured_image, category, published_at)')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching top stories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getTopStories:', error);
    return [];
  }
};

// Get articles by category
export const getArticlesByCategory = async (category: string) => {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true);
    
    if (category && category !== 'All Categories') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getArticlesByCategory:', error);
    return [];
  }
};

// Update top stories
export const updateTopStories = async (items: any[]) => {
  // First delete all existing top stories
  const { error: deleteError } = await supabase
    .from('top_stories')
    .delete()
    .neq('id', 'placeholder'); // Delete all rows
  
  if (deleteError) {
    console.error("Error deleting existing top stories:", deleteError);
    throw deleteError;
  }
  
  // Then insert the new order
  if (items.length > 0) {
    const itemsToInsert = items.map((item, index) => ({
      article_id: item.article_id,
      order_index: index + 1,
      featured: item.featured || false
    }));
    
    const { error: insertError } = await supabase
      .from('top_stories')
      .insert(itemsToInsert);
    
    if (insertError) {
      console.error("Error inserting top stories:", insertError);
      throw insertError;
    }
  }
  
  return true;
};

// Get analytics data (placeholder for now)
export const getAnalyticsData = async () => {
  // For now, return mock data
  // In a real implementation, you might pull this from a database or analytics service
  return {
    pageViews: {
      today: 846,
      yesterday: 765,
      thisWeek: 4582,
      lastWeek: 4123
    },
    topArticles: [
      { id: '1', title: 'India vs Australia: 3rd Test Preview', views: 1245 },
      { id: '2', title: 'IPL 2025 Auction Analysis', views: 987 },
      { id: '3', title: 'Top 10 Players to Watch', views: 876 },
      { id: '4', title: "England's Tour of India: What to Expect", views: 743 },
      { id: '5', title: "Women's World Cup Final Recap", views: 654 }
    ],
    userActivity: {
      activeUsers: 842,
      newUsers: 128,
      returningUsers: 714
    },
    deviceStats: {
      mobile: 68,
      desktop: 24,
      tablet: 8
    }
  };
};
