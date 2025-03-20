
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema for article form validation
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(200, "Excerpt must be less than 200 characters").optional(),
  category: z.string().min(1, "Please select a category"),
  published: z.boolean().default(false),
  cover_image: z.string().optional(),
  tags: z.string().optional()
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const ArticleForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize the form with react-hook-form
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      published: false,
      cover_image: '',
      tags: ''
    }
  });

  // Fetch article data if editing an existing article
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            title: data.title,
            content: data.content,
            excerpt: data.excerpt || '',
            category: data.category,
            published: data.published,
            cover_image: data.cover_image || '',
            tags: data.tags ? data.tags.join(', ') : ''
          });
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: "Error",
          description: "Failed to load article data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, form, toast]);

  // Handle form submission
  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    
    // Get admin info from localStorage
    const adminUserString = localStorage.getItem('adminUser');
    if (!adminUserString) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to publish articles",
        variant: "destructive",
      });
      navigate('/admin/login');
      return;
    }
    
    const adminUser = JSON.parse(adminUserString);
    const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
    
    try {
      if (id) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update({
            title: values.title,
            content: values.content,
            excerpt: values.excerpt || null,
            category: values.category,
            published: values.published,
            cover_image: values.cover_image || null,
            tags: tagsArray.length > 0 ? tagsArray : null,
            updated_at: new Date().toISOString(),
            published_at: values.published ? new Date().toISOString() : null
          })
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Article updated",
          description: "The article has been successfully updated",
        });
      } else {
        // Create new article
        const { error } = await supabase
          .from('articles')
          .insert({
            title: values.title,
            content: values.content,
            excerpt: values.excerpt || null,
            category: values.category,
            published: values.published,
            cover_image: values.cover_image || null,
            tags: tagsArray.length > 0 ? tagsArray : null,
            author_id: adminUser.id,
            published_at: values.published ? new Date().toISOString() : null
          });
        
        if (error) throw error;
        
        toast({
          title: "Article created",
          description: "The article has been successfully created",
        });
      }
      
      // Redirect to articles list
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: "Failed to save article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading article data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">
            {id ? 'Edit Article' : 'Create New Article'}
          </h1>
          <Button onClick={() => navigate('/admin/articles')}>Back to Articles</Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a short excerpt (optional)" 
                        className="h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter article content" 
                        className="h-64"
                        {...field} 
                      />
                    </FormControl>
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
              
              <div className="flex justify-end space-x-4">
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
                >
                  {isSubmitting ? 'Saving...' : id ? 'Update Article' : 'Create Article'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticleForm;
