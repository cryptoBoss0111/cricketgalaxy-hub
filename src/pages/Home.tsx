import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, TrendingUp, ChevronRight, Calendar, Users, Trophy, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ArticleCard from '@/components/ArticleCard';
import Chatbot from '@/components/Chatbot';
import FantasyPicksSection from '@/components/FantasyPicksSection';
import { cn } from '@/lib/utils';

const topStories = [
  {
    id: '1',
    title: 'India\'s white-ball wizards need a new cheat code for sustained excellence',
    excerpt: 'After the T20 World Cup triumph, the team faces new challenges in maintaining their dominance',
    imageUrl: 'https://images.unsplash.com/photo-1624526267942-ab0c6b5b8b46?q=80&w=600&auto=format&fit=crop',
    category: 'Analysis',
    author: 'Vishal Dikshit',
    date: 'Mar 19, 2025',
    timeToRead: '5 min read'
  },
  {
    id: '2',
    title: 'IPL: SKY to lead MI in opener with Hardik suspended',
    excerpt: 'Suryakumar Yadav will captain Mumbai Indians in their opening match of IPL 2025',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Vishal Dikshit',
    date: 'Mar 19, 2025',
    timeToRead: '3 min read'
  },
  {
    id: '3',
    title: 'Tension between Khawaja and Queensland ahead of Shield final',
    excerpt: 'Star batsman at odds with state team ahead of crucial domestic fixture',
    imageUrl: 'https://images.unsplash.com/photo-1565728744382-61accd4aa148?q=80&w=600&auto=format&fit=crop',
    category: 'Domestic',
    author: 'Alex Malcolm',
    date: 'Mar 18, 2025',
    timeToRead: '4 min read'
  },
  {
    id: '4',
    title: 'IPL 2025, a season soaked in soap-opera intrigue',
    excerpt: 'The upcoming IPL season promises more drama and unexpected twists',
    imageUrl: 'https://images.unsplash.com/photo-1624526267748-f5e889f8e122?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Alagappan Muthu',
    date: 'Mar 18, 2025',
    timeToRead: '6 min read'
  }
];

const editorsPicks = [
  {
    id: '5',
    title: 'The Greatest T20 Finals No. 6: CSK win again, but this one hits different',
    excerpt: 'A look back at Chennai Super Kings\' emotional victory in one of the most memorable IPL finals',
    imageUrl: 'https://images.unsplash.com/photo-1624721261764-3a2b8add41b9?q=80&w=600&auto=format&fit=crop',
    category: 'IPL History',
    author: 'Deivarayan Muthu',
    date: 'Mar 17, 2025',
    timeToRead: '7 min read'
  },
  {
    id: '6',
    title: 'Ask Steven: Does Shubman Gill currently have the highest career average in ODIs?',
    excerpt: 'Our stats expert answers your cricket questions about records and unusual occurrences',
    imageUrl: 'https://images.unsplash.com/photo-1624974358559-9d582e45e7ac?q=80&w=600&auto=format&fit=crop',
    category: 'Stats Analysis',
    author: 'Steven Lynch',
    date: 'Mar 16, 2025',
    timeToRead: '5 min read'
  },
  {
    id: '7',
    title: 'The Greatest T20 finals No. 7: The cliffhanger that shouldn\'t have been',
    excerpt: 'Revisiting one of the most dramatic T20 World Cup finals that went down to the last ball',
    imageUrl: 'https://images.unsplash.com/photo-1624885563458-8b9ddca17e37?q=80&w=600&auto=format&fit=crop',
    category: 'T20 World Cup',
    author: 'Alex Malcolm',
    date: 'Mar 15, 2025',
    timeToRead: '6 min read'
  }
];

