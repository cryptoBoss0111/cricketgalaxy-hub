
import { useRef, useState } from 'react';
import { Upload, Info } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MediaUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (files: FileList) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const MediaUploadDialog = ({
  isOpen,
  onOpenChange,
  onFileUpload,
  isUploading,
  uploadProgress,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop
}: MediaUploadDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      try {
        await onFileUpload(e.target.files);
      } catch (err: any) {
        setError(err.message || 'Error uploading files');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            Select image files to upload to your media library
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-cricket-accent bg-cricket-accent/5' : 'border-gray-200'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-base font-medium">Drag files here or click to browse</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Upload JPG, PNG, GIF, or WebP files
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelection}
            className="hidden"
            id="file-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Select Files
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2 flex justify-between">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cricket-accent"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex p-3 border rounded-lg bg-amber-50 mt-2">
          <Info className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Files will be publicly accessible once uploaded. Make sure you have the rights to use these images.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadDialog;
