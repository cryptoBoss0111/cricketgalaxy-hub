
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type FantasyPick = {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: 'Excellent' | 'Good' | 'Average' | 'Poor';
  image_url: string;
  stats: string;
  points_prediction: number;
  match_details: string;
  selection_reason: string;
  created_at: string;
};

interface FantasyPickCardProps {
  pick: FantasyPick;
  index: number;
}

// Helper to get form color
const getFormColor = (form: string) => {
  switch (form) {
    case 'Excellent':
      return 'text-green-600';
    case 'Good':
      return 'text-blue-600';
    case 'Average':
      return 'text-yellow-600';
    case 'Poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const FantasyPickCard: React.FC<FantasyPickCardProps> = ({ pick, index }) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-t-4 relative animate-fade-in",
        index === 0 ? "border-t-yellow-500 animate-delay-100" : 
        index === 1 ? "border-t-blue-500 animate-delay-200" : 
        "border-t-green-500 animate-delay-300"
      )}
    >
      <Badge 
        className={cn(
          "absolute top-2 right-2 font-medium",
          index === 0 ? "bg-yellow-500" : 
          index === 1 ? "bg-blue-500" : 
          "bg-green-500"
        )}
      >
        {index === 0 ? "Top Pick" : index === 1 ? "Value Pick" : "Differential Pick"}
      </Badge>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={pick.image_url} 
            alt={pick.player_name}
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-lg">{pick.player_name}</h3>
            <p className="text-gray-500 text-sm">{pick.team} • {pick.role}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Form:</span>
            <span className={cn(
              "text-sm font-medium",
              getFormColor(pick.form)
            )}>
              {pick.form}
            </span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Predicted Points:</span>
            <span className="text-sm font-bold text-cricket-accent">{pick.points_prediction} pts</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Match:</span>
            <span className="text-sm">{pick.match_details}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
          <strong>Why Pick:</strong> {pick.selection_reason}
        </div>
      </CardContent>
    </Card>
  );
};

export default FantasyPickCard;
