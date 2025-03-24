
import { useState, useEffect } from 'react';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Chatbot from '@/components/Chatbot';
import { TopStoriesSection } from './sections/TopStoriesSection';
import { UpcomingMatchesSection } from './sections/UpcomingMatchesSection';
import { TrendingPlayersSection } from './sections/TrendingPlayersSection';
import { QuickStatsSection } from './sections/QuickStatsSection';
import { FanPollSection } from './sections/FanPollSection';
import FantasyPicksSection from '@/components/FantasyPicksSection';
import { useTheme } from '@/components/ThemeProvider';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-cricket-accent text-sm font-medium mb-1 animate-bounce-subtle">
            Namaste 🙏🏻
          </div>
          <h1 className="text-3xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent mb-6 animate-pulse">
            CricketExpress
          </h1>
          <div className="space-y-2">
            <div className="h-2 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="h-2 w-60 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <LiveMatchesBar />
      <Navbar />
      <main>
        <HeroSection />
        
        <TopStoriesSection />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <UpcomingMatchesSection />
                <TrendingPlayersSection />
              </div>
              
              <div className="space-y-10">
                <QuickStatsSection />
                <FanPollSection />
              </div>
            </div>
          </div>
        </section>
        
        <FantasyPicksSection />
        
        <Footer />
      </main>
      <Chatbot />
    </div>
  );
};

export default HomePage;
