
import { useEffect, useRef } from 'react';

interface CricTimesEmbedProps {
  height?: string;
  className?: string;
}

const CricTimesEmbed = ({ height = "460px", className = "" }: CricTimesEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = "https://cwidget.crictimes.org/?b=d9d9d9&sb=434343&c=cccccc&a=434343&bo=434343&dc=000000&db=ffffff";
      iframe.style.width = "100%";
      iframe.style.minHeight = height;
      iframe.frameBorder = "0";
      iframe.scrolling = "yes";
      
      // Clear the container and append the iframe
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(iframe);
    }
    
    return () => {
      // Clean up on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [height]);

  return (
    <div 
      ref={containerRef} 
      className={`crictimes-embed ${className}`} 
      aria-label="Live Cricket Scores"
    >
      <a rel="nofollow" href="https://www.crictimes.org/cricket-scores">Live Cricket Scores</a>
    </div>
  );
};

export default CricTimesEmbed;
