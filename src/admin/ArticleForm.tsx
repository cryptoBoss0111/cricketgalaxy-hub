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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import ImageUploader from './components/ImageUploader';
import ContentBlockManager, { ContentBlock } from './components/ContentBlockManager';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Define the schema for article form validation
const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(200, "Excerpt must be less than 200 characters").optional(),
  meta_description: z.string().max(160, "Meta description must be less than 160 characters").optional(),
  category: z.string().min(1, "Please select a category"),
  published: z.boolean().default(false),
  cover_image: z.string().optional(),
  featured_image: z.string().optional(),
  tags: z.string().optional()
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const ArticleForm = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  const [adminId, setAdminId] = useState<string | null>(null);
  const { isAdmin, verifyAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize the form with react-hook-form
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      meta_description: '',
      category: '',
      published: false,
      cover_image: '',
      featured_image: '',
      tags: ''
    }
  });

  // Check authentication and setup admin ID
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify admin status first
        const adminStatus = await verifyAdmin();
        
        if (!adminStatus) {
          console.log("Not authenticated as admin, redirecting to login");
          toast({
            title: "Authentication Required",
            description: "You must be logged in as an admin to access this page",
            variant: "destructive",
          });
          navigate('/admin/login');
          return false;
        }
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        let userId = sessionData.session?.user?.id;
        
        // Try to get admin info from localStorage if session doesn't have it
        if (!userId) {
          const adminUserStr = localStorage.getItem('adminUser');
          if (adminUserStr) {
            try {
              const adminUser = JSON.parse(adminUserStr);
              userId = adminUser.id;
              console.log("Using admin ID from localStorage:", userId);
            } catch (error) {
              console.error("Error parsing admin user data:", error);
            }
          }
        }
        
        // If we still don't have a user ID, redirect to login
        if (!userId) {
          toast({
            title: "Authentication Required",
            description: "Unable to determine admin identity. Please log in again.",
            variant: "destructive",
          });
          navigate('/admin/login');
          return false;
        }
        
        console.log("Admin authenticated:", userId);
        setAdminId(userId);
        return true;
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate('/admin/login');
        return false;
      }
    };
    
    checkAuth().then(isAuth => {
      if (isAuth) {
        // Fetch categories for dropdown
        fetchCategories();
        // If editing, fetch article data
        if (id) {
          fetchArticle(id);
        }
      }
    });
  }, [id, navigate, toast, verifyAdmin]);

  // Fetch existing categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(item => item.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch article data if editing
  const fetchArticle = async (articleId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        form.reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          meta_description: data.meta_description || '',
          category: data.category,
          published: data.published || false,
          cover_image: data.cover_image || '',
          featured_image: data.featured_image || '',
          tags: data.tags ? data.tags.join(', ') : ''
        });

        // Set content blocks if they exist
        if (data.content_blocks && Array.isArray(data.content_blocks)) {
          // Convert the JSON data to ContentBlock type
          const blocks = data.content_blocks as unknown as ContentBlock[];
          setContentBlocks(blocks);
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast({
        title: "Error",
        description: "Failed to load article data",
        variant: "destructive",
      });
      navigate('/admin/articles');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Double-check admin status before saving
      if (!adminId || !isAdmin) {
        const adminCheck = await verifyAdmin();
        if (!adminCheck) {
          toast({
            title: "Permission Denied",
            description: "You must be logged in as an admin to publish articles",
            variant: "destructive",
          });
          navigate('/admin/login');
          return;
        }
      }
      
      // Get current session to ensure we have fresh tokens
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }
      
      // Prepare tags array
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      const articleData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        meta_description: values.meta_description || null,
        category: values.category,
        published: values.published,
        cover_image: values.cover_image || null,
        featured_image: values.featured_image || null,
        content_blocks: contentBlocks,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_at: new Date().toISOString(),
        published_at: values.published ? new Date().toISOString() : null,
        author_id: adminId
      };
      
      console.log("Saving article with data:", { ...articleData, content: "[content truncated]" });
      
      if (id) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);
        
        if (error) {
          console.error("Error updating article:", error);
          throw error;
        }
        
        toast({
          title: "Article updated",
          description: "The article has been successfully updated",
        });
      } else {
        // Create new article
        const { error } = await supabase
          .from('articles')
          .insert({
            ...articleData,
            author_id: adminId
          });
        
        if (error) {
          console.error("Error creating article:", error);
          throw error;
        }
        
        toast({
          title: "Article created",
          description: "The article has been successfully created",
        });
      }
      
      // Redirect to articles list
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save article",
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
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">
            {id ? 'Edit Article' : 'Create New Article'}
          </h1>
          <Button onClick={() => navigate('/admin/articles')}>Back to Articles</Button>
        </div>
        
        {/* Show admin status */}
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          {/* Include standard categories */}
                          <SelectItem value="IPL 2025">IPL 2025</SelectItem>
                          <SelectItem value="Analysis">Analysis</SelectItem>
                          <SelectItem value="Match Preview">Match Preview</SelectItem>
                          <SelectItem value="Match Review">Match Review</SelectItem>
                          <SelectItem value="Women's Cricket">Women's Cricket</SelectItem>
                          <SelectItem value="Player Profile">Player Profile</SelectItem>
                          <SelectItem value="Fantasy Tips">Fantasy Tips</SelectItem>
                          <SelectItem value="World Cup">World Cup</SelectItem>
                          
                          {/* Include any additional categories from the database */}
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
              
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
                <TabsTrigger value="seo">SEO & Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
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
              </TabsContent>
              
              <TabsContent value="blocks" className="space-y-6">
                <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Content Blocks</h3>
                    <p className="text-sm text-gray-500">
                      Add rich content blocks to your article. These will appear after the main content.
                    </p>
                  </div>
                  
                  <ContentBlockManager 
                    blocks={contentBlocks}
                    onBlocksChange={setContentBlocks}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-6">
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
              </TabsContent>
            </Tabs>
              
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
                  >
                    {isSubmitting ? 'Saving...' : id ? 'Update Article' : 'Create Article'}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ArticleForm;

