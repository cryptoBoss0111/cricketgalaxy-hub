
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import ArticleCard from '@/components/article-card';

const IPL2025Page = () => {
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
        <h2 className="text-2xl font-bold mb-8 border-b-2 border-cricket-accent pb-2">Latest IPL 2025 Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First card */}
          <div className="col-span-1">
            <ArticleCard 
              id="dc-vs-srh"
              title="Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!"
              excerpt="Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground."
              imageUrl="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png"
              category="IPL 2025"
              author="CricketExpress Team"
              date="March 30, 2025"
            />
          </div>
          
          {/* Second card (duplicate for layout example) */}
          <div className="col-span-1">
            <ArticleCard 
              id="dc-vs-srh"
              title="Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!"
              excerpt="Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground."
              imageUrl="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png"
              category="IPL 2025"
              author="CricketExpress Team"
              date="March 30, 2025"
            />
          </div>
          
          {/* Third card (duplicate for layout example) */}
          <div className="col-span-1">
            <ArticleCard 
              id="dc-vs-srh"
              title="Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!"
              excerpt="Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground."
              imageUrl="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png"
              category="IPL 2025"
              author="CricketExpress Team"
              date="March 30, 2025"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default IPL2025Page;
