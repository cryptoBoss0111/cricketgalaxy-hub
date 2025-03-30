
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl, getImageProps } from '@/utils/imageUtils';

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
  
  // Get optimized image URL using our utility
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl || '');

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    console.error(`Failed to load image for: ${title}`);
  };

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video bg-gray-100">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={error ? "/placeholder.svg" : optimizedImageUrl}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-300 hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Load images immediately for better user experience
        fetchPriority="high" // Higher priority for article images
        width={640}
        height={360}
        decoding="async"
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
