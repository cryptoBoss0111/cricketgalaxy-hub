
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArticleFormHeaderProps {
  id?: string;
  isAdmin: boolean;
  saveError: string | null;
}

const ArticleFormHeader = ({ id, isAdmin, saveError }: ArticleFormHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">
          {id ? 'Edit Article' : 'Create New Article'}
        </h1>
        <Button onClick={() => navigate('/admin/articles')}>Back to Articles</Button>
      </div>
      
      {isAdmin ? (
        <Alert className="bg-green-50 border-green-200">
          <Info className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Admin Authenticated</AlertTitle>
          <AlertDescription className="text-green-600">
            You have admin permissions to create and edit articles.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Admin permissions are required to save articles. Please log in.
          </AlertDescription>
        </Alert>
      )}
      
      {saveError && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error Saving Article</AlertTitle>
          <AlertDescription>
            {saveError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ArticleFormHeader;
