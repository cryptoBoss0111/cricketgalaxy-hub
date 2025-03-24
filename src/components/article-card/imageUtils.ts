
import { useState, useEffect } from 'react';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';
const RELIABLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
];

// Simplified URL validation
export const isValidImageUrl = (url?: string): boolean => {
  return !!url && url.trim() !== '';
};

// Simplified URL processing function
export const getFullImageUrl = (url: string): string => {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  // If URL already includes http(s), it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, it's a local URL
  if (url.startsWith('/')) {
    return url;
  }
  
  // For Supabase storage paths, construct the full URL
  return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
};

// Simplified hook for article image handling
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>('');
  
  // Choose the first available image source
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    
    // Process and prioritize image URLs
    let sourceUrl: string | undefined;
    
    if (isValidImageUrl(featured_image)) {
      sourceUrl = getFullImageUrl(featured_image!);
      console.log(`Using featured_image for "${title}": ${sourceUrl}`);
    } else if (isValidImageUrl(cover_image)) {
      sourceUrl = getFullImageUrl(cover_image!);
      console.log(`Using cover_image for "${title}": ${sourceUrl}`);
    } else if (isValidImageUrl(imageUrl)) {
      sourceUrl = getFullImageUrl(imageUrl!);
      console.log(`Using imageUrl for "${title}": ${sourceUrl}`);
    } else {
      // If no valid image source, use a fallback
      sourceUrl = RELIABLE_FALLBACKS[0];
      console.log(`No valid image source for "${title}", using fallback`);
    }
    
    setImageSource(sourceUrl);
  }, [title, featured_image, cover_image, imageUrl]);
  
  // Handle successful image load
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    
    // On error, try to use a fallback image
    if (!imageSource.includes('unsplash.com') && !imageSource.includes(DEFAULT_PLACEHOLDER)) {
      console.log(`Trying fallback image for "${title}"`);
      setImageSource(RELIABLE_FALLBACKS[0]);
    } else if (imageSource === RELIABLE_FALLBACKS[0]) {
      // Try second fallback if first one fails
      setImageSource(RELIABLE_FALLBACKS[1]);
    } else {
      // If all else fails, use default placeholder
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
