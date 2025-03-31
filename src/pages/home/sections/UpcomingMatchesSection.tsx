
import React from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';

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
  // Define only the first 3 upcoming matches
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
      time: '7:30 PM IST'
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
      venue: 'BRSABV Ekana Stadium, Lucknow',
      date: 'April 1, 2025',
      time: '7:30 PM IST'
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
      time: '7:30 PM IST'
    }
  ];

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
    </>
  );
};
