
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/hero/HeroSection';
import { TopStoriesSection } from '@/pages/home/sections/TopStoriesSection';
import { UpcomingMatchesSection } from '@/pages/home/sections/UpcomingMatchesSection';
import { QuickStatsSection } from '@/pages/home/sections/QuickStatsSection';
import { FanPollSection } from '@/pages/home/sections/FanPollSection';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';
import { useTheme } from '@/components/ThemeProvider';

const Index = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Loading screen with dark theme
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cricket-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-cricket-accent text-sm font-medium mb-1 animate-bounce-subtle">
            Namaste 🙏🏻
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
    <div className="min-h-screen flex flex-col dark bg-cricket-dark">
      <LiveMatchesBar />
      <Navbar />
      
      <main className="flex-grow pt-0">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Column - 2/3 width */}
            <div className="md:col-span-2 space-y-12">
              <TopStoriesSection />
              <UpcomingMatchesSection />
            </div>
            
            {/* Sidebar - 1/3 width */}
            <div className="space-y-8">
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
