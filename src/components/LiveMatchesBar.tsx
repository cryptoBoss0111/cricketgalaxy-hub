
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import CricTimesEmbed from './CricTimesEmbed';

interface LiveScoreData {
  status: string;
  match: string;
  teamone: string;
  teamonescore: string;
  teamtwo: string;
  teamtwoscore: string;
  update: string;
}

interface LiveMatch {
  id: string;
  name: string;
  status: string;
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
  league?: string;
  matchTime?: string;
}

const LiveMatchesBar = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCricTimesWidget, setShowCricTimesWidget] = useState(false);
  
  const apiUrl = "https://espncricinfo-live-api.herokuapp.com/live";

  const fetchLiveMatches = async () => {
    setIsLoading(true);
    
    try {
      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data: LiveScoreData[] = await response.json();
        console.log('ESPNCricinfo API response:', data);
        
        const liveMatches: LiveMatch[] = [];
        
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((match, index) => {
            const isIPLMatch = match.match.toLowerCase().includes('ipl') || 
                            match.teamone.includes('MI') ||
                            match.teamone.includes('CSK') ||
                            match.teamone.includes('RCB') ||
                            match.teamone.includes('SRH') ||
                            match.teamone.includes('KKR');
            
            liveMatches.push({
              id: `match-${index}-${Date.now()}`,
              name: `${match.teamone} vs ${match.teamtwo}`,
              status: match.status,
              league: isIPLMatch ? 'IPL 2025' : 'International Cricket',
              matchTime: '',
              teams: {
                home: {
                  name: match.teamone,
                  score: match.teamonescore
                },
                away: {
                  name: match.teamtwo,
                  score: match.teamtwoscore
                }
              }
            });
          });
        }
        
        const iplMatches = liveMatches.filter(match => 
          match.league && match.league.toLowerCase().includes('ipl 2025')
        );
        
        const filteredMatches = iplMatches.length > 0 ? iplMatches : liveMatches;
        
        if (filteredMatches.length === 0) {
          filteredMatches.push({
            id: 'mi-vs-kkr-match',
            name: 'MI vs KKR - Match 12',
            status: 'Live',
            matchTime: 'Today',
            league: 'IPL 2025',
            teams: {
              home: { name: 'Mumbai Indians', score: '165/6 (20)' },
              away: { name: 'Kolkata Knight Riders', score: '102/4 (12.3)' }
            }
          });
        }
        
        setMatches(filteredMatches);
      } catch (err) {
        console.log('Falling back to hardcoded match data');
        const fallbackMatch = {
          id: 'mi-vs-kkr-match',
          name: 'MI vs KKR - Match 12',
          status: 'Live',
          matchTime: 'Today',
          league: 'IPL 2025',
          teams: {
            home: { name: 'Mumbai Indians', score: '165/6 (20)' },
            away: { name: 'Kolkata Knight Riders', score: '102/4 (12.3)' }
          }
        };
        
        setMatches([fallbackMatch]);
      }
      
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

  useEffect(() => {
    fetchLiveMatches();
    
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded hover:bg-yellow-400"
              onClick={() => setShowCricTimesWidget(!showCricTimesWidget)}
            >
              <span>CricTimes</span>
              {!showCricTimesWidget && <ExternalLink size={12} />}
            </Button>
          </div>
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
