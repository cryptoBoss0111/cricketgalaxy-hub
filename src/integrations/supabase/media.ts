
import { supabase } from './client-core';

// Upload file to storage with improved error handling and CORS support
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

    // Use the original filename 
    const originalFileName = file.name;
    
    // Create a unique stored filename to prevent collisions while preserving original name
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalFileName.split('.').pop()?.toLowerCase() || '';
    
    // Sanitize the filename to avoid URL encoding issues - remove spaces and special characters
    const fileBaseName = originalFileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const storedFileName = `${fileBaseName}_${timestamp}_${randomString}.${extension}`;
    
    console.log("Uploading image:", originalFileName);
    console.log("Stored as:", storedFileName);
    console.log("Content type:", file.type);
    
    // Set proper content type and caching headers
    const options = {
      cacheControl: '3600',
      upsert: false, // Don't overwrite files with the same name
      contentType: file.type // Ensure proper content type is set
    };
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storedFileName, file, options);
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    console.log("Upload successful, data:", data);
    
    // Get the public URL without any transformations to ensure CORS compatibility
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Ensure we have no query parameters that might cause CORS issues
    // For Supabase storage URLs, everything before the first question mark is the actual file URL
    const cleanUrl = publicUrl.split('?')[0];
    
    console.log("Clean public URL:", cleanUrl);
    
    // Save record to the media table with clean URL and file size
    const { data: mediaRecord, error: mediaError } = await supabase
      .from('media')
      .insert({
        original_file_name: originalFileName,
        stored_file_name: storedFileName,
        url: cleanUrl,
        size: file.size
      })
      .select()
      .single();
    
    if (mediaError) {
      console.error("Error saving to media table:", mediaError);
      throw mediaError;
    }
    
    console.log("Media record created:", mediaRecord);
    
    // Return the media record with guaranteed clean URL
    const cleanMediaRecord = {
      ...mediaRecord,
      url: mediaRecord.url.split('?')[0] // Ensure URL is clean
    };
    
    return cleanMediaRecord;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
