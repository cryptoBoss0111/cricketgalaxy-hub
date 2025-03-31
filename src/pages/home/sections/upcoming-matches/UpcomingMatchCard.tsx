
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock } from 'lucide-react';

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
    <Card className="hover:shadow-md transition-all duration-300 animate-fade-in border">
      <CardContent className="p-0">
        {/* Header with match type and date */}
        <div className="flex items-center justify-between p-4 border-b">
          <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            {match.matchType}
          </Badge>
          <span className="text-sm text-gray-500 font-medium">{match.date}</span>
        </div>
        
        {/* Teams Section */}
        <div className="flex justify-between items-center p-6">
          {/* Team 1 */}
          <div className="flex flex-col items-center">
            {!team1ImageLoaded && (
              <Skeleton className={cn(
                "w-20 h-20 rounded-full mb-2",
                getTeamBgColor(match.team1.shortName)
              )} />
            )}
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-2",
              getTeamBgColor(match.team1.shortName),
              team1ImageLoaded ? "opacity-100" : "opacity-0"
            )}>
              <img 
                src={match.team1.flagUrl} 
                alt={`${match.team1.name} logo`}
                className="w-16 h-16 object-contain"
                onLoad={() => setTeam1ImageLoaded(true)}
                width={64}
                height={64}
              />
            </div>
            <span className="font-bold text-lg text-center">{match.team1.shortName}</span>
            <span className="text-xs text-gray-500">{match.team1.name}</span>
          </div>
          
          {/* VS */}
          <div className="flex flex-col items-center px-4 py-2">
            <span className="text-lg font-semibold text-gray-700 mb-2">VS</span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
          </div>
          
          {/* Team 2 */}
          <div className="flex flex-col items-center">
            {!team2ImageLoaded && (
              <Skeleton className={cn(
                "w-20 h-20 rounded-full mb-2",
                getTeamBgColor(match.team2.shortName)
              )} />
            )}
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-2",
              getTeamBgColor(match.team2.shortName),
              team2ImageLoaded ? "opacity-100" : "opacity-0"
            )}>
              <img 
                src={match.team2.flagUrl} 
                alt={`${match.team2.name} logo`}
                className="w-16 h-16 object-contain"
                onLoad={() => setTeam2ImageLoaded(true)}
                width={64}
                height={64}
              />
            </div>
            <span className="font-bold text-lg text-center">{match.team2.shortName}</span>
            <span className="text-xs text-gray-500">{match.team2.name}</span>
          </div>
        </div>
        
        {/* Match Details */}
        {match.details && (
          <div className="px-6 py-3 text-center text-gray-600 border-t">
            <p>{match.details}</p>
          </div>
        )}
        
        {/* Footer with venue and time */}
        <div className="bg-gray-50 p-4 text-sm text-gray-600 rounded-b-lg border-t">
          <div className="flex items-start mb-2">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
            <span className="line-clamp-2">{match.venue}</span>
          </div>
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
            <span>{match.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMatchCard;
