
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
  const [hasClosedPopup, setHasClosedPopup] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [hasScrolledPastThreshold, setHasScrolledPastThreshold] = useState(false);

  // Handle scroll to show popup when scrolling past the second section
  useEffect(() => {
    const handleScroll = () => {
      // Get height of viewport
      const viewportHeight = window.innerHeight;
      
      // Check if user has scrolled past the second section (approximately 1.5 viewport heights)
      const scrollTriggerPoint = viewportHeight * 1.5;
      const hasPassedThreshold = window.scrollY > scrollTriggerPoint;
      
      if (hasPassedThreshold && !hasScrolledPastThreshold) {
        setHasScrolledPastThreshold(true);
        
        // Only show popup if it hasn't been closed before
        if (!hasClosedPopup && !isPopupOpen && !isSelectionModalOpen) {
          setIsPopupOpen(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasClosedPopup, hasScrolledPastThreshold, isPopupOpen, isSelectionModalOpen]);

  // Handle popup close
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setHasClosedPopup(true);
    setShowStickyButton(true);
  };

  // Handle join now button click
  const handleJoinNow = () => {
    setIsPopupOpen(false);
    setIsSelectionModalOpen(true);
    setHasClosedPopup(true);
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
          setShowStickyButton(true);
        }}
      />
      
      {/* Sticky Button */}
      {showStickyButton && !isPopupOpen && !isSelectionModalOpen && (
        <StickyButton onClick={() => setIsSelectionModalOpen(true)} />
      )}
    </FreeWarContext.Provider>
  );
};
