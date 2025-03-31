
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { RefreshCw, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Match {
  id: string;
  name: string;
  status: string;
  venue: string;
  date: string;
  matchType: string;
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
  const [remainingHits, setRemainingHits] = useState<number | null>(null);

  // Function to fetch live matches data from RapidAPI
  const fetchLiveScores = async () => {
    setIsLoading(true);
    setError(null);
    
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
      console.log('API Response:', data);
      
      // Check if we have valid data structure based on the actual API response
      if (!data || !data.response || !Array.isArray(data.response)) {
        throw new Error('Invalid response format from API');
      }
      
      const formattedMatches: Match[] = [];
      
      // Process each series in the response
      data.response.forEach((series: any) => {
        if (series.matchList && Array.isArray(series.matchList)) {
          series.matchList.forEach((match: any) => {
            formattedMatches.push({
              id: match.matchId || `match-${Math.random().toString(36).substr(2, 9)}`,
              name: match.matchTitle || 'Unknown Match',
              status: match.matchStatus || 'No status available',
              venue: match.matchVenue || 'Venue not specified',
              date: match.matchDate || 'Date not available',
              matchType: match.matchFormat || 'Unknown format',
              teams: {
                home: {
                  name: match.teamOne?.name || 'Home Team',
                  score: match.teamOne?.score || ''
                },
                away: {
                  name: match.teamTwo?.name || 'Away Team',
                  score: match.teamTwo?.score || ''
                }
              }
            });
          });
        }
      });
      
      setMatches(formattedMatches);
      setLastUpdated(new Date().toLocaleTimeString());
      
      // If the API includes rate limit information, store it
      // This is currently commented out as the API doesn't seem to provide this info
      // if (data.status === "success" && data.headers) {
      //   const rateLimit = data.headers.get('X-RateLimit-Remaining');
      //   if (rateLimit) {
      //     setRemainingHits(parseInt(rateLimit, 10));
      //   }
      // }
      
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

  const renderMatchCards = () => {
    if (matches.length === 0) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-lg">No live matches currently available.</p>
        </div>
      );
    }

    return matches.map((match) => (
      <div 
        key={match.id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-blue-500 text-white px-4 py-2 font-medium">
          {match.name}
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
            <p><span className="font-medium">Venue:</span> {match.venue}</p>
            <p><span className="font-medium">Date:</span> {match.date}</p>
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
          <h1 className="text-3xl font-bold text-white">Live Cricket Scores</h1>
          <div className="flex items-center gap-2">
            {remainingHits !== null && (
              <div className="text-white text-sm bg-blue-600 px-3 py-1 rounded-full flex items-center">
                <Info size={14} className="mr-1" />
                API Calls: {remainingHits} remaining
              </div>
            )}
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
            service provides updates for all international and major domestic cricket matches.
          </p>
          <p>
            Live scores are powered by Cricket API and update automatically every few minutes. 
            If you don't see the latest scores, try clicking the Refresh button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
