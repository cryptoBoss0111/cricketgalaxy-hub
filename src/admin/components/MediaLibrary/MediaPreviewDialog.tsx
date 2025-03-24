
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Clipboard, 
  Calendar, 
  FileType, 
  HardDrive,
  Trash2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Function to handle image retry
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // Generate direct URL to Supabase storage
  const getImageUrl = (file: MediaFile) => {
    // Directly construct the Supabase storage URL
    const directUrl = `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/article_images/${file.stored_file_name}`;
    // Add cache busting parameter
    const urlWithCacheBusting = `${directUrl}?t=${Date.now()}&r=${retryCount}`;
    console.log("Preview dialog image URL:", directUrl);
    return urlWithCacheBusting;
  };

  if (!selectedFile) return null;

  const fileExtension = selectedFile.original_file_name.split('.').pop()?.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-auto max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            {selectedFile.original_file_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          <div className="md:col-span-3 bg-gray-50 rounded-lg flex items-center justify-center h-[300px] overflow-hidden relative">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cricket-accent border-t-transparent"></div>
              </div>
            )}
            
            {hasError ? (
              <div className="flex flex-col items-center justify-center text-center p-6">
                <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Image failed to load</h3>
                <p className="text-gray-500 mb-4">There was an error loading this image</p>
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry Loading
                </Button>
              </div>
            ) : (
              <img 
                src={getImageUrl(selectedFile)}
                alt={selectedFile.original_file_name}
                className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
                crossOrigin="anonymous"
              />
            )}
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-4">File Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-gray-500">
                  <FileType className="h-4 w-4 mr-2" />
                  <span className="text-sm">File name</span>
                </div>
                <p className="text-base mt-1 break-all">{selectedFile.original_file_name}</p>
              </div>
              
              <div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Uploaded on</span>
                </div>
                <p className="text-base mt-1">{formatDate(selectedFile.created_at)}</p>
              </div>
              
              {selectedFile.size && (
                <div>
                  <div className="flex items-center text-gray-500">
                    <HardDrive className="h-4 w-4 mr-2" />
                    <span className="text-sm">File size</span>
                  </div>
                  <p className="text-base mt-1">{formatFileSize(selectedFile.size)}</p>
                </div>
              )}
              
              <div>
                <div className="flex items-center text-gray-500">
                  <FileType className="h-4 w-4 mr-2" />
                  <span className="text-sm">File type</span>
                </div>
                <p className="text-base mt-1">{fileExtension ? `.${fileExtension}` : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial flex items-center"
            onClick={() => {
              // Copy direct Supabase storage URL
              const directUrl = `https://swiftskcxeoyomwwmkms.supabase.co/storage/v1/object/public/article_images/${selectedFile.stored_file_name}`;
              onCopyUrl(directUrl);
            }}
          >
            <Clipboard className="h-4 w-4 mr-2" /> Copy URL
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 sm:flex-initial flex items-center"
            onClick={() => {
              onDelete(selectedFile);
              onOpenChange(false);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPreviewDialog;
