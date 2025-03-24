
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
    const timestamp = Date.now();
    // Sanitize the filename to avoid URL encoding issues - remove spaces and special characters
    const fileBaseName = originalFileName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
    const extension = originalFileName.split('.').pop()?.toLowerCase() || '';
    const storedFileName = `${fileBaseName}_${timestamp}.${extension}`;
    
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
    
    // Make sure all URLs are clean (no query parameters)
    const cleanData = data?.map(item => ({
      ...item,
      url: item.url.split('?')[0] // Ensure URL is clean
    }));
    
    console.log(`Successfully fetched ${cleanData?.length} media records`);
    return cleanData || [];
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
      .from('article_images')
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
