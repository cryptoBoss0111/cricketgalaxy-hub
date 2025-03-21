
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
  
  // This effect runs once when component mounts and sets the image source
  useEffect(() => {
    // Log all received image URLs for debugging
    console.log(`ArticleCard for "${title}" received these image URLs:`, {
      featured_image,
      cover_image,
      imageUrl
    });
    
    // Check featured_image first (from admin panel)
    if (featured_image && featured_image.trim() !== '') {
      setImageSource(featured_image);
      console.log(`Using featured_image for "${title}": ${featured_image}`);
      return;
    }
    
    // Then try cover_image (from admin panel)
    if (cover_image && cover_image.trim() !== '') {
      setImageSource(cover_image);
      console.log(`Using cover_image for "${title}": ${cover_image}`);
      return;
    }
    
    // Then try imageUrl (legacy field)
    if (imageUrl && imageUrl.trim() !== '') {
      setImageSource(imageUrl);
      console.log(`Using imageUrl for "${title}": ${imageUrl}`);
      return;
    }
    
    // If no images provided, use placeholder
    console.log(`No valid images found for "${title}", using placeholder`);
    setImageSource(DEFAULT_PLACEHOLDER);
  }, [title, featured_image, cover_image, imageUrl]);
  
  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for "${title}": ${imageSource}`);
    setIsLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    console.error(`❌ Failed to load image for article "${title}": ${imageSource}`);
    
    // If the current image fails, try fallback images or use placeholder
    if (imageSource === featured_image && cover_image) {
      console.log(`Trying fallback to cover_image for "${title}"`);
      setImageSource(cover_image);
    } else if ((imageSource === featured_image || imageSource === cover_image) && imageUrl) {
      console.log(`Trying fallback to imageUrl for "${title}"`);
      setImageSource(imageUrl);
    } else if (imageSource !== DEFAULT_PLACEHOLDER) {
      console.log(`Using placeholder for "${title}" after all image attempts failed`);
      setImageSource(DEFAULT_PLACEHOLDER);
    }
    
    setIsLoading(false);
    setImageError(imageSource === DEFAULT_PLACEHOLDER);
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
