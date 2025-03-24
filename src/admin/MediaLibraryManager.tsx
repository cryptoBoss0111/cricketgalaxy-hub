
import { useState, useEffect, useCallback } from 'react';
import { Upload, RotateCw } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getMediaFiles, deleteMediaFile, uploadImageToStorage } from '@/integrations/supabase/media';
import { 
  MediaGrid, 
  MediaSearchBar, 
  MediaUploadDialog, 
  MediaDeleteDialog, 
  MediaPreviewDialog,
  MediaFile
} from './components/MediaLibrary';

const MediaLibraryManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { toast } = useToast();
  
  const fetchMediaFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const files = await getMediaFiles();
      console.log("Fetched media files:", files);
      
      // Files are already in the correct format from the database
      setMediaFiles(files);
      setFilteredFiles(files);
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media library',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles, refreshTrigger]);
  
  useEffect(() => {
    filterMediaFiles();
  }, [searchQuery, mediaFiles]);
  
  const filterMediaFiles = () => {
    if (!searchQuery) {
      setFilteredFiles(mediaFiles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mediaFiles.filter(file => 
      file.original_file_name.toLowerCase().includes(query)
    );
    setFilteredFiles(filtered);
  };
  
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileArray = Array.from(files);
      let successCount = 0;
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        try {
          if (!file.type.startsWith('image/')) {
            toast({
              title: 'Invalid File',
              description: `${file.name} is not an image file`,
              variant: 'destructive'
            });
            continue;
          }
          
          console.log(`Starting upload for file ${i+1}/${fileArray.length}: ${file.name}`);
          await uploadImageToStorage(file);
          successCount++;
          
          setUploadProgress(Math.floor(((i + 1) / fileArray.length) * 100));
          console.log(`File ${i+1}/${fileArray.length} upload complete. Progress: ${Math.floor(((i + 1) / fileArray.length) * 100)}%`);
        } catch (fileError: any) {
          console.error(`Error uploading ${file.name}:`, fileError);
          toast({
            title: 'Upload Error',
            description: fileError.message || `Failed to upload ${file.name}`,
            variant: 'destructive'
          });
        }
      }
      
      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'}`,
        });
        
        // Refresh the media library after successful upload
        await fetchMediaFiles();
      }
      
      setIsUploadDialogOpen(false);
    } catch (error: any) {
      console.error('Error during file upload:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'An error occurred during file upload',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const confirmDelete = (file: MediaFile) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedFile) return;
    
    try {
      await deleteMediaFile(selectedFile.id);
      
      setMediaFiles(mediaFiles.filter(file => file.id !== selectedFile.id));
      
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  };
  
  const showPreview = (file: MediaFile) => {
    setSelectedFile(file);
    setIsPreviewDialogOpen(true);
  };
  
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Copied!',
        description: 'Image URL copied to clipboard',
      });
    }).catch(err => {
      console.error('Error copying to clipboard:', err);
      toast({
        title: 'Error',
        description: 'Failed to copy URL to clipboard',
        variant: 'destructive'
      });
    });
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshing",
      description: "Refreshing media library..."
    });
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Media Library</h1>
            <p className="text-gray-500 mt-1">Manage images and media files</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} className="flex items-center">
              <RotateCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" /> Upload Files
            </Button>
          </div>
        </div>
        
        <MediaSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <MediaGrid 
          files={filteredFiles}
          isLoading={isLoading}
          searchQuery={searchQuery}
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onUploadClick={() => setIsUploadDialogOpen(true)}
          onPreview={showPreview}
          onCopyUrl={copyToClipboard}
          onDelete={confirmDelete}
          formatFileSize={formatFileSize}
          onRefresh={handleRefresh}
        />
      </div>
      
      <MediaUploadDialog 
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
      
      <MediaDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedFile={selectedFile}
        onDelete={handleDelete}
        formatFileSize={formatFileSize}
      />
      
      <MediaPreviewDialog 
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        selectedFile={selectedFile}
        onDelete={confirmDelete}
        onCopyUrl={copyToClipboard}
        formatFileSize={formatFileSize}
        formatDate={formatDate}
      />
    </AdminLayout>
  );
};

export default MediaLibraryManager;
