
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
            id: "rs-sharma-home",
            player: "Rohit Sharma",
            team: "Mumbai Indians",
            role: "Batsman",
            form: "Average",
            imageUrl: "/lovable-uploads/7dbad874-c8be-4912-a6b8-876c69ddd3f2.png",
            stats: "34(28), 21(19), 45(30)"
          },
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
            id: "hp-pandya-home",
            player: "Hardik Pandya",
            team: "Mumbai Indians",
            role: "All-Rounder",
            form: "Average",
            imageUrl: "/lovable-uploads/cdd2468f-c245-4e98-b13a-bb4fecb899e6.png",
            stats: "23(15), 1/32, 31(22), 0/29"
          },
          {
            id: "sn-narine-home",
            player: "Sunil Narine",
            team: "Kolkata Knight Riders",
            role: "All-Rounder",
            form: "Good",
            imageUrl: "/lovable-uploads/1e95e00e-b311-4ab0-89d3-cb051ab0e846.png",
            stats: "28(14), 2/24, 19(11), 1/32"
          }
        ]} />
        
        <Footer />
      </main>
      <Chatbot />
    </div>
  );
};

export default HomePage;
