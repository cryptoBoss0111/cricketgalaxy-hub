
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight } from 'lucide-react';

const FantasySectionHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex items-center space-x-3">
        <Trophy className="text-cricket-accent h-7 w-7" />
        <h2 className="text-2xl md:text-3xl font-heading font-bold">Fantasy Hot Picks</h2>
      </div>
      <Link to="/fantasy-tips" className="flex items-center text-sm font-medium text-cricket-accent hover:underline">
        View All Picks <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default FantasySectionHeader;
