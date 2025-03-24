
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { submitFreeWarTeam } from '@/integrations/supabase/free-war';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Player {
  name: string;
  team: 'GT' | 'PBKS';
  role?: string;
  isImpact?: boolean;
}

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const gtPlayers: Player[] = [
  { name: 'Shubman Gill (c)', team: 'GT' },
  { name: 'Jos Buttler (wk)', team: 'GT' },
  { name: 'Sai Sudharsan', team: 'GT' },
  { name: 'Shahrukh Khan', team: 'GT' },
  { name: 'Glenn Phillips', team: 'GT' },
  { name: 'Washington Sundar', team: 'GT' },
  { name: 'Rahul Tewatia', team: 'GT' },
  { name: 'Rashid Khan', team: 'GT' },
  { name: 'Kagiso Rabada', team: 'GT' },
  { name: 'Mohammed Siraj', team: 'GT' },
  { name: 'Prasidh Krishna', team: 'GT' },
  { name: 'Gerald Coetzee', team: 'GT', isImpact: true },
  { name: 'Mahipal Lomror', team: 'GT', isImpact: true },
  { name: 'R. Sai Kishore', team: 'GT', isImpact: true },
];

const pbksPlayers: Player[] = [
  { name: 'Prabhsimran Singh', team: 'PBKS' },
  { name: 'Josh Inglis (wk)', team: 'PBKS' },
  { name: 'Shreyas Iyer (c)', team: 'PBKS' },
  { name: 'Glenn Maxwell', team: 'PBKS' },
  { name: 'Marcus Stoinis', team: 'PBKS' },
  { name: 'Shashank Singh', team: 'PBKS' },
  { name: 'Marco Jansen', team: 'PBKS' },
  { name: 'Harpreet Brar', team: 'PBKS' },
  { name: 'Arshdeep Singh', team: 'PBKS' },
  { name: 'Yuzvendra Chahal', team: 'PBKS' },
  { name: 'Lockie Ferguson', team: 'PBKS' },
  { name: 'Xavier Bartlett', team: 'PBKS', isImpact: true },
  { name: 'Nehal Wadhera', team: 'PBKS', isImpact: true },
  { name: 'Azmatullah Omarzai', team: 'PBKS', isImpact: true },
];

const PlayerSelectionModal = ({ isOpen, onClose }: PlayerSelectionModalProps) => {
  const [email, setEmail] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tossCutoffTime] = useState(new Date('2025-03-25T19:30:00+05:30'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTerms, setShowTerms] = useState(false);
  const { toast } = useToast();

  const timeLeft = tossCutoffTime.getTime() - currentTime.getTime();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const handlePlayerToggle = (player: Player) => {
    if (selectedPlayers.some(p => p.name === player.name)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.name !== player.name));
    } else {
      if (selectedPlayers.length < 11) {
        setSelectedPlayers([...selectedPlayers, player]);
      } else {
        toast({
          title: "Team limit reached",
          description: "You can select a maximum of 11 players",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPlayers.length < 11) {
      toast({
        title: "Team incomplete",
        description: `Please select 11 players (${selectedPlayers.length} selected)`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await submitFreeWarTeam(
        email,
        selectedPlayers.map(p => p.name)
      );
      
      if (result.success) {
        toast({
          title: "Team submitted successfully!",
          description: "Good luck in the contest. Results will be sent to your email.",
          duration: 5000,
        });
        
        // Reset form and close modal
        setEmail('');
        setSelectedPlayers([]);
        onClose();
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "Please try again later",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Submission error",
        description: "An error occurred while submitting your team",
        variant: "destructive"
      });
      console.error("Error submitting team:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isPlayerSelected = (player: Player) => {
    return selectedPlayers.some(p => p.name === player.name);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-2 border-orange-500">
          <div className="bg-[#1A2A44] text-white p-4">
            <DialogHeader>
              <div className="absolute right-4 top-4 z-10">
                <button 
                  onClick={onClose}
                  className="rounded-full p-1 hover:bg-red-500 text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <DialogTitle className="text-xl text-center font-bold">
                GT vs PBKS Free War – Build Your Team!
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="space-y-6 p-6 bg-white">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="border-gray-300"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Winners will be notified via email
              </p>
            </div>
            
            <div className="flex justify-center items-center">
              <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-3 py-1.5 rounded-full font-bold text-sm">
                Time left: {hoursLeft}h {minutesLeft}m until toss
              </span>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">Select Your Team (11 players)</h3>
                <span className="text-sm bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {selectedPlayers.length}/11 selected
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-bold text-[#1A2A44] mb-3">Gujarat Titans (GT)</h4>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
                    {gtPlayers.map((player) => (
                      <div 
                        key={player.name}
                        className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer ${
                          isPlayerSelected(player) 
                            ? 'bg-orange-100 border border-orange-300' 
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => handlePlayerToggle(player)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{player.name}</span>
                          {player.isImpact && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                              Impact
                            </span>
                          )}
                        </div>
                        {isPlayerSelected(player) && (
                          <Check className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-bold text-[#D50032] mb-3">Punjab Kings (PBKS)</h4>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
                    {pbksPlayers.map((player) => (
                      <div 
                        key={player.name}
                        className={`flex items-center justify-between p-2.5 rounded-md cursor-pointer ${
                          isPlayerSelected(player) 
                            ? 'bg-orange-100 border border-orange-300' 
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                        onClick={() => handlePlayerToggle(player)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{player.name}</span>
                          {player.isImpact && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                              Impact
                            </span>
                          )}
                        </div>
                        {isPlayerSelected(player) && (
                          <Check className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <button 
                type="button" 
                onClick={() => setShowTerms(true)}
                className="text-orange-500 text-sm hover:underline font-medium"
              >
                Terms & Conditions
              </button>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="accent" 
                size="lg" 
                onClick={handleSubmit}
                disabled={isSubmitting || selectedPlayers.length !== 11}
                className="px-8 py-6 h-auto font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Submit My Team"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-md border-2 border-orange-500">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>One account per participant.</li>
              <li>Valid email is required. Winners will be contacted by email.</li>
              <li>Team performance will be based on actual match stats.</li>
              <li>Any cheating, fake accounts, or automation use will lead to disqualification.</li>
              <li>This contest is completely FREE to enter and play.</li>
            </ol>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              variant="accent" 
              onClick={() => setShowTerms(false)}
              className="px-6 bg-orange-500 hover:bg-orange-600"
            >
              Back to Contest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerSelectionModal;
