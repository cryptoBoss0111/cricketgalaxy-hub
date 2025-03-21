
import { FC } from 'react';
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

export const HeroContent: FC<HeroContentProps> = ({ 
  article, 
  isAnimating,
  getCategoryUrl
}) => {
  return (
    <div className={cn(
      "transition-all duration-500",
      isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
    )}>
      <div className="flex flex-wrap gap-2 mb-4">
        <Link to={`/${getCategoryUrl(article.category)}`}>
          <Badge className="bg-cricket-accent hover:bg-cricket-accent/90">
            {article.category}
          </Badge>
        </Link>
        
        {article.isFeaturedPick && (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Fantasy Hot Pick
          </Badge>
        )}
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
        {article.title}
      </h1>
      
      <p className="text-gray-300 text-lg mb-6">
        {article.excerpt}
      </p>
      
      <div className="flex items-center mb-8">
        <span className="text-sm text-gray-400">{article.date}</span>
        <span className="mx-3 text-gray-500">•</span>
        <Link to={`/article/${article.id}`} className="text-cricket-accent hover:underline flex items-center text-sm font-medium">
          Read Full Story <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
          <Link to={`/article/${article.id}`}>
            Read More
          </Link>
        </Button>
        
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Link to={`/${getCategoryUrl(article.category)}`}>
            More {article.category} News
          </Link>
        </Button>
      </div>
    </div>
  );
};
