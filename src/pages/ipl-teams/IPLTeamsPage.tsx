
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo: string;
  captain: string;
  homeGround: string;
  championships: number;
}

const iplTeams: Team[] = [
  {
    id: 'csk',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    color: 'bg-yellow-500',
    logo: '/lovable-uploads/1e95e00e-b311-4ab0-89d3-cb051ab0e846.png',
    captain: 'MS Dhoni',
    homeGround: 'M. A. Chidambaram Stadium, Chennai',
    championships: 5
  },
  {
    id: 'mi',
    name: 'Mumbai Indians',
    shortName: 'MI',
    color: 'bg-blue-600',
    logo: '/lovable-uploads/8fddb4c1-d745-4902-ae9c-7a7e51dea885.png',
    captain: 'Hardik Pandya',
    homeGround: 'Wankhede Stadium, Mumbai',
    championships: 5
  },
  {
    id: 'rcb',
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    color: 'bg-red-600',
    logo: '/lovable-uploads/3a3641a5-0c32-4ac8-8867-0a4cb144760d.png',
    captain: 'Faf du Plessis',
    homeGround: 'M. Chinnaswamy Stadium, Bangalore',
    championships: 0
  },
  {
    id: 'dc',
    name: 'Delhi Capitals',
    shortName: 'DC',
    color: 'bg-blue-500',
    logo: '/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png',
    captain: 'Rishabh Pant',
    homeGround: 'Arun Jaitley Stadium, Delhi',
    championships: 0
  },
  {
    id: 'kkr',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    color: 'bg-purple-700',
    logo: '/lovable-uploads/5bb2ea7d-70ca-49f6-9f96-1002a5b7b550.png',
    captain: 'Shreyas Iyer',
    homeGround: 'Eden Gardens, Kolkata',
    championships: 3
  },
  {
    id: 'srh',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    color: 'bg-orange-500',
    logo: '/lovable-uploads/cc36f6fd-2f71-4dee-8313-6b2fa5cd7d21.png',
    captain: 'Pat Cummins',
    homeGround: 'Rajiv Gandhi Intl. Cricket Stadium, Hyderabad',
    championships: 1
  },
  {
    id: 'rr',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    color: 'bg-pink-600',
    logo: '/lovable-uploads/87f31ffe-3086-45ed-ae49-ccdcdaaf0347.png',
    captain: 'Sanju Samson',
    homeGround: 'Sawai Mansingh Stadium, Jaipur',
    championships: 1
  },
  {
    id: 'pbks',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    color: 'bg-red-500',
    logo: '/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png',
    captain: 'Shikhar Dhawan',
    homeGround: 'IS Bindra Stadium, Mohali',
    championships: 0
  },
  {
    id: 'gt',
    name: 'Gujarat Titans',
    shortName: 'GT',
    color: 'bg-blue-800',
    logo: '/lovable-uploads/143884fc-6b7b-4af4-b860-2122a3ebcd67.png',
    captain: 'Shubman Gill',
    homeGround: 'Narendra Modi Stadium, Ahmedabad',
    championships: 1
  },
  {
    id: 'lsg',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    color: 'bg-teal-500',
    logo: '/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png',
    captain: 'KL Rahul',
    homeGround: 'BRSABV Ekana Cricket Stadium, Lucknow',
    championships: 0
  }
];

const IPLTeamsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cricket-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-cricket-accent text-sm font-medium mb-1 animate-bounce-subtle">
            IPL Teams
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
        <title>IPL Teams 2025 - Indian Premier League Teams | CricketExpress</title>
        <meta 
          name="description" 
          content="Explore all IPL teams including Chennai Super Kings, Mumbai Indians, Royal Challengers Bangalore, and more. Get team information, achievements, and updates." 
        />
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-r from-cricket-accent to-cricket-secondary py-16 px-4 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">IPL Teams 2025</h1>
          <p className="text-xl max-w-2xl mx-auto">
            All about your favorite Indian Premier League cricket teams
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">All IPL Teams</h2>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-cricket-accent" />
            <span className="text-sm font-medium">{iplTeams.length} Teams</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {iplTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden transition-transform hover:scale-105 bg-cricket-dark border-gray-700 hover:shadow-lg">
              <CardContent className="p-0">
                <div className={`h-2 ${team.color}`}></div>
                <div className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{team.name}</h3>
                    <p className="text-sm text-gray-400">{team.shortName}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-400">Captain:</span> {team.captain}</p>
                    <p><span className="font-medium text-gray-400">Home Ground:</span> {team.homeGround}</p>
                    <p><span className="font-medium text-gray-400">Championships:</span> {team.championships}</p>
                  </div>
                  <button className="mt-4 w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors">
                    Team Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default IPLTeamsPage;
