
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
        name: 'Chennai Super Kings',
        shortName: 'CSK'
      },
      team2: {
        name: 'Royal Challengers Bangalore',
        shortName: 'RCB'
      },
      matchType: 'IPL 2025',
      venue: 'M.A. Chidambaram Stadium, Chennai',
      date: 'April 2, 2025',
      time: '7:30 PM IST'
    },
    {
      id: 'match-14',
      team1: {
        name: 'Delhi Capitals',
        shortName: 'DC'
      },
      team2: {
        name: 'Sunrisers Hyderabad',
        shortName: 'SRH'
      },
      matchType: 'IPL 2025',
      venue: 'Arun Jaitley Stadium, Delhi',
      date: 'April 4, 2025',
      time: '7:30 PM IST'
    }
  ];

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
      <HomeFantasyPicksSection picks={fantasyPicks} />
    </>
  );
};
