
import { FC, memo } from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroArticle } from './types';

interface HeroContentProps {
  article: HeroArticle;
  isAnimating: boolean;
  getCategoryUrl: (category: string) => string;
}

const HeroContentComponent: FC<HeroContentProps> = ({ 
  article, 
  isAnimating,
  getCategoryUrl
}) => {
  return (
    <div className={cn(
      "transition-all duration-700 ease-in-out transform",
      isAnimating 
        ? "opacity-0 translate-y-8" 
        : "opacity-100 translate-y-0"
    )}>
      <div className="flex flex-wrap gap-2 mb-4 transition-all duration-500 delay-100">
        <Link to={`/${getCategoryUrl(article.category)}`}>
          <Badge className="bg-cricket-accent hover:bg-cricket-accent/90 transition-transform duration-300 hover:scale-105">
            {article.category}
          </Badge>
        </Link>
        
        {article.isFeaturedPick && (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1 transition-transform duration-300 hover:scale-105">
            <TrendingUp className="h-3 w-3" /> Fantasy Hot Pick
          </Badge>
        )}
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight transition-all duration-500 delay-150">
        {article.title}
      </h1>
      
      <p className="text-gray-300 text-lg mb-6 transition-all duration-500 delay-200">
        {article.excerpt}
      </p>
      
      <div className="flex items-center mb-8 transition-all duration-500 delay-300">
        <span className="text-sm text-gray-400">{article.date}</span>
        <span className="mx-3 text-gray-500">•</span>
        <Link to={`/article/${article.id}`} className="text-cricket-accent hover:underline flex items-center text-sm font-medium group">
          Read Full Story <ChevronRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-3 transition-all duration-500 delay-400">
        <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90 transition-transform duration-300 hover:scale-105">
          <Link to={`/article/${article.id}`}>
            Read More
          </Link>
        </Button>
        
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 transition-transform duration-300 hover:scale-105">
          <Link to={`/${getCategoryUrl(article.category)}`}>
            More {article.category} News
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const HeroContent = memo(HeroContentComponent);
