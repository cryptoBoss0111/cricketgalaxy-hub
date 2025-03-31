
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageProps } from '@/utils/imageUtils';

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
  
  // Force URLs to be static strings without any processing
  const team1ImageUrl = match.team1.shortName === 'MI' 
    ? '/lovable-uploads/ecc2d92f-2f5b-47a3-ae69-17dc0df384cd.png'
    : match.team1.flagUrl;
    
  const team2ImageUrl = match.team2.shortName === 'KKR'
    ? '/lovable-uploads/ce55e622-ee4f-4402-a770-0dc4c874de64.png'
    : match.team2.flagUrl;
  
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
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
            <img 
              src={team1ImageUrl} 
              alt={`${match.team1.name} logo`}
              className={cn(
                "w-8 h-8 rounded-full object-cover",
                team1ImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setTeam1ImageLoaded(true)}
              width={32}
              height={32}
            />
            <span className="font-semibold">{match.team1.shortName}</span>
          </div>
          
          <span className="text-sm text-gray-500">vs</span>
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{match.team2.shortName}</span>
            {!team2ImageLoaded && (
              <Skeleton className="w-8 h-8 rounded-full" />
            )}
            <img 
              src={team2ImageUrl} 
              alt={`${match.team2.name} logo`}
              className={cn(
                "w-8 h-8 rounded-full object-cover",
                team2ImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setTeam2ImageLoaded(true)}
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
