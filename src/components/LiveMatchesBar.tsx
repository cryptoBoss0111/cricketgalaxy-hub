
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CricTimesEmbed from './CricTimesEmbed';

const LiveMatchesBar = () => {
  const [showCricTimesWidget, setShowCricTimesWidget] = useState(false);
  
  return (
    <div className="live-match-ticker fixed top-0 left-0 right-0 z-50 w-full bg-blue-500 text-white py-2 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="animate-pulse-subtle mr-2">🔴</span>
          <span className="font-medium text-sm">See Live Scores of IPL 2025</span>
        </div>
        
        <div className="flex items-center gap-2 whitespace-nowrap ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded hover:bg-yellow-400 h-6"
            onClick={() => setShowCricTimesWidget(!showCricTimesWidget)}
          >
            <span className="text-xs">CricTimes</span>
            {!showCricTimesWidget && <ExternalLink size={10} />}
          </Button>
        </div>
      </div>

      {showCricTimesWidget && (
        <div className="absolute top-12 right-4 z-50 w-96 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 bg-yellow-500 text-black flex justify-between items-center">
              <span className="font-medium">Live Cricket Score - CricTimes</span>
              <button 
                className="text-black/80 hover:text-black" 
                onClick={() => setShowCricTimesWidget(false)}
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <CricTimesEmbed height="320px" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatchesBar;
