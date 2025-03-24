
import { useState } from 'react';
import { Copy, Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  const handleImageError = () => {
    console.error(`Failed to load image: ${file.url}`);
    setImageLoadError(true);
  };

  // Ensure the URL is clean (no query parameters) to avoid CORS issues
  const imageUrl = file.url.split('?')[0];
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative bg-gray-100">
        {!isImageLoaded && !imageLoadError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {imageLoadError ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
            <span className="text-sm text-gray-400 text-center">
              Unable to load image
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={file.original_file_name}
            className={`w-full h-full object-contain ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            crossOrigin="anonymous"
          />
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" title={file.original_file_name}>
          {file.original_file_name}
        </h3>
        
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>{file.size ? formatFileSize(file.size) : 'Unknown size'}</span>
          <span>{file.content_type || 'Image'}</span>
        </div>
        
        <div className="flex justify-between mt-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPreview(file)}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onCopyUrl(file.url)}
            title="Copy URL"
          >
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(file)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MediaCard;
