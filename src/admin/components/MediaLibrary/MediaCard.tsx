
import { Copy, Trash2 } from 'lucide-react';
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
  // Extract a more readable name from the timestamp-based filename
  const displayName = file.name.includes('-') 
    ? file.name.split('-').slice(0, -1).join('-') 
    : file.name;

  return (
    <Card key={file.name} className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="relative h-36 bg-gray-100 cursor-pointer"
        onClick={() => onPreview(file)}
      >
        <img 
          src={file.publicUrl} 
          alt={file.name} 
          className="absolute inset-0 w-full h-full object-cover p-2"
          crossOrigin="anonymous"
          loading="lazy"
          onError={(e) => {
            console.error("Error loading image:", file.publicUrl);
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <CardContent className="p-3">
        <div className="text-sm font-medium truncate mb-1" title={file.name}>
          {file.name}
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
