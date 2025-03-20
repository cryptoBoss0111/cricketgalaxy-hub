
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getPlayerProfiles, upsertPlayerProfile, deletePlayerProfile, uploadImageToStorage } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const playerProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Player name is required'),
  team: z.string().min(1, 'Team is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  image: z.string().optional(),
  stats: z.record(z.any()).optional().default({})
});

type PlayerProfileFormValues = z.infer<typeof playerProfileSchema>;

interface PlayerProfile {
  id: string;
  name: string;
  team: string;
  role: string;
  bio?: string;
  image?: string;
  stats: Record<string, any>;
}

const PlayerProfilesManager = () => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<PlayerProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  const form = useForm<PlayerProfileFormValues>({
    resolver: zodResolver(playerProfileSchema),
    defaultValues: {
      name: '',
      team: '',
      role: '',
      bio: '',
      image: '',
      stats: {}
    }
  });
  
  useEffect(() => {
    fetchPlayerProfiles();
  }, []);
  
  const fetchPlayerProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await getPlayerProfiles(searchQuery, teamFilter, roleFilter);
      setProfiles(data);
      
      // Extract unique teams and roles for filters
      const uniqueTeams = Array.from(new Set(data.map(profile => profile.team)));
      const uniqueRoles = Array.from(new Set(data.map(profile => profile.role)));
      setTeams(uniqueTeams);
      setRoles(uniqueRoles);
    } catch (error) {
      console.error('Error fetching player profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load player profiles',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    fetchPlayerProfiles();
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setTeamFilter('');
    setRoleFilter('');
    fetchPlayerProfiles();
  };
  
  const openForm = (profile?: PlayerProfile) => {
    if (profile) {
      setSelectedProfile(profile);
      form.reset({
        id: profile.id,
        name: profile.name,
        team: profile.team,
        role: profile.role,
        bio: profile.bio || '',
        image: profile.image || '',
        stats: profile.stats || {}
      });
    } else {
      setSelectedProfile(null);
      form.reset({
        name: '',
        team: '',
        role: '',
        bio: '',
        image: '',
        stats: {}
      });
    }
    setIsFormOpen(true);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const confirmDelete = (id: string) => {
    setProfileToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!profileToDelete) return;
    
    try {
      await deletePlayerProfile(profileToDelete);
      setProfiles(profiles.filter(profile => profile.id !== profileToDelete));
      toast({
        title: 'Success',
        description: 'Player profile deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting player profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete player profile',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };
  
  const onSubmit = async (values: PlayerProfileFormValues) => {
    try {
      setIsUploading(true);
      
      // Upload image if selected
      let imageUrl = values.image;
      if (imageFile) {
        imageUrl = await uploadImageToStorage(imageFile);
      }
      
      // Prepare stats object with default values if empty
      const stats = values.stats || {
        matches: 0,
        runs: 0,
        wickets: 0,
        average: 0,
        strikeRate: 0,
        highestScore: 0,
        bestBowling: '0/0'
      };
      
      // Format data and save player profile
      const profileData = {
        ...values,
        image: imageUrl,
        stats
      };
      
      await upsertPlayerProfile(profileData);
      
      toast({
        title: 'Success',
        description: `Player profile ${values.id ? 'updated' : 'created'} successfully`,
      });
      
      setIsFormOpen(false);
      fetchPlayerProfiles();
    } catch (error) {
      console.error('Error saving player profile:', error);
      toast({
        title: 'Error',
        description: `Failed to ${values.id ? 'update' : 'create'} player profile`,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Player Profiles</h1>
            <p className="text-gray-500 mt-1">Manage cricket player profiles</p>
          </div>
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4 mr-2" /> Add Player
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={applyFilters}>
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500">No player profiles found</h3>
            <p className="text-gray-400 mt-2 mb-6">Add player profiles to show here</p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Player
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 bg-gray-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {profile.name}
                  </CardTitle>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    profile.role === 'Batsman' ? 'bg-blue-100 text-blue-800' :
                    profile.role === 'Bowler' ? 'bg-green-100 text-green-800' :
                    profile.role === 'All-rounder' ? 'bg-purple-100 text-purple-800' :
                    profile.role === 'Wicket-keeper' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.role}
                  </span>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex gap-4 mb-4">
                    {profile.image ? (
                      <Avatar className="h-16 w-16">
                        <img src={profile.image} alt={profile.name} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-16 w-16 bg-cricket-primary text-white">
                        <span className="text-lg font-semibold">{getInitials(profile.name)}</span>
                      </Avatar>
                    )}
                    
                    <div>
                      <div className="font-medium text-sm text-gray-500">
                        Team
                      </div>
                      <div className="font-semibold">
                        {profile.team}
                      </div>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {profile.bio}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    {profile.stats && Object.keys(profile.stats).length > 0 && (
                      <>
                        <div>
                          <div className="text-xs text-gray-500">Matches</div>
                          <div className="font-medium">{profile.stats.matches || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Runs</div>
                          <div className="font-medium">{profile.stats.runs || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Wickets</div>
                          <div className="font-medium">{profile.stats.wickets || 0}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Average</div>
                          <div className="font-medium">{profile.stats.average || 0}</div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openForm(profile)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(profile.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Player Profile Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProfile ? 'Edit Player Profile' : 'Add New Player'}
            </DialogTitle>
            <DialogDescription>
              {selectedProfile 
                ? 'Update the player details below' 
                : 'Fill in the details to add a new player profile'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Virat Kohli" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                        </FormControl>
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
                          <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                          <SelectItem value="Ireland">Ireland</SelectItem>
                          <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Batsman">Batsman</SelectItem>
                          <SelectItem value="Bowler">Bowler</SelectItem>
                          <SelectItem value="All-rounder">All-rounder</SelectItem>
                          <SelectItem value="Wicket-keeper">Wicket-keeper</SelectItem>
                          <SelectItem value="Captain">Captain</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief description of the player's career and achievements" 
                        className="h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Player Image</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 500x500 pixels
                    </p>
                  </div>
                  
                  {(form.watch('image') || selectedProfile?.image) && !imageFile && (
                    <div className="relative h-24 w-24">
                      <img 
                        src={form.watch('image') || selectedProfile?.image} 
                        alt="Player preview" 
                        className="absolute inset-0 h-full w-full object-cover rounded-full"
                      />
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="relative h-24 w-24">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="New image preview" 
                        className="absolute inset-0 h-full w-full object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
              </FormItem>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <h3 className="text-lg font-medium">Player Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="stats.matches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matches</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.runs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Runs</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.wickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wickets</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.average"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.strikeRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strike Rate</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                          value={field.value || 0}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.highestScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Score</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value)} 
                          value={field.value || '0'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stats.bestBowling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Best Bowling</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="E.g. 5/20" 
                          onChange={(e) => field.onChange(e.target.value)} 
                          value={field.value || '0/0'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Saving...' : 'Save Player'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this player profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PlayerProfilesManager;
