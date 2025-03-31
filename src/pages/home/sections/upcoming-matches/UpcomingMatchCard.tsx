
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface TeamInfo {
  name: string;
  shortName: string;
  flagUrl?: string;
}

export interface UpcomingMatch {
  id: string;
  team1: TeamInfo;
  team2: TeamInfo;
  matchType: string;
  venue: string;
  date: string;
  time: string;
  details?: string;
}

interface UpcomingMatchCardProps {
  match: UpcomingMatch;
  index: number;
}

const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({ match, index }) => {
  // Get team background colors based on team shortname
  const getTeamBgColor = (shortName: string) => {
    switch(shortName) {
      case 'MI':
        return 'bg-blue-500';
      case 'KKR':
        return 'bg-purple-700';
      case 'RCB':
        return 'bg-red-600';
      case 'CSK':
        return 'bg-yellow-500';
      case 'GT':
        return 'bg-blue-600';
      case 'LSG':
        return 'bg-sky-600';
      case 'PBKS':
        return 'bg-red-500';
      case 'RR':
        return 'bg-pink-600';
      case 'DC':
        return 'bg-blue-400';
      case 'SRH':
        return 'bg-orange-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-cricket-dark border-gray-700">
      {/* Header with match type and date */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="text-sm font-medium text-gray-200">{match.matchType}</div>
        <div className="text-sm text-gray-300">{match.date}</div>
      </div>
      
      {/* Teams Section */}
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          {/* Team 1 */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mb-2",
              getTeamBgColor(match.team1.shortName)
            )}>
              <span className="text-white font-bold text-xl">{match.team1.shortName}</span>
            </div>
            <span className="text-xs text-gray-300 max-w-[70px] text-center truncate">{match.team1.name}</span>
          </div>
          
          {/* VS */}
          <div className="flex flex-col items-center px-2">
            <span className="text-lg font-semibold text-gray-300">VS</span>
            <div className="w-6 h-0.5 bg-gray-600 mt-1"></div>
          </div>
          
          {/* Team 2 */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center mb-2",
              getTeamBgColor(match.team2.shortName)
            )}>
              <span className="text-white font-bold text-xl">{match.team2.shortName}</span>
            </div>
            <span className="text-xs text-gray-300 max-w-[70px] text-center truncate">{match.team2.name}</span>
          </div>
        </div>
        
        {/* Time */}
        <div className="text-center my-3">
          <span className="text-sm font-medium text-gray-200">{match.time}</span>
        </div>
      </CardContent>
      
      {/* Footer with venue */}
      <div className="bg-gray-800 p-3 text-xs text-gray-300 border-t border-gray-700 flex items-center">
        <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
        <span className="line-clamp-1">{match.venue}</span>
      </div>
    </Card>
  );
};

export default UpcomingMatchCard;
