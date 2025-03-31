
import React, { useEffect } from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';
import HomeFantasyPicksSection from './upcoming-matches/HomeFantasyPicksSection';
import { fantasyPicks } from '../data/homeData';
import { preloadImage } from '@/utils/imageUtils';

// Define the upcoming matches data structure
interface TeamInfo {
  name: string;
  shortName: string;
  flagUrl: string;
}

interface UpcomingMatch {
  id: string;
  team1: TeamInfo;
  team2: TeamInfo;
  matchType: string;
  venue: string;
  date: string;
  time: string;
  details?: string;
}

export const UpcomingMatchesSection: React.FC = () => {
  // Define only the first match - MI vs KKR on March 31
  const upcomingMatches: UpcomingMatch[] = [
    {
      id: 'match-12',
      team1: {
        name: 'Mumbai Indians',
        shortName: 'MI',
        flagUrl: '/lovable-uploads/65c4f6b7-ff25-4841-bce7-30bc76245b41.png'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortName: 'KKR',
        flagUrl: '/lovable-uploads/46dae9e8-7caf-4b10-b557-c735f3a51161.png'
      },
      matchType: 'IPL 2025',
      venue: 'Wankhede Stadium, Mumbai',
      date: 'March 31, 2025',
      time: '7:30 PM IST',
      details: 'This will be an exciting clash between two IPL heavyweights'
    }
  ];
  
  // Preload team logos for faster rendering
  useEffect(() => {
    const preloadLogos = async () => {
      const logoPromises = upcomingMatches.flatMap(match => [
        preloadImage(match.team1.flagUrl),
        preloadImage(match.team2.flagUrl)
      ]);
      
      await Promise.all(logoPromises);
    };
    
    preloadLogos();
  }, []);

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
      <HomeFantasyPicksSection picks={fantasyPicks} />
    </>
  );
};
