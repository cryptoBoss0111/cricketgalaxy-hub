
import { useState } from 'react';
import { Copy, Download, Trash2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  
  if (!selectedFile) return null;
  
  // Create a URL with cache busting for preview
  const getImageUrl = () => {
    try {
      // Add current timestamp and random value to prevent caching
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000000);
      
      // Create a URL object to properly handle query parameters
      const url = new URL(selectedFile.url);
      // Add cache busting parameters
      url.searchParams.set('t', timestamp.toString());
      url.searchParams.set('r', random.toString());
      url.searchParams.set('retry', retryCount.toString());
      url.searchParams.set('preview', 'true');
      return url.toString();
    } catch (e) {
      // If URL creation fails, simply append query params
      return `${selectedFile.url}?t=${Date.now()}&r=${Math.random()}&retry=${retryCount}&preview=true`;
    }
  };

  const handleRetry = () => {
    console.log(`Retrying image load: ${selectedFile.original_file_name}`);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  const handleDownload = () => {
    // Create a link element with download attribute
    const link = document.createElement('a');
    // Use the original URL without cache-busting parameters for download
    link.href = selectedFile.url;
    link.download = selectedFile.original_file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <div className="flex flex-col">
          <div className="text-xl font-medium mb-2 truncate">
            {selectedFile.original_file_name}
          </div>
          
          <div className="bg-gray-100 rounded-md overflow-hidden relative min-h-[300px]">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cricket-accent border-t-transparent"></div>
              </div>
            )}
            
            {hasError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className="text-gray-400 mb-4">Failed to load image</div>
                <Button onClick={handleRetry} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </Button>
              </div>
            ) : (
              <img 
                src={getImageUrl()}
                alt={selectedFile.original_file_name}
                className={`w-full h-auto max-h-[calc(80vh-200px)] object-contain transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => {
                  console.log("Preview image loaded successfully");
                  setIsLoading(false);
                }}
                onError={(e) => {
                  console.error("Error loading preview image:", e);
                  setHasError(true);
                  setIsLoading(false);
                }}
                crossOrigin="anonymous"
              />
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">File Details</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li><span className="font-medium">Name:</span> {selectedFile.original_file_name}</li>
                {selectedFile.size && <li><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</li>}
                <li><span className="font-medium">Uploaded:</span> {formatDate(selectedFile.created_at)}</li>
                <li className="truncate"><span className="font-medium">URL:</span> {selectedFile.url}</li>
              </ul>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => onCopyUrl(selectedFile.url)}
                  className="flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy URL
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(selectedFile);
                  onOpenChange(false);
                }}
                className="flex items-center"
              >
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
