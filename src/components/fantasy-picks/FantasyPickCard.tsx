
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
      return 'text-green-600 dark:text-green-400';
    case 'Good':
      return 'text-blue-600 dark:text-blue-400';
    case 'Average':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'Poor':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Helper to process image URL
const processImageUrl = (url: string) => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Process Supabase storage URL
  return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
};

const FantasyPickCard: React.FC<FantasyPickCardProps> = ({ pick, index }) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-t-4 relative animate-fade-in dark:bg-cricket-dark/80 dark:border-gray-800 dark:border-t-4",
        index === 0 ? "border-t-yellow-500 animate-delay-100" : 
        index === 1 ? "border-t-blue-500 animate-delay-200" : 
        index === 2 ? "border-t-green-500 animate-delay-300" :
        "border-t-purple-500 animate-delay-400"
      )}
    >
      <Badge 
        className={cn(
          "absolute top-2 right-2 font-medium",
          index === 0 ? "bg-yellow-500" : 
          index === 1 ? "bg-blue-500" : 
          index === 2 ? "bg-green-500" :
          "bg-purple-500"
        )}
      >
        {index === 0 ? "Top Pick" : index === 1 ? "Value Pick" : index === 2 ? "Differential Pick" : "Budget Pick"}
      </Badge>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={processImageUrl(pick.image_url)} 
            alt={pick.player_name}
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-700"
            onError={(e) => {
              console.log("Image load error, using fallback");
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
            }}
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">{pick.player_name}</h3>
            <p className="text-gray-500 text-sm dark:text-gray-400">{pick.team} • {pick.role}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm dark:text-gray-400">Form:</span>
            <span className={cn(
              "text-sm font-medium",
              getFormColor(pick.form)
            )}>
              {pick.form}
            </span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm dark:text-gray-400">Predicted Points:</span>
            <span className="text-sm font-bold text-cricket-accent">{pick.points_prediction} pts</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm dark:text-gray-400">Recent Stats:</span>
            <span className="text-sm dark:text-gray-300">{pick.stats}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
          <strong>Why Pick:</strong> {pick.selection_reason}
        </div>
      </CardContent>
    </Card>
  );
};

export default FantasyPickCard;
