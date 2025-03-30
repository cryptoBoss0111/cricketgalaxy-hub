
import { FC, memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroImageProps {
  imageUrl: string;
  title: string;
  isAnimating: boolean;
}

const HeroImageComponent: FC<HeroImageProps> = ({ 
  imageUrl, 
  title,
  isAnimating
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Process the image URL more efficiently
  const processImageUrl = (url: string) => {
    if (!url) {
      return '/placeholder.svg';
    }
    
    // Map of image IDs to local paths for better performance
    const imageMap: Record<string, string> = {
      '19133248-8247-4e8c-8615-f3c5b00d9287': "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png",
      '412c16d3-2e56-4ea0-b086-deed0e90d189': "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png",
      'ba068302-d7ba-4cdd-9735-cc9aac148031': "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png",
      '8dca24c4-f648-4d13-b9d7-5227f02fc2ff': "/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png",
      '6c575f57-57f9-4811-804e-0a850a01ef6d': "/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png",
      '95f7655d-a0d9-48a3-a64c-a8f362d04b31': "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png",
      'e61767b2-868d-47bc-8eb7-911d51239eb1': "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png"
    };
    
    // Check each key to see if it's in the URL
    for (const [id, path] of Object.entries(imageMap)) {
      if (url.includes(id)) {
        return path;
      }
    }
    
    return url;
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform",
      isAnimating 
        ? "opacity-0 translate-y-8 scale-95" 
        : "opacity-100 translate-y-0 scale-100"
    )}>
      {isLoading && (
        <Skeleton className="w-full h-80 md:h-96" />
      )}
      <img 
        src={processImageUrl(imageUrl)}
        alt={title}
        className={cn(
          "w-full h-80 md:h-96 object-cover transition-transform duration-700 ease-in-out hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading="eager" // Load hero images immediately
        fetchPriority="high" // Higher priority for hero images
        decoding="async" // Async decoding for better performance
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Failed to load hero image:", imageUrl);
          setHasError(true);
          setIsLoading(false);
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
};

export const HeroImage = memo(HeroImageComponent);
