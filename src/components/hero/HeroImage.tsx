
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
  
  // Process the image URL if needed
  const processImageUrl = (url: string) => {
    if (!url) {
      return '/placeholder.svg';
    }
    
    // Use direct paths for our known uploaded images for better performance
    if (url.includes('19133248-8247-4e8c-8615-f3c5b00d9287')) {
      return "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png";
    }
    
    if (url.includes('412c16d3-2e56-4ea0-b086-deed0e90d189')) {
      return "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png";
    }
    
    if (url.includes('ba068302-d7ba-4cdd-9735-cc9aac148031')) {
      return "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png";
    }
    
    if (url.includes('8dca24c4-f648-4d13-b9d7-5227f02fc2ff')) {
      return "/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png";
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
