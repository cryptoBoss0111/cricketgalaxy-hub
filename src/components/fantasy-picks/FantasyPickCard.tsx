
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FantasyPick } from './hooks/useFantasyPicks';

interface FantasyPickCardProps {
  pick: FantasyPick;
  index: number;
}

// Helper to get form color
const getFormColor = (form: string): string => {
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

// Process image URL helper
const processImageUrl = (url: string): string => {
  if (!url) {
    return 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
  }
  
  // Fix URL path if needed
  if (url.startsWith('/lovable-uploads/')) {
    return url;
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return url;
};

// Get badge styles and text based on index
const getBadgeInfo = (index: number) => {
  switch (index) {
    case 0:
      return {
        color: "bg-yellow-500",
        text: "Top Pick",
        borderColor: "border-t-yellow-500"
      };
    case 1:
      return {
        color: "bg-blue-500",
        text: "Value Pick",
        borderColor: "border-t-blue-500"
      };
    case 2:
      return {
        color: "bg-green-500",
        text: "Differential Pick",
        borderColor: "border-t-green-500"
      };
    default:
      return {
        color: "bg-purple-500",
        text: "Budget Pick",
        borderColor: "border-t-purple-500"
      };
  }
};

const FantasyPickCard: React.FC<FantasyPickCardProps> = ({ pick, index }) => {
  const { color, text, borderColor } = getBadgeInfo(index);
  const imageUrl = processImageUrl(pick.image_url);
  const formColorClass = getFormColor(pick.form);
  
  // Animation delay based on index
  const animationDelay = `animate-delay-${(index + 1) * 100}`;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-sm hover:shadow-md border transition-all duration-300 dark:bg-cricket-dark/80 dark:border-gray-800",
        animationDelay
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={imageUrl} 
            alt={pick.player_name}
            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
            }}
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">{pick.player_name}</h3>
            <p className="text-gray-500 text-sm dark:text-gray-400">{pick.team}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm dark:text-gray-400">Role:</span>
            <span className="text-sm font-medium dark:text-white">{pick.role}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm dark:text-gray-400">Form:</span>
            <span className={cn(
              "text-sm font-medium",
              formColorClass
            )}>
              {pick.form}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
          <div className="font-medium mb-1">Recent Performance:</div>
          <div>{pick.stats}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FantasyPickCard;
