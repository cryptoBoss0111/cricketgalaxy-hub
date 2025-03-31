
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Types for the Cricket API response
interface MatchData {
  id: string;
  status: string;
  ms: 'live' | 'fixture' | 'result';
  t1: string;
  t2: string;
  t1s?: string;
  t2s?: string;
  series: string;
}

interface ApiResponse {
  data: MatchData[];
  status: 'success' | 'failure';
  info: {
    hitsToday: number;
  };
  message?: string;
}

const API_KEY = "f948889f-9691-4345-8d1e-ad455e012bb5";
const API_ENDPOINT = "https://api.cricapi.com/v1/cricScore";

const LiveMatchesBar = () => {
  const [liveMatches, setLiveMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to fetch live IPL matches
  const fetchLiveMatches = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("LiveMatchesBar: Fetching from API:", `${API_ENDPOINT}?apikey=${API_KEY}`);
      
      const response = await fetch(`${API_ENDPOINT}?apikey=${API_KEY}`);
      const data: ApiResponse = await response.json();
      
      console.log("LiveMatchesBar API Response:", data);
      
      if (data.status === 'success') {
        if (!data.data || !Array.isArray(data.data)) {
          console.error("Invalid API response format:", data);
          setError('Invalid API response format');
          setLiveMatches([]);
        } else {
          // Filter for IPL matches that are live
          const liveIplMatches = data.data.filter(match => 
            match.series && match.series.includes("Indian Premier League") && 
            match.ms === 'live'
          );
          
          console.log("LiveMatchesBar filtered IPL matches:", liveIplMatches);
          setLiveMatches(liveIplMatches);
        }
      } else {
        console.error("API returned failure status:", data);
        setError(data.message || 'API returned failure status');
        setLiveMatches([]);
      }
    } catch (error) {
      console.error("Error fetching live matches:", error);
      setError('Failed to fetch live matches');
      setLiveMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiveMatches();
    
    // Refresh every 5 minutes (less frequent than the main page)
    const interval = setInterval(fetchLiveMatches, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Rotate through matches every 10 seconds
  useEffect(() => {
    if (liveMatches.length <= 1) return;
    
    const rotateInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % liveMatches.length);
    }, 10000);
    
    return () => clearInterval(rotateInterval);
  }, [liveMatches.length]);

  // Format team names to remove brackets
  const formatTeamName = (team: string) => {
    return team.split('[')[0].trim();
  };

  // Format score for ticker display
  const formatTickerScore = (match: MatchData) => {
    const team1 = formatTeamName(match.t1);
    const team2 = formatTeamName(match.t2);
    
    let scoreText = `${team1} vs ${team2}`;
    
    if (match.t1s || match.t2s) {
      scoreText += ' | ';
      if (match.t1s) scoreText += `${team1} ${match.t1s}`;
      if (match.t1s && match.t2s) scoreText += ' | ';
      if (match.t2s) scoreText += `${team2} ${match.t2s}`;
    }
    
    return scoreText;
  };

  // If error or no live matches, don't show the bar
  if ((!isLoading && liveMatches.length === 0) || error) {
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
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
          
          {isLoading ? (
            <div className="text-sm">Loading live scores...</div>
          ) : liveMatches.length > 0 ? (
            <div className="whitespace-nowrap text-sm md:text-base font-medium overflow-hidden">
              <span className="inline-flex items-center bg-red-500 text-white px-2 rounded-sm mr-2 text-xs">
                LIVE
              </span>
              {formatTickerScore(liveMatches[currentIndex])}
            </div>
          ) : (
            <div className="text-sm">No live IPL matches currently</div>
          )}
        </div>
        <Link to="/live-scores" className="flex items-center gap-1 text-white hover:text-blue-100 whitespace-nowrap ml-2">
          <span className="text-xs md:text-sm font-medium">Full Scores</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default LiveMatchesBar;
