
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
                      {match.team1.flagUrl && (
                        <img 
                          src={match.team1.flagUrl} 
                          alt={match.team1.name} 
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                      )}
                      <span className="font-medium dark:text-white">{match.team1.shortName}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-1">vs</div>
                    <div className="flex items-center mt-1">
                      {match.team2.flagUrl && (
                        <img 
                          src={match.team2.flagUrl} 
                          alt={match.team2.name} 
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                      )}
                      <span className="font-medium dark:text-white">{match.team2.shortName}</span>
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
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" asChild>
                <Link to={`/match-details/${match.id}`}>
                  Match Details
                </Link>
              </Button>
              <Button size="sm" variant="default" asChild>
                <Link to={`/fantasy-tips/${match.id}`}>
                  Fantasy Tips
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatchesGrid;
