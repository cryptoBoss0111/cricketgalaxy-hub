
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LiveMatchesBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadWidget = () => {
    if (containerRef.current) {
      // Clear any existing content first
      containerRef.current.innerHTML = '';
      setIsLoading(true);
      
      try {
        // Create script elements properly instead of using innerHTML
        const configScript = document.createElement('script');
        configScript.text = 'app="www.cricwaves.com"; mo="1"; nt="n"; wi ="0"; co ="2"; ad="1";';
        
        const widgetScript = document.createElement('script');
        widgetScript.src = '//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
        widgetScript.type = 'text/javascript';
        
        // Add load event listener to detect when widget loads
        widgetScript.onload = () => {
          console.log("CricWaves widget script loaded in ticker");
          setIsLoading(false);
        };
        
        widgetScript.onerror = (error) => {
          console.error("Error loading CricWaves widget in ticker:", error);
          setIsLoading(false);
        };
        
        // Append scripts to the container
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(widgetScript);
      } catch (error) {
        console.error("Error setting up widget in ticker:", error);
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    loadWidget();
    
    return () => {
      // Cleanup function to remove scripts when component unmounts
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="live-match-ticker sticky top-0 z-50 w-full bg-blue-500 text-white py-2 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-white hover:text-blue-200"
            onClick={loadWidget}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <div ref={containerRef} className="w-full overflow-hidden flex justify-center items-center min-h-[30px]"></div>
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
