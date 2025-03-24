
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface TeamSelection {
  id: string;
  email: string;
  created_at: string;
  players: string[];
  team_name?: string;
}

const FreeWarContestManager = () => {
  const [teamSelections, setTeamSelections] = useState<TeamSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamSelections();
  }, []);

  const fetchTeamSelections = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('free_war_teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTeamSelections(data || []);
    } catch (error) {
      console.error('Error fetching team selections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team selections',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      // Format data for CSV
      const headers = ['Email', 'Team Name', 'Players', 'Submission Time'];
      const csvRows = [
        headers.join(','),
        ...teamSelections.map(selection => {
          const submissionTime = new Date(selection.created_at).toLocaleString();
          const players = JSON.stringify(selection.players).replace(/,/g, ';');
          const teamName = selection.team_name || 'N/A';
          return [selection.email, teamName, players, submissionTime].join(',');
        })
      ];

      // Create and download CSV file
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `free-war-teams-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: 'Team selections exported to CSV',
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export team selections',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Free War Contest Entries</h1>
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="mb-4">
            <p className="text-gray-500">
              View all user team selections for the Free War contest.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
            </div>
          ) : teamSelections.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">No team selections yet</h3>
              <p className="text-gray-400 mt-2">Users haven't submitted any teams for the contest yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teamSelections.map((selection) => (
                <Card key={selection.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold">{selection.email}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(selection.created_at).toLocaleString()}
                      </span>
                    </div>
                    {selection.team_name && (
                      <p className="text-sm font-medium">Team Name: {selection.team_name}</p>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Selected Players:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selection.players.map((player, index) => (
                          <div key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {player}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FreeWarContestManager;
