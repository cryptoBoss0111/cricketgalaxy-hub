
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
  
  // Function to create and make bucket public
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // Check if bucket exists
      const { data: bucket, error: getBucketError } = await supabase.storage
        .getBucket(bucketName);
      
      if (getBucketError) {
        console.log(`Creating bucket ${bucketName}...`);
        const { error: createError } = await supabase.storage
          .createBucket(bucketName, {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
        
        if (createError) {
          console.error(`Error creating bucket: ${createError.message}`);
          return false;
        }
      } else if (bucket) {
        // Make sure bucket is public
        const { error: updateError } = await supabase.storage
          .updateBucket(bucketName, { public: true });
        
        if (updateError) {
          console.error(`Error updating bucket to public: ${updateError.message}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error managing bucket:", error);
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
      throw new Error(`Upload failed: ${error.message}`);
    }
  };
  
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
      const bucketName = 'article_images';
      
      // Ensure bucket exists and is public
      await ensureBucketExists(bucketName);
      
      // Try direct upload method
      let imageUrl = '';
      try {
        imageUrl = await directUpload(file, bucketName);
      } catch (directError) {
        console.error("Direct upload failed:", directError);
        
        // Try with standard uploadImageToStorage as fallback
        imageUrl = await uploadImageToStorage(file, bucketName);
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
      
      // Show more specific error message
      let errorMessage = "Failed to upload image";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.statusText) {
        errorMessage = `${error.statusText} (${error.status})`;
      }
      
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
