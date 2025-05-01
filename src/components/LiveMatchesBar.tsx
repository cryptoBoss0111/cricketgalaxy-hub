
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const LiveMatchesBar = () => {
  return (
    <Link 
      to="/live-scores"
      className="live-match-ticker fixed top-0 left-0 right-0 z-50 w-full bg-blue-500 text-white py-1 shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
    >
      <div className="container mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="animate-pulse-subtle mr-1">🔴</span>
          <span className="text-sm truncate max-w-[180px] md:max-w-full">LIVE: RR vs MI - Match 50, IPL 2025</span>
        </div>
        
        <div className="flex items-center">
          <ExternalLink size={14} />
        </div>
      </div>
    </Link>
  );
};

export default LiveMatchesBar;
