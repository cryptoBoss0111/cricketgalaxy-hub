import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { topStories as fallbackTopStories } from '../data/homeData';

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
    const fetchTopStories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('top_stories')
          .select(`
            id,
            article_id,
            order_index,
            featured,
            articles:article_id (
              id,
              title,
              excerpt,
              cover_image,
              category,
              author_id,
              published_at,
              content
            )
          `)
          .order('order_index', { ascending: true })
          .limit(4);
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          console.log('No top stories found, using fallback data');
          setTopStories(fallbackTopStories as TopStory[]);
          return;
        }
        
        const formattedStories: TopStory[] = data.map((item) => {
          const article = item.articles as any;
          return {
            id: article.id,
            title: article.title,
            excerpt: article.excerpt || 'Read this exciting article...',
            imageUrl: article.cover_image || '',
            category: article.category,
            author: article.author_id ? `Author ${article.author_id.slice(0, 8)}` : 'CricketExpress Staff',
            date: new Date(article.published_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            timeToRead: `${Math.ceil((article.content?.length || 0) / 1000)} min read`
          };
        });
        
        setTopStories(formattedStories);
      } catch (error) {
        console.error('Error fetching top stories:', error);
        setTopStories(fallbackTopStories as TopStory[]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopStories();
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
