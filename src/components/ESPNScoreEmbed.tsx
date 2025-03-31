
import { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ESPNScoreEmbedProps {
  matchId?: string;
  width?: string;
  height?: string;
  className?: string;
  showFallbackImage?: boolean;
}

const ESPNScoreEmbed = ({
  matchId = "1411396", // IPL 2025 match ID (default to a recent match)
  width = "100%",
  height = "480px",
  className = "",
  showFallbackImage = true,
}: ESPNScoreEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Direct ESPNCricinfo URL - if iframe embedding doesn't work, we'll redirect here
  const directUrl = `https://www.espncricinfo.com/series/ipl-2025-1449924/live-cricket-score`;
  
  // Match-specific widget URL
  const embedUrl = `https://www.espncricinfo.com/scores/widget/cricket/${matchId}`;

  // Handle iframe load events
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Check if iframe is blocked after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

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
          <h3 className="text-lg font-medium text-yellow-800">Unable to load score widget</h3>
          <p className="text-sm text-yellow-600 text-center mt-1">
            This might be due to content restrictions or your browser's security settings.
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
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          frameBorder="0"
          scrolling="no"
          onLoad={handleLoad}
          onError={handleError}
          title="Live Cricket Scores"
          className={isLoading ? 'opacity-0' : 'opacity-100'}
          sandbox="allow-same-origin allow-scripts"
        />
      )}
    </div>
  );
};

export default ESPNScoreEmbed;
