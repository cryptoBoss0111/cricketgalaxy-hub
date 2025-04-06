
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BadgeDollarSign } from 'lucide-react';
import { useFreeWar } from './FreeWarProvider';

interface StickyButtonProps {
  onClick: () => void;
}

const StickyButton = ({ onClick }: StickyButtonProps) => {
  const { toast } = useToast();
  const { showPopup } = useFreeWar();
  
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
    <div className="fixed bottom-16 right-3 z-40 group md:bottom-6 md:right-6 md:z-50">
      <div className="absolute inset-0 bg-orange-500 rounded-full opacity-75 animate-pulse scale-110"></div>
      <Button
        variant="accent"
        size="sm"
        onClick={handleClick}
        className="relative shadow-lg px-3 py-1 h-auto rounded-full font-medium bg-gradient-to-r from-orange-500 to-orange-400 border border-white hover:scale-105 transition-all duration-200 hover:brightness-110 text-xs"
      >
        <BadgeDollarSign className="mr-1 h-3 w-3" />
        Earn Now
      </Button>
    </div>
  );
};

export default StickyButton;
