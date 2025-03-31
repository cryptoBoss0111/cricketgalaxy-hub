
import React from 'react';
import { Calendar } from 'lucide-react';
import UpcomingMatchCard, { UpcomingMatch } from './UpcomingMatchCard';

interface UpcomingMatchesGridProps {
  matches: UpcomingMatch[];
}

const UpcomingMatchesGrid: React.FC<UpcomingMatchesGridProps> = ({ matches }) => {
  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="text-cricket-accent h-6 w-6" />
        <h2 className="text-2xl font-heading font-bold">Next Match</h2>
      </div>
      
      <div className="max-w-xl mx-auto">
        {matches.map((match, index) => (
          <UpcomingMatchCard 
            key={match.id} 
            match={match} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingMatchesGrid;
