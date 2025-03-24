
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getFantasyPicks, 
  upsertFantasyPick, 
  deleteFantasyPick,
  getUpcomingMatches
} from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Edit, Trash2, Plus, Trophy, AlertTriangle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import FantasyPickForm from './components/FantasyPickForm';

type Match = {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  match_time: string;
};

type FantasyPickItem = {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  match: string;
  match_id?: string;
  reason: string;
  points_prediction: number;
  image_url?: string;
  stats?: string;
  created_at: string;
  updated_at: string;
};

const FantasyPicksManager = () => {
  const [picks, setPicks] = useState<FantasyPickItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPick, setEditingPick] = useState<FantasyPickItem | null>(null);
  const [activeTab, setActiveTab] = useState('view');
  const { toast } = useToast();

  // Fetch fantasy picks and matches data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch matches first
        const matchesData = await getUpcomingMatches();
        setMatches(matchesData);
        
        // Then fetch fantasy picks
        const picksData = await getFantasyPicks();
        setPicks(picksData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load fantasy picks data',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleEditPick = (pick: FantasyPickItem) => {
    setEditingPick(pick);
    setActiveTab('edit');
  };

  const handleDeletePick = async (id: string) => {
    try {
      await deleteFantasyPick(id);
      setPicks(picks.filter(pick => pick.id !== id));
      toast({
        title: 'Fantasy pick deleted',
        description: 'Fantasy pick has been removed successfully',
      });
    } catch (error) {
      console.error('Error deleting fantasy pick:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete fantasy pick',
      });
    }
  };

  const handleSavePick = async (pick: FantasyPickItem) => {
    try {
      const savedPick = await upsertFantasyPick(pick);
      
      if (pick.id) {
        // Update existing pick
        setPicks(picks.map(p => p.id === pick.id ? {...p, ...savedPick} : p));
      } else {
        // Add new pick
        setPicks([...picks, savedPick]);
      }
      
      setEditingPick(null);
      setActiveTab('view');
      
      toast({
        title: 'Fantasy pick saved',
        description: 'Fantasy pick has been saved successfully',
      });
    } catch (error) {
      console.error('Error saving fantasy pick:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save fantasy pick',
      });
    }
  };

  const matchPickCounts = picks.reduce((acc, pick) => {
    const match = pick.match;
    acc[match] = (acc[match] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fantasy Picks Manager</h1>
            <p className="text-gray-500">Manage fantasy cricket picks for upcoming matches</p>
          </div>
          <Button 
            onClick={() => {
              setEditingPick(null);
              setActiveTab('create');
            }}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add New Pick
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="view">View All Picks</TabsTrigger>
            <TabsTrigger value="create">Add New Pick</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingPick}>
              {editingPick ? `Edit: ${editingPick.player_name}` : 'Edit Pick'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : picks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Fantasy Picks Yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first fantasy pick for an upcoming match</p>
                  <Button onClick={() => setActiveTab('create')}>Add Your First Pick</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {Object.entries(matchPickCounts).map(([match, count]) => {
                  const isWarning = count > 4;
                  return isWarning ? (
                    <Alert variant="destructive" className="mb-4" key={match}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Match "{match}" has {count} picks. Maximum recommended is 4 picks per match.
                      </AlertDescription>
                    </Alert>
                  ) : null;
                })}
                
                <Card>
                  <CardHeader>
                    <CardTitle>All Fantasy Picks</CardTitle>
                    <CardDescription>
                      View and manage all fantasy player picks. Recommended: up to 4 picks per match.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Player</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Match</TableHead>
                          <TableHead>Form</TableHead>
                          <TableHead>Points Prediction</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {picks.map((pick) => (
                          <TableRow key={pick.id}>
                            <TableCell className="font-medium">{pick.player_name}</TableCell>
                            <TableCell>{pick.team}</TableCell>
                            <TableCell>{pick.role}</TableCell>
                            <TableCell>{pick.match}</TableCell>
                            <TableCell>
                              <span className={
                                pick.form === 'Excellent' ? 'text-green-500' :
                                pick.form === 'Good' ? 'text-blue-500' :
                                pick.form === 'Average' ? 'text-yellow-500' :
                                'text-red-500'
                              }>
                                {pick.form}
                              </span>
                            </TableCell>
                            <TableCell>{pick.points_prediction}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditPick(pick)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeletePick(pick.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Add New Fantasy Pick</CardTitle>
                <CardDescription>Create a new fantasy player pick for an upcoming match</CardDescription>
              </CardHeader>
              <CardContent>
                <FantasyPickForm 
                  onSave={handleSavePick} 
                  matches={matches} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            {editingPick && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Fantasy Pick</CardTitle>
                  <CardDescription>Update details for {editingPick.player_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FantasyPickForm 
                    initialData={editingPick} 
                    onSave={handleSavePick} 
                    matches={matches}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default FantasyPicksManager;
