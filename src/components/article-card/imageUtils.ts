
import { useState, useEffect } from 'react';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
const UNSPLASH_FALLBACK = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop';

// Helper function to validate URL format - accepting any non-empty string
export const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  return true;
};

// Function to get full URL if it's a relative path from Supabase storage
export const getFullImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // For debugging
  console.log(`Processing image URL: ${url}`);
  
  try {
    // Remove any query parameters which might cause issues
    const cleanUrl = url.split('?')[0];
    
    // Handle Supabase URLs with proper transformation
    if (cleanUrl.includes('supabase.co/storage/v1/')) {
      // Make sure the URL contains 'object/public' for proper access
      if (!cleanUrl.includes('/object/public/')) {
        // Convert from API format to public URL format
        const correctedUrl = cleanUrl.replace(
          '/storage/v1/',
          '/storage/v1/object/public/'
        );
        console.log(`Corrected Supabase URL: ${correctedUrl}`);
        return correctedUrl;
      }
      console.log(`URL already in correct format: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // If it's already a full URL but not a Supabase one, return as is
    if (cleanUrl.startsWith('http')) {
      console.log(`Using external URL as is: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // For relative paths, construct the full Supabase public URL
    const fullUrl = `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${cleanUrl}`;
    console.log(`Created full URL from relative path: ${fullUrl}`);
    return fullUrl;
  } catch (error) {
    console.error(`Error processing URL ${url}:`, error);
    return undefined;
  }
};

// Custom hook to handle image sources and fallbacks
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>(DEFAULT_PLACEHOLDER);
  const [fallbacksAttempted, setFallbacksAttempted] = useState<string[]>([]);
  
  useEffect(() => {
    // Reset state when props change
    setIsLoading(true);
    setImageError(false);
    setFallbacksAttempted([]);
    
    // Add unsplash fallback to the mix
    const externalFallback = UNSPLASH_FALLBACK;
    
    const fullFeaturedImage = getFullImageUrl(featured_image);
    const fullCoverImage = getFullImageUrl(cover_image);
    const fullImageUrl = getFullImageUrl(imageUrl);
    
    // For debugging, log all potential image sources
    console.log(`ArticleCard for "${title}" - Available images:`, {
      featured_image: fullFeaturedImage,
      cover_image: fullCoverImage,
      imageUrl: fullImageUrl
    });
    
    // Try featured_image first
    if (isValidImageUrl(fullFeaturedImage)) {
      console.log(`Setting primary image source to featured_image: ${fullFeaturedImage}`);
      setImageSource(fullFeaturedImage!);
      return;
    }
    
    // Then try cover_image
    if (isValidImageUrl(fullCoverImage)) {
      console.log(`Setting primary image source to cover_image: ${fullCoverImage}`);
      setImageSource(fullCoverImage!);
      return;
    }
    
    // Then try imageUrl
    if (isValidImageUrl(fullImageUrl)) {
      console.log(`Setting primary image source to imageUrl: ${fullImageUrl}`);
      setImageSource(fullImageUrl!);
      return;
    }
    
    // Try external fallback if none of the others work
    console.log(`Using external fallback image for "${title}"`);
    setImageSource(externalFallback);
    
    // Default to placeholder if everything else fails
    if (!externalFallback) {
      console.log(`No valid image found for "${title}", using placeholder`);
      setImageSource(DEFAULT_PLACEHOLDER);
      setIsLoading(false);
    }
  }, [title, featured_image, cover_image, imageUrl]);
  
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    
    // Add the current source to attempted fallbacks
    setFallbacksAttempted(prev => [...prev, imageSource]);
    
    // Get all available image sources
    const fullFeaturedImage = getFullImageUrl(featured_image);
    const fullCoverImage = getFullImageUrl(cover_image);
    const fullImageUrl = getFullImageUrl(imageUrl);
    const externalFallback = UNSPLASH_FALLBACK;
    
    // Create an array of available sources that we haven't tried yet
    const availableSources = [
      fullFeaturedImage,
      fullCoverImage,
      fullImageUrl,
      externalFallback
    ].filter(source => 
      source && 
      source !== imageSource && 
      !fallbacksAttempted.includes(source)
    );
    
    if (availableSources.length > 0) {
      // Try the next available source
      const nextSource = availableSources[0];
      console.log(`Trying fallback to ${nextSource} for "${title}"`);
      setImageSource(nextSource);
      return;
    }
    
    // If all have failed, use placeholder
    if (imageSource !== DEFAULT_PLACEHOLDER) {
      console.log(`All image attempts failed for "${title}", using placeholder`);
      setImageSource(DEFAULT_PLACEHOLDER);
      setIsLoading(false);
      setImageError(true);
    }
  };
  
  return {
    imageSource,
    isLoading,
    imageError,
    handleImageLoad,
    handleImageError,
    DEFAULT_PLACEHOLDER
  };
};
