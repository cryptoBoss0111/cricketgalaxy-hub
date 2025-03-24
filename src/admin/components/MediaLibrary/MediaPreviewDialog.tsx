
import { useState, useEffect } from 'react';
import { Copy, Trash2, Image as ImageIcon, RefreshCw } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState('');
  
  // Reset states when dialog opens/closes or file changes
  useEffect(() => {
    if (isOpen && selectedFile) {
      setImageLoaded(false);
      setHasError(false);
      
      // Generate a unique URL with enhanced cache busting
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000000);
      
      // Create URL with specific parameters for debugging
      const url = new URL(selectedFile.publicUrl);
      url.searchParams.set('t', timestamp.toString());
      url.searchParams.set('r', random.toString());
      url.searchParams.set('retry', retryCount.toString());
      url.searchParams.set('preview', 'true');
      
      setImageSrc(url.toString());
      console.log(`Preview image URL: ${url.toString()}`);
    }
  }, [isOpen, selectedFile, retryCount]);

  const handleRetry = () => {
    if (selectedFile) {
      console.log(`Manually retrying preview for: ${selectedFile.name}`);
      setImageLoaded(false);
      setHasError(false);
      setRetryCount(prev => prev + 1);
    }
  };
  
  // Get clean URL for copying - without cache busting parameters
  const getCleanUrl = (url: string) => {
    try {
      const cleanUrl = new URL(url);
      // Create base URL without parameters
      return cleanUrl.origin + cleanUrl.pathname;
    } catch (e) {
      console.error("Error cleaning URL:", e);
      return url;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-cricket-accent border-t-transparent"></div>
                </div>
              )}
              
              {hasError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Image could not be loaded</p>
                  <Button 
                    variant="outline"
                    onClick={handleRetry}
                    className="flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <img 
                  src={imageSrc}
                  alt={selectedFile.name} 
                  className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  crossOrigin="anonymous"
                  onLoad={() => {
                    console.log(`Preview image loaded successfully: ${selectedFile.name}`);
                    setImageLoaded(true);
                    setHasError(false);
                  }}
                  onError={(e) => {
                    console.error(`Error loading preview image: ${selectedFile.name}`, e);
                    setHasError(true);
                    setImageLoaded(false);
                  }}
                />
              )}
            </div>
            
            {hasError && (
              <Alert variant="warning" className="mt-4">
                <AlertDescription>
                  There was an issue loading this image. The image may be corrupted or inaccessible. Try refreshing the media library.
                </AlertDescription>
              </Alert>
            )}
            
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
                  <p className="text-sm truncate flex-1">{getCleanUrl(selectedFile.publicUrl)}</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1"
                    onClick={() => onCopyUrl(getCleanUrl(selectedFile.publicUrl))}
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
                onClick={() => onCopyUrl(getCleanUrl(selectedFile.publicUrl))}
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
