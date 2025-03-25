
import { TeamSelection } from '@/integrations/supabase/free-war';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TeamSelectionsTableProps {
  teamSelections: TeamSelection[];
  isLoading: boolean;
  lastRefreshed: Date;
}

const TeamSelectionsTable = ({
  teamSelections,
  isLoading,
  lastRefreshed
}: TeamSelectionsTableProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!teamSelections || teamSelections.length === 0) {
    return <EmptyState lastRefreshed={lastRefreshed} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-500">
          View all user team selections for the Free War contest.
        </p>
        <p className="text-sm text-gray-400">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            Total submissions: {teamSelections.length}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Players Selected</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamSelections.map((selection) => (
              <TableRow key={selection.id}>
                <TableCell className="font-medium">{selection.email}</TableCell>
                <TableCell>{selection.team_name || 'N/A'}</TableCell>
                <TableCell>{new Date(selection.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {selection.players && Array.isArray(selection.players) ? (
                        selection.players.map((player, index) => (
                          <li key={index}>{player}</li>
                        ))
                      ) : (
                        <li className="text-red-500">Invalid player data</li>
                      )}
                    </ul>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
    <div className="mb-4 flex justify-between items-center">
      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
    </div>
  </div>
);

const EmptyState = ({ lastRefreshed }: { lastRefreshed: Date }) => (
  <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
    <div className="mb-4 flex justify-between items-center">
      <p className="text-gray-500">
        View all user team selections for the Free War contest.
      </p>
      <p className="text-sm text-gray-400">
        Last refreshed: {lastRefreshed.toLocaleTimeString()}
      </p>
    </div>
    <div className="text-center py-12 space-y-6">
      <h3 className="text-xl font-medium text-gray-500">No team selections found</h3>
      <p className="text-gray-400">No team submissions have been recorded in the database yet.</p>
      <div className="flex justify-center">
        <div className="border border-gray-200 rounded-md p-6 bg-gray-50 max-w-lg">
          <h4 className="font-medium mb-2">Troubleshooting Tips:</h4>
          <ul className="list-disc text-left pl-5 space-y-2 text-sm text-gray-600">
            <li>Check that users are submitting their selections correctly</li>
            <li>Verify that the team submission API is functioning properly</li>
            <li>Confirm that the Supabase connection is working</li>
            <li>Ensure the database table has been created correctly</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default TeamSelectionsTable;
