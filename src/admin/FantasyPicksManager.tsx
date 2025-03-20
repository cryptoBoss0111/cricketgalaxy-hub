
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface FantasyPick {
  id: string;
  player_name: string;
  team: string;
  points_prediction: number;
  role: string;
  form: string; // good, average, excellent
  reason: string;
  match: string;
  created_at: string;
}

const FantasyPicksManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPick, setCurrentPick] = useState<Partial<FantasyPick> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for fantasy picks
  const mockFantasyPicks: FantasyPick[] = [
    {
      id: '1',
      player_name: 'Virat Kohli',
      team: 'Royal Challengers Bangalore',
      points_prediction: 78,
      role: 'Batsman',
      form: 'excellent',
      reason: 'Has been in exceptional form in the last 5 matches with an average of 65+',
      match: 'RCB vs CSK',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      player_name: 'Rohit Sharma',
      team: 'Mumbai Indians',
      points_prediction: 62,
      role: 'Batsman',
      form: 'good',
      reason: 'Comfortable playing at home ground with good recent performances',
      match: 'MI vs KKR',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      player_name: 'Jasprit Bumrah',
      team: 'Mumbai Indians',
      points_prediction: 85,
      role: 'Bowler',
      form: 'excellent',
      reason: 'Has been taking wickets consistently in the powerplay and death overs',
      match: 'MI vs KKR',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const fetchFantasyPicks = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('fantasy_picks')
        //   .select('*')
        //   .order('created_at', { ascending: false });
        
        // if (error) throw error;
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setFantasyPicks(mockFantasyPicks);
      } catch (error) {
        console.error('Error fetching fantasy picks:', error);
        toast({
          title: 'Error',
          description: 'Failed to load fantasy picks',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFantasyPicks();
  }, [toast]);

  const handleAddNew = () => {
    setCurrentPick({
      player_name: '',
      team: '',
      points_prediction: 50,
      role: 'Batsman',
      form: 'good',
      reason: '',
      match: '',
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (pick: FantasyPick) => {
    setCurrentPick({...pick});
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this fantasy pick?')) {
      try {
        setIsLoading(true);
        // In a real implementation, we would delete from Supabase
        // const { error } = await supabase
        //   .from('fantasy_picks')
        //   .delete()
        //   .eq('id', id);
        
        // if (error) throw error;
        
        // Update local state
        setFantasyPicks(fantasyPicks.filter(pick => pick.id !== id));
        
        toast({
          title: 'Success',
          description: 'Fantasy pick deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting fantasy pick:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete fantasy pick',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!currentPick) return;
    
    if (!currentPick.player_name || !currentPick.team || !currentPick.match || !currentPick.reason) {
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
      //   ? await supabase
      //       .from('fantasy_picks')
      //       .update(currentPick)
      //       .eq('id', currentPick.id)
      //       .select()
      //   : await supabase
      //       .from('fantasy_picks')
      //       .insert(currentPick)
      //       .select();
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      if (isEditing) {
        setFantasyPicks(fantasyPicks.map(pick => 
          pick.id === currentPick.id ? {...currentPick as FantasyPick} : pick
        ));
      } else {
        const newPick = {
          ...currentPick,
          id: `new-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as FantasyPick;
        
        setFantasyPicks([newPick, ...fantasyPicks]);
      }
      
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: `Fantasy pick ${isEditing ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      console.error('Error saving fantasy pick:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'add'} fantasy pick`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Fantasy Picks Manager</h1>
            <p className="text-muted-foreground mt-1">Manage fantasy cricket player recommendations</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Fantasy Pick
          </Button>
        </div>
        
        {isLoading && fantasyPicks.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-cricket-accent border-t-transparent rounded-full"></div>
          </div>
        ) : fantasyPicks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium">No Fantasy Picks Yet</h3>
              <p className="text-muted-foreground mt-2">Start by creating your first fantasy pick recommendation</p>
              <Button className="mt-4" onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Add Fantasy Pick
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fantasyPicks.map((pick) => (
              <Card key={pick.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        pick.form === 'excellent' ? 'bg-green-100 text-green-800' :
                        pick.form === 'good' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pick.form.charAt(0).toUpperCase() + pick.form.slice(1)} Form
                      </span>
                      <span className="ml-2 inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                        {pick.role}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(pick)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(pick.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-xl">{pick.player_name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{pick.team}</div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">Predicted Points</div>
                    <div className="text-2xl font-bold text-cricket-accent">{pick.points_prediction}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1">Match</div>
                    <div className="text-sm">{pick.match}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Recommendation Reason</div>
                    <div className="text-sm text-muted-foreground">{pick.reason}</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-4">
                    Added {formatDate(pick.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Fantasy Pick' : 'Add New Fantasy Pick'}</DialogTitle>
          </DialogHeader>
          
          {currentPick && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="player-name" className="text-sm font-medium">Player Name *</label>
                <Input 
                  id="player-name"
                  value={currentPick.player_name} 
                  onChange={(e) => setCurrentPick({...currentPick, player_name: e.target.value})}
                  placeholder="e.g. Virat Kohli"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="team" className="text-sm font-medium">Team *</label>
                <Input 
                  id="team"
                  value={currentPick.team} 
                  onChange={(e) => setCurrentPick({...currentPick, team: e.target.value})}
                  placeholder="e.g. Royal Challengers Bangalore"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role *</label>
                  <Select 
                    value={currentPick.role} 
                    onValueChange={(value) => setCurrentPick({...currentPick, role: value})}
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
                  <label htmlFor="form" className="text-sm font-medium">Current Form *</label>
                  <Select 
                    value={currentPick.form} 
                    onValueChange={(value) => setCurrentPick({...currentPick, form: value})}
                  >
                    <SelectTrigger id="form">
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="points" className="text-sm font-medium">
                  Predicted Points: {currentPick.points_prediction}
                </label>
                <Input 
                  id="points"
                  type="range"
                  min="0"
                  max="100"
                  value={currentPick.points_prediction} 
                  onChange={(e) => setCurrentPick({
                    ...currentPick, 
                    points_prediction: parseInt(e.target.value)
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="match" className="text-sm font-medium">Match *</label>
                <Input 
                  id="match"
                  value={currentPick.match} 
                  onChange={(e) => setCurrentPick({...currentPick, match: e.target.value})}
                  placeholder="e.g. RCB vs CSK"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">Recommendation Reason *</label>
                <Textarea 
                  id="reason"
                  value={currentPick.reason} 
                  onChange={(e) => setCurrentPick({...currentPick, reason: e.target.value})}
                  placeholder="Why is this player a good fantasy pick?"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Update' : 'Add'} Fantasy Pick
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FantasyPicksManager;
