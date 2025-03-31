
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
import HomeFantasyPicksSection from './sections/upcoming-matches/HomeFantasyPicksSection';
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
        
        <HomeFantasyPicksSection picks={[
          {
            id: "sk-yadav-home",
            player: "Suryakumar Yadav",
            team: "Mumbai Indians",
            role: "Batsman",
            form: "Excellent",
            imageUrl: "/lovable-uploads/611356be-0c40-46ec-9995-1e3b95eab3e4.png",
            stats: "65(31), 43(29), 72(37)"
          },
          {
            id: "ar-russell-home",
            player: "Andre Russell",
            team: "Kolkata Knight Riders",
            role: "All-Rounder",
            form: "Excellent",
            imageUrl: "/lovable-uploads/5f09742b-2608-4ef2-b57b-7cabaab57f6a.png",
            stats: "42(19), 2/26, 38(16), 3/31"
          },
          {
            id: "qdk-home",
            player: "Quinton de Kock",
            team: "Kolkata Knight Riders",
            role: "Wicketkeeper",
            form: "Excellent",
            imageUrl: "/lovable-uploads/50e4858d-9918-404c-b823-b3552013fd2b.png",
            stats: "97*, 45(32), 63(41)"
          },
          {
            id: "t-boult-home",
            player: "Trent Boult",
            team: "Mumbai Indians",
            role: "Bowler",
            form: "Good",
            imageUrl: "/lovable-uploads/df73abd6-8fc7-4ccd-8357-07d5db3d6520.png",
            stats: "3/27, 2/31, 1/26"
          }
        ]} />
        
        <Footer />
      </main>
      <Chatbot />
    </div>
  );
};

export default HomePage;
