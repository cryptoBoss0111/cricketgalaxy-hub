
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';

const MediaLibraryManager = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Media Library</h1>
            <p className="text-muted-foreground mt-1">Manage images, videos and other media files</p>
          </div>
          <Button>Upload Media</Button>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium">Media Library Coming Soon</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              This feature is under development and will be available soon.
            </p>
            <Button variant="outline">Join Waiting List</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MediaLibraryManager;
