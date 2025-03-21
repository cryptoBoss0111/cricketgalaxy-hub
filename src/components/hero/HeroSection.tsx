
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getTopStories } from '@/integrations/supabase/client';
import { HeroArticle } from './types';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';
import { HeroControls } from './HeroControls';
import { getCategoryUrl, getMockHeroArticles } from './heroUtils';

export const HeroSection = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroArticles, setHeroArticles] = useState<HeroArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch top stories from Supabase
  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setIsLoading(true);
        const topStoriesData = await getTopStories();
        
        // Filter to get only featured stories and limit to 3
        const featuredStories = topStoriesData
          .filter(story => story.featured)
          .slice(0, 3)
          .map(story => ({
            id: story.article_id,
            title: story.articles.title,
            excerpt: story.articles.excerpt || 'Read this exciting story...',
            category: story.articles.category,
            // Fixed: Using featured_image since cover_image doesn't exist in the type
            imageUrl: story.articles.featured_image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop',
            date: new Date(story.articles.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            isFeaturedPick: Math.random() > 0.5 // Randomly mark some articles as featured picks
          }));
        
        // If no featured stories, use fallback data
        if (featuredStories.length === 0) {
          console.log('No top stories found, returning mock data');
          setHeroArticles(getMockHeroArticles());
        } else {
          setHeroArticles(featuredStories);
        }
      } catch (error) {
        console.error('Error fetching top stories:', error);
        // Toast notification for error
        toast({
          title: "Error fetching featured articles",
          description: "Could not load the featured articles. Using sample data instead.",
          variant: "destructive"
        });
        
        // Fallback to mock data in case of error
        setHeroArticles(getMockHeroArticles());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopStories();
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
        }, 100);
      }, 700);
    }, 10000); // Increased interval for better user experience
    
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
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
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
