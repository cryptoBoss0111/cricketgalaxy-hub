
import { useState, useEffect } from 'react';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
const RELIABLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
];

// Check if a URL is provided and looks valid
export const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  return true;
};

// Process image URLs for better compatibility
export const getFullImageUrl = (url: string): string => {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  // If URL already starts with http(s), it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, it's a local URL
  if (url.startsWith('/')) {
    return url;
  }
  
  // Handle Supabase storage URLs - extract the actual path
  if (url.includes('swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/')) {
    // The URL is already a full Supabase URL, return it as is
    return url;
  }
  
  // Check if it's an article_images path without the full URL
  if (url.startsWith('article_images/')) {
    return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
  }
  
  // Construct the full Supabase storage URL
  return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
};

// Custom hook for article image handling with multiple fallbacks
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>('');
  const [currentSourceIndex, setCurrentSourceIndex] = useState(-1);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  
  // Process URLs to ensure they are complete
  const processedFeaturedImage = featured_image ? getFullImageUrl(featured_image) : undefined;
  const processedCoverImage = cover_image ? getFullImageUrl(cover_image) : undefined;
  const processedImageUrl = imageUrl ? getFullImageUrl(imageUrl) : undefined;
  
  console.log(`Processing image sources for article "${title}":`, {
    featured: featured_image, 
    cover: cover_image,
    processed_featured: processedFeaturedImage,
    processed_cover: processedCoverImage
  });
  
  // Create a prioritized list of all possible image sources
  const allImageSources = [
    processedFeaturedImage,
    processedCoverImage,
    processedImageUrl,
  ].filter(Boolean) as string[];
  
  // Try the next image source
  const tryNextImageSource = () => {
    const nextIndex = currentSourceIndex + 1;
    
    // First try all the article's own images
    if (nextIndex < allImageSources.length) {
      const nextSource = allImageSources[nextIndex];
      console.log(`Trying image source ${nextIndex} for "${title}": ${nextSource}`);
      setImageSource(nextSource);
      setCurrentSourceIndex(nextIndex);
      return;
    }
    
    // If all article images fail, use a fallback from our reliable list
    if (fallbackAttempt < RELIABLE_FALLBACKS.length) {
      const fallbackImage = RELIABLE_FALLBACKS[fallbackAttempt];
      console.log(`Trying fallback image ${fallbackAttempt} for "${title}": ${fallbackImage}`);
      setImageSource(fallbackImage);
      setFallbackAttempt(fallbackAttempt + 1);
      return;
    }
    
    // If all else fails, use the default placeholder
    console.log(`All image attempts failed for "${title}", using default placeholder`);
    setImageSource(DEFAULT_PLACEHOLDER);
    setIsLoading(false);
    setImageError(true);
  };
  
  // Initialize with first source
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    setCurrentSourceIndex(-1);
    setFallbackAttempt(0);
    
    // If we have no image sources at all, immediately use a fallback
    if (allImageSources.length === 0) {
      setImageSource(RELIABLE_FALLBACKS[0]);
      setFallbackAttempt(1);
    } else {
      tryNextImageSource();
    }
  }, [title, processedFeaturedImage, processedCoverImage, processedImageUrl]);
  
  // Handle successful image load
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  // Handle image load error and try next source
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    tryNextImageSource();
  };
  
  return {
    imageSource,
    isLoading,
    imageError,
    handleImageLoad,
    handleImageError
  };
};
