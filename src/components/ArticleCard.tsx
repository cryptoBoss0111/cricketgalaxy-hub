
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface ArticleCardProps {
  id: string | number;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  cover_image?: string;
  featured_image?: string;
  category: string;
  author: string;
  date: string;
  timeToRead?: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  imageUrl,
  cover_image,
  featured_image,
  category,
  author,
  date,
  timeToRead,
  className,
}) => {
  const DEFAULT_PLACEHOLDER = '/placeholder.svg';
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState<string>(DEFAULT_PLACEHOLDER);
  
  // Helper function to validate URL format - accepting any non-empty string
  const isValidImageUrl = (url?: string): boolean => {
    if (!url || url.trim() === '') return false;
    return true;
  };
  
  // Function to get full URL if it's a relative path from Supabase storage
  const getFullImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    
    // Handle relative URLs if needed
    return url;
  };
  
  // This effect sets the initial image source when the component mounts
  useEffect(() => {
    const fullFeaturedImage = getFullImageUrl(featured_image);
    const fullCoverImage = getFullImageUrl(cover_image);
    const fullImageUrl = getFullImageUrl(imageUrl);
    
    console.log(`ArticleCard for "${title}" - Available images:`, {
      featured_image: fullFeaturedImage,
      cover_image: fullCoverImage,
      imageUrl: fullImageUrl
    });
    
    // Try featured_image first (from admin panel)
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
    
    // Then try imageUrl (legacy field)
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
    
    // If we've tried all images and they've failed, use placeholder
    if (imageSource !== DEFAULT_PLACEHOLDER) {
      console.log(`All image attempts failed for "${title}", using placeholder`);
      setImageSource(DEFAULT_PLACEHOLDER);
      setIsLoading(false);
      setImageError(true);
    }
  };
  
  return (
    <article className={cn(
      "article-card flex flex-col h-full bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300",
      className
    )}>
      <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
        {/* Show skeleton while loading */}
        {isLoading && (
          <Skeleton className="w-full h-48 object-cover" />
        )}
        
        {/* Display the image with error handling */}
        <img 
          src={imageSource}
          alt={title}
          className={cn(
            "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-cricket-accent text-white rounded">
            {category}
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <Link to={`/article/${id}`} className="block mb-2">
            <h3 className="text-lg font-heading font-semibold leading-tight hover:text-cricket-accent dark:text-white dark:hover:text-cricket-accent">
              {title}
            </h3>
          </Link>
          
          {excerpt && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {excerpt}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {date}
          </span>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 text-xs">
              By {author}
            </span>
            {timeToRead && (
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
                • {timeToRead}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
