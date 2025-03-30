
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

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
        
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src="/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png" 
                alt="Delhi Capitals vs Sunrisers Hyderabad" 
                className="w-full h-[300px] object-cover" 
              />
              <div className="absolute top-3 left-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-cricket-accent text-white rounded">
                  IPL 2025
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold font-heading mb-3 hover:text-cricket-accent dark:text-white dark:hover:text-cricket-accent">
                Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground.
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  March 30, 2025
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    By CricketExpress Team
                  </span>
                  <Link 
                    to="/article/dc-vs-srh" 
                    className="inline-flex items-center ml-6 text-cricket-accent hover:text-cricket-secondary font-medium"
                  >
                    Read full article
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default IPL2025Page;
