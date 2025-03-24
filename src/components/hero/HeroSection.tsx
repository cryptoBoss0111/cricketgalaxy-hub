
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { HeroArticle } from './types';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';
import { HeroControls } from './HeroControls';
import { getCategoryUrl, fetchHeroSliderArticles } from './heroUtils';

export const HeroSection = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroArticles, setHeroArticles] = useState<HeroArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch hero slider articles from Supabase
  useEffect(() => {
    const fetchHeroArticles = async () => {
      try {
        setIsLoading(true);
        const articles = await fetchHeroSliderArticles();
        setHeroArticles(articles);
      } catch (error) {
        console.error('Error fetching hero slider articles:', error);
        toast({
          title: "Error loading hero slider",
          description: "Could not load the featured articles. Using sample data instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHeroArticles();
  }, [toast]);
  
  useEffect(() => {
    // Only start carousel if we have articles
    if (heroArticles.length === 0) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % heroArticles.length);
        setTimeout(() => {
          setIsAnimating(false);
        }, 150); // Slightly longer delay before removing animation state
      }, 700); // Keep transition timing consistent
    }, 10000); // Interval between slides
    
    return () => clearInterval(interval);
  }, [heroArticles.length]);
  
  // Show loading state or fallback if no articles
  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 to-cricket-dark text-white py-16 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-center items-center" style={{ minHeight: '400px' }}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-600 rounded mb-4"></div>
            <div className="h-6 w-64 bg-gray-600 rounded"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (heroArticles.length === 0) {
    return (
      <section className="relative bg-gradient-to-b from-gray-900 to-cricket-dark text-white py-16 overflow-hidden">
        <div className="container mx-auto px-4 flex justify-center items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-2">No Featured Stories</h2>
            <p className="text-gray-300">Check back later for the latest cricket news and updates</p>
          </div>
        </div>
      </section>
    );
  }
  
  const article = heroArticles[currentSlide];
  
  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-cricket-dark text-white py-16 overflow-hidden">
      {/* Background pattern with subtle animation */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-pulse-subtle" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <HeroContent 
              article={article} 
              isAnimating={isAnimating} 
              getCategoryUrl={getCategoryUrl}
            />
            
            <HeroImage 
              imageUrl={article.imageUrl} 
              title={article.title} 
              isAnimating={isAnimating}
            />
          </div>
          
          <HeroControls 
            articles={heroArticles}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
