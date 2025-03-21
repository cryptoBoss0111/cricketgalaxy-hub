
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronRight } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { topStories } from '../data/homeData';

// Update the topStories interface to include the missing properties
interface TopStory {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  cover_image?: string;
  featured_image?: string;
  category: string;
  author: string;
  date: string;
  timeToRead: string;
}

export const TopStoriesSection = () => {
  console.log('Top stories data:', topStories);
  
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
          {(topStories as TopStory[]).map((story, index) => {
            console.log(`Story ${index} image URLs:`, {
              imageUrl: story.imageUrl,
              coverImage: story.cover_image,
              featuredImage: story.featured_image
            });
            
            return (
              <ArticleCard
                key={story.id}
                id={story.id}
                title={story.title}
                excerpt={story.excerpt}
                imageUrl={story.imageUrl}
                cover_image={story.cover_image}
                featured_image={story.featured_image}
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
