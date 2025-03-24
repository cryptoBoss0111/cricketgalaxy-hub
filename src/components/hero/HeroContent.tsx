
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFreeWar } from '../free-war/FreeWarProvider';

interface HeroContentProps {
  title: string;
  subtitle: string;
  ctaLink: string;
  ctaText: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  ctaLink,
  ctaText,
}) => {
  const { showSelectionModal } = useFreeWar();
  
  return (
    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-white/80 mb-8">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="accent" size="lg" className="group">
          <a href={ctaLink}>
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="bg-white hover:bg-gray-100 text-cricket-accent border-cricket-accent"
          onClick={showSelectionModal}
        >
          Join Free War Contest
        </Button>
      </div>
    </div>
  );
};
