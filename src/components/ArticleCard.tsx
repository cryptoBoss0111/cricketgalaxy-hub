
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
  // Define a local placeholder image path
  const DEFAULT_PLACEHOLDER = '/lovable-uploads/f0bea2fb-5aa7-404a-b434-d153984a2dbf.png';
  
  // Use state to track loading status and final image URL
  const [isLoading, setIsLoading] = useState(true);
  const [displayImage, setDisplayImage] = useState(DEFAULT_PLACEHOLDER);
  
  // Attempt to load image when component mounts
  useEffect(() => {
    // Use a direct approach - start with the placeholder
    setDisplayImage(DEFAULT_PLACEHOLDER);
    
    // Create simple image loader helper
    const tryLoadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        
        // Set a timeout to reject if image takes too long
        const timeoutId = setTimeout(() => {
          reject(new Error(`Image load timeout: ${src}`));
        }, 5000);
        
        img.onload = () => {
          clearTimeout(timeoutId);
          resolve(src);
        };
        
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Failed to load image: ${src}`));
        };
        
        // Add cache-busting parameter
        img.src = `${src}?t=${new Date().getTime()}`;
      });
    };
    
    // Create array of potential image sources, remove any undefined/null
    const potentialSources = [imageUrl, featured_image, cover_image].filter(Boolean) as string[];
    
    // If we have no sources, just use the placeholder and end loading
    if (potentialSources.length === 0) {
      setIsLoading(false);
      return;
    }
    
    // Try to load images in sequence
    const loadImages = async () => {
      for (const source of potentialSources) {
        try {
          // Try to load this image
          const validatedSource = await tryLoadImage(source);
          setDisplayImage(validatedSource);
          setIsLoading(false);
          return; // Success! Exit the function
        } catch (err) {
          console.log(`Image load failed for source: ${source}`);
          // Continue to next source
        }
      }
      
      // If we get here, all sources failed
      console.log(`Using default image for article: ${title}`);
      setIsLoading(false);
    };
    
    loadImages();
  }, [imageUrl, featured_image, cover_image, title]);
  
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
