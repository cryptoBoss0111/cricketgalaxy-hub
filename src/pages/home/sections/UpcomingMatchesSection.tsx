
import React from 'react';
import UpcomingMatchesGrid from './upcoming-matches/UpcomingMatchesGrid';
import { upcomingMatches } from '../data/homeData';

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
  return (
    <div className="bg-white dark:bg-cricket-dark/80 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-heading font-bold mb-4 dark:text-white">Upcoming Matches</h2>
        <UpcomingMatchesGrid matches={upcomingMatches} />
      </div>
    </div>
  );
};
