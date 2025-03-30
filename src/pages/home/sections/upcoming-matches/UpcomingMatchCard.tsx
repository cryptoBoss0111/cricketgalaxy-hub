
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [team1ImageLoaded, setTeam1ImageLoaded] = useState(false);
  const [team2ImageLoaded, setTeam2ImageLoaded] = useState(false);
  const [team1ImageError, setTeam1ImageError] = useState(false);
  const [team2ImageError, setTeam2ImageError] = useState(false);
  
  return (
    <Card className={cn(
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
            {!team1ImageLoaded && !team1ImageError && (
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
            <img 
              src={match.team1.flagUrl} 
              alt={match.team1.name}
              className={cn(
                "w-8 h-8 rounded-full object-cover",
                team1ImageLoaded ? "opacity-100" : "opacity-0",
                team1ImageError ? "hidden" : "block"
              )}
              onLoad={() => setTeam1ImageLoaded(true)}
              onError={() => setTeam1ImageError(true)}
              loading="eager"
              decoding="async"
              width={32}
              height={32}
            />
            <span className="font-semibold">{match.team1.shortName}</span>
          </div>
          
          <span className="text-sm text-gray-500">vs</span>
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{match.team2.shortName}</span>
            {!team2ImageLoaded && !team2ImageError && (
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
            <img 
              src={match.team2.flagUrl} 
              alt={match.team2.name}
              className={cn(
                "w-8 h-8 rounded-full object-cover",
                team2ImageLoaded ? "opacity-100" : "opacity-0",
                team2ImageError ? "hidden" : "block"
              )}
              onLoad={() => setTeam2ImageLoaded(true)}
              onError={() => setTeam2ImageError(true)}
              loading="eager"
              decoding="async"
              width={32}
              height={32}
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
