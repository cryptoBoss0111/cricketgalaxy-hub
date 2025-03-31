
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FantasyPickPreview {
  id: string;
  player: string;
  team: string;
  role: string;
  form: string;
  imageUrl: string;
  stats: string;
}

interface HomeFantasyPicksSectionProps {
  picks?: FantasyPickPreview[];
}

const HomeFantasyPicksSection: React.FC<HomeFantasyPicksSectionProps> = ({ picks = [] }) => {
  // Process image URL to ensure it's complete
  const processImageUrl = (url: string) => {
    if (!url) {
      return 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Return the URL as is
    return url;
  };
  
  // Get form color class
  const getFormColorClass = (form: string) => {
    switch(form.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'average':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="text-cricket-accent h-6 w-6" />
          <h2 className="text-2xl font-heading font-bold">Fantasy Picks</h2>
        </div>
        
        <div className="bg-cricket-accent/20 px-4 py-2 rounded-full text-cricket-accent font-medium text-sm">
          MI vs KKR
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {picks.map((player, index) => (
          <div 
            key={player.id} 
            className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition-300"
          >
            <div className="flex items-center mb-4">
              <img 
                src={processImageUrl(player.imageUrl)} 
                alt={player.player}
                className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
                }}
                crossOrigin="anonymous"
              />
              <div>
                <h3 className="font-semibold text-lg">{player.player}</h3>
                <p className="text-gray-500 text-sm">{player.team}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium">{player.role}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Form:</span>
                <span className={cn("font-medium", getFormColorClass(player.form))}>
                  {player.form}
                </span>
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="text-gray-500 mb-1">Recent Performance:</div>
                <div className="font-medium">{player.stats}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="accent" asChild>
          <Link to="/fantasy-tips">
            View Complete Fantasy Guide
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeFantasyPicksSection;