const trendingPlayers = [
  { id: '1', name: 'Virat Kohli', imageUrl: 'https://images.unsplash.com/photo-1624970702036-44043bcb08f0?q=80&w=120&auto=format&fit=crop' },
  { id: '2', name: 'Vaibhav Suryavanshi', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=120&auto=format&fit=crop' },
  { id: '3', name: 'Rohit Sharma', imageUrl: 'https://images.unsplash.com/photo-1624970944033-fb910d6a2f72?q=80&w=120&auto=format&fit=crop' },
  { id: '4', name: 'MS Dhoni', imageUrl: 'https://images.unsplash.com/photo-1624970725512-8908ce544c99?q=80&w=120&auto=format&fit=crop' },
  { id: '5', name: 'Babar Azam', imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=120&auto=format&fit=crop' },
  { id: '6', name: 'Swastik Chikara', imageUrl: 'https://images.unsplash.com/photo-1578432014316-48b448d79d57?q=80&w=120&auto=format&fit=crop' }
];

const upcomingMatches = [
  {
    id: '1',
    team1: { name: 'India', shortName: 'IND', flagUrl: 'https://images.unsplash.com/photo-1527675005063-dd2e8f0e507b?q=80&w=60&auto=format&fit=crop' },
    team2: { name: 'Australia', shortName: 'AUS', flagUrl: 'https://images.unsplash.com/photo-1608023874495-3f19c37e2cd1?q=80&w=60&auto=format&fit=crop' },
    matchType: 'ODI',
    venue: 'Sydney Cricket Ground',
    date: 'Mar 25, 2025',
    time: '09:00 AM IST'
  },
  {
    id: '2',
    team1: { name: 'England', shortName: 'ENG', flagUrl: 'https://images.unsplash.com/photo-1589959864842-ba9ba575a429?q=80&w=60&auto=format&fit=crop' },
    team2: { name: 'West Indies', shortName: 'WI', flagUrl: 'https://images.unsplash.com/photo-1572207292573-47fc49c9d247?q=80&w=60&auto=format&fit=crop' },
    matchType: 'Test',
    venue: 'Lord\'s, London',
    date: 'Mar 27, 2025',
    time: '03:30 PM IST'
  },
  {
    id: '3',
    team1: { name: 'Chennai Super Kings', shortName: 'CSK', flagUrl: 'https://images.unsplash.com/photo-1624721243291-741a7244fe46?q=80&w=60&auto=format&fit=crop' },
    team2: { name: 'Mumbai Indians', shortName: 'MI', flagUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=60&auto=format&fit=crop' },
    matchType: 'IPL',
    venue: 'M.A. Chidambaram Stadium, Chennai',
    date: 'Apr 2, 2025',
    time: '07:30 PM IST'
  }
];

const fantasyPicks = [
  {
    id: '1',
    player: 'Rishabh Pant',
    team: 'Delhi Capitals',
    role: 'WK-Batsman',
    form: 'Excellent',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 68(42), 45(32), 72(39)'
  },
  {
    id: '2',
    player: 'Jasprit Bumrah',
    team: 'Mumbai Indians',
    role: 'Bowler',
    form: 'Good',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 3/24, 2/18, 4/29'
  },
  {
    id: '3',
    player: 'Shubman Gill',
    team: 'Gujarat Titans',
    role: 'Batsman',
    form: 'Excellent',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 92(58), 57(42), 104(63)'
  }
];

const quickStats = [
  { label: 'Most Runs (IPL 2024)', value: 'Virat Kohli', detail: '765 runs' },
  { label: 'Most Wickets (IPL 2024)', value: 'Jasprit Bumrah', detail: '27 wickets' },
  { label: 'Highest Score (Test 2024)', value: 'Joe Root', detail: '254 vs India' },
  { label: 'Fastest Century (T20I)', value: 'Nicholas Pooran', detail: '35 balls' }
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
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
    <>
      <LiveMatchesBar />
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Top Stories Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-cricket-accent h-6 w-6" />
                <h2 className="text-2xl md:text-3xl font-heading font-bold">Top Stories</h2>
              </div>
              <Link to="/cricket-news" className="flex items-center text-sm font-medium text-cricket-accent hover:underline">
                See All <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topStories.map((story, index) => (
                <ArticleCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  excerpt={story.excerpt}
                  imageUrl={story.imageUrl}
                  category={story.category}
                  author={story.author}
                  date={story.date}
                  timeToRead={story.timeToRead}
                  className={cn(
                    "animate-fade-in",
                    index === 0 ? "animate-delay-100" : "",
                    index === 1 ? "animate-delay-200" : "",
                    index === 2 ? "animate-delay-300" : "",
                    index === 3 ? "animate-delay-400" : ""
                  )}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Multi-section Area */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content - 2/3 width */}
              <div className="lg:col-span-2 space-y-10">
                {/* Upcoming Matches */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="text-cricket-accent h-6 w-6" />
                    <h2 className="text-2xl font-heading font-bold">Upcoming Matches</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingMatches.map((match, index) => (
                      <Card key={match.id} className={cn(
                        "hover:shadow-md transition-all duration-300 animate-fade-in",
                        index === 0 ? "animate-delay-100" : "",
                        index === 1 ? "animate-delay-200" : "",
                        index === 2 ? "animate-delay-300" : ""
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                              {match.matchType}
                            </Badge>
                            <span className="text-xs text-gray-500">{match.date}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <img 
                                src={match.team1.flagUrl} 
                                alt={match.team1.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="font-semibold">{match.team1.shortName}</span>
                            </div>
                            
                            <span className="text-sm text-gray-500">vs</span>
                            
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{match.team2.shortName}</span>
                              <img 
                                src={match.team2.flagUrl} 
                                alt={match.team2.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 flex flex-col space-y-1">
                            <div className="flex items-start">
                              <span className="mr-2">🏟️</span>
                              <span>{match.venue}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="mr-2">⏰</span>
                              <span>{match.time}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Fantasy Picks */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Trophy className="text-cricket-accent h-6 w-6" />
                    <h2 className="text-2xl font-heading font-bold">Fantasy Picks</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {fantasyPicks.map((player, index) => (
                      <div 
                        key={player.id} 
                        className={cn(
                          "feature-card animate-fade-in", 
                          index === 0 ? "animate-delay-100" : "",
                          index === 1 ? "animate-delay-200" : "",
                          index === 2 ? "animate-delay-300" : ""
                        )}
                      >
                        <div className="flex items-center mb-4">
                          <img 
                            src={player.imageUrl} 
                            alt={player.player}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{player.player}</h3>
                            <p className="text-gray-500 text-sm">{player.team}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Role:</span>
                            <span className="font-medium">{player.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Form:</span>
                            <span className={cn(
                              "font-medium",
                              player.form === 'Excellent' ? "text-green-600" :
                              player.form === 'Good' ? "text-blue-600" : "text-yellow-600"
                            )}>
                              {player.form}
                            </span>
                          </div>
                          <div className="border-t border-gray-100 pt-2 mt-2">
                            <span className="text-gray-500 block mb-1">Recent Performance:</span>
                            <span className="font-medium text-gray-700">{player.stats}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
                      <Link to="/fantasy-tips">
                        View Complete Fantasy Guide
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Trending Players */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <Users className="text-cricket-accent h-6 w-6" />
                    <h2 className="text-2xl font-heading font-bold">Trending Players</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {trendingPlayers.map((player, index) => (
                      <Link 
                        key={player.id} 
                        to={`/player-profiles/${player.id}`}
                        className={cn(
                          "flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in",
                          index % 6 === 0 ? "animate-delay-100" : "",
                          index % 6 === 1 ? "animate-delay-150" : "",
                          index % 6 === 2 ? "animate-delay-200" : "",
                          index % 6 === 3 ? "animate-delay-250" : "",
                          index % 6 === 4 ? "animate-delay-300" : "",
                          index % 6 === 5 ? "animate-delay-350" : ""
                        )}
                      >
                        <img 
                          src={player.imageUrl} 
                          alt={player.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-sm">{player.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Sidebar - 1/3 width */}
              <div className="space-y-10">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-6">
                    <BarChart2 className="text-cricket-accent h-6 w-6" />
                    <h2 className="text-xl font-heading font-bold">Quick Stats</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {quickStats.map((stat, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors animate-fade-in",
                          index === 0 ? "animate-delay-100" : "",
                          index === 1 ? "animate-delay-200" : "",
                          index === 2 ? "animate-delay-300" : "",
                          index === 3 ? "animate-delay-400" : ""
                        )}
                      >
                        <div className="text-gray-500 text-xs mb-1">{stat.label}</div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{stat.value}</span>
                          <span className="text-cricket-accent text-sm">{stat.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link 
                      to="/stats" 
                      className="text-cricket-accent hover:text-cricket-accent/80 text-sm font-medium flex items-center justify-center"
                    >
                      View All Statistics <ExternalLink size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
                
                {/* Poll Widget */}
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 animate-fade-in animate-delay-300">
                  <h2 className="text-xl font-heading font-bold mb-4">Fan Poll</h2>
                  <div className="mb-4">
                    <p className="font-medium">Who will win IPL 2025?</p>
                  </div>
                  
                  <div className="space-y-3">
                    {['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals'].map((team, i) => (
                      <div key={i} className="relative">
                        <div className="bg-gray-100 rounded-md h-10 overflow-hidden">
                          <div 
                            className="bg-cricket-accent h-full rounded-md"
                            style={{ width: `${[38, 32, 15, 15][i]}%` }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="font-medium text-sm">{team}</span>
                          <span className="font-medium text-sm">{[38, 32, 15, 15][i]}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button className="w-full bg-cricket-accent hover:bg-cricket-accent/90">
                      Cast Your Vote
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">12,845 votes so far</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Fantasy Picks Section */}





