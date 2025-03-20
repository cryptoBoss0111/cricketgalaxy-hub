
import { useState, useEffect, useRef } from 'react';
import { Image, Upload, Trash2, Copy, Search, X, Info } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getMediaFiles, deleteMediaFile, uploadImageToStorage } from '@/integrations/supabase/client';

interface MediaFile {
  name: string;
  publicUrl: string;
  size: number;
  created_at: string;
  metadata?: any;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchMediaFiles();
  }, []);
  
  useEffect(() => {
    filterMediaFiles();
  }, [searchQuery, mediaFiles]);
  
  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      const files = await getMediaFiles();
      // Transform data to match MediaFile interface
      const transformedFiles: MediaFile[] = files.map(file => ({
        name: file.name,
        publicUrl: file.publicUrl,
        size: file.metadata?.size || 0, // Add default size if missing
        created_at: file.created_at,
        metadata: file.metadata
      }));
      setMediaFiles(transformedFiles);
      setFilteredFiles(transformedFiles);
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
  };
  
  const filterMediaFiles = () => {
    if (!searchQuery) {
      setFilteredFiles(mediaFiles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mediaFiles.filter(file => 
      file.name.toLowerCase().includes(query)
    );
    setFilteredFiles(filtered);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileUpload(e.target.files);
    }
  };
  
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Convert FileList to Array
      const fileArray = Array.from(files);
      let successCount = 0;
      
      // Upload each file
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        try {
          // Check if file is an image
          if (!file.type.startsWith('image/')) {
            toast({
              title: 'Invalid File',
              description: `${file.name} is not an image file`,
              variant: 'destructive'
            });
            continue;
          }
          
          // Upload file
          await uploadImageToStorage(file);
          successCount++;
          
          // Update progress
          setUploadProgress(Math.floor(((i + 1) / fileArray.length) * 100));
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          toast({
            title: 'Upload Error',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive'
          });
        }
      }
      
      // Show success message
      if (successCount > 0) {
        toast({
          title: 'Upload Complete',
          description: `Successfully uploaded ${successCount} ${successCount === 1 ? 'file' : 'files'}`,
        });
        
        // Refresh media files list
        fetchMediaFiles();
      }
      
      // Close dialog
      setIsUploadDialogOpen(false);
    } catch (error) {
      console.error('Error during file upload:', error);
      toast({
        title: 'Upload Error',
        description: 'An error occurred during file upload',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const confirmDelete = (file: MediaFile) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedFile) return;
    
    try {
      await deleteMediaFile(selectedFile.name);
      
      // Update state to remove the deleted file
      setMediaFiles(mediaFiles.filter(file => file.name !== selectedFile.name));
      
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
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Drag and drop handlers
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
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Media Library</h1>
            <p className="text-gray-500 mt-1">Manage images and media files</p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Upload Files
          </Button>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search media files by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div 
            className={`text-center py-12 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-cricket-accent bg-cricket-accent/5' : 'border-gray-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" /> Upload Files
                </Button>
              </>
            )}
          </div>
        ) : (
          <div 
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-colors ${
              isDragging ? 'ring-2 ring-cricket-accent ring-offset-2 bg-cricket-accent/5 rounded-lg p-4' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {filteredFiles.map((file) => (
              <Card key={file.name} className="overflow-hidden hover:shadow-md transition-shadow">
                <div 
                  className="relative h-36 bg-gray-100 cursor-pointer"
                  onClick={() => showPreview(file)}
                >
                  <img 
                    src={file.publicUrl} 
                    alt={file.name} 
                    className="absolute inset-0 w-full h-full object-contain p-2"
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
                      onClick={() => copyToClipboard(file.publicUrl)}
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(file)}
                      title="Delete file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
            <DialogDescription>
              Select image files to upload to your media library
            </DialogDescription>
          </DialogHeader>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-cricket-accent bg-cricket-accent/5' : 'border-gray-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
              onChange={handleFileChange}
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
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="h-16 w-16 relative rounded overflow-hidden bg-gray-100">
                <img 
                  src={selectedFile.publicUrl} 
                  alt={selectedFile.name} 
                  className="absolute inset-0 w-full h-full object-contain" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="truncate">
              {selectedFile?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <>
              <div className="flex-1 min-h-0 relative bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={selectedFile.publicUrl} 
                  alt={selectedFile.name} 
                  className="absolute inset-0 w-full h-full object-contain p-4" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">File name</p>
                  <p className="text-sm truncate">{selectedFile.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">File size</p>
                  <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">URL</p>
                  <div className="flex items-center">
                    <p className="text-sm truncate flex-1">{selectedFile.publicUrl}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1"
                      onClick={() => copyToClipboard(selectedFile.publicUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">Uploaded</p>
                  <p className="text-sm">{formatDate(selectedFile.created_at)}</p>
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setIsPreviewDialogOpen(false);
                    confirmDelete(selectedFile);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(selectedFile.publicUrl)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy URL
                </Button>
                <DialogClose asChild>
                  <Button size="sm">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MediaLibraryManager;
