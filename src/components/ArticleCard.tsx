
import React, { useState, useEffect, useRef } from 'react';
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
  const DEFAULT_PLACEHOLDER = '/lovable-uploads/59a2c89e-ced1-42c5-b6a5-59527e647419.png';
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState<string>(DEFAULT_PLACEHOLDER);
  const isMounted = useRef(true);
  
  // Collect all possible image sources, filtering out undefined/null values
  const imageSources = [
    imageUrl,
    featured_image, 
    cover_image
  ].filter(Boolean) as string[];
  
  console.log(`Article ${id} - Original image sources for "${title}":`, {
    imageUrl,
    featured_image,
    cover_image,
    availableSources: imageSources
  });

  useEffect(() => {
    // Set isMounted ref to true when component mounts
    isMounted.current = true;
    
    // Function to load the image
    const loadImage = async () => {
      // If no sources are available, use the default placeholder
      if (!imageSources.length) {
        console.log(`No image sources available for article: ${title}`);
        setDisplayedImage(DEFAULT_PLACEHOLDER);
        setIsImageLoading(false);
        return;
      }
      
      // Try each source in sequence
      for (let i = 0; i < imageSources.length; i++) {
        const src = imageSources[i];
        
        try {
          // Break if component unmounted during execution
          if (!isMounted.current) return;
          
          await new Promise<void>((resolve, reject) => {
            // Create a new image element for testing
            const img = new Image();
            
            // Set a timeout to avoid hanging forever
            const timeoutId = setTimeout(() => {
              reject(new Error(`Timeout loading image from ${src}`));
            }, 3000);
            
            // Success handler
            img.onload = () => {
              clearTimeout(timeoutId);
              if (isMounted.current) {
                console.log(`Successfully loaded image for article "${title}" from source: ${src}`);
                setDisplayedImage(src);
                setIsImageLoading(false);
              }
              resolve();
            };
            
            // Error handler
            img.onerror = () => {
              clearTimeout(timeoutId);
              console.error(`Failed to load image from source ${i+1}/${imageSources.length} for article "${title}": ${src}`);
              reject(new Error(`Failed to load image from ${src}`));
            };
            
            // Set source with cache-busting parameter and specific flags for cross-origin issues
            img.crossOrigin = "anonymous";
            img.referrerPolicy = "no-referrer";
            
            // Add random parameter to bypass cache
            const cacheBuster = Math.random().toString(36).substring(7);
            img.src = `${src}?v=${cacheBuster}`;
          });
          
          // If we reach here, the image loaded successfully
          return;
          
        } catch (error) {
          console.log(`Error loading image from ${i+1}/${imageSources.length} sources for article "${title}":`, error);
          // Continue to next source on failure
        }
      }
      
      // If we've tried all sources and none worked, use the placeholder
      if (isMounted.current) {
        console.log(`Using default placeholder image for article: ${title}`);
        setDisplayedImage(DEFAULT_PLACEHOLDER);
        setIsImageLoading(false);
      }
    };
    
    // Attempt to load the image
    setIsImageLoading(true);
    loadImage().catch(err => {
      console.error('Unhandled error in image loading:', err);
      if (isMounted.current) {
        setDisplayedImage(DEFAULT_PLACEHOLDER);
        setIsImageLoading(false);
      }
    });
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted.current = false;
    };
  }, [id, title, imageSources, DEFAULT_PLACEHOLDER]);
  
  return (
    <article className={cn(
      "article-card flex flex-col h-full bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300",
      className
    )}>
      <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
        {isImageLoading && (
          <Skeleton className="w-full h-48 object-cover" />
        )}
        
        <img 
          src={displayedImage}
          alt={title}
          className={cn(
            "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          onError={(e) => {
            console.error(`Final image display error for ${title}:`, e);
            (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER;
          }}
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
