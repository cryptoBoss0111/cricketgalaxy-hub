
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const LiveScoresPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load the CricWaves widget
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
          console.log("CricWaves widget script loaded");
          setIsLoading(false);
        };
        
        widgetScript.onerror = (error) => {
          console.error("Error loading CricWaves widget:", error);
          setIsLoading(false);
        };
        
        // Append scripts to the container
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(widgetScript);
      } catch (error) {
        console.error("Error setting up widget:", error);
        setIsLoading(false);
      }
    }
  };

  // Initial load of the widget
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
    <div className="min-h-screen bg-cricket-dark">
      <Helmet>
        <title>Live Scores | CricketExpress</title>
        <meta httpEquiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';" />
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Live Cricket Scores</h1>
          <Button 
            variant="accent" 
            onClick={loadWidget}
            className="flex items-center gap-2"
          >
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
            Refresh Scores
          </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          <div 
            ref={containerRef}
            className="w-full overflow-hidden flex justify-center items-center min-h-[500px]"
            id="cricwaves-widget-container"
          />
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">About Live Scores</h2>
          <p className="mb-4">
            Stay updated with real-time cricket scores from around the world. Our live score widget 
            provides ball-by-ball updates for all international and major domestic cricket matches.
          </p>
          <p>
            Live scores are powered by CricWaves and update automatically every few seconds. 
            If you don't see the scores, try clicking the Refresh button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
