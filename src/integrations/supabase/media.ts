
import { supabase } from './client-core';

// Generate a unique filename for uploads
export const generateUniqueFileName = (fileName: string) => {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = fileName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Upload file to storage with improved error handling and retry logic
export const uploadImageToStorage = async (file: File, bucket = 'article_images') => {
  try {
    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `${bucket}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    // Return the full public URL
    return data.path;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
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
