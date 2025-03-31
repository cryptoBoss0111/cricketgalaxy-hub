
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
    
    if (url.startsWith('/')) {
      // Ensure local URLs are properly formatted
      return url;
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
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'average':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Add Suryakumar Yadav, Andre Russell, and Trent Boult as picks if not already in the list
  const ensurePlayersExist = () => {
    const allPicks = [...picks];
    
    const hasSuryakumar = picks.some(p => p.player === "Suryakumar Yadav");
    const hasRussell = picks.some(p => p.player === "Andre Russell");
    const hasBoult = picks.some(p => p.player === "Trent Boult");
    
    if (!hasSuryakumar) {
      allPicks.push({
        id: "sk-yadav-home",
        player: "Suryakumar Yadav",
        team: "Mumbai Indians",
        role: "Batsman",
        form: "Excellent",
        imageUrl: "/lovable-uploads/611356be-0c40-46ec-9995-1e3b95eab3e4.png", 
        stats: "65(31), 43(29), 72(37)"
      });
    }
    
    if (!hasRussell) {
      allPicks.push({
        id: "ar-russell-home",
        player: "Andre Russell",
        team: "Kolkata Knight Riders",
        role: "All-Rounder",
        form: "Excellent",
        imageUrl: "/lovable-uploads/5f09742b-2608-4ef2-b57b-7cabaab57f6a.png",
        stats: "42(19), 2/26, 38(16), 3/31"
      });
    }
    
    if (!hasBoult) {
      allPicks.push({
        id: "t-boult-home",
        player: "Trent Boult",
        team: "Mumbai Indians",
        role: "Bowler",
        form: "Good",
        imageUrl: "/lovable-uploads/df73abd6-8fc7-4ccd-8357-07d5db3d6520.png",
        stats: "3/27, 2/31, 1/26"
      });
    }
    
    return allPicks;
  };
  
  const picksToShow = ensurePlayersExist();

  console.log("Fantasy picks to render:", picksToShow); // Log all picks to help debug

  return (
    <div className="mb-8 py-8 bg-white dark:bg-cricket-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="text-cricket-accent h-6 w-6 dark:text-white" />
            <h2 className="text-2xl font-heading font-bold dark:text-white">Fantasy Picks</h2>
          </div>
          
          <div className="bg-cricket-accent/20 px-4 py-2 rounded-full text-cricket-accent font-medium text-sm dark:bg-cricket-accent/40 dark:text-white">
            MI vs KKR
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {picksToShow.map((player, index) => {
            console.log(`Rendering player ${index}:`, player); // Log each player
            const imageUrl = processImageUrl(player.imageUrl);
            console.log(`Processed image URL for ${player.player}:`, imageUrl); // Debug image URL
            
            return (
              <div 
                key={player.id} 
                className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition-300 dark:bg-cricket-dark dark:border-gray-700 dark:text-white"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={imageUrl} 
                    alt={player.player}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      console.log("Image failed to load:", imageUrl);
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{player.player}</h3>
                    <p className="text-gray-500 text-sm dark:text-gray-400">{player.team}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="font-medium dark:text-white">{player.role}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Form:</span>
                    <span className={cn(
                      "font-medium",
                      getFormColorClass(player.form)
                    )}>
                      {player.form}
                    </span>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 mb-1">Recent Performance:</div>
                    <div className="font-medium dark:text-white">{player.stats}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-6">
          <Button variant="accent" asChild>
            <Link to="/fantasy-tips">
              View Complete Fantasy Guide
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeFantasyPicksSection;
