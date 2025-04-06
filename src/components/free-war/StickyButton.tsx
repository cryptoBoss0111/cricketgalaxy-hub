
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BadgeDollarSign } from 'lucide-react';
import { useFreeWar } from './FreeWarProvider';
import { useIsMobile } from '@/hooks/use-mobile';

interface StickyButtonProps {
  onClick: () => void;
}

const StickyButton = ({ onClick }: StickyButtonProps) => {
  const { toast } = useToast();
  const { showPopup } = useFreeWar();
  const isMobile = useIsMobile();
  
  // Don't render on mobile
  if (isMobile) return null;
  
  const handleClick = () => {
    toast({
      title: "GT vs PBKS Free War is LIVE!",
      description: "Entry: ₹0 | Prize Pool: ₹500. Build your team before toss time (7:30 PM IST). Join now and win big!",
      duration: 5000,
    });
    
    // Show the popup instead of directly going to selection modal
    showPopup();
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 group hidden md:block">
      <div className="absolute inset-0 bg-orange-500 rounded-full opacity-75 animate-pulse scale-110"></div>
      <Button
        variant="accent"
        size="sm"
        onClick={handleClick}
        className="relative shadow-lg px-4 py-2 h-auto rounded-full font-medium bg-gradient-to-r from-orange-500 to-orange-400 border border-white hover:scale-105 transition-all duration-200 hover:brightness-110"
      >
        <BadgeDollarSign className="mr-2 h-4 w-4" />
        Earn Now
      </Button>
    </div>
  );
};

export default StickyButton;
