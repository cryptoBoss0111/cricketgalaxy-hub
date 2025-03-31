
import { useEffect, useRef } from 'react';

const LiveMatchesBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add the script to the document
    const script1 = document.createElement('script');
    script1.innerHTML = 'app="www.cricwaves.com"; mo="1"; nt="n"; wi ="0"; co ="2"; ad="1";';
    
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111';
    
    // Only add scripts if they don't already exist
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(script1);
      containerRef.current.appendChild(script2);
    }
    
    return () => {
      // Cleanup function to remove scripts when component unmounts
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="live-match-ticker bg-cricket-dark">
      <div ref={containerRef} className="w-full overflow-hidden"></div>
    </div>
  );
};

export default LiveMatchesBar;
