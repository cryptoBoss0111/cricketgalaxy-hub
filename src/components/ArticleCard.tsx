
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
  // Define a fixed placeholder image that we know exists in the public folder
  const DEFAULT_PLACEHOLDER = '/placeholder.svg';
  
  // States to manage image loading
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [bestImageUrl, setBestImageUrl] = useState<string | null>(null);
  
  // Function to extract URL and check if it is potentially valid
  const sanitizeUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    // Remove any query parameters or fragments that might cause issues
    return url.split('?')[0].split('#')[0];
  };
  
  // Find the best available image
  useEffect(() => {
    // Try images in order of preference
    const possibleImages = [featured_image, cover_image, imageUrl]
      .map(sanitizeUrl)
      .filter(Boolean) as string[];
    
    if (possibleImages.length > 0) {
      // Use the first available image
      const chosenImage = possibleImages[0];
      setBestImageUrl(chosenImage);
      console.log(`Selected image for "${title}":`, chosenImage);
    } else {
      // No valid images found, we'll use the placeholder
      setBestImageUrl(null);
      console.log(`No valid images found for "${title}", will use placeholder`);
    }
  }, [featured_image, cover_image, imageUrl, title]);
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.error(`Failed to load image for article "${title}":`, bestImageUrl);
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
        
        {/* Image element */}
        <img 
          src={!imageError && bestImageUrl ? bestImageUrl : DEFAULT_PLACEHOLDER}
          alt={title}
          className={cn(
            "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          crossOrigin="anonymous" // Add crossOrigin to handle CORS
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
