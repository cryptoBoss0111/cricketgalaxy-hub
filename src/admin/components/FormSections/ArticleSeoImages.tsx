
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from '@/hooks/useArticleSubmit';
import ImageUploader from '@/admin/components/ImageUploader';

interface ArticleSeoImagesProps {
  form: UseFormReturn<ArticleFormValues>;
}

const ArticleSeoImages = ({ form }: ArticleSeoImagesProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Cover Image</h3>
          <FormField
            control={form.control}
            name="cover_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    existingImageUrl={field.value}
                    onImageUploaded={(url) => form.setValue('cover_image', url)}
                    label="Article Cover Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Featured Image</h3>
          <FormField
            control={form.control}
            name="featured_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUploader
                    existingImageUrl={field.value}
                    onImageUploaded={(url) => form.setValue('featured_image', url)}
                    label="Featured Image (Homepage)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="meta_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter SEO meta description" 
                  className="h-20"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500 mt-1">
                This description appears in search engine results and social media previews.
              </p>
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};

export default ArticleSeoImages;
