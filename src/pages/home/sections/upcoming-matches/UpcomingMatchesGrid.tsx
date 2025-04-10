
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

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

interface UpcomingMatchesGridProps {
  matches: UpcomingMatch[];
}

// Function to get background color based on team name
const getTeamBgColor = (teamShortName: string): string => {
  switch (teamShortName) {
    case 'CSK':
      return 'bg-[#FEF7CD] text-yellow-700'; // Yellow background for CSK
    case 'MI':
      return 'bg-blue-100 text-blue-700'; // Blue background for MI
    case 'RCB':
      return 'bg-red-100 text-red-700'; // Red background for RCB
    case 'KKR':
      return 'bg-purple-100 text-purple-700'; // Purple background for KKR
    case 'GT':
      return 'bg-[#ea384c]/10 text-red-700'; // Red background for GT
    case 'LSG':
      return 'bg-blue-200 text-blue-800'; // Light blue for LSG
    case 'SRH':
      return 'bg-orange-100 text-orange-700'; // Orange background for SRH
    case 'PBKS':
      return 'bg-red-100 text-red-700'; // Red background for PBKS
    case 'RR':
      return 'bg-pink-100 text-pink-700'; // Pink background for RR
    case 'DC':
      return 'bg-blue-100 text-blue-700'; // Blue background for DC
    default:
      return 'bg-gray-100 text-gray-700'; // Default gray
  }
};

const TeamLogo: React.FC<{ teamShortName: string }> = ({ teamShortName }) => {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${getTeamBgColor(teamShortName)}`}>
      {teamShortName}
    </div>
  );
};

const UpcomingMatchesGrid: React.FC<UpcomingMatchesGridProps> = ({ matches }) => {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div 
          key={match.id}
          className="p-4 bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 text-xs font-medium bg-cricket-accent/20 text-cricket-accent rounded">
                  {match.matchType}
                </span>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {match.date}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <TeamLogo teamShortName={match.team1.shortName} />
                      <span className="font-medium dark:text-white ml-2">{match.team1.shortName}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-1">vs</div>
                    <div className="flex items-center mt-1">
                      <TeamLogo teamShortName={match.team2.shortName} />
                      <span className="font-medium dark:text-white ml-2">{match.team2.shortName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block text-center px-3">
                  <div className="text-lg font-medium dark:text-white">
                    {match.time}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 mr-1" />
                {match.venue}
              </div>
            </div>
            
            <div className="md:hidden text-center">
              <div className="text-lg font-medium dark:text-white">
                {match.time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatchesGrid;
