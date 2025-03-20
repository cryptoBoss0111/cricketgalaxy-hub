
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  Search, 
  Filter,
  Download,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  created_at: string;
}

const MediaLibraryManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Load media files on component mount
  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      // Fetch files from Supabase Storage
      const { data: storageFiles, error: storageError } = await supabase
        .storage
        .from('article_images')
        .list();

      if (storageError) {
        throw storageError;
      }

      // Process and format the files
      const files: MediaFile[] = [];
      for (const file of storageFiles || []) {
        // Skip folders
        if (file.id === null) continue;

        // Get the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('article_images')
          .getPublicUrl(file.name);

        const fileType = file.metadata?.mimetype || 
          file.name.split('.').pop()?.toLowerCase() || 'unknown';
        
        const isImage = fileType.startsWith('image/') || 
          ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileType);

        files.push({
          id: file.id || file.name,
          name: file.name,
          url: publicUrl,
          type: isImage ? 'image' : 'document',
          size: file.metadata?.size || 0,
          created_at: file.created_at || new Date().toISOString()
        });
      }

      // Filter files based on search and type filter
      let filteredFiles = [...files];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredFiles = filteredFiles.filter(file => 
          file.name.toLowerCase().includes(query)
        );
      }
      
      if (typeFilter) {
        filteredFiles = filteredFiles.filter(file => file.type === typeFilter);
      }
      
      // Sort by most recent
      filteredFiles.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setMediaFiles(filteredFiles);
    } catch (error) {
      console.error('Error fetching media files:', error);
      toast({
        title: "Error loading media files",
        description: "There was a problem loading your media files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type (images only)
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
    
    setUploadingFile(true);
    
    try {
      // Generate a unique file name
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 12);
      const extension = file.name.split('.').pop();
      const uniqueFileName = `${timestamp}-${randomString}.${extension}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('article_images')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      });
      
      // Refresh the file list
      await fetchMediaFiles();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your file",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
      setUploadDialogOpen(false);
    }
  };

  const confirmDelete = (file: MediaFile) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    
    try {
      // Delete from Supabase Storage
      const { error } = await supabase
        .storage
        .from('article_images')
        .remove([fileToDelete.name]);
      
      if (error) throw error;
      
      // Update local state
      setMediaFiles(mediaFiles.filter(file => file.id !== fileToDelete.id));
      
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "There was a problem deleting the file",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    toast({
      title: "URL copied",
      description: "The file URL has been copied to clipboard",
    });
    
    // Reset copied state after a delay
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderMediaGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-200 rounded-md h-48"></div>
          ))}
        </div>
      );
    }

    if (mediaFiles.length === 0) {
      return (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium">No Media Files Found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Upload images to start building your media library.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload First Image
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaFiles.map((file) => (
          <Card key={file.id} className="overflow-hidden group">
            <div className="relative h-40 bg-gray-100">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => copyUrlToClipboard(file.url)}
                >
                  {copiedUrl === file.url ? 
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                    <Copy className="h-4 w-4" />
                  }
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => confirmDelete(file)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500 flex justify-between">
                <span>{getFileSize(file.size)}</span>
                <span>{new Date(file.created_at).toLocaleDateString()}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-1">Manage images, videos and other media files</p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={typeFilter === 'image' ? 'default' : 'outline'} 
              onClick={() => setTypeFilter(typeFilter === 'image' ? '' : 'image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </Button>
            <Button 
              variant={typeFilter === 'document' ? 'default' : 'outline'} 
              onClick={() => setTypeFilter(typeFilter === 'document' ? '' : 'document')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Documents
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {renderMediaGrid()}
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop or click to select
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PNG, JPG, GIF up to 5MB
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingFile}
                />
                <Button asChild disabled={uploadingFile}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadingFile ? 'Uploading...' : 'Select File'}
                  </label>
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete File</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteFile}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MediaLibraryManager;
