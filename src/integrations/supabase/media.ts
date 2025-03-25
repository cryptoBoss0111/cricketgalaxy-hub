import { supabase } from './client-core';

// Upload file to storage with proper MIME type handling
export const uploadImageToStorage = async (file: File, bucket = 'article_images') => {
  try {
    // Check if file exists
    if (!file) {
      throw new Error("No file provided for upload");
    }
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      throw new Error("Only image files are supported");
    }
    
    // Sanitize filename
    const fileBaseName = file.name
      .split('.')[0]
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");
    
    const timestamp = Date.now();
    const storedFileName = `${fileBaseName}_${timestamp}.jpg`;
    
    console.log("Uploading image with original MIME type:", file.type);
    console.log("File will be stored as:", storedFileName);
    
    // Use the file directly without forcing MIME type conversion
    // This prevents the application/json error
    
    // Set options for upload - using the file's original content type
    const options = {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    };
    
    // Upload the file with its original content type
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
    
    // Generate a clean URL without query parameters
    const cleanUrl = publicUrl.split('?')[0];
    
    // Save record to the media table
    const { data: mediaRecord, error: mediaError } = await supabase
      .from('media')
      .insert({
        original_file_name: file.name,
        stored_file_name: storedFileName,
        url: cleanUrl,
        size: file.size,
        content_type: file.type
      })
      .select()
      .single();
    
    if (mediaError) {
      console.error("Error saving to media table:", mediaError);
      throw mediaError;
    }
    
    return {
      ...mediaRecord,
      url: cleanUrl
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all media files from the database with improved error handling
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
    
    // Make sure all URLs are clean without query parameters
    const cleanData = data?.map(item => ({
      ...item,
      url: item.url.split('?')[0],
      content_type: "image/jpeg" // Force content type to image/jpeg
    }));
    
    return cleanData || [];
  } catch (error) {
    console.error('Error in getMediaFiles:', error);
    return [];
  }
};

// Delete media file with improved error handling
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
