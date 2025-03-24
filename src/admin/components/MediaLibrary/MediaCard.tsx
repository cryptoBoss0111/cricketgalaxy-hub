
import { useState, useEffect } from 'react';
import { Copy, Trash2, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaFile } from './types';

interface MediaCardProps {
  file: MediaFile;
  onPreview: (file: MediaFile) => void;
  onCopyUrl: (url: string) => void;
  onDelete: (file: MediaFile) => void;
  formatFileSize: (bytes: number) => string;
}

const MediaCard = ({
  file,
  onPreview,
  onCopyUrl,
  onDelete,
  formatFileSize
}: MediaCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Extract a more readable name from the filename
  const displayName = file.original_file_name.split('.')[0] || file.original_file_name;
  const fileExtension = file.original_file_name.split('.').pop()?.toLowerCase();

  // Function to handle image retry
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Manually retrying image: ${file.original_file_name}`);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // Generate direct URL to image with cache busting
  const getImageUrl = () => {
    // Ensure we have a clean URL (no query parameters)
    const baseUrl = file.url.split('?')[0];
    // Add cache busting parameter
    return `${baseUrl}?t=${Date.now()}&r=${retryCount}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="relative h-36 bg-gray-100 cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-cricket-accent border-t-transparent"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50">
            <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 text-center mb-2">Image not available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs py-1 px-2 h-auto flex items-center"
              onClick={handleRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        ) : (
          <img 
            src={getImageUrl()}
            alt={file.original_file_name} 
            className={`absolute inset-0 w-full h-full object-cover p-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            loading="lazy"
            onLoad={() => {
              console.log(`Image loaded successfully: ${file.original_file_name}`);
              setIsLoading(false);
            }}
            onError={() => {
              console.error(`Error loading image: ${file.original_file_name}`);
              setHasError(true);
              setIsLoading(false);
            }}
            crossOrigin="anonymous"
          />
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="text-sm font-medium truncate mb-1" title={file.original_file_name}>
          {displayName}
        </div>
        <div className="text-xs text-gray-500 flex justify-between">
          <span>{file.size ? formatFileSize(file.size) : ""}</span>
          {fileExtension && <span className="text-gray-400">.{fileExtension}</span>}
          {hasError && (
            <span className="text-amber-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </span>
          )}
        </div>
        
        <div className="flex justify-between mt-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onCopyUrl(file.url.split('?')[0]); // Use clean URL
            }}
            title="Copy URL"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file);
            }}
            title="Delete file"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
