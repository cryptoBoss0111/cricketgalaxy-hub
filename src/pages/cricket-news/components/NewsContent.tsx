
import React from 'react';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface NewsContentProps {
  articles?: Article[];
  isLoading: boolean;
  selectedCategory?: string;
  setSelectedCategory?: React.Dispatch<React.SetStateAction<string>>;
  categories?: string[];
  sortBy?: string;
  setSortBy?: React.Dispatch<React.SetStateAction<string>>;
  filteredArticles?: Article[];
  searchQuery?: string;
}

const NewsContent = ({ 
  articles = [], 
  isLoading,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  sortBy,
  setSortBy,
  filteredArticles = [],
  searchQuery
}: NewsContentProps) => {
  // Use filteredArticles if provided, otherwise use articles
  const displayArticles = filteredArticles?.length > 0 ? filteredArticles : articles;

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
            {displayArticles.map((article) => (
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
