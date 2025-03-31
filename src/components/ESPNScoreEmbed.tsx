
import { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveScoreData {
  status: string;
  match: string;
  teamone: string;
  teamonescore: string;
  teamtwo: string;
  teamtwoscore: string;
  update: string;
}

interface ESPNScoreEmbedProps {
  width?: string;
  height?: string;
  className?: string;
  showFallbackImage?: boolean;
}

const ESPNScoreEmbed = ({
  width = "100%",
  height = "480px",
  className = "",
  showFallbackImage = true,
}: ESPNScoreEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [liveScores, setLiveScores] = useState<LiveScoreData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<LiveScoreData | null>(null);
  
  // Direct ESPNCricinfo URL - if API doesn't work, we'll redirect here
  const directUrl = `https://www.espncricinfo.com/live-cricket-score`;
  
  // API URL for live cricket scores
  const apiUrl = "https://espncricinfo-live-api.herokuapp.com/live";

  // Handle API data fetch
  const fetchLiveScores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('ESPNCricinfo API response:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setLiveScores(data);
        // Set the first live match as selected
        const liveMatch = data.find(match => match.status.toLowerCase() === 'live');
        setSelectedMatch(liveMatch || data[0]);
      } else {
        throw new Error('No live matches available');
      }
      
      setHasError(false);
    } catch (err) {
      console.error('Error fetching live scores:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchLiveScores();
    
    // Auto refresh every 60 seconds
    const intervalId = setInterval(fetchLiveScores, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="bg-yellow-50 p-4 flex flex-col items-center justify-center" style={{ height }}>
          <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
          <h3 className="text-lg font-medium text-yellow-800">Unable to load live scores</h3>
          <p className="text-sm text-yellow-600 text-center mt-1">
            This might be due to API service being unavailable or network issues.
          </p>
          
          {showFallbackImage && (
            <div className="my-4 max-w-full">
              <img 
                src="https://www.cricbuzz.com/api/html/cricket-scorecard/82383" 
                alt="Scorecard Snapshot" 
                className="max-w-full h-auto border rounded-lg shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <a 
            href={directUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
          >
            <span>View Scores on ESPNcricinfo</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      ) : (
        <div className="bg-white p-4" style={{ height }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Cricket Scores</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLiveScores}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
            </Button>
          </div>
          
          {liveScores.length > 0 && (
            <div className="space-y-4">
              {liveScores.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {liveScores.map((score, index) => (
                    <button
                      key={index}
                      className={`px-2 py-1 text-xs whitespace-nowrap rounded ${
                        selectedMatch === score 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedMatch(score)}
                    >
                      {score.teamone} vs {score.teamtwo}
                    </button>
                  ))}
                </div>
              )}
              
              {selectedMatch && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-600 text-white p-3">
                    <h3 className="text-lg font-medium">{selectedMatch.match}</h3>
                    <div className="text-xs bg-white/20 inline-block px-2 py-0.5 rounded mt-1">
                      {selectedMatch.status}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="w-5/12">
                        <div className="font-bold text-lg">{selectedMatch.teamone}</div>
                        <div className="text-2xl font-medium">{selectedMatch.teamonescore || "Yet to bat"}</div>
                      </div>
                      
                      <div className="w-2/12 text-center">
                        <div className="text-sm text-gray-600 font-medium">vs</div>
                      </div>
                      
                      <div className="w-5/12 text-right">
                        <div className="font-bold text-lg">{selectedMatch.teamtwo}</div>
                        <div className="text-2xl font-medium">{selectedMatch.teamtwoscore || "Yet to bat"}</div>
                      </div>
                    </div>
                    
                    {selectedMatch.update && (
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <strong>Match Status:</strong> {selectedMatch.update}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Powered by ESPNCricinfo Live API
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!isLoading && liveScores.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 mb-4">No live matches available at the moment.</p>
              <a 
                href={directUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Check ESPNCricinfo</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ESPNScoreEmbed;
