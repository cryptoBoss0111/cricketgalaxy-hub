
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Match {
  id: string;
  matchType: string;
  status: string;
  venue: string;
  team1: {
    name: string;
    shortName: string;
    score: string;
  };
  team2: {
    name: string;
    shortName: string;
    score: string;
  };
}

export const LiveMatchesBar = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch from the cricket API
        // For now, we'll use sample data
        const sampleMatches: Match[] = [
          {
            id: '1',
            matchType: 'T20I',
            status: 'LIVE',
            venue: 'Christchurch',
            team1: {
              name: 'New Zealand',
              shortName: 'NZ',
              score: '145/8 (15 ov)'
            },
            team2: {
              name: 'Pakistan',
              shortName: 'PAK',
              score: '130/4 (13.1 ov)'
            }
          },
          {
            id: '2',
            matchType: 'T20I',
            status: 'LIVE',
            venue: 'Harare',
            team1: {
              name: 'Zimbabwe',
              shortName: 'ZIM',
              score: '151 & 165/6 (55 ov)'
            },
            team2: {
              name: 'Durham',
              shortName: 'DURH',
              score: '185'
            }
          },
          {
            id: '3',
            matchType: 'ODI',
            status: 'RESULT',
            venue: 'Windhoek',
            team1: {
              name: 'Canada',
              shortName: 'CAN',
              score: '145/8'
            },
            team2: {
              name: 'Namibia',
              shortName: 'NAM',
              score: '146/3'
            }
          },
          {
            id: '4',
            matchType: 'PM Cup',
            status: 'LIVE',
            venue: 'Siddharthanagar',
            team1: {
              name: 'Kathmandu Royals',
              shortName: 'KAR',
              score: '205'
            },
            team2: {
              name: 'Lumbini Province',
              shortName: 'LP',
              score: '35/1 (11.50 ov)'
            }
          },
          {
            id: '5',
            matchType: 'PM Cup',
            status: 'LIVE',
            venue: 'Bhairahawa',
            team1: {
              name: 'Nepal Police Club',
              shortName: 'NPC',
              score: '297/8'
            },
            team2: {
              name: 'Bagmati Province',
              shortName: 'BP',
              score: '26/1 (5.50 ov)'
            }
          }
        ];

        setMatches(sampleMatches);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Auto-cycle through matches every 8 seconds
    const interval = setInterval(() => {
      setCurrentMatch(prev => (prev + 1) % (matches.length || 1));
    }, 8000);

    return () => clearInterval(interval);
  }, [matches.length]);

  const nextMatch = () => {
    setCurrentMatch(prev => (prev + 1) % matches.length);
  };

  const prevMatch = () => {
    setCurrentMatch(prev => (prev - 1 + matches.length) % matches.length);
  };

  if (loading) {
    return (
      <div className="live-match-ticker h-12 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-2 w-24 bg-white/40 rounded"></div>
          <div className="h-2 w-36 bg-white/40 rounded"></div>
          <div className="h-2 w-24 bg-white/40 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || matches.length === 0) {
    return (
      <div className="live-match-ticker h-12 flex items-center justify-center">
        <span>No live matches at the moment</span>
      </div>
    );
  }

  const match = matches[currentMatch];

  return (
    <div className="live-match-ticker h-12 flex items-center justify-between px-4">
      <button onClick={prevMatch} className="text-white p-1 focus:outline-none">
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-center space-x-4 animate-fade-in">
          <span className="live-badge bg-white/20 text-white">
            {match.status === 'LIVE' ? 'LIVE' : match.status}
          </span>
          
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-xs">{match.matchType}</span>
            <span className="text-xs">•</span>
            <span className="text-xs">{match.venue}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="font-semibold">{match.team1.shortName}</span>
              <span className="ml-2 text-sm">{match.team1.score}</span>
            </div>
            
            <span className="text-white/60">vs</span>
            
            <div className="text-left">
              <span className="font-semibold">{match.team2.shortName}</span>
              <span className="ml-2 text-sm">{match.team2.score}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button onClick={nextMatch} className="text-white p-1 focus:outline-none">
        <ChevronRight size={20} />
      </button>
      
      <div className="hidden md:flex absolute right-8 h-4">
        <div className="flex space-x-1">
          {matches.map((_, idx) => (
            <span 
              key={idx} 
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full transition-all duration-300",
                idx === currentMatch ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchesBar;
