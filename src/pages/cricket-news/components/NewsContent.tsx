import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '../types';
import { Skeleton } from '@/components/ui/skeleton';

const NewsContent = ({ articles, isLoading }: { articles: Article[], isLoading: boolean }) => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
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
        )}
      </div>
    </div>
  );
};

export default NewsContent;
