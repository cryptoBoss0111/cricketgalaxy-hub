
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaFile } from './types';

interface MediaDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: MediaFile | null;
  onDelete: () => void;
  formatFileSize: (bytes: number) => string;
}

const MediaDeleteDialog = ({
  isOpen,
  onOpenChange,
  selectedFile,
  onDelete,
  formatFileSize
}: MediaDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {selectedFile && (
          <div className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="h-16 w-16 relative rounded overflow-hidden bg-gray-100">
              <img 
                src={selectedFile.publicUrl} 
                alt={selectedFile.name} 
                className="absolute inset-0 w-full h-full object-contain" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDeleteDialog;
