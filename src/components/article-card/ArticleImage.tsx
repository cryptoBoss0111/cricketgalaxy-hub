
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleImageProps {
  id: string | number;
  title: string;
  imageUrl?: string;
  cover_image?: string;
  featured_image?: string;
  category: string;
}

// Reliable fallback images (local or CDN)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop'
];

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  cover_image,
  featured_image,
  category
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  
  // Use a random fallback image for consistency
  const fallbackImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  
  // Handle successful image load
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle image load error - use fallback
  const handleImageError = () => {
    setImageSrc(fallbackImage);
    setIsLoading(false);
    setHasError(true);
  };

  // Set initial image source when component mounts
  React.useEffect(() => {
    const source = featured_image || cover_image || imageUrl || fallbackImage;
    setImageSrc(source);
  }, [featured_image, cover_image, imageUrl, fallbackImage]);

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={imageSrc}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-500 hover:scale-110",
          isLoading ? "opacity-0" : "opacity-100"
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
  );
};
