
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
  
  // Construct the full Supabase storage URL
  return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
};

// Custom hook for article image handling with multiple fallbacks
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>('');
  const [currentSourceIndex, setCurrentSourceIndex] = useState(-1);
  
  // Process URLs to ensure they are complete
  const processedFeaturedImage = featured_image ? getFullImageUrl(featured_image) : undefined;
  const processedCoverImage = cover_image ? getFullImageUrl(cover_image) : undefined;
  const processedImageUrl = imageUrl ? getFullImageUrl(imageUrl) : undefined;
  
  // Create a prioritized list of all possible image sources
  const allImageSources = [
    processedFeaturedImage,
    processedCoverImage,
    processedImageUrl,
    ...RELIABLE_FALLBACKS,
    DEFAULT_PLACEHOLDER
  ].filter(Boolean) as string[];
  
  // Try the next image source
  const tryNextImageSource = () => {
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < allImageSources.length) {
      const nextSource = allImageSources[nextIndex];
      console.log(`Trying image source ${nextIndex} for "${title}": ${nextSource}`);
      setImageSource(nextSource);
      setCurrentSourceIndex(nextIndex);
    }
  };
  
  // Initialize with first source
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    setCurrentSourceIndex(-1);
    tryNextImageSource();
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
    
    // If we haven't reached the end of our sources, try the next one
    if (currentSourceIndex < allImageSources.length - 1) {
      tryNextImageSource();
    } else {
      // If all sources failed, set placeholder and finish loading
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
    handleImageError
  };
};
