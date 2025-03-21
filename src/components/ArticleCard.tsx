
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
  
  // Helper function to validate URL format
  const isValidImageUrl = (url?: string): boolean => {
    if (!url || url.trim() === '') return false;
    return true;
  };
  
  // This effect sets the initial image source when the component mounts
  useEffect(() => {
    console.log(`ArticleCard for "${title}" - Received image URLs:`, {
      featured_image,
      cover_image,
      imageUrl
    });
    
    // Try featured_image first (from admin panel)
    if (isValidImageUrl(featured_image)) {
      console.log(`Setting primary image source to featured_image: ${featured_image}`);
      setImageSource(featured_image!);
      return;
    }
    
    // Then try cover_image
    if (isValidImageUrl(cover_image)) {
      console.log(`Setting primary image source to cover_image: ${cover_image}`);
      setImageSource(cover_image!);
      return;
    }
    
    // Then try imageUrl (legacy field)
    if (isValidImageUrl(imageUrl)) {
      console.log(`Setting primary image source to imageUrl: ${imageUrl}`);
      setImageSource(imageUrl!);
      return;
    }
    
    // Default to placeholder if no valid images found
    console.log(`No valid image found for "${title}", using placeholder`);
    setImageSource(DEFAULT_PLACEHOLDER);
  }, [title, featured_image, cover_image, imageUrl]);
  
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error(`❌ Image load failed for "${title}": ${imageSource}`);
    
    // Track which sources we've already tried
    const isFeaturedImage = imageSource === featured_image;
    const isCoverImage = imageSource === cover_image;
    const isImageUrl = imageSource === imageUrl;
    
    // Try fallback images in sequence
    if (isFeaturedImage && isValidImageUrl(cover_image)) {
      console.log(`Trying fallback to cover_image for "${title}": ${cover_image}`);
      setImageSource(cover_image!);
      return;
    } 
    
    if ((isFeaturedImage || isCoverImage) && isValidImageUrl(imageUrl)) {
      console.log(`Trying fallback to imageUrl for "${title}": ${imageUrl}`);
      setImageSource(imageUrl!);
      return;
    }
    
    // If we've tried all images and they've failed, use placeholder
    if (!isImageUrl || imageSource !== DEFAULT_PLACEHOLDER) {
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
          crossOrigin="anonymous"
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
