
import { useState, useEffect } from 'react';
import { Award, Plus, Search, Edit, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { getFantasyPicks, upsertFantasyPick, deleteFantasyPick } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const fantasyPickSchema = z.object({
  id: z.string().optional(),
  player_name: z.string().min(1, 'Player name is required'),
  team: z.string().min(1, 'Team is required'),
  role: z.string().min(1, 'Role is required'),
  form: z.string().min(1, 'Current form is required'),
  points_prediction: z.number().min(0, 'Prediction must be a positive number'),
  reason: z.string().min(1, 'Selection reason is required'),
  match: z.string().min(1, 'Match is required')
});

type FantasyPickFormValues = z.infer<typeof fantasyPickSchema>;

interface FantasyPick {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  points_prediction: number;
  reason: string;
  match: string;
}

const FantasyPicksManager = () => {
  const [picks, setPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPick, setSelectedPick] = useState<FantasyPick | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pickToDelete, setPickToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<FantasyPickFormValues>({
    resolver: zodResolver(fantasyPickSchema),
    defaultValues: {
      player_name: '',
      team: '',
      role: '',
      form: '',
      points_prediction: 0,
      reason: '',
      match: ''
    }
  });
  
  useEffect(() => {
    fetchFantasyPicks();
  }, []);
  
  const fetchFantasyPicks = async () => {
    setIsLoading(true);
    try {
      const data = await getFantasyPicks();
      setPicks(data);
    } catch (error) {
      console.error('Error fetching fantasy picks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fantasy picks',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredPicks = picks.filter(pick => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      pick.player_name.toLowerCase().includes(query) ||
      pick.team.toLowerCase().includes(query) ||
      pick.match.toLowerCase().includes(query)
    );
  });
  
  const openForm = (pick?: FantasyPick) => {
    if (pick) {
      setSelectedPick(pick);
      form.reset({
        id: pick.id,
        player_name: pick.player_name,
        team: pick.team,
        role: pick.role,
        form: pick.form,
        points_prediction: pick.points_prediction,
        reason: pick.reason,
        match: pick.match
      });
    } else {
      setSelectedPick(null);
      form.reset({
        player_name: '',
        team: '',
        role: '',
        form: '',
        points_prediction: 0,
        reason: '',
        match: ''
      });
    }
    setIsFormOpen(true);
  };
  
  const confirmDelete = (id: string) => {
    setPickToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!pickToDelete) return;
    
    try {
      await deleteFantasyPick(pickToDelete);
      setPicks(picks.filter(pick => pick.id !== pickToDelete));
      toast({
        title: 'Success',
        description: 'Fantasy pick deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting fantasy pick:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete fantasy pick',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPickToDelete(null);
    }
  };
  
  const onSubmit = async (values: FantasyPickFormValues) => {
    try {
      await upsertFantasyPick(values);
      
      toast({
        title: 'Success',
        description: `Fantasy pick ${values.id ? 'updated' : 'created'} successfully`,
      });
      
      setIsFormOpen(false);
      fetchFantasyPicks();
    } catch (error) {
      console.error('Error saving fantasy pick:', error);
      toast({
        title: 'Error',
        description: `Failed to ${values.id ? 'update' : 'create'} fantasy pick`,
        variant: 'destructive'
      });
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
  
  // Helper to get form color based on value
  const getFormColor = (form: string) => {
    switch (form.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-green-50 text-green-700';
      case 'average':
        return 'bg-blue-50 text-blue-700';
      case 'poor':
        return 'bg-amber-50 text-amber-700';
      case 'bad':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Fantasy Picks</h1>
            <p className="text-gray-500 mt-1">Manage fantasy cricket player picks</p>
          </div>
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4 mr-2" /> Add Fantasy Pick
          </Button>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search fantasy picks by player name or match..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
          </div>
        ) : filteredPicks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500">No fantasy picks found</h3>
            <p className="text-gray-400 mt-2 mb-6">Add fantasy picks to show here</p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Fantasy Pick
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPicks.map((pick) => (
              <Card key={pick.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 bg-gray-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    {pick.player_name}
                  </CardTitle>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    pick.role === 'Batsman' ? 'bg-blue-100 text-blue-800' :
                    pick.role === 'Bowler' ? 'bg-green-100 text-green-800' :
                    pick.role === 'All-rounder' ? 'bg-purple-100 text-purple-800' :
                    pick.role === 'Wicket-keeper' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {pick.role}
                  </span>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 bg-cricket-primary text-white mr-3">
                      <span className="text-sm font-semibold">{getInitials(pick.player_name)}</span>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold">
                        {pick.team}
                      </div>
                      <div className="text-sm text-gray-500">
                        {pick.match}
                      </div>
                    </div>
                    
                    <div className="ml-auto">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Predicted Points</div>
                        <div className="font-bold text-lg text-cricket-accent">{pick.points_prediction}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium">Current Form</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getFormColor(pick.form)}`}>
                      {pick.form}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium">Selection Reason</div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {pick.reason}
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openForm(pick)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(pick.id)}
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
      
      {/* Fantasy Pick Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPick ? 'Edit Fantasy Pick' : 'Add New Fantasy Pick'}
            </DialogTitle>
            <DialogDescription>
              {selectedPick 
                ? 'Update the fantasy pick details below' 
                : 'Fill in the details to add a new fantasy cricket pick'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="player_name"
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
                          <SelectItem value="Chennai Super Kings">Chennai Super Kings</SelectItem>
                          <SelectItem value="Mumbai Indians">Mumbai Indians</SelectItem>
                          <SelectItem value="Royal Challengers Bangalore">Royal Challengers Bangalore</SelectItem>
                          <SelectItem value="Kolkata Knight Riders">Kolkata Knight Riders</SelectItem>
                          <SelectItem value="Delhi Capitals">Delhi Capitals</SelectItem>
                          <SelectItem value="Punjab Kings">Punjab Kings</SelectItem>
                          <SelectItem value="Rajasthan Royals">Rajasthan Royals</SelectItem>
                          <SelectItem value="Sunrisers Hyderabad">Sunrisers Hyderabad</SelectItem>
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Form</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select form" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Bad">Bad</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="points_prediction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Prediction</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="match"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. India vs Australia, 3rd T20I" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selection Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Why is this player a good fantasy pick?" 
                        className="h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedPick ? 'Update Pick' : 'Add Pick'}
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
              Are you sure you want to delete this fantasy pick? This action cannot be undone.
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

export default FantasyPicksManager;
