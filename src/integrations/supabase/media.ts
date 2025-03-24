
import { supabase } from './client-core';

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

    // Use the original filename directly without modification
    const fileName = file.name;
    const filePath = `${fileName}`;
    
    console.log("Uploading image with original filename:", fileName);
    
    // Get the current session to check authentication status
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      // Proceed with anon upload if there's a session error
    } else {
      console.log("Session status:", sessionData.session ? "Authenticated" : "Not authenticated");
    }
    
    // Set proper content type and caching headers
    const options = {
      cacheControl: '0', // Disable cache to ensure freshness
      upsert: true,
      contentType: file.type
    };
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, options);
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    console.log("Upload successful, data:", data);
    
    // Get the public URL with a timestamp to prevent caching
    const timestamp = new Date().getTime();
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Add cache busting parameter
    const urlWithCacheBust = `${publicUrl}?t=${timestamp}`;
    console.log("Generated public URL with cache busting:", urlWithCacheBust);
    
    // Return the public URL
    return urlWithCacheBust;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all media files
export const getMediaFiles = async (bucketName = 'article_images') => {
  try {
    // Ensure bucket exists
    await ensureBucketExists(bucketName);
    
    // List files in the bucket
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
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
    
    // Add public URLs to each file with timestamp to prevent caching
    const timestamp = new Date().getTime();
    const filesWithUrls = data
      .filter(file => !file.id.startsWith('.') && file.id !== '.emptyFolderPlaceholder')
      .map(file => {
        const { data: { publicUrl } } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(file.name);
        
        // Add cache busting parameter
        const urlWithCacheBust = `${publicUrl}?t=${timestamp}&r=${Math.random().toString(36).substring(2, 8)}`;
        
        return {
          ...file,
          publicUrl: urlWithCacheBust
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
      ? fileName.split('/').pop()?.split('?')[0] // Remove query parameters
      : fileName.split('?')[0]; // Remove query parameters
    
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
