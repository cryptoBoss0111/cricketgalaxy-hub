
import { Copy, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaFile } from './types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const displayName = file.name.includes('-') 
    ? file.name.split('-').slice(0, -1).join('-') 
    : file.name;

  // Add a retry mechanism
  useEffect(() => {
    if (hasError && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log(`Retrying image load for ${file.name}, attempt ${retryCount + 1}`);
        setIsLoading(true);
        setHasError(false);
        setRetryCount(prevCount => prevCount + 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasError, retryCount, file.name]);

  // Function to handle image retry
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  };

  return (
    <Card key={file.name} className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="relative h-36 bg-gray-100 cursor-pointer"
        onClick={() => onPreview(file)}
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50">
            <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 text-center mb-2">Image not available</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs py-1 px-2 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
            >
              Retry
            </Button>
          </div>
        ) : (
          <img 
            src={`${file.publicUrl}?t=${new Date().getTime()}&rand=${Math.random()}`} // Add stronger cache-busting
            alt={file.name} 
            className={`absolute inset-0 w-full h-full object-cover p-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => {
              console.log(`Image loaded successfully: ${file.name}`);
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Error loading image:", file.publicUrl);
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>
      
      <CardContent className="p-3">
        <div className="text-sm font-medium truncate mb-1" title={file.name}>
          {displayName}
        </div>
        <div className="text-xs text-gray-500 flex justify-between">
          <span>{formatFileSize(file.size)}</span>
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
              onCopyUrl(file.publicUrl);
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
