
import { useEffect, useRef } from 'react';

const LiveMatchesBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content first
      containerRef.current.innerHTML = '';
      
      // Add the script exactly as provided by the user
      containerRef.current.innerHTML = `
        <script> app="www.cricwaves.com"; mo="1"; nt="n"; wi ="0"; co ="2"; ad="1"; </script>
        <script type="text/javascript" src="//www.cricwaves.com/cricket/widgets/script/scoreWidgets.js?v=0.111"></script>
      `;
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
