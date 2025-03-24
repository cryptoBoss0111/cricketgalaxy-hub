
import { supabase } from './client-core';

// Helper function to infer content type from file extension
const inferContentTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      // Only allow jpeg files, but provide a safe fallback
      return 'image/jpeg';
  }
};

// Upload file to storage with improved error handling and CORS support
export const uploadImageToStorage = async (file: File, bucket = 'article_images') => {
  try {
    // Check if file exists
    if (!file) {
      throw new Error("No file provided for upload");
    }

    // Validate file type - only allow JPEG images
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      throw new Error("Please upload only JPEG files (.jpg or .jpeg)");
    }

    // Use the original filename but sanitize it
    const originalFileName = file.name;
    
    // Check for valid extension
    const extension = originalFileName.split('.').pop()?.toLowerCase() || '';
    if (extension !== 'jpg' && extension !== 'jpeg') {
      throw new Error("Only .jpg and .jpeg files are allowed");
    }
    
    // Sanitize filename to remove spaces and special characters
    const fileBaseName = file.name
      .split('.')[0]
      .replace(/\s+/g, "_")         // Replace spaces with underscores
      .replace(/[^\w.-]/g, "");     // Remove any special characters except word chars, dots and hyphens
    
    const timestamp = Date.now();
    const storedFileName = `${fileBaseName}_${timestamp}.${extension}`;
    
    console.log("Uploading image:", originalFileName);
    console.log("Stored as:", storedFileName);
    console.log("Content type from file object:", file.type);
    
    // Set caching headers but do NOT override content type
    // CRITICAL FIX: Pass the file's type directly without any inference or transformation
    const options = {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type // Use exact file.type from the browser
    };
    
    console.log("Upload options:", options);
    
    // Upload the file directly to Supabase Storage without any transformation
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
        size: file.size,
        content_type: file.type // Save the original file type
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
    
    // Make sure all URLs are clean (no query parameters) and have proper content type
    const cleanData = data?.map(item => ({
      ...item,
      url: item.url.split('?')[0], // Ensure URL is clean
      content_type: item.content_type || 'image/jpeg' // Ensure content_type exists, default to JPEG
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
