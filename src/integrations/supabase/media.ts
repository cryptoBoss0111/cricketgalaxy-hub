
import { supabase } from './client-core';

// Upload file to storage with improved error handling and CORS support
export const uploadImageToStorage = async (file: File, bucket = 'media') => {
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
    
    // Set proper content type and caching headers
    const options = {
      cacheControl: '3600',
      upsert: false, // Don't overwrite files with the same name
      contentType: file.type
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
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    // Save record to the media table
    const { data: mediaRecord, error: mediaError } = await supabase
      .from('media')
      .insert({
        original_file_name: originalFileName,
        stored_file_name: storedFileName,
        url: publicUrl, // Store the clean URL without cache-busting parameters
        size: file.size
      })
      .select()
      .single();
    
    if (mediaError) {
      console.error("Error saving to media table:", mediaError);
      throw mediaError;
    }
    
    console.log("Media record created:", mediaRecord);
    
    // Return the media record
    return mediaRecord;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all media files from the database
export const getMediaFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching media files:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data.length} media records`);
    return data || [];
  } catch (error) {
    console.error('Error in getMediaFiles:', error);
    return [];
  }
};

// Delete media file
export const deleteMediaFile = async (id: string) => {
  try {
    // First, get the file details
    const { data: fileData, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching file data for deletion:", fetchError);
      throw fetchError;
    }
    
    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('media')
      .remove([fileData.stored_file_name]);
    
    if (storageError) {
      console.error("Error deleting from storage:", storageError);
      // Continue to delete the database record even if storage deletion fails
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error("Error deleting from media table:", dbError);
      throw dbError;
    }
    
    console.log("Successfully deleted file:", fileData.original_file_name);
    return true;
  } catch (error) {
    console.error('Error in deleteMediaFile:', error);
    throw error;
  }
};
