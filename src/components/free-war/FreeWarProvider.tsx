import React, { createContext, useContext, useState, useEffect } from 'react';
import FreeWarPopup from './FreeWarPopup';
import StickyButton from './StickyButton';
import PlayerSelectionModal from './PlayerSelectionModal';

interface FreeWarContextType {
  showPopup: () => void;
  showSelectionModal: () => void;
}

const FreeWarContext = createContext<FreeWarContextType | undefined>(undefined);

export const useFreeWar = () => {
  const context = useContext(FreeWarContext);
  if (!context) {
    throw new Error('useFreeWar must be used within a FreeWarProvider');
  }
  return context;
};

export const FreeWarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] = useState(false);

  // Show popup automatically when the component mounts (user lands on the page)
  useEffect(() => {
    // Check if this popup has been shown before in this session
    const hasShownPopup = sessionStorage.getItem('hasShownFreeWarPopup');
    
    if (!hasShownPopup && !isPopupOpen && !isSelectionModalOpen) {
      // Set a slight delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        // Mark that we've shown the popup in this session
        sessionStorage.setItem('hasShownFreeWarPopup', 'true');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isPopupOpen, isSelectionModalOpen]);

  // Keep the scroll behavior as well for a second opportunity to show the popup
  useEffect(() => {
    const handleScroll = () => {
      // Get height of viewport
      const viewportHeight = window.innerHeight;
      
      // Check if user has scrolled past the second section (approximately 1.5 viewport heights)
      const scrollTriggerPoint = viewportHeight * 1.5;
      const hasPassedThreshold = window.scrollY > scrollTriggerPoint;
      
      if (hasPassedThreshold && !hasScrolledPastThreshold) {
        setHasScrolledPastThreshold(true);
        
        // Only show popup if it isn't already open and player selection modal isn't open
        if (!isPopupOpen && !isSelectionModalOpen) {
          setIsPopupOpen(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledPastThreshold, isPopupOpen, isSelectionModalOpen]);

  // Handle popup close
  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  // Handle join now button click
  const handleJoinNow = () => {
    setIsPopupOpen(false);
    setIsSelectionModalOpen(true);
  };

  // Context value
  const value = {
    showPopup: () => setIsPopupOpen(true),
    showSelectionModal: () => setIsSelectionModalOpen(true),
  };

  return (
    <FreeWarContext.Provider value={value}>
      {children}
      
      {/* Free War Popup */}
      <FreeWarPopup 
        isOpen={isPopupOpen} 
        onClose={handlePopupClose} 
        onJoinNow={handleJoinNow} 
      />
      
      {/* Player Selection Modal */}
      <PlayerSelectionModal 
        isOpen={isSelectionModalOpen}
        onClose={() => {
          setIsSelectionModalOpen(false);
        }}
      />
      
      {/* Sticky Button - always visible when popup/modal is not open */}
      {!isPopupOpen && !isSelectionModalOpen && (
        <StickyButton onClick={() => setIsPopupOpen(true)} />
      )}
    </FreeWarContext.Provider>
  );
};
