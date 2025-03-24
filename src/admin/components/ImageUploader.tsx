import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { uploadImageToStorage } from '@/integrations/supabase/media';
import { Image, Upload, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageCropper from './MediaLibrary/ImageCropper';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  existingImageUrl?: string;
  label?: string;
}

const ImageUploader = ({ onImageUploaded, existingImageUrl, label = "Upload Image" }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageToProcess, setImageToProcess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (existingImageUrl) {
      // Clean the URL by removing any query parameters
      const cleanedUrl = existingImageUrl.split('?')[0];
      setPreviewUrl(cleanedUrl);
      setCleanUrl(cleanedUrl);
    }
  }, [existingImageUrl]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB");
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Set the file for cropping
    setSelectedFile(file);
    
    // Create preview from the selected file
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setImageToProcess(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Create a file from the blob
      const croppedFile = new File([croppedBlob], selectedFile.name, { type: 'image/jpeg' });
      
      console.log("Starting image upload process with cropped image...");
      
      // Upload the image to Supabase and get media record
      const mediaRecord = await uploadImageToStorage(croppedFile);
      
      console.log("Upload successful, media record:", mediaRecord);
      
      // Ensure the URL is clean (no query parameters)
      const cleanedUrl = mediaRecord.url.split('?')[0];
      setCleanUrl(cleanedUrl);
      setPreviewUrl(cleanedUrl);
      
      // Pass the URL to the parent component
      onImageUploaded(cleanedUrl);
      
      // Reset cropping state
      setImageToProcess(null);
      setSelectedFile(null);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      let errorMessage = "Failed to upload image";
      if (typeof error === 'object' && error !== null) {
        errorMessage = error.message || "Unknown error occurred";
      }
      
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCropCancel = () => {
    // Clean up URL object if it's not a data URL
    if (imageToProcess && !imageToProcess.startsWith('data:')) {
      URL.revokeObjectURL(imageToProcess);
    }
    
    // Reset cropping state
    setImageToProcess(null);
    setSelectedFile(null);
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setCleanUrl(null);
    onImageUploaded('');
    setError(null);
    setImageLoadError(false);
    setImageToProcess(null);
    setSelectedFile(null);
  };
  
  const handleRetry = () => {
    setImageLoadError(false);
    setRetryCount(prev => prev + 1);
  };
  
  // Create a URL with cache busting for external images
  const getImageUrl = () => {
    if (!previewUrl) return null;
    
    // If it's a data URL, return as is
    if (previewUrl.startsWith('data:')) return previewUrl;
    
    // If it's a network URL, add cache busting
    try {
      // Use cleanUrl if available, otherwise use previewUrl but clean it first
      const baseUrl = cleanUrl || previewUrl.split('?')[0];
      return `${baseUrl}?t=${Date.now()}&r=${retryCount}`;
    } catch {
      return previewUrl;
    }
  };
  
  if (imageToProcess) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">{label}</p>
        
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card className="p-4">
          <ImageCropper 
            imageSrc={imageToProcess}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          {imageLoadError ? (
            <div className="h-48 flex flex-col items-center justify-center bg-gray-50">
              <Image className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 mb-3">Image failed to load</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Retry
              </Button>
            </div>
          ) : (
            <img 
              src={getImageUrl() || ''} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              onError={() => {
                console.error("Error loading preview image:", previewUrl);
                setImageLoadError(true);
              }}
              crossOrigin="anonymous"
            />
          )}
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white text-red-500 hover:bg-white/90 hover:text-red-600 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label>
          <Card className="border-dashed border-2 p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="bg-gray-100 p-2 rounded-full">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-400">
                PNG, JPG or WEBP (max. 5MB)
              </div>
              {isUploading && (
                <div className="mt-2 animate-pulse text-xs">Uploading...</div>
              )}
            </div>
          </Card>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
