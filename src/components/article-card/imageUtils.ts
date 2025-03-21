
import { useState, useEffect } from 'react';

const DEFAULT_PLACEHOLDER = '/placeholder.svg';

// Helper function to validate URL format - accepting any non-empty string
export const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  return true;
};

// Function to get full URL if it's a relative path from Supabase storage
export const getFullImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url;
  
  // Handle relative URLs if needed
  return url;
};

// Custom hook to handle image sources and fallbacks
export const useArticleImage = (title: string, featured_image?: string, cover_image?: string, imageUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>(DEFAULT_PLACEHOLDER);
  
  useEffect(() => {
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
    
    // Default to placeholder if no valid images found
    console.log(`No valid image found for "${title}", using placeholder`);
    setImageSource(DEFAULT_PLACEHOLDER);
    setIsLoading(false);
  }, [title, featured_image, cover_image, imageUrl]);
  
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    
    // Track which sources we've already tried
    const fullFeaturedImage = getFullImageUrl(featured_image);
    const fullCoverImage = getFullImageUrl(cover_image);
    const fullImageUrl = getFullImageUrl(imageUrl);
    
    const isFeaturedImage = imageSource === fullFeaturedImage;
    const isCoverImage = imageSource === fullCoverImage;
    const isImageUrl = imageSource === fullImageUrl;
    
    // Try fallback images in sequence
    if (isFeaturedImage && isValidImageUrl(fullCoverImage)) {
      console.log(`Trying fallback to cover_image for "${title}": ${fullCoverImage}`);
      setImageSource(fullCoverImage!);
      return;
    } 
    
    if ((isFeaturedImage || isCoverImage) && isValidImageUrl(fullImageUrl)) {
      console.log(`Trying fallback to imageUrl for "${title}": ${fullImageUrl}`);
      setImageSource(fullImageUrl!);
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
