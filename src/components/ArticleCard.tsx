
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
  // Define fallback image - using a reliable source
  const placeholderImage = 'https://placehold.co/600x400/cricket/white?text=Cricket+Express';
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  
  // Use effect to determine the best image to display with cross-origin support
  useEffect(() => {
    // Use all possible image sources
    const imageSources = [
      imageUrl, 
      featured_image, 
      cover_image
    ].filter(Boolean) as string[];
    
    if (imageSources.length === 0) {
      console.log(`No image sources available for article: ${title}`);
      setFinalImageUrl(placeholderImage);
      setIsImageLoading(false);
      return;
    }
    
    // Make the image URLs more reliable by using the placehold service as fallback
    const tryLoadImage = (currentIndex = 0) => {
      if (currentIndex >= imageSources.length) {
        // If all sources fail, use placeholder
        console.log(`Using placeholder image for article: ${title}`);
        setFinalImageUrl(placeholderImage);
        setIsImageLoading(false);
        return;
      }

      const img = new Image();
      const currentUrl = imageSources[currentIndex];
      
      img.crossOrigin = "anonymous"; // Add cross-origin support
      
      img.onload = () => {
        console.log(`Successfully loaded image for article: ${title} from ${currentUrl}`);
        setFinalImageUrl(currentUrl);
        setIsImageLoading(false);
        setImageError(false);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image at ${currentUrl} for article: ${title}`);
        // Try next image source
        tryLoadImage(currentIndex + 1);
      };
      
      // Set a timeout to handle very slow image loads
      const timeout = setTimeout(() => {
        if (img.complete === false) {
          console.log(`Image loading timeout for ${currentUrl}`);
          img.src = ''; // Cancel the current load
          tryLoadImage(currentIndex + 1);
        }
      }, 5000); // 5 second timeout
      
      img.src = currentUrl;
      
      // Clear timeout if image loads or errors out before timeout
      img.onload = () => {
        clearTimeout(timeout);
        console.log(`Successfully loaded image for article: ${title} from ${currentUrl}`);
        setFinalImageUrl(currentUrl);
        setIsImageLoading(false);
        setImageError(false);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error(`Failed to load image at ${currentUrl} for article: ${title}`);
        tryLoadImage(currentIndex + 1);
      };
    };
    
    // Start trying the images
    tryLoadImage();
    
    // Log available image URLs for debugging
    console.log(`Article ${id} - Image URLs:`, { 
      imageUrl, 
      cover_image, 
      featured_image, 
      availableSources: imageSources
    });
    
  }, [id, imageUrl, cover_image, featured_image, title, placeholderImage]);
  
  // Manual image load handling for visible image element
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  const handleImageError = () => {
    console.error(`Failed to load image for article: ${title}`);
    setFinalImageUrl(placeholderImage); // Set to placeholder immediately on error
    setIsImageLoading(false);
    setImageError(true);
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
          src={finalImageUrl || placeholderImage}
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
