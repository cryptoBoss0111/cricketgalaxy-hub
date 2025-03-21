
import { FC, memo } from 'react';
import { cn } from '@/lib/utils';

interface HeroControlsProps {
  articles: any[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
}

const HeroControlsComponent: FC<HeroControlsProps> = ({
  articles,
  currentSlide,
  onSlideChange,
  isAnimating,
  setIsAnimating
}) => {
  const handleSlideChange = (idx: number) => {
    if (isAnimating || idx === currentSlide) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onSlideChange(idx);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 400);
  };

  return (
    <div className="flex justify-center mt-8 space-x-2 transition-opacity duration-300" style={{ opacity: isAnimating ? 0.5 : 1 }}>
      {articles.map((_, idx) => (
        <button
          key={idx}
          onClick={() => handleSlideChange(idx)}
          disabled={isAnimating}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-500",
            idx === currentSlide 
              ? "bg-cricket-accent w-6" 
              : "bg-white/30 hover:bg-white/50"
          )}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export const HeroControls = memo(HeroControlsComponent);
