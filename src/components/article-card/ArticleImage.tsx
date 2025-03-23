import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState<number>(-1);
  
  // Process Supabase URLs if needed
  const processUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    
    // If URL is already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, construct the full Supabase URL
    return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
  };
  
  // Prioritized list of all possible image sources
  const imageSources = [
    processUrl(featured_image),
    processUrl(cover_image),
    processUrl(imageUrl),
    ...RELIABLE_FALLBACKS,
    '/placeholder.svg'
  ].filter(Boolean) as string[];

  // Try next image source in our prioritized list
  const tryNextSource = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < imageSources.length) {
      console.log(`Trying image source ${nextIndex}: ${imageSources[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setImageSrc(imageSources[nextIndex]);
    } else {
      // If all fail, use placeholder and stop loading state
      console.log('All image sources exhausted, using final placeholder');
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
    }
  };

  // Initialize with first image source
  useEffect(() => {
    setIsLoading(true);
    setFallbackIndex(-1);
    tryNextSource();
  }, [featured_image, cover_image, imageUrl]); // Reset when props change

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully: ${imageSrc}`);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error(`❌ Image load failed: ${imageSrc}`);
    tryNextSource();
  };

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
