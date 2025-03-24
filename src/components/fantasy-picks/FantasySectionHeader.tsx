
import React from 'react';
import { Trophy } from 'lucide-react';
import { useFeaturedMatch } from './hooks/useFeaturedMatch';

interface FantasySectionHeaderProps {
  activeMatch?: string | null;
}

const FantasySectionHeader: React.FC<FantasySectionHeaderProps> = ({ activeMatch }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <Trophy className="text-cricket-accent h-6 w-6" />
        <h2 className="text-2xl font-heading font-bold dark:text-white">Fantasy Picks</h2>
      </div>
      
      {activeMatch && (
        <div className="bg-cricket-accent/20 px-4 py-2 rounded-full text-cricket-accent font-medium text-sm">
          {activeMatch}
        </div>
      )}
    </div>
  );
};

export default FantasySectionHeader;
