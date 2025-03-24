
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { uploadImageToStorage } from '@/integrations/supabase/media';
import { Image, Upload, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  existingImageUrl?: string;
  label?: string;
}

const ImageUploader = ({ onImageUploaded, existingImageUrl, label = "Upload Image" }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (existingImageUrl) {
      setPreviewUrl(existingImageUrl);
    }
  }, [existingImageUrl]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Create preview from the selected file
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setPreviewUrl(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
    
    setIsUploading(true);
    
    try {
      console.log("Starting image upload process...");
      
      // Upload the image to Supabase and get media record
      const mediaRecord = await uploadImageToStorage(file);
      
      console.log("Upload successful, media record:", mediaRecord);
      
      // Pass the URL to the parent component
      onImageUploaded(mediaRecord.url);
      
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
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    setError(null);
  };
  
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
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
            onError={(e) => {
              console.error("Error loading preview image:", previewUrl);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
            crossOrigin="anonymous"
          />
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
