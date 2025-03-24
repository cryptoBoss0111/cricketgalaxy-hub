
import { supabase } from './client-core';

// Generate a unique filename for uploads
export const generateUniqueFileName = (fileName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
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

    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `${fileName}`; // Keep the path simple
    
    console.log("Uploading image:", file.name, "Size:", file.size, "Type:", file.type);
    
    // Ensure bucket exists
    await ensureBucketExists(bucket);
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Set to true to overwrite if file exists
        contentType: file.type // Explicitly set the content type
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    console.log("Upload successful, data:", data);
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log("Generated public URL:", publicUrl);
    
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
      console.log(`Bucket '${bucketName}' does not exist. Auto-creating it.`);
      
      // Using the storage API directly
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error("Error creating bucket:", error);
        throw error;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    throw error;
  }
};

// Get all media files
export const getMediaFiles = async (bucketName = 'article_images') => {
  try {
    // Ensure bucket exists
    await ensureBucketExists(bucketName);
    
    // Now list the files in the bucket
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
