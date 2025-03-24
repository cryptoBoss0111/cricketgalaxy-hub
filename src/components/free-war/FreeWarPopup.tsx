
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface FreeWarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinNow: () => void;
}

const FreeWarPopup = ({ isOpen, onClose, onJoinNow }: FreeWarPopupProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="absolute right-4 top-4">
            <button 
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogTitle className="text-xl text-center text-cricket-accent font-bold">
            Ready to Win Real Cash in Today's IPL Match?
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            Join our first-ever Free War – 100% FREE!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Match:</span>
              <span>Gujarat Titans (GT) vs Punjab Kings (PBKS)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date & Time:</span>
              <span>Today – March 25, 2025 | 7:30 PM IST</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Venue:</span>
              <span>Narendra Modi Stadium, Ahmedabad</span>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <p className="font-medium">Build your fantasy team with 11 players from both squads</p>
            <p className="font-medium">Compete with others in real-time</p>
            <p className="font-medium">Win from a total ₹500 prize pool</p>
          </div>
          
          <p className="text-center italic">No entry fee. No catch. Just your cricket brain.</p>
          
          <div className="space-y-2">
            <p className="font-semibold text-center">Prize Pool Breakdown:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span>1st:</span>
                <span>₹200</span>
              </div>
              <div className="flex justify-between">
                <span>2nd:</span>
                <span>₹100</span>
              </div>
              <div className="flex justify-between">
                <span>3rd:</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between">
                <span>4th–10th:</span>
                <span>₹20 each</span>
              </div>
              <div className="flex justify-between">
                <span>11th–20th:</span>
                <span>₹5 each</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onClose}
            className="px-6 py-2 font-medium"
          >
            Dismiss
          </Button>
          <Button 
            variant="accent" 
            size="lg" 
            onClick={onJoinNow}
            className="px-8 py-2 font-semibold"
          >
            Earn Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeWarPopup;
