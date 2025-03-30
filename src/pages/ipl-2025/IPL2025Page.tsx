
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ArticleCard from '@/components/article-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

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

      <Navbar />

      <div className="bg-gradient-to-r from-cricket-accent to-cricket-secondary py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">IPL 2025</h1>
          <p className="text-xl max-w-2xl mx-auto">
            The latest news, match reports, analysis and updates from the Indian Premier League 2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Match Highlight - Card Style */}
        <div className="mb-12 bg-white dark:bg-cricket-dark/80 shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="lg:flex">
            <div className="lg:w-1/2">
              <div className="aspect-w-16 aspect-h-9 relative h-full">
                <img 
                  src="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png" 
                  alt="Delhi Capitals vs Sunrisers Hyderabad" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="lg:w-1/2 p-6">
              <div className="flex items-center mb-4">
                <span className="bg-cricket-accent text-white text-xs font-bold px-3 py-1 rounded">MATCH REVIEW</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-4">March 30, 2025</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
                Today's IPL Banger – Delhi Capitals vs. Sunrisers Hyderabad
              </h2>
              <p className="text-lg md:text-xl font-medium mb-4">
                Visakhapatnam Vibes: DC Smashed It! Delhi Capitals rolled up against Sunrisers Hyderabad and owned the pitch with a cool 7-wicket win.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">
                Today's clash in Visakhapatnam was straight-up! Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and owned the pitch. Picture this: SRH batting first, and boom—Mitchell Starc comes in like a wrecking ball, sending Travis Head packing for the sixth time in top-tier cricket.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  By <span className="font-semibold">CricketExpress Team</span>
                </div>
                <Link to="/article/dc-vs-srh" className="inline-flex items-center text-cricket-accent hover:text-cricket-secondary font-medium">
                  Read full article
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 border-b-2 border-cricket-accent pb-2">Latest IPL 2025 Articles</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300 h-full">
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
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="text-xl text-red-500">Error loading articles</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later</p>
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
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-500">No articles available yet</h3>
            <p className="mt-2 text-gray-400">Check back soon for the latest IPL 2025 updates</p>
            
            {/* Demo Blog Cards when no articles from database */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300 h-full">
                  <div className="aspect-w-16 aspect-h-9 relative h-48">
                    <img 
                      src="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png" 
                      alt="IPL 2025 Match" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-cricket-accent text-white rounded">
                        IPL 2025
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-heading font-semibold leading-tight hover:text-cricket-accent dark:text-white dark:hover:text-cricket-accent">
                      {`IPL 2025 Match ${i+1}: Key Highlights and Analysis`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm my-2 line-clamp-2">
                      Check out the latest match analysis, player performances, and team strategies from the exciting IPL 2025 season.
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {`March ${20 + i}, 2025`}
                      </span>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        By CricketExpress Team
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default IPL2025Page;
