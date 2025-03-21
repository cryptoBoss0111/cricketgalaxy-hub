
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeamInfo {
  name: string;
  shortName: string;
  flagUrl: string;
}

export interface UpcomingMatch {
  id: string;
  team1: TeamInfo;
  team2: TeamInfo;
  matchType: string;
  venue: string;
  date: string;
  time: string;
}

interface UpcomingMatchCardProps {
  match: UpcomingMatch;
  index: number;
}

const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({ match, index }) => {
  return (
    <Card key={match.id} className={cn(
      "hover:shadow-md transition-all duration-300 animate-fade-in",
      index === 0 ? "animate-delay-100" : "",
      index === 1 ? "animate-delay-200" : "",
      index === 2 ? "animate-delay-300" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {match.matchType}
          </Badge>
          <span className="text-xs text-gray-500">{match.date}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img 
              src={match.team1.flagUrl} 
              alt={match.team1.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold">{match.team1.shortName}</span>
          </div>
          
          <span className="text-sm text-gray-500">vs</span>
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{match.team2.shortName}</span>
            <img 
              src={match.team2.flagUrl} 
              alt={match.team2.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex flex-col space-y-1">
          <div className="flex items-start">
            <span className="mr-2">🏟️</span>
            <span>{match.venue}</span>
          </div>
          <div className="flex items-start">
            <span className="mr-2">⏰</span>
            <span>{match.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchCard;
