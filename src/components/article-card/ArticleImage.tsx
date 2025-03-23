
import React from 'react';
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
  // Use our custom hook for image handling
  const {
    imageSource,
    isLoading,
    imageError,
    handleImageLoad,
    handleImageError
  } = useArticleImage(title, featured_image, cover_image, imageUrl);

  return (
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
  );
};
