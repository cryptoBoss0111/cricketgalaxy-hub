
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import { getFreeWarTeamSelections, TeamSelection } from '@/integrations/supabase/free-war';
import TeamSelectionsHeader from './components/free-war/TeamSelectionsHeader';
import TeamSelectionsTable from './components/free-war/TeamSelectionsTable';
import RecentSubmissions from './components/free-war/RecentSubmissions';

const FreeWarContestManager = () => {
  const [teamSelections, setTeamSelections] = useState<TeamSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchTeamSelections = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFreeWarTeamSelections();
      console.log('Team selections fetched:', data);
      
      if (Array.isArray(data)) {
        setTeamSelections(data);
        setLastRefreshed(new Date());
        
        // Show success toast if data was fetched
        if (data.length > 0) {
          toast({
            title: 'Data Loaded',
            description: `${data.length} team selections found`,
          });
        } else {
          toast({
            title: 'No Data Found',
            description: 'No team selections were found in the database',
          });
          console.log('No team selections found in database');
        }
      } else {
        console.error('Unexpected data format:', data);
        toast({
          title: 'Data Format Error',
          description: 'Received unexpected data format from server',
          variant: 'destructive',
        });
      }
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
  }, [toast]);

  useEffect(() => {
    console.log('FreeWarContestManager mounted, fetching data...');
    fetchTeamSelections();
    
    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing team selections...');
      fetchTeamSelections();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchTeamSelections]);

  // Force an immediate refresh on manual click
  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchTeamSelections();
  };

  // Export function with better error handling
  const exportToCSV = (teamSelections: TeamSelection[]) => {
    try {
      if (!teamSelections || teamSelections.length === 0) {
        console.log('No data to export');
        return { success: false, error: 'No data to export' };
      }
      
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

      return { success: true };
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return { success: false, error };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <TeamSelectionsHeader 
          onRefresh={handleManualRefresh} 
          onExport={() => exportToCSV(teamSelections)} 
          isLoading={isLoading} 
          teamSelectionsCount={teamSelections.length}
        />

        <TeamSelectionsTable 
          teamSelections={teamSelections} 
          isLoading={isLoading} 
          lastRefreshed={lastRefreshed} 
        />

        {!isLoading && teamSelections.length > 0 && (
          <RecentSubmissions teamSelections={teamSelections.slice(0, 4)} />
        )}
      </div>
    </AdminLayout>
  );
};

export default FreeWarContestManager;
