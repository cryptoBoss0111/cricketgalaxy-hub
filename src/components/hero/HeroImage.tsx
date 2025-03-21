
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
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out transform",
      isAnimating 
        ? "opacity-0 translate-y-8 scale-95" 
        : "opacity-100 translate-y-0 scale-100"
    )}>
      <img 
        src={imageUrl}
        alt={title}
        className="w-full h-80 md:h-96 object-cover transition-transform duration-700 ease-in-out hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
};

export const HeroImage = memo(HeroImageComponent);
