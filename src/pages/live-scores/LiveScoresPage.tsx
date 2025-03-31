
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Match {
  id: string;
  name: string;
  status: string;
  venue?: string;
  date?: string;
  matchType?: string;
  league?: string;
  teams: {
    home: {
      name: string;
      score?: string;
    };
    away: {
      name: string;
      score?: string;
    };
  };
}

const LiveScoresPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [filterIPL, setFilterIPL] = useState<boolean>(true);

  // Function to fetch live matches data from ESPNCricinfo
  const fetchLiveScores = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using a cors proxy to access ESPN data
      const response = await fetch('https://corsproxy.io/?https://www.espncricinfo.com/matches/engine/match/live.json');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('LiveScoresPage ESPNCricinfo API response:', data);
      
      // Process matches from the API response
      const formattedMatches: Match[] = [];
      
      // Parse ESPN data format
      if (data && data.matches && Array.isArray(data.matches)) {
        data.matches.forEach((match: any) => {
          formattedMatches.push({
            id: match.objectId || `match-${Math.random().toString(36).substr(2, 9)}`,
            name: match.description || 'Unknown Match',
            status: match.status_text || 'No status available',
            venue: match.ground_name || 'Venue not specified',
            date: match.start_date_raw ? new Date(match.start_date_raw).toLocaleDateString() : 'Date not available',
            matchType: match.match_format || 'Unknown format',
            league: match.series_name || '',
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
        });
      }
      
      setMatches(formattedMatches);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching live scores:', err);
      setError(`Failed to fetch live scores: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      
      toast({
        title: "Error loading live scores",
        description: "Could not fetch the latest cricket scores",
        variant: "destructive"
      });
    }
  };

  // Fetch scores on component mount
  useEffect(() => {
    fetchLiveScores();
    
    // Set up auto-refresh every 2 minutes
    const interval = setInterval(() => {
      fetchLiveScores();
    }, 120000); // 2 minutes in milliseconds
    
    return () => clearInterval(interval);
  }, []);

  // Filter matches based on IPL preference
  const filteredMatches = filterIPL
    ? matches.filter(match => match.league && match.league.toLowerCase().includes('ipl 2025'))
    : matches;
  
  const renderMatchCards = () => {
    if (filteredMatches.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-lg">
            {filterIPL 
              ? "No live IPL 2025 matches currently available." 
              : "No live matches currently available."}
          </p>
          {filterIPL && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setFilterIPL(false)}
            >
              Show All Cricket Matches
            </Button>
          )}
        </div>
      );
    }

    return filteredMatches.map((match) => (
      <div 
        key={match.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-blue-500 text-white px-4 py-2 font-medium flex justify-between items-center">
          <span>{match.name}</span>
          {match.league && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded">
              {match.league.includes('IPL 2025') ? 'IPL 2025' : match.league}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <p className="text-lg font-bold">{match.teams.home.name}</p>
              <p className="text-xl">{match.teams.home.score || 'No score'}</p>
            </div>
            <div className="mx-4 text-gray-500">vs</div>
            <div className="flex-1 text-right">
              <p className="text-lg font-bold">{match.teams.away.name}</p>
              <p className="text-xl">{match.teams.away.score || 'No score'}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <p><span className="font-medium">Status:</span> {match.status}</p>
            {match.venue && <p><span className="font-medium">Venue:</span> {match.venue}</p>}
            {match.date && <p><span className="font-medium">Date:</span> {match.date}</p>}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-cricket-dark">
      <Helmet>
        <title>Live Scores | CricketExpress</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            {filterIPL ? 'IPL 2025 Live Scores' : 'Live Cricket Scores'}
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="accent" 
              onClick={fetchLiveScores}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Scores
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {filterIPL ? 'IPL 2025 Matches' : 'All Cricket Matches'}
            </h2>
            <Button
              variant={filterIPL ? "accent" : "outline"}
              onClick={() => setFilterIPL(!filterIPL)}
            >
              {filterIPL ? 'Show All Matches' : 'Show IPL Only'}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Error loading scores</p>
              <p className="text-sm">{error}</p>
              <div className="mt-3">
                <Button variant="outline" onClick={fetchLiveScores} size="sm">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {lastUpdated && (
                <div className="text-right text-sm text-gray-500 mb-2">
                  Last updated: {lastUpdated}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderMatchCards()}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">About Live Scores</h2>
          <p className="mb-4">
            Stay updated with real-time cricket scores from around the world. Our live score 
            service provides updates for all international and major domestic cricket matches,
            with special focus on IPL 2025 matches.
          </p>
          <p>
            Live scores are powered by ESPNCricinfo and update automatically every few minutes. 
            If you don't see the latest scores, try clicking the Refresh button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
