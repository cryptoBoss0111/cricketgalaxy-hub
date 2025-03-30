
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ArticleCard from '@/components/article-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  featured_image: string;
  published_at: string;
  author?: string;
  category: string;
}

const IPL2025Page = () => {
  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ['ipl2025Articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'IPL 2025')
        .order('published_at', { ascending: false })
        .limit(12); // Limit to 12 articles initially for better performance

      if (error) throw error;
      return data as Article[] || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return (
    <>
      <Helmet>
        <title>IPL 2025 - Latest News, Updates & Analysis | CricketExpress</title>
        <meta 
          name="description" 
          content="Get the latest IPL 2025 news, match reports, team updates, player performances and expert analysis. Stay updated with everything happening in Indian Premier League 2025." 
        />
      </Helmet>

      <div className="bg-gradient-to-r from-cricket-accent to-cricket-secondary py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">IPL 2025</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The latest news, match reports, analysis and updates from the Indian Premier League 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Latest IPL 2025 Articles</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-red-500">Error loading articles</h3>
            <p className="mt-2 text-gray-600">Please try again later</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.cover_image || article.featured_image}
                date={new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
                category="IPL 2025"
                author={article.author || 'CricketExpress Team'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-500">No articles available yet</h3>
            <p className="mt-2 text-gray-400">Check back soon for the latest IPL 2025 updates</p>
          </div>
        )}
      </div>
    </>
  );
};

export default IPL2025Page;
