
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFeaturedMatch } from '@/components/fantasy-picks/hooks/useFeaturedMatch';

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

const HomeFantasyPicksSection: React.FC<HomeFantasyPicksSectionProps> = ({ picks: propPicks }) => {
  const { featuredMatch, filteredPicks, isLoading } = useFeaturedMatch();
  
  // Use the provided picks from props if available, otherwise use the ones from the useFeaturedMatch hook
  const displayPicks = propPicks || filteredPicks.map(pick => ({
    id: pick.id,
    player: pick.player_name,
    team: pick.team,
    role: pick.role,
    form: pick.form,
    imageUrl: pick.image_url || '',
    stats: pick.stats,
  }));
  
  // Process image URL to ensure it's complete
  const processImageUrl = (url: string) => {
    if (!url) {
      return 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Process Supabase storage URL
    if (url.startsWith('article_images/')) {
      return `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/${url}`;
    }
    
    return url;
  };
  
  if (isLoading || displayPicks.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="text-cricket-accent h-6 w-6" />
          <h2 className="text-2xl font-heading font-bold dark:text-white">Fantasy Picks</h2>
        </div>
        
        {featuredMatch && (
          <div className="bg-cricket-accent/20 px-4 py-2 rounded-full text-cricket-accent font-medium text-sm">
            {featuredMatch}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayPicks.slice(0, 4).map((player, index) => {
          const processedImageUrl = processImageUrl(player.imageUrl);
          
          return (
            <div 
              key={player.id} 
              className={cn(
                "feature-card animate-fade-in bg-white dark:bg-cricket-dark/80 dark:border-gray-800", 
                index === 0 ? "animate-delay-100" : "",
                index === 1 ? "animate-delay-200" : "",
                index === 2 ? "animate-delay-300" : "",
                index === 3 ? "animate-delay-400" : ""
              )}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={processedImageUrl} 
                  alt={player.player}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
                  }}
                  crossOrigin="anonymous"
                />
                <div>
                  <h3 className="font-semibold text-lg dark:text-white">{player.player}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{player.team}</p>
                </div>
              </div>
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Role:</span>
                  <span className="font-medium dark:text-white">{player.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Form:</span>
                  <span className={cn(
                    "font-medium",
                    player.form === 'Excellent' ? "text-green-600 dark:text-green-400" :
                    player.form === 'Good' ? "text-blue-600 dark:text-blue-400" : 
                    player.form === 'Average' ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  )}>
                    {player.form}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-gray-500 dark:text-gray-400 block mb-1">Recent Performance:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{player.stats}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
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
