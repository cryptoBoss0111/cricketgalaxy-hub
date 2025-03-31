
import React from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';
import HomeFantasyPicksSection from './upcoming-matches/HomeFantasyPicksSection';
import { fantasyPicks } from '../data/homeData';

// Define the upcoming matches data structure
interface TeamInfo {
  name: string;
  shortName: string;
  flagUrl?: string;
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
  // Define multiple upcoming matches
  const upcomingMatches: UpcomingMatch[] = [
    {
      id: 'match-12',
      team1: {
        name: 'Mumbai Indians',
        shortName: 'MI'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortName: 'KKR'
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
        shortName: 'LSG'
      },
      team2: {
        name: 'Punjab Kings',
        shortName: 'PBKS'
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
        shortName: 'RCB'
      },
      team2: {
        name: 'Gujarat Titans',
        shortName: 'GT'
      },
      matchType: 'IPL 2025',
      venue: 'M. Chinnaswamy Stadium, Bengaluru',
      date: 'April 2, 2025',
      time: '7:30 PM IST',
      details: 'RCB, playing at their home ground, will face GT'
    },
    {
      id: 'match-15',
      team1: {
        name: 'Rajasthan Royals',
        shortName: 'RR'
      },
      team2: {
        name: 'Delhi Capitals',
        shortName: 'DC'
      },
      matchType: 'IPL 2025',
      venue: 'Sawai Mansingh Stadium, Jaipur',
      date: 'April 3, 2025',
      time: '7:30 PM IST',
      details: 'RR will take on DC in Jaipur'
    }
  ];

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
      <HomeFantasyPicksSection picks={fantasyPicks} />
    </>
  );
};
