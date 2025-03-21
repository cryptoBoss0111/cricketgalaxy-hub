
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
  // Use a static local placeholder image rather than an external service
  const placeholderImage = '/lovable-uploads/78bd8ca1-c0b1-430c-814b-d38fbaf2ef0c.png';
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [displayedImage, setDisplayedImage] = useState<string>(placeholderImage);
  
  // Log available image sources for debugging
  const availableSources = [imageUrl, featured_image, cover_image].filter(Boolean);
  
  console.log(`Article ${id} - Image URLs:`, {
    imageUrl,
    cover_image,
    featured_image,
    availableSources
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      // Skip loading if no sources available
      if (!availableSources.length) {
        if (isMounted) {
          console.log(`No image sources available for article: ${title}`);
          setDisplayedImage(placeholderImage);
          setIsImageLoading(false);
        }
        return;
      }
      
      let imageLoaded = false;
      
      // Try loading each image with simplified approach
      for (const src of availableSources) {
        if (!isMounted) return;
        
        try {
          // Create a new image for testing
          const img = new Image();
          
          // Create a promise for image loading with timeout
          await new Promise<void>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error(`Timeout loading image from ${src}`));
            }, 5000);
            
            // Configure CORS attributes to help with cross-origin issues
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              clearTimeout(timeoutId);
              if (isMounted) {
                setDisplayedImage(src);
                setIsImageLoading(false);
                imageLoaded = true;
              }
              resolve();
            };
            
            img.onerror = () => {
              clearTimeout(timeoutId);
              console.error(`Failed to load image at ${src} for article: ${title}`);
              reject(new Error(`Failed to load image from ${src}`));
            };
            
            // Set cache-busting parameter to prevent caching issues
            img.src = `${src}?t=${new Date().getTime()}`;
          });
          
          // If we successfully loaded the image, exit the loop
          if (imageLoaded) {
            console.log(`Successfully loaded image for article: ${title} from ${src}`);
            break;
          }
        } catch (error) {
          console.log(`Error loading image from ${availableSources.indexOf(src) + 1}/${availableSources.length} sources for article "${title}":`, error);
          // Continue to the next source
        }
      }
      
      // If no image was loaded, use the placeholder
      if (!imageLoaded && isMounted) {
        console.log(`Using placeholder image for article: ${title}`);
        setDisplayedImage(placeholderImage);
        setIsImageLoading(false);
      }
    };
    
    // Attempt to load the image
    setIsImageLoading(true);
    loadImage();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [id, title, availableSources, placeholderImage]);
  
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
