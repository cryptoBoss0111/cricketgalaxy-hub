
import { Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaFile } from './types';
import { useState } from 'react';
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
  
  // Extract a more readable name from the filename
  const displayName = file.name.includes('-') 
    ? file.name.split('-').slice(0, -1).join('-') 
    : file.name;

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
            <p className="text-xs text-gray-400 text-center">Image not available</p>
          </div>
        ) : (
          <img 
            src={file.publicUrl + '?t=' + new Date().getTime()} // Add cache-busting parameter
            alt={file.name} 
            className={`absolute inset-0 w-full h-full object-cover p-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
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
