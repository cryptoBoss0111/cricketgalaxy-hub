
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
  details?: string;
}

interface UpcomingMatchCardProps {
  match: UpcomingMatch;
  index: number;
}

const UpcomingMatchCard: React.FC<UpcomingMatchCardProps> = ({ match, index }) => {
  const [team1ImageLoaded, setTeam1ImageLoaded] = useState(false);
  const [team2ImageLoaded, setTeam2ImageLoaded] = useState(false);
  
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
            {!team1ImageLoaded && (
              <Skeleton className={cn(
                "w-10 h-10 rounded-full",
                getTeamBgColor(match.team1.shortName)
              )} />
            )}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              getTeamBgColor(match.team1.shortName),
              team1ImageLoaded ? "opacity-100" : "opacity-0"
            )}>
              <img 
                src={match.team1.flagUrl} 
                alt={`${match.team1.name} logo`}
                className="w-8 h-8 object-contain"
                onLoad={() => setTeam1ImageLoaded(true)}
                width={32}
                height={32}
              />
            </div>
            <span className="font-semibold">{match.team1.shortName}</span>
          </div>
          
          <span className="text-sm text-gray-500">vs</span>
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{match.team2.shortName}</span>
            {!team2ImageLoaded && (
              <Skeleton className={cn(
                "w-10 h-10 rounded-full",
                getTeamBgColor(match.team2.shortName)
              )} />
            )}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              getTeamBgColor(match.team2.shortName),
              team2ImageLoaded ? "opacity-100" : "opacity-0"
            )}>
              <img 
                src={match.team2.flagUrl} 
                alt={`${match.team2.name} logo`}
                className="w-8 h-8 object-contain"
                onLoad={() => setTeam2ImageLoaded(true)}
                width={32}
                height={32}
              />
            </div>
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
