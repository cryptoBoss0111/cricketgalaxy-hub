
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
  
  const handleSubmit = () => {
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
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitted team:', {
        email,
        players: selectedPlayers.map(p => p.name)
      });
      
      setIsSubmitting(false);
      onClose();
      
      toast({
        title: "Team submitted successfully!",
        description: "Good luck in the contest. Results will be sent to your email.",
        duration: 5000,
      });
      
      // Reset form
      setEmail('');
      setSelectedPlayers([]);
    }, 1000);
  };
  
  const isPlayerSelected = (player: Player) => {
    return selectedPlayers.some(p => p.name === player.name);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
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
            Free War Contest Entry
          </DialogTitle>
          <DialogDescription className="text-center">
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="font-semibold">Time left:</span>
              <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-2 py-1 rounded">
                {hoursLeft}h {minutesLeft}m until toss
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Winners will be notified via email
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Select Your Team (11 players)</h3>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {selectedPlayers.length}/11 selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-cricket-accent mb-2">Gujarat Titans (GT)</h4>
                <div className="space-y-1">
                  {gtPlayers.map((player) => (
                    <div 
                      key={player.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        isPlayerSelected(player) 
                          ? 'bg-cricket-accent/20 dark:bg-cricket-accent/30' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      } ${player.isImpact ? 'opacity-80' : ''}`}
                      onClick={() => handlePlayerToggle(player)}
                    >
                      <div className="flex items-center">
                        <span>{player.name}</span>
                        {player.isImpact && (
                          <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-1 rounded">
                            Impact
                          </span>
                        )}
                      </div>
                      {isPlayerSelected(player) && (
                        <Check className="h-4 w-4 text-cricket-accent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-cricket-accent mb-2">Punjab Kings (PBKS)</h4>
                <div className="space-y-1">
                  {pbksPlayers.map((player) => (
                    <div 
                      key={player.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        isPlayerSelected(player) 
                          ? 'bg-cricket-accent/20 dark:bg-cricket-accent/30' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      } ${player.isImpact ? 'opacity-80' : ''}`}
                      onClick={() => handlePlayerToggle(player)}
                    >
                      <div className="flex items-center">
                        <span>{player.name}</span>
                        {player.isImpact && (
                          <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-1 rounded">
                            Impact
                          </span>
                        )}
                      </div>
                      {isPlayerSelected(player) && (
                        <Check className="h-4 w-4 text-cricket-accent" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
            <h4 className="font-semibold">Terms & Conditions:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>One account per participant.</li>
              <li>Valid email is required. Winners will be contacted by email.</li>
              <li>Team performance will be based on actual match stats.</li>
              <li>Any cheating, fake accounts, or automation use will lead to disqualification.</li>
              <li>This contest is completely FREE to enter and play.</li>
            </ol>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="accent" 
            size="lg" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit My Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectionModal;
