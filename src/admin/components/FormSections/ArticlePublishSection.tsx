
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from '@/hooks/useArticleSubmit';
import { useNavigate } from 'react-router-dom';

interface ArticlePublishSectionProps {
  form: UseFormReturn<ArticleFormValues>;
  isSubmitting: boolean;
  id?: string;
}

const ArticlePublishSection = ({ form, isSubmitting, id }: ArticlePublishSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Before publishing</AlertTitle>
        <AlertDescription>
          Make sure you have added a title, content, category, and at least one image before publishing your article.
        </AlertDescription>
      </Alert>
      
      <div className="flex items-start space-x-6">
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Published</FormLabel>
                <p className="text-sm text-gray-500">
                  Check this box to make the article publicly visible.
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 flex-grow">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/articles')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArticlePublishSection;
