
import { FC, memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getOptimizedImageUrl, getRandomIplImage } from '@/utils/imageUtils';

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
  
  // Get optimized image URL with our improved utility
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl);

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform",
      isAnimating 
        ? "opacity-0 translate-y-8 scale-95" 
        : "opacity-100 translate-y-0 scale-100"
    )}>
      {isLoading && (
        <Skeleton className="w-full h-80 md:h-96 bg-gray-800" />
      )}
      <img 
        src={hasError ? getRandomIplImage() : optimizedImageUrl}
        alt={title}
        className={cn(
          "w-full h-80 md:h-96 object-cover transition-transform duration-700 ease-in-out hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        loading="eager"
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Failed to load hero image:", imageUrl);
          setHasError(true);
          setIsLoading(false);
          // Use a random IPL image as fallback
          (e.target as HTMLImageElement).src = getRandomIplImage();
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
};

export const HeroImage = memo(HeroImageComponent);
