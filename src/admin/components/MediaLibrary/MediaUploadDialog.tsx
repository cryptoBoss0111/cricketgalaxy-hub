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
import ImageCropper from './ImageCropper';
import { uploadImageToStorage } from '@/integrations/supabase/media';

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
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  const [processingFile, setProcessingFile] = useState<File | null>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        setError('Please select only JPEG files (.jpg or .jpeg)');
        return;
      }
      
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (extension !== 'jpg' && extension !== 'jpeg') {
        setError('Only .jpg and .jpeg files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setImageToProcess(imageUrl);
      setProcessingFile(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        setError('Please select only JPEG files (.jpg or .jpeg)');
        return;
      }
      
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (extension !== 'jpg' && extension !== 'jpeg') {
        setError('Only .jpg and .jpeg files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setImageToProcess(imageUrl);
      setProcessingFile(file);
    }
  };
  
  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!processingFile) {
      setError('No file selected');
      return;
    }
    
    try {
      const extension = processingFile.name.split('.').pop()?.toLowerCase();
      const useExtension = (extension === 'jpg' || extension === 'jpeg') ? extension : 'jpg';
      
      const originalMimeType = processingFile.type;
      console.log("Original file MIME type:", originalMimeType);
      
      const croppedFile = new File(
        [croppedBlob], 
        `${processingFile.name.split('.')[0]}.${useExtension}`, 
        { type: originalMimeType }
      );
      
      console.log("Cropped file:", croppedFile.name, croppedFile.type, croppedFile.size);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(croppedFile);
      const fileList = dataTransfer.files;
      
      await onFileUpload(fileList);
      
      setImageToProcess(null);
      setProcessingFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
    }
  };
  
  const handleCropCancel = () => {
    if (imageToProcess) {
      URL.revokeObjectURL(imageToProcess);
    }
    
    setImageToProcess(null);
    setProcessingFile(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            {imageToProcess ? 'Crop your image before uploading' : 'Select JPEG images to upload to your media library'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {imageToProcess ? (
          <ImageCropper
            imageSrc={imageToProcess}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        ) : (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-cricket-accent bg-cricket-accent/5' : 'border-gray-200'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={handleDrop}
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="text-base font-medium">Drag files here or click to browse</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Upload JPEG files only (.jpg, .jpeg)
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg"
                multiple={false}
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
                Only JPEG files (.jpg, .jpeg) are allowed. Files will be publicly accessible once uploaded.
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploadDialog;
