
import { TeamSelection } from '@/integrations/supabase/free-war';
import { Card } from '@/components/ui/card';

interface RecentSubmissionsProps {
  teamSelections: TeamSelection[];
}

const RecentSubmissions = ({ teamSelections }: RecentSubmissionsProps) => {
  if (!teamSelections || teamSelections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamSelections.map((selection) => (
          <TeamSelectionCard key={selection.id} selection={selection} />
        ))}
      </div>
    </div>
  );
};

interface TeamSelectionCardProps {
  selection: TeamSelection;
}

const TeamSelectionCard = ({ selection }: TeamSelectionCardProps) => {
  if (!selection) return null;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {selection.players && Array.isArray(selection.players) ? (
              selection.players.map((player, index) => (
                <div key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {player}
                </div>
              ))
            ) : (
              <div className="text-red-500 text-sm">Invalid player data</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentSubmissions;
