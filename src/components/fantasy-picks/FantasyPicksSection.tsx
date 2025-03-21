
import React from 'react';
import FantasySectionHeader from './FantasySectionHeader';
import FantasyPicksGrid from './FantasyPicksGrid';
import { useFantasyPicks } from './hooks/useFantasyPicks';

const FantasyPicksSection: React.FC = () => {
  const { fantasyPicks, isLoading } = useFantasyPicks();
  
  return (
    <section className="py-16 bg-gradient-to-br from-cricket-accent/10 to-white">
      <div className="container mx-auto px-4">
        <FantasySectionHeader />
        <FantasyPicksGrid picks={fantasyPicks} isLoading={isLoading} />
      </div>
    </section>
  );
};

export default FantasyPicksSection;
