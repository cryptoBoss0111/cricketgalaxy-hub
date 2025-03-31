
import React from 'react';
import { Calendar } from 'lucide-react';
import UpcomingMatchCard, { UpcomingMatch } from './UpcomingMatchCard';

interface UpcomingMatchesGridProps {
  matches: UpcomingMatch[];
}

const UpcomingMatchesGrid: React.FC<UpcomingMatchesGridProps> = ({ matches }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="text-cricket-accent h-6 w-6 dark:text-white" />
        <h2 className="text-2xl font-heading font-bold dark:text-white">Upcoming Matches</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.slice(0, 3).map((match, index) => (
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
