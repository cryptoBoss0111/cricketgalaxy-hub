
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
  // Define a reliable and persistent placeholder image that won't change
  const placeholderImage = 'https://placehold.co/600x400/e0e0e0/333333?text=Cricket+News';
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState<string>(placeholderImage);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      // Create array of potential image sources, filter out undefined/null values
      const imageSources = [imageUrl, featured_image, cover_image].filter(Boolean) as string[];
      
      if (imageSources.length === 0) {
        console.log(`No image sources available for article: ${title}`);
        if (isMounted) {
          setDisplayedImage(placeholderImage);
          setIsImageLoading(false);
        }
        return;
      }
      
      // Try loading each image source in sequence
      for (const src of imageSources) {
        try {
          // Create a promise that resolves when the image loads or rejects after timeout
          const imageLoaded = await new Promise<boolean>((resolve, reject) => {
            const img = new Image();
            
            // Set a timeout to reject if image takes too long to load
            const timeoutId = setTimeout(() => {
              console.log(`Image loading timeout for ${src}`);
              reject(new Error('Image load timeout'));
            }, 5000);
            
            img.onload = () => {
              clearTimeout(timeoutId);
              resolve(true);
            };
            
            img.onerror = () => {
              clearTimeout(timeoutId);
              reject(new Error(`Failed to load image from ${src}`));
            };
            
            // Start loading the image
            img.src = src;
          });
          
          // If we get here, the image loaded successfully
          if (isMounted) {
            console.log(`Successfully loaded image for article: ${title} from ${src}`);
            setDisplayedImage(src);
            setIsImageLoading(false);
          }
          return; // Exit after first successful image load
          
        } catch (error) {
          console.error(`Error loading image from ${imageSources.indexOf(src) + 1}/${imageSources.length} sources for article "${title}":`, error);
          // Continue to the next image source
        }
      }
      
      // If all image sources failed, use the placeholder
      if (isMounted) {
        console.log(`Using placeholder image for article: ${title}`);
        setDisplayedImage(placeholderImage);
        setIsImageLoading(false);
      }
    };
    
    // Start the image loading process
    loadImage();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [title, imageUrl, cover_image, featured_image, placeholderImage]);
  
  // Handle manual image loading events for the visible image element
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  const handleImageError = () => {
    console.error(`Failed to load displayed image for article: ${title}`);
    setDisplayedImage(placeholderImage);
    setIsImageLoading(false);
  };
  
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
