
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getFantasyPicks, 
  upsertFantasyPick, 
  deleteFantasyPick,
  getUpcomingMatches,
  getFantasyPicksByMatch
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Edit, Trash2, Plus, Trophy, AlertTriangle, Info } from 'lucide-react';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pickToDelete, setPickToDelete] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
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

  const confirmDeletePick = (id: string) => {
    setPickToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePick = async () => {
    if (!pickToDelete) return;
    
    try {
      await deleteFantasyPick(pickToDelete);
      setPicks(picks.filter(pick => pick.id !== pickToDelete));
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
    } finally {
      setPickToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSavePick = async (pick: FantasyPickItem) => {
    try {
      if (!pick.match_id) {
        throw new Error('Please select a match for this fantasy pick');
      }
      
      // Check if we're updating an existing pick or creating a new one
      const isNewPick = !pick.id;
      
      if (isNewPick) {
        // For new picks, check the number of existing picks for this match
        const existingPicksForMatch = picks.filter(p => p.match_id === pick.match_id);
        
        if (existingPicksForMatch.length >= 4) {
          throw new Error('Maximum of 4 fantasy picks allowed per match. Please select a different match or delete an existing pick.');
        }
      }
      
      // Save the pick
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
      
      // After saving, check if we need to validate match requirements
      validateMatchPicksRequirements();
    } catch (error: any) {
      console.error('Error saving fantasy pick:', error);
      setValidationError(error.message || 'Failed to save fantasy pick');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save fantasy pick',
      });
    }
  };

  // Group picks by match and count
  const matchPickCounts = picks.reduce((acc, pick) => {
    const matchId = pick.match_id || '';
    if (matchId) {
      acc[matchId] = (acc[matchId] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Validate that matches have at least 2 picks
  const validateMatchPicksRequirements = () => {
    const matchesWithTooFewPicks = Object.entries(matchPickCounts)
      .filter(([_, count]) => count < 2)
      .map(([matchId]) => {
        const match = matches.find(m => m.id === matchId);
        return match ? `${match.team1} vs ${match.team2}` : matchId;
      });
    
    if (matchesWithTooFewPicks.length > 0) {
      setValidationError(`Some matches have fewer than 2 fantasy picks: ${matchesWithTooFewPicks.join(', ')}. Each match should have at least 2 picks.`);
    } else {
      setValidationError(null);
    }
  };

  // Check validation when picks or matches change
  useEffect(() => {
    if (picks.length > 0 && matches.length > 0) {
      validateMatchPicksRequirements();
    }
  }, [picks, matches]);

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

        {validationError && (
          <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-300">
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

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
                {Object.entries(matchPickCounts).map(([matchId, count]) => {
                  const match = matches.find(m => m.id === matchId);
                  const matchName = match ? `${match.team1} vs ${match.team2}` : 'Unknown Match';
                  
                  const isTooMany = count > 4;
                  const isTooFew = count < 2;
                  
                  if (isTooMany || isTooFew) {
                    return (
                      <Alert 
                        variant={isTooMany ? "destructive" : "warning"} 
                        className={isTooFew ? "bg-amber-50 border-amber-300" : undefined}
                        key={matchId}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{isTooMany ? "Too Many Picks" : "Too Few Picks"}</AlertTitle>
                        <AlertDescription>
                          {isTooMany 
                            ? `Match "${matchName}" has ${count} picks. Maximum allowed is 4 picks per match.`
                            : `Match "${matchName}" has only ${count} pick${count === 1 ? '' : 's'}. Minimum required is 2 picks per match.`
                          }
                        </AlertDescription>
                      </Alert>
                    );
                  }
                  return null;
                })}
                
                <Card>
                  <CardHeader>
                    <CardTitle>All Fantasy Picks</CardTitle>
                    <CardDescription>
                      View and manage all fantasy player picks. Each match should have 2-4 picks.
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
                                  onClick={() => confirmDeletePick(pick.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this fantasy pick? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePick} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default FantasyPicksManager;
