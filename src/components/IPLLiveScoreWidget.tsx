
import { useEffect, useState } from 'react';
import { RefreshCw, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IPLMatchData {
  match: string;
  score?: string;
  overs?: string;
  status: "Not Started" | "In Progress" | "Completed" | string;
  lastUpdated: string;
  startTime?: string;
}

// Initial data now shows the match hasn't started yet
const INITIAL_DATA: IPLMatchData = {
  match: "MI vs KKR - Match 12",
  status: "Not Started",
  startTime: "Today, 7:30 PM IST",
  lastUpdated: new Date().toLocaleTimeString()
};

const IPLLiveScoreWidget = () => {
  const [matchData, setMatchData] = useState<IPLMatchData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<string>(new Date().toLocaleTimeString());

  const fetchMatchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would fetch from your API endpoint
      // For now, we'll simulate a fetch with the ESPNCricinfo data
      
      // Normally this would be: const response = await fetch('http://localhost:3000/score');
      // Since we're simulating, we'll generate mock data
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demonstration, randomly determine if the match has started
      // In reality, this would come from the API response
      const hasMatchStarted = Math.random() > 0.7;
      
      let mockData: IPLMatchData;
      
      if (hasMatchStarted) {
        // Match has started - show live score
        mockData = {
          match: "MI vs KKR - Match 12",
          score: `${Math.floor(Math.random() * 30) + 140}/${Math.floor(Math.random() * 2) + 4}`,
          overs: `${Math.floor(Math.random() * 3) + 16}.${Math.floor(Math.random() * 6)}`,
          status: Math.random() > 0.2 ? "In Progress" : "Completed",
          lastUpdated: new Date().toLocaleTimeString()
        };
      } else {
        // Match hasn't started yet - show upcoming info
        mockData = {
          match: "MI vs KKR - Match 12",
          status: "Not Started",
          startTime: "Today, 7:30 PM IST",
          lastUpdated: new Date().toLocaleTimeString()
        };
      }

      setMatchData(mockData);
      setLastFetchTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching live score data:", err);
      setError("Failed to update the score. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMatchData();
    
    // Set up automatic refresh every 60 seconds
    const interval = setInterval(() => {
      fetchMatchData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
      <CardHeader className="bg-blue-600/60 backdrop-blur-sm p-3 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg font-bold">
            IPL 2025 Live Score
          </CardTitle>
          <button 
            onClick={fetchMatchData} 
            disabled={isLoading}
            className="text-white/80 hover:text-white"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-white/10 backdrop-blur-sm text-white">
        {error ? (
          <div className="flex flex-col items-center justify-center py-3">
            <AlertTriangle size={24} className="text-yellow-300 mb-2" />
            <p className="text-center text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-3">
              <h3 className="text-xl font-bold mb-1">{matchData.match}</h3>
              <div className="inline-block px-2 py-0.5 bg-blue-700/50 rounded text-xs font-medium">
                {matchData.status}
              </div>
            </div>
            
            {matchData.status === "Not Started" ? (
              <div className="flex flex-col items-center justify-center my-3 py-2">
                <Clock size={32} className="text-yellow-200 mb-2" />
                <p className="text-lg font-medium">Match Upcoming</p>
                {matchData.startTime && (
                  <p className="text-sm opacity-80">{matchData.startTime}</p>
                )}
              </div>
            ) : (
              <div className="flex justify-center my-3">
                <div className="text-center px-6 py-2 bg-white/20 rounded-lg">
                  <div className="text-2xl font-bold">{matchData.score}</div>
                  <div className="text-sm opacity-80">{matchData.overs} overs</div>
                </div>
              </div>
            )}
            
            <div className="text-center text-xs opacity-75 mt-3">
              Last updated: {matchData.lastUpdated}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IPLLiveScoreWidget;
