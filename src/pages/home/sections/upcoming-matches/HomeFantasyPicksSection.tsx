
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
  picks: FantasyPickPreview[];
}

const HomeFantasyPicksSection: React.FC<HomeFantasyPicksSectionProps> = ({ picks }) => {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="text-cricket-accent h-6 w-6" />
        <h2 className="text-2xl font-heading font-bold">Fantasy Picks</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {picks.map((player, index) => (
          <div 
            key={player.id} 
            className={cn(
              "feature-card animate-fade-in", 
              index === 0 ? "animate-delay-100" : "",
              index === 1 ? "animate-delay-200" : "",
              index === 2 ? "animate-delay-300" : ""
            )}
          >
            <div className="flex items-center mb-4">
              <img 
                src={player.imageUrl} 
                alt={player.player}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-semibold text-lg">{player.player}</h3>
                <p className="text-gray-500 text-sm">{player.team}</p>
              </div>
            </div>
            
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium">{player.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Form:</span>
                <span className={cn(
                  "font-medium",
                  player.form === 'Excellent' ? "text-green-600" :
                  player.form === 'Good' ? "text-blue-600" : "text-yellow-600"
                )}>
                  {player.form}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-500 block mb-1">Recent Performance:</span>
                <span className="font-medium text-gray-700">{player.stats}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
          <Link to="/fantasy-tips">
            View Complete Fantasy Guide
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeFantasyPicksSection;
