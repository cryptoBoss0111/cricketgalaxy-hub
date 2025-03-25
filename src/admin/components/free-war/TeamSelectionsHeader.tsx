
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamSelectionsHeaderProps {
  onRefresh: () => void;
  onExport: () => { success: boolean; error?: any };
  isLoading: boolean;
  teamSelectionsCount: number;
}

const TeamSelectionsHeader = ({
  onRefresh,
  onExport,
  isLoading,
  teamSelectionsCount
}: TeamSelectionsHeaderProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const result = onExport();
    if (result.success) {
      toast({
        title: 'Export Successful',
        description: 'Team selections exported to CSV',
      });
    } else {
      toast({
        title: 'Export Failed',
        description: 'Could not export team selections',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-heading font-bold">Free War Contest Entries</h1>
      <div className="flex space-x-2">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
        <Button 
          onClick={handleExport} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={teamSelectionsCount === 0 || isLoading}
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>
    </div>
  );
};

export default TeamSelectionsHeader;
