
import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CricbuzzScorecardProps {
  matchId: string;
}

const CricbuzzScorecard = ({ matchId }: CricbuzzScorecardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Using ESPNCricinfo URL instead of Cricbuzz
  const espnCricinfoUrl = `https://www.espncricinfo.com/series/ipl-2025-1449924/mumbai-indians-vs-kolkata-knight-riders-12th-match-1473449/live-cricket-score`;
  
  // Check if iframe loaded successfully
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    const handleLoad = () => {
      setIsLoading(false);
      try {
        // Try to access iframe content - if blocked, this will throw an error
        const iframeContent = iframe.contentWindow?.location.href;
        if (!iframeContent) {
          setEmbedError(true);
        }
      } catch (err) {
        console.error("Cannot access iframe content:", err);
        setEmbedError(true);
      }
    };
    
    const handleError = () => {
      setIsLoading(false);
      setEmbedError(true);
    };
    
    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
    };
  }, []);

  // Set a timeout to check if loading takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setEmbedError(true);
        setIsLoading(false);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">ESPNCricinfo Live Score - MI vs KKR</h2>
        <a 
          href={espnCricinfoUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-blue-100 flex items-center gap-1"
        >
          <span>Open in ESPNCricinfo</span>
          <ExternalLink size={16} />
        </a>
      </div>
      
      {isLoading && (
        <div className="h-96 flex justify-center items-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {embedError ? (
        <div className="h-96 flex flex-col justify-center items-center bg-gray-50 p-6 text-center">
          <AlertTriangle size={48} className="text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Embedding Not Allowed</h3>
          <p className="text-gray-600 mb-6">
            ESPNCricinfo doesn't allow their content to be embedded on other websites.
            Please use the link below to view the scorecard directly on ESPNCricinfo.
          </p>
          <Button 
            variant="accent"
            onClick={() => window.open(espnCricinfoUrl, '_blank')}
            className="flex items-center gap-2"
          >
            View on ESPNCricinfo
            <ExternalLink size={16} />
          </Button>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={espnCricinfoUrl}
          width="100%"
          height="600px"
          style={{ display: isLoading ? 'none' : 'block' }}
          sandbox="allow-same-origin allow-scripts"
          referrerPolicy="no-referrer"
          title="ESPNCricinfo Live Score"
        />
      )}
    </div>
  );
};

export default CricbuzzScorecard;
