
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFreeWar } from '../free-war/FreeWarProvider';
import { HeroArticle } from './types';

interface HeroContentProps {
  article: HeroArticle;
  isAnimating: boolean;
  getCategoryUrl: (category: string) => string;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  article,
  isAnimating,
  getCategoryUrl,
}) => {
  const { showSelectionModal } = useFreeWar();
  
  return (
    <div className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 max-w-3xl transition-opacity duration-700 ${
      isAnimating ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="mb-3">
        <span className="inline-block bg-cricket-accent/90 text-white text-sm px-3 py-1 rounded-full">
          {article.category}
        </span>
        {article.isFeaturedPick && (
          <span className="inline-block bg-amber-400 text-amber-900 text-sm px-3 py-1 rounded-full ml-2">
            Featured Pick
          </span>
        )}
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
        {article.title}
      </h1>
      
      <p className="text-lg md:text-xl text-white/80 mb-8">
        {article.excerpt}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="accent" size="lg" className="group">
          <a href={`/article/${article.id}?category=${getCategoryUrl(article.category)}`}>
            Read Full Story
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
