
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
  // Define a fixed placeholder image path
  const DEFAULT_PLACEHOLDER = '/placeholder.svg';
  
  // States to manage image loading
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Function to validate if a URL is valid
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Determine the best image to use
  useEffect(() => {
    const images = [featured_image, cover_image, imageUrl]
      .filter(url => isValidUrl(url)) as string[];
    
    if (images.length > 0) {
      // We have at least one valid image URL
      setImageSrc(images[0]);
      console.log(`Using image for "${title}":`, images[0]);
    } else {
      // No valid images, use placeholder
      setImageSrc(null);
      setImageError(true);
      console.log(`No valid images found for "${title}", using placeholder`);
    }
  }, [featured_image, cover_image, imageUrl, title]);
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.error(`Failed to load image for article: ${title}`, imageSrc);
    setIsLoading(false);
    setImageError(true);
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
        
        {/* Image display with error handling */}
        <img 
          src={!imageError && imageSrc ? imageSrc : DEFAULT_PLACEHOLDER}
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
