
import { useState, useEffect } from 'react';

// Default fallback image
const DEFAULT_PLACEHOLDER = '/placeholder.svg';

// Reliable fallback images for when Supabase images fail
const RELIABLE_FALLBACKS = [
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
];

// Check if a URL is valid
export const isValidImageUrl = (url?: string): boolean => {
  return Boolean(url && url.trim() !== '');
};

// Get a complete image URL
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
  
  // If it's not a full URL or local path, assume it's a relative path
  // and convert to an absolute URL
  return `${window.location.origin}/${url}`;
};

// Simplified hook for article image handling
export const useArticleImage = (title: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>('');
  
  // Choose the image source
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    
    let sourceUrl: string;
    
    if (isValidImageUrl(imageUrl)) {
      sourceUrl = getFullImageUrl(imageUrl!);
      console.log(`Using image for "${title}": ${sourceUrl}`);
    } else {
      // If no valid image source, use a fallback
      sourceUrl = RELIABLE_FALLBACKS[0];
      console.log(`No valid image source for "${title}", using fallback`);
    }
    
    setImageSource(sourceUrl);
  }, [title, imageUrl]);
  
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
