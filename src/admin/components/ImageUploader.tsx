
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadImageToStorage, supabase } from '@/integrations/supabase/client';
import { Image, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  existingImageUrl?: string;
  label?: string;
}

const ImageUploader = ({ onImageUploaded, existingImageUrl, label = "Upload Image" }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  const { toast } = useToast();
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setPreviewUrl(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
    
    // Upload to Supabase
    setIsUploading(true);
    
    try {
      console.log("Starting image upload process...");
      
      // Force create the bucket if it doesn't exist (multiple attempts)
      let bucketCreated = false;
      const bucketName = 'article_images';
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Attempt ${attempt} to create/check bucket '${bucketName}'`);
          
          // First try to create the bucket
          await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          
          console.log(`Bucket '${bucketName}' created or already exists`);
          bucketCreated = true;
          break; // Exit the loop if successful
        } catch (bucketError: any) {
          // If the bucket already exists, consider it a success
          if (bucketError.message && bucketError.message.includes("already exists")) {
            console.log(`Bucket '${bucketName}' already exists`);
            bucketCreated = true;
            break;
          }
          
          console.warn(`Attempt ${attempt} failed to create bucket:`, bucketError);
          
          if (attempt === 3) {
            console.log("All bucket creation attempts failed, will try upload anyway");
          }
          
          // Short delay before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Retry upload with multiple attempts
      let uploadSuccess = false;
      let imageUrl = '';
      
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Attempt ${attempt} to upload file to ${bucketName}`);
          
          imageUrl = await uploadImageToStorage(file);
          
          if (imageUrl) {
            console.log("Upload successful, image URL:", imageUrl);
            uploadSuccess = true;
            break; // Exit the loop if successful
          }
        } catch (uploadError) {
          console.error(`Attempt ${attempt} failed to upload:`, uploadError);
          
          if (attempt === 3) {
            throw uploadError; // Re-throw on final attempt
          }
          
          // Short delay before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!uploadSuccess) {
        throw new Error("Failed to upload image after multiple attempts");
      }
      
      onImageUploaded(imageUrl);
      setPreviewUrl(imageUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Show more specific error message
      let errorMessage = "Failed to upload image";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.statusText) {
        errorMessage = `${error.statusText} (${error.status})`;
      }
      
      // Suggest a workaround if bucket creation failed
      if (errorMessage.includes("row-level security policy") || 
          errorMessage.includes("permission denied")) {
        errorMessage += ". Try refreshing the page or logging in again.";
      }
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });
      
      // Clear the preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover"
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
