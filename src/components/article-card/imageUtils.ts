
import { useState, useEffect } from 'react';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
const RELIABLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop'
];

// Helper function to validate URL format - accepting any non-empty string
export const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  return true;
};

// Function to get full URL if it's a relative path from Supabase storage
export const getFullImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  try {
    // Add public URL directly accessable via CORS
    const publicUrl = url.replace(
      'https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/',
      'https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/public/'
    );
    
    // For debugging
    console.log(`Processing image URL: ${url} -> ${publicUrl}`);
    
    return publicUrl;
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
    
    const fullFeaturedImage = featured_image;
    const fullCoverImage = cover_image;
    const fullImageUrl = imageUrl;
    
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
    console.log(`Using reliable fallback for "${title}"`);
    setImageSource(RELIABLE_FALLBACKS[0]);
    
    // Default to placeholder if everything else fails
    if (!RELIABLE_FALLBACKS[0]) {
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
    const availableSources = [
      featured_image,
      cover_image,
      imageUrl,
      ...RELIABLE_FALLBACKS
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
