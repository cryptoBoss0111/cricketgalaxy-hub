
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from '@/hooks/useArticleSubmit';

interface ArticleBasicInfoProps {
  form: UseFormReturn<ArticleFormValues>;
  categories: string[];
}

const ArticleBasicInfo = ({ form, categories }: ArticleBasicInfoProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter article title" {...field} className="text-xl" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="IPL 2025">IPL 2025</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                  <SelectItem value="Match Preview">Match Preview</SelectItem>
                  <SelectItem value="Match Review">Match Review</SelectItem>
                  <SelectItem value="Women's Cricket">Women's Cricket</SelectItem>
                  <SelectItem value="Player Profile">Player Profile</SelectItem>
                  <SelectItem value="Fantasy Tips">Fantasy Tips</SelectItem>
                  <SelectItem value="World Cup">World Cup</SelectItem>
                  
                  {categories
                    .filter(category => !["IPL 2025", "Analysis", "Match Preview", "Match Review", 
                                        "Women's Cricket", "Player Profile", "Fantasy Tips", "World Cup"]
                                        .includes(category))
                    .map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="cricket, ipl, india, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};

export default ArticleBasicInfo;
