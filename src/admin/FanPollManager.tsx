
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface PollOption {
  id: string;
  text: string;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  is_active: boolean;
  created_at: string;
  votes_count?: number;
}

const FanPollManager = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  
  // Form state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
    { id: '3', text: '' },
    { id: '4', text: '' }
  ]);
  const [isActive, setIsActive] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setIsLoading(true);
    try {
      // Fetch all polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('fan_polls')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pollsError) throw pollsError;

      // Get vote counts for each poll
      const pollsWithVotes = await Promise.all(
        (pollsData || []).map(async (poll) => {
          const { count, error: countError } = await supabase
            .from('poll_votes')
            .select('*', { count: 'exact', head: true })
            .eq('poll_id', poll.id);
          
          return {
            ...poll,
            options: poll.options as unknown as PollOption[],
            votes_count: countError ? 0 : count || 0
          } as Poll;
        })
      );
      
      setPolls(pollsWithVotes);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: "Error",
        description: "Failed to load polls",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePoll = () => {
    setQuestion('');
    setOptions([
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
      { id: '4', text: '' }
    ]);
    setIsActive(true);
    setEditingPoll(null);
    setCreateDialogOpen(true);
  };

  const handleEditPoll = (poll: Poll) => {
    setQuestion(poll.question);
    setOptions(poll.options);
    setIsActive(poll.is_active);
    setEditingPoll(poll);
    setCreateDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setPollToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeletePoll = async () => {
    if (!pollToDelete) return;
    
    try {
      const { error } = await supabase
        .from('fan_polls')
        .delete()
        .eq('id', pollToDelete);
      
      if (error) throw error;
      
      setPolls(polls.filter(poll => poll.id !== pollToDelete));
      
      toast({
        title: "Poll deleted",
        description: "The poll has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        title: "Error",
        description: "Failed to delete poll",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPollToDelete(null);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length >= 10) {
      toast({
        title: "Maximum options reached",
        description: "You can't add more than 10 options to a poll",
        variant: "destructive",
      });
      return;
    }
    
    setOptions([...options, { id: String(Date.now()), text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "Minimum options required",
        description: "A poll must have at least 2 options",
        variant: "destructive",
      });
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!question.trim()) {
      toast({
        title: "Missing question",
        description: "Please enter a question for the poll",
        variant: "destructive",
      });
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      toast({
        title: "Insufficient options",
        description: "Please provide at least 2 valid options",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isActive) {
        // Deactivate all other polls if this one is active
        await supabase
          .from('fan_polls')
          .update({ is_active: false })
          .eq('is_active', true);
      }

      if (editingPoll) {
        // Update existing poll
        const { error } = await supabase
          .from('fan_polls')
          .update({
            question,
            options: validOptions as unknown as Json,
            is_active: isActive,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPoll.id);
        
        if (error) throw error;
        
        toast({
          title: "Poll updated",
          description: "The poll has been successfully updated",
        });
      } else {
        // Create new poll
        const { error } = await supabase
          .from('fan_polls')
          .insert({
            question,
            options: validOptions as unknown as Json,
            is_active: isActive
          });
        
        if (error) throw error;
        
        toast({
          title: "Poll created",
          description: "The poll has been successfully created",
        });
      }

      // Refresh the polls list
      setCreateDialogOpen(false);
      fetchPolls();
    } catch (error) {
      console.error('Error saving poll:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingPoll ? 'update' : 'create'} poll`,
        variant: "destructive",
      });
    }
  };

  const togglePollActive = async (poll: Poll) => {
    try {
      if (!poll.is_active) {
        // Deactivate all other polls first
        await supabase
          .from('fan_polls')
          .update({ is_active: false })
          .eq('is_active', true);
      }

      // Toggle this poll's active status
      const { error } = await supabase
        .from('fan_polls')
        .update({ is_active: !poll.is_active })
        .eq('id', poll.id);
      
      if (error) throw error;
      
      // Update local state
      setPolls(polls.map(p => 
        p.id === poll.id 
          ? {...p, is_active: !p.is_active} 
          : p.is_active && !poll.is_active ? {...p, is_active: false} : p
      ));
      
      toast({
        title: poll.is_active ? "Poll deactivated" : "Poll activated",
        description: poll.is_active 
          ? "The poll is now hidden from the homepage" 
          : "The poll is now visible on the homepage",
      });
    } catch (error) {
      console.error('Error toggling poll status:', error);
      toast({
        title: "Error",
        description: "Failed to update poll status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-heading font-bold">Fan Polls</h1>
          <Button onClick={handleCreatePoll}>
            <Plus className="h-4 w-4 mr-2" /> Create New Poll
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">No polls found</h3>
              <p className="text-gray-400 mt-2">Start by creating your first poll.</p>
              <Button variant="outline" className="mt-4" onClick={handleCreatePoll}>
                <Plus className="mr-2 h-4 w-4" /> Create Poll
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {polls.map((poll) => (
                <Card key={poll.id} className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{poll.question}</h3>
                        {poll.is_active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {poll.options.map((option, index) => (
                          <div key={index} className="text-sm bg-gray-50 px-3 py-2 rounded-md">
                            {option.text}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(poll.created_at).toLocaleDateString()} • 
                        <span className="ml-1">{poll.votes_count} votes</span>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => togglePollActive(poll)}
                      >
                        {poll.is_active ? <X className="h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                        {poll.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditPoll(poll)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => confirmDelete(poll.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1 text-red-500" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Poll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poll? This action cannot be undone, and all votes will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePoll}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Poll Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPoll ? 'Edit Poll' : 'Create New Poll'}</DialogTitle>
            <DialogDescription>
              {editingPoll 
                ? 'Make changes to the poll question and options below.' 
                : 'Create a new poll to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Poll Question</h4>
              <Textarea 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Who will win IPL 2025?"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Poll Options</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Option
                </Button>
              </div>
              
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={option.text} 
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="poll-active" 
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <label htmlFor="poll-active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Active on Homepage
              </label>
            </div>
            
            {isActive && (
              <div className="text-sm bg-yellow-50 border border-yellow-100 p-3 rounded-md text-yellow-800">
                <p>
                  <strong>Note:</strong> Only one poll can be active at a time. Activating this poll will deactivate any currently active poll.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPoll ? 'Update Poll' : 'Create Poll'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FanPollManager;
