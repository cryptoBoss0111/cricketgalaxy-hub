
import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';
import { getUpcomingMatches, upsertMatch, deleteMatch, uploadImageToStorage } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const matchFormSchema = z.object({
  id: z.string().optional(),
  team1: z.string().min(1, 'Team 1 is required'),
  team2: z.string().min(1, 'Team 2 is required'),
  match_time: z.string().min(1, 'Match date and time is required'),
  venue: z.string().min(1, 'Venue is required'),
  competition: z.string().min(1, 'Competition is required'),
  match_type: z.string().min(1, 'Match type is required'),
  image: z.string().optional()
});

type MatchFormValues = z.infer<typeof matchFormSchema>;

interface Match {
  id: string;
  team1: string;
  team2: string;
  match_time: string;
  venue: string;
  competition: string;
  match_type: string;
  image?: string;
}

const MatchesManager = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      team1: '',
      team2: '',
      match_time: '',
      venue: '',
      competition: '',
      match_type: '',
      image: ''
    }
  });
  
  useEffect(() => {
    fetchMatches();
  }, []);
  
  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const data = await getUpcomingMatches();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load match schedule',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const openForm = (match?: Match) => {
    if (match) {
      setSelectedMatch(match);
      form.reset({
        id: match.id,
        team1: match.team1,
        team2: match.team2,
        match_time: new Date(match.match_time).toISOString().slice(0, 16),
        venue: match.venue,
        competition: match.competition,
        match_type: match.match_type,
        image: match.image || ''
      });
    } else {
      setSelectedMatch(null);
      form.reset({
        team1: '',
        team2: '',
        match_time: '',
        venue: '',
        competition: '',
        match_type: '',
        image: ''
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
    setMatchToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!matchToDelete) return;
    
    try {
      await deleteMatch(matchToDelete);
      setMatches(matches.filter(m => m.id !== matchToDelete));
      toast({
        title: 'Success',
        description: 'Match deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete match',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setMatchToDelete(null);
    }
  };
  
  const onSubmit = async (values: MatchFormValues) => {
    try {
      setIsUploading(true);
      
      // Upload image if selected
      let imageUrl = values.image;
      if (imageFile) {
        const mediaRecord = await uploadImageToStorage(imageFile);
        // Extract the URL from the media record
        imageUrl = mediaRecord.url;
      }
      
      // Format data and save match
      const matchData = {
        ...values,
        image: imageUrl,
        match_time: new Date(values.match_time).toISOString()
      };
      
      await upsertMatch(matchData);
      
      toast({
        title: 'Success',
        description: `Match ${values.id ? 'updated' : 'created'} successfully`,
      });
      
      setIsFormOpen(false);
      fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      toast({
        title: 'Error',
        description: `Failed to ${values.id ? 'update' : 'create'} match`,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const filteredMatches = matches.filter(match => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      match.team1.toLowerCase().includes(query) ||
      match.team2.toLowerCase().includes(query) ||
      match.venue.toLowerCase().includes(query) ||
      match.competition.toLowerCase().includes(query)
    );
  });
  
  // Helper to format date
  const formatMatchDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy, h:mm a");
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Match Schedule</h1>
            <p className="text-gray-500 mt-1">Manage upcoming cricket matches</p>
          </div>
          <Button onClick={() => openForm()}>
            <Plus className="h-4 w-4 mr-2" /> Add Match
          </Button>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search matches by team, venue or competition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500">No matches found</h3>
            <p className="text-gray-400 mt-2 mb-6">Add upcoming matches to show here</p>
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Your First Match
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2 bg-gray-50">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span className="text-cricket-primary">{match.competition}</span>
                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {match.match_type}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4 pt-3">
                  {match.image && (
                    <div className="relative h-32 w-full mb-3 rounded overflow-hidden">
                      <img 
                        src={match.image} 
                        alt={`${match.team1} vs ${match.team2}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">{match.team1}</div>
                    <div className="text-sm text-gray-500">vs</div>
                    <div className="font-medium text-right">{match.team2}</div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">Date:</span> {formatMatchDate(match.match_time)}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">Venue:</span> {match.venue}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openForm(match)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(match.id)}
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
      
      {/* Match Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMatch ? 'Edit Match' : 'Add New Match'}
            </DialogTitle>
            <DialogDescription>
              {selectedMatch 
                ? 'Update the match details below' 
                : 'Fill in the details to add a new match to the schedule'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="team1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team 1</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g. India" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="team2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team 2</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g. Australia" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="match_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Date & Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Melbourne Cricket Ground" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="competition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competition</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select competition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ICC World Cup">ICC World Cup</SelectItem>
                          <SelectItem value="ICC Champions Trophy">ICC Champions Trophy</SelectItem>
                          <SelectItem value="T20 World Cup">T20 World Cup</SelectItem>
                          <SelectItem value="IPL">IPL</SelectItem>
                          <SelectItem value="Test Series">Test Series</SelectItem>
                          <SelectItem value="ODI Series">ODI Series</SelectItem>
                          <SelectItem value="T20I Series">T20I Series</SelectItem>
                          <SelectItem value="Big Bash League">Big Bash League</SelectItem>
                          <SelectItem value="The Hundred">The Hundred</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="match_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select match type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Test">Test</SelectItem>
                          <SelectItem value="ODI">ODI</SelectItem>
                          <SelectItem value="T20">T20</SelectItem>
                          <SelectItem value="T10">T10</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormItem>
                <FormLabel>Match Image</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 800x400 pixels
                    </p>
                  </div>
                  
                  {(form.watch('image') || selectedMatch?.image) && !imageFile && (
                    <div className="relative h-20 w-full">
                      <img 
                        src={form.watch('image') || selectedMatch?.image} 
                        alt="Match preview" 
                        className="absolute inset-0 h-full w-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  {imageFile && (
                    <div className="relative h-20 w-full">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="New image preview" 
                        className="absolute inset-0 h-full w-full object-cover rounded"
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
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Saving...' : 'Save Match'}
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
              Are you sure you want to delete this match? This action cannot be undone.
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

export default MatchesManager;
