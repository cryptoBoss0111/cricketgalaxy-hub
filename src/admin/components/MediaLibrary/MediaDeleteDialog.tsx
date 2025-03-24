
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  if (!selectedFile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-3 border rounded-lg">
          <p className="font-medium">{selectedFile.original_file_name}</p>
          {selectedFile.size && (
            <p className="text-sm text-gray-500 mt-1">Size: {formatFileSize(selectedFile.size)}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDeleteDialog;
