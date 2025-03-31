
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl, getRandomIplImage } from '@/utils/imageUtils';

interface ArticleImageProps {
  id: string | number;
  title: string;
  imageUrl?: string;
  category: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  category
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Get optimized image URL using our improved utility
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl || '');

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  // Handle image load error with better fallback mechanism
  const handleImageError = () => {
    console.error(`Failed to load image for: ${title}`);
    setError(true);
    setIsLoading(false);
  };

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video bg-gray-900">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover bg-gray-800 animate-pulse" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={error ? getRandomIplImage() : optimizedImageUrl}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-300 hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager"
        width={640}
        height={360}
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
