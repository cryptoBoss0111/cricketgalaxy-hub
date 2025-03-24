
import { Image } from 'lucide-react';
import MediaCard from './MediaCard';
import { MediaFile } from './types';

interface MediaGridProps {
  files: MediaFile[];
  isLoading: boolean;
  searchQuery: string;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUploadClick: () => void;
  onPreview: (file: MediaFile) => void;
  onCopyUrl: (url: string) => void;
  onDelete: (file: MediaFile) => void;
  formatFileSize: (bytes: number) => string;
}

const MediaGrid = ({
  files,
  isLoading,
  searchQuery,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadClick,
  onPreview,
  onCopyUrl,
  onDelete,
  formatFileSize
}: MediaGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div 
        className={`text-center py-12 border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? 'border-cricket-accent bg-cricket-accent/5' : 'border-gray-200'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        {searchQuery ? (
          <>
            <h3 className="text-xl font-medium text-gray-500">No matching files found</h3>
            <p className="text-gray-400 mt-2">Try changing your search query</p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-medium text-gray-500">No media files yet</h3>
            <p className="text-gray-400 mt-2 mb-6">Upload images to use in your articles and content</p>
            <button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
              onClick={onUploadClick}
            >
              Upload Files
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-colors ${
        isDragging ? 'ring-2 ring-cricket-accent ring-offset-2 bg-cricket-accent/5 rounded-lg p-4' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {files.map((file) => (
        <MediaCard
          key={file.name}
          file={file}
          onPreview={onPreview}
          onCopyUrl={onCopyUrl}
          onDelete={onDelete}
          formatFileSize={formatFileSize}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
