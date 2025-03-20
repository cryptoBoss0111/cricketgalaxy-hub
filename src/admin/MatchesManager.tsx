
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar, Trophy, ArrowUpDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface Match {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  match_date: string;
  match_time: string;
  match_type: string; // T20, ODI, Test
  tournament: string;
  description?: string;
  is_featured: boolean;
  status: 'upcoming' | 'live' | 'completed';
}

const MatchesManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Partial<Match> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for matches
  const mockMatches: Match[] = [
    {
      id: '1',
      team1: 'India',
      team2: 'Australia',
      venue: 'Sydney Cricket Ground, Australia',
      match_date: '2025-01-15',
      match_time: '09:30',
      match_type: 'Test',
      tournament: 'Border-Gavaskar Trophy',
      description: 'First Test of the 5-match Border-Gavaskar Trophy series',
      is_featured: true,
      status: 'upcoming'
    },
    {
      id: '2',
      team1: 'England',
      team2: 'South Africa',
      venue: 'Lord\'s, London',
      match_date: '2025-02-02',
      match_time: '14:00',
      match_type: 'ODI',
      tournament: 'England vs South Africa Series',
      description: 'First ODI of the 3-match series',
      is_featured: false,
      status: 'upcoming'
    },
    {
      id: '3',
      team1: 'Mumbai Indians',
      team2: 'Chennai Super Kings',
      venue: 'Wankhede Stadium, Mumbai',
      match_date: '2025-04-10',
      match_time: '19:30',
      match_type: 'T20',
      tournament: 'IPL 2025',
      description: 'Opening match of IPL 2025',
      is_featured: true,
      status: 'upcoming'
    },
    {
      id: '4',
      team1: 'Royal Challengers Bangalore',
      team2: 'Kolkata Knight Riders',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      match_date: '2025-04-12',
      match_time: '19:30',
      match_type: 'T20',
      tournament: 'IPL 2025',
      is_featured: false,
      status: 'upcoming'
    }
  ];

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('matches')
        //   .select('*')
        //   .order('match_date', { ascending: true });
        
        // if (error) throw error;
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load matches',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [toast]);

  const filteredMatches = matches.filter(match => match.status === activeTab);

  const handleAddNew = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCurrentMatch({
      team1: '',
      team2: '',
      venue: '',
      match_date: tomorrow.toISOString().split('T')[0],
      match_time: '19:30',
      match_type: 'T20',
      tournament: '',
      description: '',
      is_featured: false,
      status: 'upcoming'
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (match: Match) => {
    setCurrentMatch({...match});
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      try {
        setIsLoading(true);
        // In a real implementation, we would delete from Supabase
        // const { error } = await supabase.from('matches').delete().eq('id', id);
        // if (error) throw error;
        
        // Update local state
        setMatches(matches.filter(match => match.id !== id));
        
        toast({
          title: 'Success',
          description: 'Match deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting match:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete match',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!currentMatch) return;
    
    if (!currentMatch.team1 || !currentMatch.team2 || !currentMatch.venue || 
        !currentMatch.match_date || !currentMatch.tournament) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real implementation, we would save to Supabase
      // const { data, error } = isEditing
      //   ? await supabase.from('matches').update(currentMatch).eq('id', currentMatch.id).select()
      //   : await supabase.from('matches').insert(currentMatch).select();
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      if (isEditing) {
        setMatches(matches.map(match => 
          match.id === currentMatch.id ? {...currentMatch as Match} : match
        ));
      } else {
        const newMatch = {
          ...currentMatch,
          id: `new-${Date.now()}`,
        } as Match;
        
        setMatches([...matches, newMatch]);
      }
      
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: `Match ${isEditing ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      console.error('Error saving match:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'add'} match`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'Test':
        return 'bg-red-100 text-red-800';
      case 'ODI':
        return 'bg-blue-100 text-blue-800';
      case 'T20':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Match Schedule Manager</h1>
            <p className="text-muted-foreground mt-1">Manage upcoming cricket matches and schedules</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Match
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-0">
            {isLoading && filteredMatches.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-cricket-accent border-t-transparent rounded-full"></div>
              </div>
            ) : filteredMatches.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium">No Upcoming Matches</h3>
                  <p className="text-muted-foreground mt-2">Schedule a new match to see it here</p>
                  <Button className="mt-4" onClick={handleAddNew}>
                    <Plus className="mr-2 h-4 w-4" /> Add Match
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMatches.map((match) => (
                  <Card key={match.id} className={`overflow-hidden hover:shadow-md transition-shadow ${match.is_featured ? 'border-cricket-accent' : ''}`}>
                    {match.is_featured && (
                      <div className="bg-cricket-accent text-white px-3 py-1 text-xs font-semibold uppercase text-center">
                        Featured Match
                      </div>
                    )}
                    <CardHeader className="bg-gray-50 pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getMatchTypeColor(match.match_type)}`}>
                            {match.match_type}
                          </span>
                          <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                            {match.tournament}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(match)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(match.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="mt-3 text-xl">
                        <div className="flex justify-between items-center">
                          <span>{match.team1}</span>
                          <ArrowUpDown className="h-4 w-4 mx-4 text-gray-400" />
                          <span>{match.team2}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Date & Time</div>
                          <div className="text-sm">
                            {formatDate(match.match_date)} at {match.match_time}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Venue</div>
                          <div className="text-sm text-muted-foreground">{match.venue}</div>
                        </div>
                        {match.description && (
                          <div>
                            <div className="text-sm font-medium">Description</div>
                            <div className="text-sm text-muted-foreground">{match.description}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="live" className="mt-0">
            {/* Content for live matches - similar structure */}
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium">No Live Matches</h3>
                <p className="text-muted-foreground mt-2">Live matches will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {/* Content for completed matches - similar structure */}
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium">No Completed Matches</h3>
                <p className="text-muted-foreground mt-2">Completed matches will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Match' : 'Add New Match'}</DialogTitle>
          </DialogHeader>
          
          {currentMatch && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="team1" className="text-sm font-medium">Team 1 *</label>
                  <Input 
                    id="team1"
                    value={currentMatch.team1} 
                    onChange={(e) => setCurrentMatch({...currentMatch, team1: e.target.value})}
                    placeholder="e.g. India"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="team2" className="text-sm font-medium">Team 2 *</label>
                  <Input 
                    id="team2"
                    value={currentMatch.team2} 
                    onChange={(e) => setCurrentMatch({...currentMatch, team2: e.target.value})}
                    placeholder="e.g. Australia"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="venue" className="text-sm font-medium">Venue *</label>
                <Input 
                  id="venue"
                  value={currentMatch.venue} 
                  onChange={(e) => setCurrentMatch({...currentMatch, venue: e.target.value})}
                  placeholder="e.g. Sydney Cricket Ground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="match-date" className="text-sm font-medium">Match Date *</label>
                  <Input 
                    id="match-date"
                    type="date"
                    value={currentMatch.match_date} 
                    onChange={(e) => setCurrentMatch({...currentMatch, match_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="match-time" className="text-sm font-medium">Match Time *</label>
                  <Input 
                    id="match-time"
                    type="time"
                    value={currentMatch.match_time} 
                    onChange={(e) => setCurrentMatch({...currentMatch, match_time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="match-type" className="text-sm font-medium">Match Type *</label>
                  <Select 
                    value={currentMatch.match_type} 
                    onValueChange={(value) => setCurrentMatch({...currentMatch, match_type: value})}
                  >
                    <SelectTrigger id="match-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T20">T20</SelectItem>
                      <SelectItem value="ODI">ODI</SelectItem>
                      <SelectItem value="Test">Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Match Status *</label>
                  <Select 
                    value={currentMatch.status} 
                    onValueChange={(value: 'upcoming' | 'live' | 'completed') => 
                      setCurrentMatch({...currentMatch, status: value})
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tournament" className="text-sm font-medium">Tournament *</label>
                <Input 
                  id="tournament"
                  value={currentMatch.tournament} 
                  onChange={(e) => setCurrentMatch({...currentMatch, tournament: e.target.value})}
                  placeholder="e.g. ICC World Cup 2025"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="description"
                  value={currentMatch.description} 
                  onChange={(e) => setCurrentMatch({...currentMatch, description: e.target.value})}
                  placeholder="Optional match description"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-featured"
                  checked={currentMatch.is_featured} 
                  onCheckedChange={(checked) => 
                    setCurrentMatch({...currentMatch, is_featured: checked})
                  }
                />
                <label htmlFor="is-featured" className="text-sm font-medium">
                  Feature this match on homepage
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Update' : 'Add'} Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MatchesManager;
