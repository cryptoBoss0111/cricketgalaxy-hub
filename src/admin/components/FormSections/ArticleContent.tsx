
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from '@/hooks/useArticleSubmit';

interface ArticleContentProps {
  form: UseFormReturn<ArticleFormValues>;
}

const ArticleContent = ({ form }: ArticleContentProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Excerpt</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a short excerpt (shows in article previews)" 
                className="h-20"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter article main content" 
                  className="min-h-[300px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};

export default ArticleContent;
