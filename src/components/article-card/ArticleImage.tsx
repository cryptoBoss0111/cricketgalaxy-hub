
import React, { useState, useEffect } from 'react';
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

// Working fallback images from Unsplash
const RELIABLE_FALLBACKS = [
  '/placeholder.svg',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
];

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  cover_image,
  featured_image,
  category
}) => {
  // Use a direct approach to image handling
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(-1); // Start with -1 to try actual images first

  // Setup all possible image sources in priority order
  const allPossibleSources = [
    featured_image,
    cover_image, 
    imageUrl,
    ...RELIABLE_FALLBACKS
  ].filter(Boolean) as string[];

  useEffect(() => {
    // Reset when props change
    setIsLoading(true);
    setFallbackIndex(-1);
    
    // Try the first real image
    if (allPossibleSources.length > 0) {
      console.log(`Setting initial image for "${title}" to:`, allPossibleSources[0]);
      setCurrentImage(allPossibleSources[0]);
    } else {
      // Fallback to placeholder if no sources at all
      console.log(`No image sources for "${title}", using default placeholder`);
      setCurrentImage('/placeholder.svg');
      setIsLoading(false);
    }
  }, [featured_image, cover_image, imageUrl, title]);

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${currentImage}`);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error(`❌ Image load failed: ${currentImage}`);
    
    // Calculate the next fallback index
    const nextIndex = fallbackIndex + 1;
    
    // Check if we have more fallbacks to try
    if (nextIndex < allPossibleSources.length) {
      console.log(`Trying next fallback: ${allPossibleSources[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setCurrentImage(allPossibleSources[nextIndex]);
    } else {
      // We've tried all possibilities, show the last fallback
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
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-cricket-accent text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
