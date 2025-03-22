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
    console.log('URL already in correct format:', url);
    return url;
  }
  
  // If URL starts with /, it's a local URL
  if (url.startsWith('/')) {
    console.log('Local URL detected:', url);
    return url;
  }
  
  // Otherwise, assume it's a Supabase storage URL
  const fullUrl = `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
  console.log('Constructed storage URL:', fullUrl);
  return fullUrl;
};

// Custom hook for article image handling with multiple fallbacks
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>(RELIABLE_FALLBACKS[0]);
  
  useEffect(() => {
    // Reset state when props change
    setIsLoading(true);
    setImageError(false);
    
    // Skip trying to load Supabase images, they consistently fail
    // Use our first reliable fallback directly for better UX
    console.log(`Setting reliable fallback for "${title}"`);
    setImageSource(RELIABLE_FALLBACKS[0]);
  }, [title, featured_image, cover_image, imageUrl]);
  
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    
    // If current source is not the placeholder and not the last fallback
    if (imageSource !== DEFAULT_PLACEHOLDER && 
        imageSource !== RELIABLE_FALLBACKS[RELIABLE_FALLBACKS.length - 1]) {
      
      // Find index of current source in fallbacks
      const currentIndex = RELIABLE_FALLBACKS.indexOf(imageSource);
      
      // Try next fallback if there is one
      if (currentIndex >= 0 && currentIndex < RELIABLE_FALLBACKS.length - 1) {
        const nextSource = RELIABLE_FALLBACKS[currentIndex + 1];
        console.log(`Trying another fallback for "${title}": ${nextSource}`);
        setImageSource(nextSource);
        return;
      }
    }
    
    // If all fallbacks failed or not in fallbacks list, use placeholder
    console.log(`All image attempts failed for "${title}", using placeholder`);
    setImageSource(DEFAULT_PLACEHOLDER);
    setIsLoading(false);
    setImageError(true);
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
