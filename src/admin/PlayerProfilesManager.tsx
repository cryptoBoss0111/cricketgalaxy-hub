
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserIcon, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import ImageUploader from './components/ImageUploader';

interface PlayerProfile {
  id: string;
  name: string;
  team: string;
  role: string;
  bio: string;
  image: string;
  stats: Record<string, any>;
  created_at: string;
}

const SAMPLE_PLAYERS: PlayerProfile[] = [
  {
    id: '1',
    name: 'Virat Kohli',
    team: 'India',
    role: 'Batsman',
    bio: 'Virat Kohli is an Indian international cricketer and the former captain of the Indian national cricket team. He currently represents Royal Challengers Bangalore in the IPL.',
    image: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    stats: {
      matches: 274,
      runs: 12898,
      average: 53.51,
      centuries: 46
    },
    created_at: '2025-02-14T12:00:00Z'
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    team: 'India',
    role: 'Bowler',
    bio: 'Jasprit Bumrah is an Indian international cricketer who plays for the Indian cricket team in all formats of the game. He is a right-arm fast bowler.',
    image: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    stats: {
      matches: 72,
      wickets: 336,
      economy: 3.39,
      best: '6/27'
    },
    created_at: '2025-02-15T12:00:00Z'
  },
  {
    id: '3',
    name: 'Ellyse Perry',
    team: 'Australia',
    role: 'All-rounder',
    bio: 'Ellyse Perry is an Australian sportswoman who has represented her country in cricket and football. She is the youngest person to represent Australia in cricket.',
    image: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    stats: {
      matches: 129,
      runs: 3369,
      wickets: 158,
      hundreds: 3
    },
    created_at: '2025-02-16T12:00:00Z'
  }
];

const PlayerProfilesManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<PlayerProfile[]>(SAMPLE_PLAYERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Partial<PlayerProfile>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<PlayerProfile | null>(null);
  
  const { toast } = useToast();

  // Fetch player profiles (simulated)
  const fetchPlayers = () => {
    setIsLoading(true);
    
    // Filter the players based on search query and filters
    let filteredPlayers = [...SAMPLE_PLAYERS];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPlayers = filteredPlayers.filter(player => 
        player.name.toLowerCase().includes(query) || 
        player.bio.toLowerCase().includes(query)
      );
    }
    
    if (roleFilter) {
      filteredPlayers = filteredPlayers.filter(player => player.role === roleFilter);
    }
    
    if (teamFilter) {
      filteredPlayers = filteredPlayers.filter(player => player.team === teamFilter);
    }
    
    setPlayers(filteredPlayers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, [searchQuery, roleFilter, teamFilter]);

  const handleCreatePlayer = () => {
    setCurrentPlayer({});
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditPlayer = (player: PlayerProfile) => {
    setCurrentPlayer(player);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const confirmDeletePlayer = (player: PlayerProfile) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

  const handleDeletePlayer = () => {
    if (!playerToDelete) return;
    
    // Remove the player from the list (simulated)
    setPlayers(players.filter(player => player.id !== playerToDelete.id));
    
    toast({
      title: "Player deleted",
      description: `${playerToDelete.name} has been deleted successfully`,
    });
    
    setDeleteDialogOpen(false);
    setPlayerToDelete(null);
  };

  const handleSavePlayer = () => {
    if (!currentPlayer.name || !currentPlayer.team || !currentPlayer.role) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate saving the player
    if (isEditing && currentPlayer.id) {
      // Update existing player
      setPlayers(players.map(player => 
        player.id === currentPlayer.id ? {...player, ...currentPlayer} as PlayerProfile : player
      ));
      
      toast({
        title: "Player updated",
        description: `${currentPlayer.name} has been updated successfully`,
      });
    } else {
      // Create new player
      const newPlayer: PlayerProfile = {
        id: Date.now().toString(),
        name: currentPlayer.name || '',
        team: currentPlayer.team || '',
        role: currentPlayer.role || '',
        bio: currentPlayer.bio || '',
        image: currentPlayer.image || 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
        stats: currentPlayer.stats || {},
        created_at: new Date().toISOString()
      };
      
      setPlayers([newPlayer, ...players]);
      
      toast({
        title: "Player created",
        description: `${newPlayer.name} has been added successfully`,
      });
    }
    
    setDialogOpen(false);
    setCurrentPlayer({});
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Player Profiles</h1>
            <p className="text-muted-foreground mt-1">Manage player information and statistics</p>
          </div>
          <Button onClick={handleCreatePlayer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Player
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-rounder">All-rounder</SelectItem>
                <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Teams</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="England">England</SelectItem>
                <SelectItem value="New Zealand">New Zealand</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <Card key={player.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-semibold text-white">{player.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-sm">{player.team}</span>
                      <span className="bg-cricket-accent/90 text-white text-xs px-2 py-1 rounded-full">
                        {player.role}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {player.bio}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPlayer(player)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmDeletePlayer(player)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <UserIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium">No Players Found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Add player profiles to get started or try a different search.
              </p>
              <Button variant="outline" onClick={handleCreatePlayer}>
                Add Player Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Player Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Player Profile' : 'Create Player Profile'}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Player Name*</Label>
                  <Input
                    id="name"
                    value={currentPlayer.name || ''}
                    onChange={(e) => setCurrentPlayer({...currentPlayer, name: e.target.value})}
                    placeholder="Enter player name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="team">Team*</Label>
                  <Select 
                    value={currentPlayer.team || ''} 
                    onValueChange={(value) => setCurrentPlayer({...currentPlayer, team: value})}
                  >
                    <SelectTrigger id="team">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="England">England</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="West Indies">West Indies</SelectItem>
                      <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role*</Label>
                  <Select 
                    value={currentPlayer.role || ''} 
                    onValueChange={(value) => setCurrentPlayer({...currentPlayer, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Batsman">Batsman</SelectItem>
                      <SelectItem value="Bowler">Bowler</SelectItem>
                      <SelectItem value="All-rounder">All-rounder</SelectItem>
                      <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={currentPlayer.bio || ''}
                    onChange={(e) => setCurrentPlayer({...currentPlayer, bio: e.target.value})}
                    placeholder="Enter player biography"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Player Image</Label>
                <ImageUploader
                  existingImageUrl={currentPlayer.image}
                  onImageUploaded={(url) => setCurrentPlayer({...currentPlayer, image: url})}
                  label="Profile Image"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePlayer}>
                {isEditing ? 'Save Changes' : 'Create Player'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Player</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete {playerToDelete?.name}? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePlayer}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default PlayerProfilesManager;
