
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import FantasyPickCard, { FantasyPick } from './FantasyPickCard';

interface FantasyPicksGridProps {
  picks: FantasyPick[];
  isLoading: boolean;
}

const FantasyPicksGrid: React.FC<FantasyPicksGridProps> = ({ picks, isLoading }) => {
  // Log fantasy picks data for debugging
  console.log('Fantasy picks data:', picks);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="shadow-md animate-pulse h-64 rounded-lg bg-gray-100 dark:bg-gray-800/50"></div>
        ))}
      </div>
    );
  }

  if (!picks || picks.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No Fantasy Picks Available</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back later for expert fantasy picks</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {picks.map((pick, index) => (
          <FantasyPickCard 
            key={pick.id} 
            pick={pick} 
            index={index} 
          />
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90 text-white">
          <Link to="/fantasy-tips" className="flex items-center">
            Build Your Fantasy Team <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Updated daily with fresh picks from our cricket experts</p>
      </div>
    </>
  );
};

export default FantasyPicksGrid;
