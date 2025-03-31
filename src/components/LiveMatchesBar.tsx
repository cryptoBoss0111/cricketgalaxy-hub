
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import IPLLiveScoreWidget from './IPLLiveScoreWidget';

interface TeamInfo {
  name: string;
  score?: string;
}

interface LiveMatch {
  id: string;
  name: string;
  status: string;
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  league?: string;
  matchTime?: string;
}

const LiveMatchesBar = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  // Function to fetch live matches using ESPNCricinfo
  const fetchLiveMatches = async () => {
    setIsLoading(true);
    
    try {
      // Using a cors proxy to access ESPN data
      const response = await fetch('https://corsproxy.io/?https://www.espncricinfo.com/matches/engine/match/live.json');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ESPNCricinfo API response:', data);
      
      // Process the matches from the API response
      const liveMatches: LiveMatch[] = [];
      
      // Parse ESPN data format
      if (data && data.matches && Array.isArray(data.matches)) {
        data.matches.forEach((match: any) => {
          // Check if it's an IPL match
          const isIPLMatch = match.series_name && match.series_name.toLowerCase().includes('ipl');
          
          if (match.live_state === 'live' || isIPLMatch) {
            liveMatches.push({
              id: match.objectId || `match-${Math.random().toString(36).substr(2, 9)}`,
              name: match.description || 'Unknown Match',
              status: match.status_text || 'No status available',
              league: match.series_name || '',
              matchTime: match.start_date || '',
              teams: {
                home: {
                  name: match.team1_name || 'Home Team',
                  score: match.team1_score || ''
                },
                away: {
                  name: match.team2_name || 'Away Team',
                  score: match.team2_score || ''
                }
              }
            });
          }
        });
      }
      
      // Filter to prioritize IPL matches if available
      const iplMatches = liveMatches.filter(match => 
        match.league && match.league.toLowerCase().includes('ipl 2025')
      );
      
      // Use IPL matches if available, otherwise use all matches
      const filteredMatches = iplMatches.length > 0 ? iplMatches : liveMatches;
      
      // If no matches are available, add a placeholder upcoming match
      if (filteredMatches.length === 0) {
        filteredMatches.push({
          id: 'upcoming-ipl-match',
          name: 'MI vs KKR - Match 12',
          status: 'Upcoming',
          matchTime: 'Today, 7:30 PM IST',
          league: 'IPL 2025',
          teams: {
            home: { name: 'Mumbai Indians' },
            away: { name: 'Kolkata Knight Riders' }
          }
        });
      }
      
      setMatches(filteredMatches);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching live matches:', err);
      setError(`Failed to fetch live matches: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      toast({
        title: "Error loading live matches",
        description: "We couldn't fetch the latest match data",
        variant: "destructive"
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiveMatches();
    
    // Refresh every 2 minutes
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 120000); // 2 minutes in milliseconds
    
    return () => clearInterval(interval);
  }, []);

  // If there are no live matches, don't render the bar
  if (!isLoading && (matches.length === 0 || error)) {
    return null;
  }

  return (
    <div className="live-match-ticker fixed top-0 left-0 right-0 z-50 w-full bg-blue-500 text-white py-2 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-white hover:text-blue-200"
            onClick={fetchLiveMatches}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
          
          <div className="overflow-hidden w-full whitespace-nowrap">
            {isLoading ? (
              <div className="text-sm">Loading live scores...</div>
            ) : (
              <div className="marquee">
                <div className="marquee-content flex gap-4">
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center gap-2">
                      {match.league && (
                        <span className="bg-yellow-500 text-black text-xs px-1 rounded">
                          {match.league.includes('IPL 2025') ? 'IPL 2025' : match.league}
                        </span>
                      )}
                      <span className="font-medium">{match.name}:</span>
                      {match.status.toLowerCase() === 'upcoming' ? (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {match.matchTime || 'Upcoming'}
                        </span>
                      ) : (
                        <span>
                          {match.teams.home.name} {match.teams.home.score || ''} vs {match.teams.away.name} {match.teams.away.score || ''}
                        </span>
                      )}
                      <span className="text-blue-200">|</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap ml-2">
          <Link to="/live-scores" className="flex items-center gap-1 text-white hover:text-blue-100">
            <span className="text-xs md:text-sm font-medium">Full Scores</span>
            <ExternalLink size={14} />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded hover:bg-yellow-400"
            onClick={() => setShowWidget(!showWidget)}
          >
            <span>MI vs KKR</span>
            {!showWidget && <ExternalLink size={12} />}
          </Button>
        </div>
      </div>

      {showWidget && (
        <div className="absolute top-12 right-4 z-50 w-80 animate-in fade-in slide-in-from-top-5 duration-300">
          <IPLLiveScoreWidget />
        </div>
      )}

      <style>{`
        .marquee {
          width: 100%;
          overflow: hidden;
        }
        
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        
        @keyframes marquee {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default LiveMatchesBar;
