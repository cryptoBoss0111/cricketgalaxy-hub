
import { supabase } from './client-core';

// Generate a unique filename for uploads that preserves the original filename
export const generateUniqueFileName = (fileName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 6);
  
  // Extract extension and base name
  const extension = fileName.split('.').pop()?.toLowerCase();
  const baseName = fileName.split('.').slice(0, -1).join('.');
  
  // Clean the base name to remove any special characters
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Return a filename that contains the original name for better readability
  return `${cleanBaseName}-${randomString}.${extension}`;
};

// Upload file to storage with improved error handling
export const uploadImageToStorage = async (file: File, bucket = 'article_images') => {
  try {
    // Check if file exists
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error("Please upload a valid image file");
    }

    // Create a unique file name while preserving the original file name
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${fileName}`; // Keep the path simple
    
    console.log("Uploading image:", file.name, "Size:", file.size, "Type:", file.type);
    console.log("Generated storage path:", filePath);
    
    // Get the current session to check authentication status
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      // Proceed with anon upload if there's a session error
    } else {
      console.log("Session status:", sessionData.session ? "Authenticated" : "Not authenticated");
    }
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '0', // Disable caching to make sure we always get the newest version
        upsert: true, // Set to true to overwrite if file exists
        contentType: file.type // Explicitly set the content type
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      // If the error is related to permissions, try a more permissive approach
      if (error.message.includes("permission") || error.message.includes("row-level security")) {
        throw new Error(`Permission denied: ${error.message}. Please make sure you're logged in with an account that has upload rights.`);
      }
      throw error;
    }
    
    console.log("Upload successful, data:", data);
    
    // Get the public URL with cache-busting parameter
    const timestamp = new Date().getTime();
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Add cache-busting parameter to force reloading of the image
    const urlWithCacheBusting = `${publicUrl}?t=${timestamp}`;
    
    console.log("Generated public URL:", urlWithCacheBusting);
    
    // Return the full public URL
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Ensure bucket exists, create if it doesn't
export const ensureBucketExists = async (bucketName: string) => {
  try {
    // First, check if bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) {
      console.error("Error fetching buckets:", bucketError);
      throw bucketError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' does not exist. Will try to use it anyway.`);
    } else {
      console.log(`Bucket '${bucketName}' exists.`);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    // Just log the error but continue, as the bucket might exist even if we can't confirm it
    return true;
  }
};

// Get all media files
export const getMediaFiles = async (bucketName = 'article_images') => {
  try {
    // Try to list files in the bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list(undefined, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      console.error("Error fetching media files:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No files found in bucket:", bucketName);
      return [];
    }
    
    // Add public URLs to each file
    const timestamp = new Date().getTime();
    const filesWithUrls = data.filter(file => !file.id.startsWith('.'))
      .map(file => {
        const { data: { publicUrl } } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(file.name);
        
        return {
          ...file,
          publicUrl
        };
      });
    
    console.log(`Successfully fetched ${filesWithUrls.length} files from bucket:`, bucketName);
    return filesWithUrls || [];
  } catch (error) {
    console.error('Error in getMediaFiles:', error);
    return [];
  }
};

// Delete media file
export const deleteMediaFile = async (fileName: string, bucketName = 'article_images') => {
  try {
    console.log("Attempting to delete file:", fileName, "from bucket:", bucketName);
    
    // Extract just the filename from a full URL if needed
    const actualFileName = fileName.includes('/') 
      ? fileName.split('/').pop() 
      : fileName;
    
    if (!actualFileName) {
      throw new Error("Invalid file name");
    }
    
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([actualFileName]);
    
    if (error) {
      console.error("Error deleting media file:", error);
      throw error;
    }
    
    console.log("Successfully deleted file:", actualFileName);
    return true;
  } catch (error) {
    console.error('Error in deleteMediaFile:', error);
    throw error;
  }
};
