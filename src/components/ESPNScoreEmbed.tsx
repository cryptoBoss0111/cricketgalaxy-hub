
import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ESPNScoreEmbedProps {
  matchId?: string;
  width?: string;
  height?: string;
  className?: string;
}

const ESPNScoreEmbed = ({
  matchId = "1411396", // IPL 2025 match ID (default to a recent match)
  width = "100%",
  height = "480px",
  className = "",
}: ESPNScoreEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
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
          <a 
            href="https://www.espncricinfo.com/live-cricket-score" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            View Scores on ESPNcricinfo
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
