
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FantasyPickCard, { FantasyPick } from './FantasyPickCard';

interface FantasyPicksGridProps {
  picks: FantasyPick[];
  isLoading: boolean;
}

const FantasyPicksGrid: React.FC<FantasyPicksGridProps> = ({ picks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shadow-md animate-pulse h-64 rounded-lg bg-gray-100"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {picks.map((pick, index) => (
          <FantasyPickCard 
            key={pick.id} 
            pick={pick} 
            index={index} 
          />
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
          <Link to="/fantasy-tips" className="flex items-center">
            Build Your Fantasy Team <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
        <p className="text-sm text-gray-500 mt-3">Updated daily with fresh picks from our cricket experts</p>
      </div>
    </>
  );
};

export default FantasyPicksGrid;
