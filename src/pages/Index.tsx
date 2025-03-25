
import React, { useEffect, useState } from 'react';
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
  const { theme, setTheme } = useTheme();
  const [isGenzMode, setIsGenzMode] = useState(false);
  
  // Effect to log articles data for debugging image issues
  useEffect(() => {
    console.log("Fetching articles from Supabase");
  }, []);
  
  // Toggle Gen Z mode
  const toggleGenzMode = () => {
    setIsGenzMode(!isGenzMode);
    // Automatically set to dark mode when Gen Z is enabled
    if (!isGenzMode) {
      document.documentElement.classList.add('genz');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('genz');
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "dark bg-cricket-dark" : "bg-gray-50"}`}>
      {/* Gen Z Mode Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleGenzMode}
          className={`px-4 py-2 rounded-full ${isGenzMode 
            ? 'bg-neon-green text-genz-dark shadow-neon-green font-poppins font-bold animate-pulse-subtle' 
            : 'bg-gray-200 text-gray-800'} 
            transition-all duration-300`}
        >
          {isGenzMode ? "Vibin' 🔥" : "Gen Z Mode"}
        </button>
      </div>
      
      <LiveMatchesBar />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Gen Z Title */}
          {isGenzMode && (
            <div className="text-center mb-12">
              <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-3">
                Cricket <span className="text-neon-purple animate-text-glow">Go Brr</span> 🔥
              </h2>
              <p className="text-lg text-gray-300 font-medium">
                Catch the Vibe & Stay Updated, No Cap!
              </p>
            </div>
          )}
          
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
