import React from 'react';
import { useEffect, useState } from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';
import HomeFantasyPicksSection from './upcoming-matches/HomeFantasyPicksSection';
import { fantasyPicks } from '../data/homeData';
import { getOptimizedImageUrl, preloadImage } from '@/utils/imageUtils';

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
  // Define upcoming matches based on the provided IPL 2025 schedule
  const upcomingMatches: UpcomingMatch[] = [
    {
      id: 'match-12',
      team1: {
        name: 'Mumbai Indians',
        shortName: 'MI',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/2a4ce6cf-adb0-4f0a-9c8a-3353432db175.png', 'MI')
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortName: 'KKR',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png', 'KKR')
      },
      matchType: 'IPL 2025',
      venue: 'Wankhede Stadium, Mumbai',
      date: 'March 31, 2025',
      time: '7:30 PM IST',
      details: 'This will be an exciting clash between two IPL heavyweights'
    },
    {
      id: 'match-13',
      team1: {
        name: 'Lucknow Super Giants',
        shortName: 'LSG',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png', 'LSG')
      },
      team2: {
        name: 'Punjab Kings',
        shortName: 'PBKS',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png', 'PBKS')
      },
      matchType: 'IPL 2025',
      venue: 'BRSABV Ekana Cricket Stadium, Lucknow',
      date: 'April 1, 2025',
      time: '7:30 PM IST',
      details: 'LSG will host PBKS in what promises to be a competitive encounter'
    },
    {
      id: 'match-14',
      team1: {
        name: 'Royal Challengers Bengaluru',
        shortName: 'RCB',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png', 'RCB')
      },
      team2: {
        name: 'Gujarat Titans',
        shortName: 'GT',
        flagUrl: getOptimizedImageUrl('/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png', 'GT')
      },
      matchType: 'IPL 2025',
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      date: 'April 2, 2025',
      time: '7:30 PM IST',
      details: 'RCB, playing at their home ground, will face GT'
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
