
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
  // Define fallback image
  const placeholderImage = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop';
  
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  
  // Use effect to determine the best image to display
  useEffect(() => {
    // Try all possible image sources in order of preference
    const imageSources = [imageUrl, cover_image, featured_image].filter(Boolean);
    
    if (imageSources.length === 0) {
      console.log(`No image sources available for article: ${title}`);
      setFinalImageUrl(placeholderImage);
      setIsImageLoading(false);
      return;
    }
    
    // Check if the first image is loadable
    const checkImage = (url: string, index: number) => {
      const img = new Image();
      
      img.onload = () => {
        console.log(`Successfully loaded image for article: ${title}`);
        setFinalImageUrl(url);
        setIsImageLoading(false);
        setImageError(false);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image at ${url} for article: ${title}`);
        
        // Try the next image if available
        if (index < imageSources.length - 1) {
          checkImage(imageSources[index + 1] as string, index + 1);
        } else {
          // If all images fail, use placeholder
          console.log(`Using placeholder image for article: ${title}`);
          setFinalImageUrl(placeholderImage);
          setIsImageLoading(false);
          setImageError(true);
        }
      };
      
      img.src = url;
    };
    
    // Start checking with the first available image
    checkImage(imageSources[0] as string, 0);
    
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
        
        {finalImageUrl && (
          <img 
            src={finalImageUrl}
            alt={title}
            className={cn(
              "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
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
