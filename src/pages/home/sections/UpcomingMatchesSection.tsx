
import React from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';
import HomeFantasyPicksSection from './upcoming-matches/HomeFantasyPicksSection';

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

  // Fantasy picks for today's match (MI vs KKR)
  const fantasyPicks = [
    {
      id: "pick-1",
      player: "Shubman Gill",
      team: "Gujarat Titans",
      role: "Batsman",
      form: "Excellent",
      imageUrl: "/public/lovable-uploads/3a3641a5-0c32-4ac8-8867-0a4cb144760d.png",
      stats: "92(58), 57(42), 104(63)"
    },
    {
      id: "pick-2",
      player: "Suryakumar Yadav",
      team: "Mumbai Indians",
      role: "Batsman",
      form: "Good",
      imageUrl: "",
      stats: "65(31), 43(29), 72(37)"
    },
    {
      id: "pick-3",
      player: "Andre Russell",
      team: "Kolkata Knight Riders",
      role: "All-Rounder",
      form: "Excellent",
      imageUrl: "",
      stats: "42(19), 2/26, 38(16), 3/31"
    },
    {
      id: "pick-4",
      player: "Trent Boult",
      team: "Mumbai Indians",
      role: "Bowler",
      form: "Good",
      imageUrl: "",
      stats: "3/27, 2/31, 1/26"
    }
  ];

  return (
    <>
      <UpcomingMatchesGrid matches={upcomingMatches} />
      <HomeFantasyPicksSection picks={fantasyPicks} />
    </>
  );
};
