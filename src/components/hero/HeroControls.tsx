
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface HeroControlsProps {
  articles: any[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
}

export const HeroControls: FC<HeroControlsProps> = ({
  articles,
  currentSlide,
  onSlideChange,
  isAnimating,
  setIsAnimating
}) => {
  const handleSlideChange = (idx: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      onSlideChange(idx);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {articles.map((_, idx) => (
        <button
          key={idx}
          onClick={() => handleSlideChange(idx)}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
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
