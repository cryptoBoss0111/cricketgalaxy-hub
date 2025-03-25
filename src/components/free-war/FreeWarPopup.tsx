
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
      <DialogContent className="w-[95%] sm:w-[90%] md:w-[600px] max-w-md lg:max-w-lg p-0 overflow-hidden border-2 border-orange-500">
        <div className="bg-gradient-to-br from-[#1A2A44] to-[#F97316] text-white">
          <DialogHeader className="p-4 sm:p-5 space-y-2">
            <div className="absolute right-4 top-4">
              <button 
                onClick={onClose}
                className="rounded-full p-1 hover:bg-red-500 transition-colors duration-200 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DialogTitle className="text-xl sm:text-2xl text-center font-bold text-white drop-shadow-md">
              Ready to Win Real Cash in Today's IPL Match?
            </DialogTitle>
            <DialogDescription className="text-center text-white text-opacity-90 font-medium">
              Join our first-ever Free War – <span className="text-orange-300 font-bold">100% FREE!</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Match:</span>
                <span className="font-medium">Gujarat Titans (GT) vs Punjab Kings (PBKS)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Date & Time:</span>
                <span className="font-medium">Today – March 25, 2025 | 7:30 PM IST</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Venue:</span>
                <span className="font-medium">Narendra Modi Stadium, Ahmedabad</span>
              </div>
            </div>
            
            <div className="space-y-2 p-3 bg-white/10 backdrop-blur-sm rounded-md">
              <p className="font-medium text-sm">Build your fantasy team with 11 players from both squads</p>
              <p className="font-medium text-sm">Compete with others in real-time</p>
              <p className="font-medium text-sm">Win from a total <span className="text-orange-300 font-bold">₹500 prize pool</span></p>
            </div>
            
            <p className="text-center italic text-xs text-white/80">No entry fee. No catch. Just your cricket brain.</p>
            
            <div className="space-y-2">
              <p className="font-semibold text-center text-sm">Prize Pool Breakdown:</p>
              <div className="grid grid-cols-2 gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-md">
                <div className="flex justify-between text-xs">
                  <span>1st:</span>
                  <span className="font-bold text-orange-300">₹200</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>2nd:</span>
                  <span className="font-bold text-orange-300">₹100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>3rd:</span>
                  <span className="font-bold text-orange-300">₹50</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>4th–10th:</span>
                  <span className="font-bold text-orange-300">₹20 each</span>
                </div>
                <div className="flex justify-between text-xs col-span-2">
                  <span>11th–20th:</span>
                  <span className="font-bold text-orange-300">₹5 each</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 p-4 bg-[#1A2A44]/50">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="px-4 py-1 h-9 font-medium bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
            >
              Dismiss
            </Button>
            <Button 
              variant="accent" 
              size="sm" 
              onClick={onJoinNow}
              className="px-6 py-1 h-9 font-semibold bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 animate-pulse-subtle shadow-lg border-2 border-orange-300/20"
            >
              Earn Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeWarPopup;
