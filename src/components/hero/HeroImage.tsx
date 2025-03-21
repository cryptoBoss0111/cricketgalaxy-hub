
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface HeroImageProps {
  imageUrl: string;
  title: string;
  isAnimating: boolean;
}

export const HeroImage: FC<HeroImageProps> = ({ 
  imageUrl, 
  title,
  isAnimating
}) => {
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500",
      isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
    )}>
      <img 
        src={imageUrl}
        alt={title}
        className="w-full h-80 md:h-96 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
    </div>
  );
};
