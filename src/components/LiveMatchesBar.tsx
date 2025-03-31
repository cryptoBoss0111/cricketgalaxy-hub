
import { useEffect, useRef } from 'react';

const LiveMatchesBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only add scripts if they don't already exist
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Create and append the script tags as specified
      const scriptConfig = document.createElement('script');
      scriptConfig.innerHTML = 'app="www.cricwaves.com"; mo="1"; nt="n"; wi ="0"; co ="2"; ad="1";';
      
      const scriptWidget = document.createElement('script');
      scriptWidget.type = 'text/javascript';
      scriptWidget.src = '//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
      
      // Append both scripts to the container
      containerRef.current.appendChild(scriptConfig);
      containerRef.current.appendChild(scriptWidget);
    }
    
    return () => {
      // Cleanup function to remove scripts when component unmounts
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="live-match-ticker sticky top-0 z-50 w-full bg-blue-500 text-white shadow-md">
      <div ref={containerRef} className="w-full overflow-hidden"></div>
    </div>
  );
};

export default LiveMatchesBar;
