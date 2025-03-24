
import { useState } from 'react';
import { Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter 
} from '@/components/ui/dialog';
import { MediaFile } from './types';

interface MediaPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: MediaFile | null;
  onDelete: (file: MediaFile) => void;
  onCopyUrl: (url: string) => void;
  formatFileSize: (bytes: number) => string;
  formatDate: (dateString: string) => string;
}

const MediaPreviewDialog = ({
  isOpen,
  onOpenChange,
  selectedFile,
  onDelete,
  onCopyUrl,
  formatFileSize,
  formatDate
}: MediaPreviewDialogProps) => {
  // State to track if image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Reset states when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setImageLoaded(false);
      setHasError(false);
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate">
            {selectedFile?.name}
          </DialogTitle>
        </DialogHeader>
        
        {selectedFile && (
          <>
            <div className="flex-1 min-h-0 relative bg-gray-100 rounded-md overflow-hidden">
              {!imageLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
                </div>
              )}
              
              {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500">Image could not be loaded</p>
                </div>
              ) : (
                <img 
                  src={selectedFile.publicUrl + '?t=' + new Date().getTime()} // Add cache-busting parameter
                  alt={selectedFile.name} 
                  className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  crossOrigin="anonymous"
                  onLoad={() => {
                    setImageLoaded(true);
                    setHasError(false);
                  }}
                  onError={(e) => {
                    console.error("Error loading preview image:", selectedFile.publicUrl);
                    setHasError(true);
                    setImageLoaded(false);
                  }}
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">File name</p>
                <p className="text-sm truncate">{selectedFile.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">File size</p>
                <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">URL</p>
                <div className="flex items-center">
                  <p className="text-sm truncate flex-1">{selectedFile.publicUrl}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1"
                    onClick={() => onCopyUrl(selectedFile.publicUrl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">Uploaded</p>
                <p className="text-sm">{formatDate(selectedFile.created_at)}</p>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDelete(selectedFile);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onCopyUrl(selectedFile.publicUrl)}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy URL
              </Button>
              <DialogClose asChild>
                <Button size="sm">Close</Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
