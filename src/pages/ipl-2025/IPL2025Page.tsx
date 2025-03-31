
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/article-card';
import { getRandomIplImage } from '@/utils/imageUtils';

const IPL2025Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Updated articles with reliable image sources
  const articles = [
    {
      id: "dc-vs-srh",
      title: "Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!",
      excerpt: "Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground.",
      imageUrl: "/lovable-uploads/7bfe4d81-c107-492c-aa9b-1a87d574aa20.png",
      category: "IPL 2025",
      author: "CricketExpress Team",
      date: "March 30, 2025"
    },
    {
      id: "mi-vs-kkr",
      title: "Tomorrow's IPL Double-Header: Mumbai Indians vs. Kolkata Knight Riders – Full Hype Breakdown!",
      excerpt: "Yo, cricket fam! It's March 30, 2025, 11:01 PM IST, and tomorrow—Monday, March 31, 2025—is about to hit us with an IPL 2025 banger! The schedule's locked in, and we've got Mumbai Indians (MI) vs. Kolkata Knight Riders (KKR) lighting up the Wankhede Stadium.",
      imageUrl: "/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png",
      category: "IPL 2025",
      author: "CricketExpress Team",
      date: "March 30, 2025"
    }
  ];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cricket-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-cricket-accent text-sm font-medium mb-1 animate-bounce-subtle">
            IPL 2025
          </div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent mb-6 animate-pulse">
            CricketExpress
          </h1>
          <div className="space-y-2">
            <div className="h-2 w-48 bg-gray-700 rounded animate-pulse mx-auto"></div>
            <div className="h-2 w-60 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold mb-8 border-b-2 border-blue-500 pb-2">Latest IPL 2025 Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="col-span-1">
              <ArticleCard 
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.imageUrl}
                category={article.category}
                author={article.author}
                date={article.date}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IPL2025Page;
