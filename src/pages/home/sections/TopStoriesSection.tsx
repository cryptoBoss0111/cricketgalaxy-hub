import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { mockNewsArticles } from '@/pages/cricket-news/data/mockNewsArticles';
import { getRandomIplImage } from '@/utils/imageUtils';

interface TopStory {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  timeToRead: string;
}

export const TopStoriesSection = () => {
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getSelectedArticles = () => {
      try {
        setIsLoading(true);
        
        const selectedArticles = [
          mockNewsArticles.find(article => article.id === 'gt-vs-mi'),
          mockNewsArticles.find(article => article.id === 'csk-vs-rcb'),
          mockNewsArticles.find(article => article.id === 'rr-vs-csk'),
          mockNewsArticles.find(article => article.id === 'kkr-vs-rcb')
        ].filter(Boolean);
        
        const formattedStories: TopStory[] = selectedArticles.map((article) => {
          if (!article) return null;
          
          return {
            id: article.id,
            title: article.title,
            excerpt: article.excerpt || 'Read this exciting article...',
            imageUrl: article.id === 'gt-vs-mi' 
              ? '/lovable-uploads/7bfe4d81-c107-492c-aa9b-1a87d574aa20.png' 
              : (article.imageUrl || getRandomIplImage()),
            category: article.category,
            author: article.author || 'CricketExpress Staff',
            date: article.date || new Date().toLocaleDateString(),
            timeToRead: article.timeToRead || '5 min read'
          };
        }).filter(Boolean) as TopStory[];
        
        console.log('Selected articles:', formattedStories);
        setTopStories(formattedStories);
      } catch (error) {
        console.error('Error preparing articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSelectedArticles();
  }, []);
  
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-cricket-dark/90">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-cricket-dark/50 rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-cricket-dark/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-cricket-accent h-6 w-6" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold dark:text-white">Top Stories</h2>
          </div>
          <Link to="/cricket-news" className="flex items-center text-sm font-medium text-cricket-accent hover:underline">
            See All <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topStories.map((story, index) => {
            console.log(`Story ${index} image URL:`, story.imageUrl);
            
            return (
              <ArticleCard
                key={story.id}
                id={story.id}
                title={story.title}
                excerpt={story.excerpt}
                imageUrl={story.imageUrl}
                category={story.category}
                author={story.author}
                date={story.date}
                timeToRead={story.timeToRead}
                className={cn(
                  "animate-fade-in",
                  index === 0 ? "animate-delay-100" : "",
                  index === 1 ? "animate-delay-200" : "",
                  index === 2 ? "animate-delay-300" : "",
                  index === 3 ? "animate-delay-400" : ""
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
