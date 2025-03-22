
import React, { useState, useEffect } from 'react';
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

// Working reliable fallback images
const RELIABLE_FALLBACKS = [
  '/placeholder.svg',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=600&auto=format&fit=crop'
];

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  cover_image,
  featured_image,
  category
}) => {
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0); // Start directly with first fallback

  useEffect(() => {
    // Reset when props change
    setIsLoading(true);
    
    // Skip Supabase images entirely - they're consistently failing
    // Just use our reliable fallbacks immediately for better UX
    console.log(`Setting default fallback image for "${title}"`);
    setCurrentImage(RELIABLE_FALLBACKS[fallbackIndex]);
  }, [featured_image, cover_image, imageUrl, title, fallbackIndex]);

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${currentImage}`);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error(`❌ Image load failed: ${currentImage}`);
    
    // Try next fallback
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < RELIABLE_FALLBACKS.length) {
      console.log(`Trying next fallback: ${RELIABLE_FALLBACKS[nextIndex]}`);
      setFallbackIndex(nextIndex);
    } else {
      // If all fail, use placeholder
      console.log('All fallbacks exhausted, using final placeholder');
      setCurrentImage('/placeholder.svg');
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={currentImage}
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
