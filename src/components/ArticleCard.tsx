
import React, { useState } from 'react';
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
  // Local placeholder image (static asset in public folder)
  const DEFAULT_PLACEHOLDER = '/lovable-uploads/71896ba4-b0bc-405b-a224-34e3fa673d5e.png';
  
  // Use state to track loading status and final image URL
  const [isLoading, setIsLoading] = useState(true);
  const [displayImage, setDisplayImage] = useState(DEFAULT_PLACEHOLDER);
  
  // Get all possible image sources, prioritizing in order (most important first)
  const imageSources = [imageUrl, featured_image, cover_image].filter(Boolean);
  
  // Handle the image load event
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // Handle image error - display the default placeholder
  const handleImageError = () => {
    console.log(`Failed to load image for article: ${title}`);
    setDisplayImage(DEFAULT_PLACEHOLDER);
    setIsLoading(false);
  };
  
  // Choose the best available image or fall back to placeholder
  React.useEffect(() => {
    // If we have any sources to try, use the first one, otherwise use placeholder
    if (imageSources.length > 0) {
      // Set the first available source as our display image
      setDisplayImage(imageSources[0]);
    } else {
      // If no sources, use the placeholder and end loading state
      setDisplayImage(DEFAULT_PLACEHOLDER);
      setIsLoading(false);
    }
  }, [imageSources]);
  
  return (
    <article className={cn(
      "article-card flex flex-col h-full bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300",
      className
    )}>
      <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
        {isLoading && (
          <Skeleton className="w-full h-48 object-cover" />
        )}
        
        <img 
          src={displayImage}
          alt={title}
          className={cn(
            "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
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
