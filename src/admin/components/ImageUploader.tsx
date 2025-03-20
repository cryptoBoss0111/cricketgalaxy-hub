
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { uploadImageToStorage, supabase } from '@/integrations/supabase/client';
import { Image, Upload, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  existingImageUrl?: string;
  label?: string;
}

const ImageUploader = ({ onImageUploaded, existingImageUrl, label = "Upload Image" }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError("Please log in to upload images");
      }
    };
    
    checkSession();
  }, []);
  
  // Function to create and ensure bucket is public
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      console.log(`Checking if bucket ${bucketName} exists...`);
      
      // Check if bucket exists
      const { data: bucket, error: getBucketError } = await supabase.storage
        .getBucket(bucketName);
      
      if (getBucketError) {
        console.log(`Error checking bucket ${bucketName}: ${getBucketError.message}`);
        return false;
      }
      
      if (!bucket) {
        console.log(`Bucket ${bucketName} doesn't exist, cannot create it programmatically`);
        toast({
          title: "Storage configuration error",
          description: "Please check your Supabase storage configuration",
          variant: "destructive",
        });
        return false;
      }
      
      console.log(`Bucket ${bucketName} exists`);
      return true;
    } catch (error) {
      console.error("Error checking bucket:", error);
      return false;
    }
  };
  
  // Direct upload function with better error handling
  const directUpload = async (file: File, bucketName: string): Promise<string> => {
    // Generate unique filename
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 12);
    const extension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${extension}`;
    
    try {
      // First check session before uploading
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Authentication required to upload files");
      }
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueFileName);
      
      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Clear previous errors
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB");
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
      const bucketName = 'article_images';
      
      // Ensure bucket exists
      const bucketExists = await ensureBucketExists(bucketName);
      if (!bucketExists) {
        throw new Error("Storage bucket not accessible");
      }
      
      // Try direct upload method
      let imageUrl = '';
      try {
        imageUrl = await directUpload(file, bucketName);
      } catch (directError: any) {
        console.error("Direct upload failed:", directError);
        
        // Try with standard uploadImageToStorage as fallback
        try {
          imageUrl = await uploadImageToStorage(file, bucketName);
        } catch (fallbackError: any) {
          console.error("Fallback upload failed:", fallbackError);
          throw new Error(
            directError.message || 
            (typeof fallbackError === 'object' && fallbackError.message) || 
            "Failed to upload image. Please try again."
          );
        }
      }
      
      if (!imageUrl) {
        throw new Error("Failed to get image URL after upload");
      }
      
      onImageUploaded(imageUrl);
      setPreviewUrl(imageUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Format error message
      let errorMessage = "Failed to upload image";
      if (typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.error_description) {
          errorMessage = error.error_description;
        } else if (error.statusText) {
          errorMessage = `${error.statusText} (${error.status})`;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      });
      
      // Clear the preview on error
      setPreviewUrl(existingImageUrl);
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
        <Alert variant="warning" className="mb-3">
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
