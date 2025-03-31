
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

// Types for the Cricket API response
interface MatchData {
  id: string;
  dateTimeGMT: string;
  matchType: string;
  status: string;
  ms: 'live' | 'fixture' | 'result';
  t1: string;
  t2: string;
  t1s?: string;
  t2s?: string;
  series: string;
  venue?: string;
}

interface ApiResponse {
  apikey: string;
  data: MatchData[];
  status: 'success' | 'failure';
  info: {
    hitsToday: number;
    hitsLimit: number;
    credits: number;
    server: number;
    queryTime: number;
  };
}

const API_KEY = "f948889f-9691-4345-8d1e-ad455e012bb5";
const API_ENDPOINT = "https://api.cricapi.com/v1/cricScore";
const REFRESH_INTERVAL = 120000; // 2 minutes in milliseconds

const LiveScoresPage = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiHits, setApiHits] = useState<number>(0);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch live scores from Cricket API
  const fetchLiveScores = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINT}?apikey=${API_KEY}`);
      const data: ApiResponse = await response.json();
      
      if (data.status === 'failure') {
        setError('API returned failure status. Please try again later.');
        toast({
          title: "Error fetching scores",
          description: "There was a problem fetching the latest scores. Please try again.",
          variant: "destructive"
        });
      } else {
        // Filter to show only IPL matches
        const iplMatches = data.data.filter(match => 
          match.series.includes("Indian Premier League")
        );
        
        setMatches(iplMatches);
        setLastUpdated(new Date());
        setApiHits(data.info.hitsToday);
        
        // Adjust refresh interval if approaching the API limit
        if (data.info.hitsToday > 450) {
          // Slow down to 5 minutes if close to the limit
          resetRefreshInterval(300000); // 5 minutes
          toast({
            title: "API Usage High",
            description: "Approaching daily limit. Updates slowed to once every 5 minutes.",
            duration: 5000,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching live scores:", err);
      setError('Failed to fetch live scores. Please check your connection and try again.');
      toast({
        title: "Error",
        description: "Failed to fetch live scores. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset the refresh interval
  const resetRefreshInterval = (interval = REFRESH_INTERVAL) => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    refreshIntervalRef.current = setInterval(() => {
      fetchLiveScores();
    }, interval);
  };

  // Initial fetch and setup interval
  useEffect(() => {
    fetchLiveScores();
    resetRefreshInterval();
    
    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Function to format date and time
  const formatDateTime = (dateTimeGMT: string) => {
    const date = new Date(dateTimeGMT);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get background color based on match status
  const getStatusColor = (status: 'live' | 'fixture' | 'result') => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'result':
        return 'bg-gray-100 text-gray-800';
      case 'fixture':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-cricket-dark">
      <Helmet>
        <title>IPL 2025 Live Scores | CricketExpress</title>
        <meta httpEquiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';" />
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">IPL 2025 Live Scores</h1>
          <div className="flex flex-col items-end">
            <Button 
              variant="accent" 
              onClick={() => fetchLiveScores()}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              Refresh Scores
            </Button>
            {lastUpdated && (
              <span className="text-xs text-gray-300 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {apiHits > 0 && ` | API Usage: ${apiHits}/500`}
              </span>
            )}
          </div>
        </div>
        
        {error ? (
          <Card className="bg-red-50 border-red-100 mb-6">
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button variant="outline" onClick={() => fetchLiveScores()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Show skeleton loader when loading
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="bg-white/5 backdrop-blur-sm animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-5 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : matches.length === 0 ? (
              <Card className="col-span-full bg-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p>No IPL 2025 matches currently live.</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Check back later for upcoming matches or results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Display all IPL matches
              matches.map(match => (
                <Card key={match.id} className="bg-white overflow-hidden border-gray-200">
                  <CardHeader className="pb-2 pt-5">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block mb-2 ${getStatusColor(match.ms)}`}>
                      {match.ms === 'live' ? 'LIVE' : match.ms === 'fixture' ? 'UPCOMING' : 'COMPLETED'}
                    </span>
                    <CardTitle className="text-lg font-bold">
                      {match.t1} vs {match.t2}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm">
                        <strong>Status:</strong> {match.status}
                      </div>
                      {(match.t1s || match.t2s) && (
                        <div className="text-sm font-medium">
                          {match.t1s && <div>{match.t1.split('[')[0].trim()}: {match.t1s}</div>}
                          {match.t2s && <div>{match.t2.split('[')[0].trim()}: {match.t2s}</div>}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {match.venue && <div>Venue: {match.venue}</div>}
                        <div>Time: {formatDateTime(match.dateTimeGMT)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-2">About IPL 2025 Live Scores</h2>
          <p className="mb-4">
            Stay updated with real-time scores from the Indian Premier League 2025. 
            Our live score system provides automatic updates for all IPL matches.
          </p>
          <p>
            Scores automatically refresh every 2 minutes. You can also manually refresh 
            using the button above. All data is provided by Cricket Data API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
