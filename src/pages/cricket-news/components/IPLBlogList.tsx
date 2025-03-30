
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/article-card';
import { Article } from '../types';

interface IPLBlogListProps {
  articles: Article[];
}

const IPLBlogList: React.FC<IPLBlogListProps> = ({ articles }) => {
  // Filter for only IPL 2025 articles
  const iplArticles = articles.filter(article => article.category === 'IPL 2025');
  
  return (
    <section className="py-12 bg-gray-50 dark:bg-cricket-dark">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-3 dark:text-white">IPL 2025 Coverage</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Catch up with all the latest matches, player performances, and drama from the 2025 Indian Premier League season.
          </p>
        </div>
        
        {iplArticles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No IPL articles found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Check back soon for our upcoming IPL coverage</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {iplArticles.slice(0, 3).map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  author={article.author}
                  date={article.date}
                  timeToRead={article.timeToRead}
                  className="h-full"
                />
              ))}
            </div>
            
            {iplArticles.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {iplArticles.slice(3, 5).map((article) => (
                  <div key={article.id} className="flex items-center gap-4 p-4 bg-white dark:bg-cricket-dark/80 rounded-lg shadow-sm">
                    <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
                      <img 
                        src={article.imageUrl || '/placeholder.svg'} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <span className="text-xs text-cricket-accent">{article.category}</span>
                      <Link to={`/article/${article.id}`}>
                        <h4 className="font-bold text-md leading-tight mb-1 hover:text-cricket-accent transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                      <div className="flex text-xs text-gray-500 gap-2">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.timeToRead}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link to="/ipl-2025">View All IPL 2025 Coverage</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default IPLBlogList;
