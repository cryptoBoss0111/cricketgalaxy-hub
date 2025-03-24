
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StickyButtonProps {
  onClick: () => void;
}

const StickyButton = ({ onClick }: StickyButtonProps) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "GT vs PBKS Free War is LIVE!",
      description: "Entry: ₹0 | Prize Pool: ₹500. Build your team before toss time (7:30 PM IST). Join now and win big!",
      duration: 5000,
    });
    
    onClick();
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
      <Button
        variant="accent"
        size="lg"
        onClick={handleClick}
        className="shadow-lg px-6 py-6 h-auto rounded-full font-semibold"
      >
        Earn Now
      </Button>
    </div>
  );
};

export default StickyButton;
