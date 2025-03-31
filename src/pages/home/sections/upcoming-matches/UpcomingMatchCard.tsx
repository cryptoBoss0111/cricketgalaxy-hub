
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
  
  // Use team flag URLs directly
  const team1FlagUrl = match.team1.flagUrl;
  const team2FlagUrl = match.team2.flagUrl;
  
  // Preload images for better performance
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    
    img1.src = team1FlagUrl;
    img1.onload = () => setTeam1ImageLoaded(true);
    img1.onerror = () => setTeam1ImageError(true);
    
    img2.src = team2FlagUrl;
    img2.onload = () => setTeam2ImageLoaded(true);
    img2.onerror = () => setTeam2ImageError(true);
    
    return () => {
      img1.onload = null;
      img1.onerror = null;
      img2.onload = null;
      img2.onerror = null;
    };
  }, [team1FlagUrl, team2FlagUrl]);
  
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
              src={team1FlagUrl} 
              alt={`${match.team1.name} logo`}
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
              src={team2FlagUrl} 
              alt={`${match.team2.name} logo`}
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
