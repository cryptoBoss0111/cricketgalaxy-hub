
import React from 'react';
import FantasySectionHeader from './FantasySectionHeader';
import FantasyPicksGrid from './FantasyPicksGrid';
import { useFeaturedMatch } from './hooks/useFeaturedMatch';

const FantasyPicksSection: React.FC = () => {
  const { featuredMatch, filteredPicks, isLoading } = useFeaturedMatch();
  
  return (
    <section className="py-16 bg-gradient-to-br from-cricket-accent/10 to-white">
      <div className="container mx-auto px-4">
        <FantasySectionHeader activeMatch={featuredMatch} />
        <FantasyPicksGrid picks={filteredPicks} isLoading={isLoading} />
      </div>
    </section>
  );
};

export default FantasyPicksSection;
