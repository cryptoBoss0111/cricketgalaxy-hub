
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trendingPlayers } from '../data/homeData';

export const TrendingPlayersSection = () => {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Users className="text-cricket-accent h-6 w-6" />
        <h2 className="text-2xl font-heading font-bold">Trending Players</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {trendingPlayers.map((player, index) => (
          <Link 
            key={player.id} 
            to={`/player-profiles/${player.id}`}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in",
              index % 6 === 0 ? "animate-delay-100" : "",
              index % 6 === 1 ? "animate-delay-150" : "",
              index % 6 === 2 ? "animate-delay-200" : "",
              index % 6 === 3 ? "animate-delay-250" : "",
              index % 6 === 4 ? "animate-delay-300" : "",
              index % 6 === 5 ? "animate-delay-350" : ""
            )}
          >
            <img 
              src={player.imageUrl} 
              alt={player.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-sm">{player.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
