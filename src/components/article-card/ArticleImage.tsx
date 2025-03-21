
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticleImage } from './imageUtils';

interface ArticleImageProps {
  id: string | number;
  title: string;
  imageUrl?: string;
  cover_image?: string;
  featured_image?: string;
  category: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  cover_image,
  featured_image,
  category
}) => {
  const {
    imageSource,
    isLoading,
    imageError,
    handleImageLoad,
    handleImageError
  } = useArticleImage(title, featured_image, cover_image, imageUrl);

  // Use a reliable fallback image
  const FALLBACK_IMAGES = [
    '/placeholder.svg',
    'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop'
  ];
  
  const [fallbackIndex, setFallbackIndex] = useState(0);
  
  // Handle last resort fallback if even the placeholder fails
  const handleLastResortError = () => {
    if (fallbackIndex < FALLBACK_IMAGES.length - 1) {
      setFallbackIndex(fallbackIndex + 1);
    }
  };

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      {imageError ? (
        // Fallback image if original fails
        <img 
          src={FALLBACK_IMAGES[fallbackIndex]}
          alt={title}
          className="w-full h-48 object-cover"
          onError={handleLastResortError}
          loading="lazy"
        />
      ) : (
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
          referrerPolicy="no-referrer"
        />
      )}
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-cricket-accent text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
