
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  date: string;
}

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const heroArticles: HeroArticle[] = [
    {
      id: '1',
      title: 'India Dominates in Historic Cricket Series Win Against Australia',
      excerpt: 'Team India secures a remarkable series victory on Australian soil with stellar performances from both senior and emerging players.',
      category: 'Series',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop',
      date: 'Mar 15, 2025'
    },
    {
      id: '2',
      title: 'IPL 2025: Complete Guide to Teams, Players, and Key Matches',
      excerpt: 'Everything you need to know about the upcoming Indian Premier League season with analysis of all ten franchises.',
      category: 'IPL 2025',
      imageUrl: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=1200&auto=format&fit=crop',
      date: 'Mar 14, 2025'
    },
    {
      id: '3',
      title: 'Rising Stars: The Next Generation of Cricket Superstars',
      excerpt: 'Meet the talented young cricketers who are making waves internationally and are poised to become the next cricket legends.',
      category: 'Player Profiles',
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
      date: 'Mar 13, 2025'
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % heroArticles.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [heroArticles.length]);
  
  const article = heroArticles[currentSlide];
  
  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-cricket-dark text-white py-16 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className={cn(
              "transition-all duration-500",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              <Badge className="bg-cricket-accent hover:bg-cricket-accent/90 mb-4">
                {article.category}
              </Badge>
              
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
                  <Link to="/cricket-news">
                    Latest News
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className={cn(
              "relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}>
              <img 
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {heroArticles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentSlide(idx);
                    setIsAnimating(false);
                  }, 500);
                }}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
