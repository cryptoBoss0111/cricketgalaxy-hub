
import { useEffect, useRef } from 'react';

const LiveMatchesBar = () => {
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
    <div className="live-match-ticker sticky top-0 z-50 w-full bg-blue-500 text-white py-2 shadow-md">
      <div className="container mx-auto">
        <div ref={containerRef} className="w-full overflow-hidden flex justify-center items-center min-h-[30px]"></div>
      </div>
    </div>
  );
};

export default LiveMatchesBar;
