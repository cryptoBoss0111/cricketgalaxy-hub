
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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
}

const LiveMatchesBar = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch live matches using RapidAPI Cricket API
  const fetchLiveMatches = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://cricket-api-free-data.p.rapidapi.com/cricket-livescores', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '43b772b4d8msh6d5dd68873fbb6cp173b08jsn80bc23c85703',
          'X-RapidAPI-Host': 'cricket-api-free-data.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('LiveMatchesBar API response:', data);
      
      // Check if we have valid data structure
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format from API');
      }
      
      // Format the matches for display
      const formattedMatches: LiveMatch[] = data.map((match: any) => ({
        id: match.id || `match-${Math.random().toString(36).substr(2, 9)}`,
        name: match.name || 'Unknown Match',
        status: match.status || 'No status available',
        teams: {
          home: {
            name: match.teams?.home?.name || 'Home Team',
            score: match.teams?.home?.score || ''
          },
          away: {
            name: match.teams?.away?.name || 'Away Team',
            score: match.teams?.away?.score || ''
          }
        }
      }));
      
      // Filter for live matches (adjust based on actual API response structure)
      const liveMatches = formattedMatches.filter(match => 
        match.status.toLowerCase().includes('progress') || 
        match.status.toLowerCase().includes('live')
      );
      
      setMatches(liveMatches);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching live matches:', err);
      setError(`Failed to fetch live matches: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
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
    <div className="live-match-ticker sticky top-0 z-50 w-full bg-blue-500 text-white py-2 shadow-md">
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
                      <span className="font-medium">{match.name}:</span>
                      <span>
                        {match.teams.home.name} {match.teams.home.score || ''} vs {match.teams.away.name} {match.teams.away.score || ''}
                      </span>
                      <span className="text-blue-200">|</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Link to="/live-scores" className="flex items-center gap-1 text-white hover:text-blue-100 whitespace-nowrap ml-2">
          <span className="text-xs md:text-sm font-medium">Full Scores</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <style jsx>{`
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
