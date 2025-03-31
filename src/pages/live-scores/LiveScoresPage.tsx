
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

const LiveScoresPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content first
      containerRef.current.innerHTML = '';
      
      // Create script elements properly instead of using innerHTML
      const configScript = document.createElement('script');
      configScript.text = 'app="www.cricwaves.com"; mo="1"; nt="n"; wi ="0"; co ="2"; ad="1";';
      
      const widgetScript = document.createElement('script');
      widgetScript.src = '//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
      widgetScript.type = 'text/javascript';
      
      // Append scripts to the container
      containerRef.current.appendChild(configScript);
      containerRef.current.appendChild(widgetScript);
    }
    
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
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Live Cricket Scores</h1>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div ref={containerRef} className="w-full overflow-hidden flex justify-center items-center min-h-[400px]"></div>
        </div>
        
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">About Live Scores</h2>
          <p className="mb-4">
            Stay updated with real-time cricket scores from around the world. Our live score widget 
            provides ball-by-ball updates for all international and major domestic cricket matches.
          </p>
          <p>
            Live scores are powered by CricWaves and update automatically every few seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveScoresPage;
