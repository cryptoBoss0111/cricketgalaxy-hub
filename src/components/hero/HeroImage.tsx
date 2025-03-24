
import { FC, memo } from 'react';
import { cn } from '@/lib/utils';

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
  // Process the image URL if needed
  const processImageUrl = (url: string) => {
    if (!url) {
      return '/placeholder.svg';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a Supabase storage path
    if (url.startsWith('article_images/')) {
      return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
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
      <img 
        src={processImageUrl(imageUrl)}
        alt={title}
        className="w-full h-80 md:h-96 object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error("Failed to load hero image:", imageUrl);
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=600&auto=format&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
};

export const HeroImage = memo(HeroImageComponent);
