
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CricTimesEmbed from './CricTimesEmbed';

const LiveMatchesBar = () => {
  const [showCricTimesWidget, setShowCricTimesWidget] = useState(false);
  
  return (
    <div className="live-match-ticker fixed top-0 left-0 right-0 z-50 w-full bg-blue-500 text-white py-0.5 shadow-md text-xs">
      <div className="container mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className="animate-pulse-subtle mr-1">🔴</span>
          <span className="text-xs truncate max-w-[180px] md:max-w-full">See Live Scores of IPL 2025</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-0.5 bg-yellow-500 text-black text-xs px-1 py-0 rounded h-4"
            onClick={() => setShowCricTimesWidget(!showCricTimesWidget)}
          >
            <span className="text-[10px]">CricTimes</span>
            {!showCricTimesWidget && <ExternalLink size={8} />}
          </Button>
        </div>
      </div>

      {showCricTimesWidget && (
        <div className="absolute top-8 right-4 z-50 w-96 animate-in fade-in slide-in-from-top-5 duration-300">
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
