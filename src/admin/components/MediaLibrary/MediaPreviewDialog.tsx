
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, X, Link } from 'lucide-react';
import { MediaFile } from './types';

interface MediaPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: MediaFile | null;
  onDelete: (file: MediaFile) => void;
  onCopyUrl: (url: string) => void;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: string) => string;
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
  if (!selectedFile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <DialogTitle className="text-xl">{selectedFile.original_file_name}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 bg-gray-50 flex items-center justify-center p-4 min-h-[300px]">
            <img 
              src={selectedFile.url} 
              alt={selectedFile.original_file_name} 
              className="max-w-full max-h-[500px] object-contain"
              crossOrigin="anonymous"
            />
          </div>
          
          <div className="md:col-span-2 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">File Details</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500">Name:</span>
                  <span className="col-span-2 font-medium truncate" title={selectedFile.original_file_name}>
                    {selectedFile.original_file_name}
                  </span>
                </div>
                
                {selectedFile.size && (
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-gray-500">Size:</span>
                    <span className="col-span-2">{formatFileSize(selectedFile.size)}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-gray-500">Uploaded:</span>
                  <span className="col-span-2">{formatDate(selectedFile.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <h3 className="text-sm font-medium text-gray-500">URL</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 p-2 rounded truncate text-sm" title={selectedFile.url}>
                    {selectedFile.url}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => onCopyUrl(selectedFile.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t flex justify-between">
              <Button variant="default" onClick={() => onCopyUrl(selectedFile.url)}>
                <Link className="h-4 w-4 mr-2" /> Copy URL
              </Button>
              
              <Button variant="destructive" onClick={() => {
                onDelete(selectedFile);
                onOpenChange(false);
              }}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
