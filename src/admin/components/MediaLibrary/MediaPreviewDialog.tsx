
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Image, Copy, Trash2, Calendar, FileType, HardDrive } from 'lucide-react';
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
  const [imageLoadError, setImageLoadError] = useState(false);
  
  if (!selectedFile) return null;
  
  // Clean URL to avoid CORS issues
  const cleanUrl = selectedFile.url.split('?')[0];
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>File Preview</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4 min-h-[240px]">
            {imageLoadError ? (
              <div className="text-center">
                <Image className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Unable to load image</p>
              </div>
            ) : (
              <img 
                src={cleanUrl}
                alt={selectedFile.original_file_name} 
                className="max-w-full max-h-[320px] object-contain"
                onError={() => setImageLoadError(true)}
                crossOrigin="anonymous"
              />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">
              {selectedFile.original_file_name}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Uploaded</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedFile.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FileType className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-gray-500">
                    {selectedFile.content_type || 'Image'}
                  </p>
                </div>
              </div>
              
              {selectedFile.size && (
                <div className="flex items-start">
                  <HardDrive className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Size</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-3">
                <p className="text-sm font-medium mb-2">URL</p>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    readOnly 
                    value={cleanUrl} 
                    className="flex-1 p-2 text-xs border rounded-l-md bg-gray-50"
                  />
                  <Button
                    className="rounded-l-none"
                    onClick={() => onCopyUrl(cleanUrl)}
                  >
                    <Copy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
              </div>
              
              <div className="pt-3">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    onDelete(selectedFile);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
