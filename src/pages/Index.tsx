
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import { TopStoriesSection } from '@/pages/home/sections/TopStoriesSection';
import { TrendingPlayersSection } from '@/pages/home/sections/TrendingPlayersSection';
import { UpcomingMatchesSection } from '@/pages/home/sections/UpcomingMatchesSection';
import { QuickStatsSection } from '@/pages/home/sections/QuickStatsSection';
import FantasyPicksSection from '@/components/fantasy-picks/FantasyPicksSection';
import { FanPollSection } from '@/pages/home/sections/FanPollSection';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

const Index = () => {
  const { theme } = useTheme();
  
  // Effect to log articles data for debugging image issues
  useEffect(() => {
    console.log("Fetching articles from Supabase");
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "dark bg-cricket-dark" : "bg-gray-50"}`}>
      <LiveMatchesBar />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Column - 2/3 width */}
            <div className="md:col-span-2 space-y-12">
              <TopStoriesSection />
              <UpcomingMatchesSection />
              <FantasyPicksSection />
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
              <TrendingPlayersSection />
              <QuickStatsSection />
              <FanPollSection />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
