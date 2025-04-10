
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
  // Updated upcoming matches with latest schedule
  const upcomingMatches: UpcomingMatch[] = [
    {
      id: 'match-25',
      team1: {
        name: 'Chennai Super Kings',
        shortName: 'CSK'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortName: 'KKR'
      },
      matchType: 'IPL 2025',
      venue: 'MA Chidambaram Stadium, Chennai',
      date: 'April 11, 2025',
      time: '7:30 PM IST'
    },
    {
      id: 'match-26',
      team1: {
        name: 'Lucknow Super Giants',
        shortName: 'LSG'
      },
      team2: {
        name: 'Gujarat Titans',
        shortName: 'GT'
      },
      matchType: 'IPL 2025',
      venue: 'BRSABV Ekana Cricket Stadium, Lucknow',
      date: 'April 12, 2025',
      time: '7:30 PM IST'
    },
    {
      id: 'match-27',
      team1: {
        name: 'Sunrisers Hyderabad',
        shortName: 'SRH'
      },
      team2: {
        name: 'Punjab Kings',
        shortName: 'PBKS'
      },
      matchType: 'IPL 2025',
      venue: 'Rajiv Gandhi International Stadium, Hyderabad',
      date: 'April 13, 2025',
      time: '7:30 PM IST'
    }
  ];

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
    </>
  );
};
