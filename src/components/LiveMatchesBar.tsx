
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const LiveMatchesBar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasMatches, setHasMatches] = useState(false);
  const matchesContainerRef = useRef<HTMLDivElement>(null);

  // Function to load mini ticker widget
  const loadMiniTicker = async () => {
    if (matchesContainerRef.current) {
      // Clear any existing content
      matchesContainerRef.current.innerHTML = '';
      setIsLoading(true);
      
      try {
        // Create and append the mini ticker scripts
        const configScript = document.createElement('script');
        configScript.text = 'app="www.cricwaves.com"; mo="mo_2"; nt="n"; wi ="w_1"; co ="2"; ad="1";';
        
        const widgetScript = document.createElement('script');
        widgetScript.src = '//www.cricwaves.com/cricket/widgets/script/livescore.js';
        widgetScript.type = 'text/javascript';
        
        // Add load event listener
        widgetScript.onload = () => {
          console.log("CricWaves mini ticker loaded");
          setIsLoading(false);
          
          // Check if we have actual matches after a short delay
          setTimeout(() => {
            const tickerContent = matchesContainerRef.current?.querySelector('.crkt_scr_wrp');
            setHasMatches(!!tickerContent && tickerContent.children.length > 0);
          }, 1000);
        };
        
        widgetScript.onerror = (error) => {
          console.error("Error loading CricWaves mini ticker:", error);
          setIsLoading(false);
          toast({
            title: "Error loading live scores",
            description: "Could not load the live scores ticker",
            variant: "destructive"
          });
        };
        
        // Append scripts
        matchesContainerRef.current.appendChild(configScript);
        matchesContainerRef.current.appendChild(widgetScript);
      } catch (error) {
        console.error("Error setting up mini ticker:", error);
        setIsLoading(false);
        setHasMatches(false);
      }
    }
  };

  // Load initially
  useEffect(() => {
    loadMiniTicker();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadMiniTicker, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // If nothing to show, don't render the bar
  if (!isLoading && !hasMatches) {
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
            onClick={loadMiniTicker}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
          
          <div ref={matchesContainerRef} className="mini-ticker overflow-hidden w-full">
            {isLoading && <div className="text-sm">Loading live scores...</div>}
          </div>
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
