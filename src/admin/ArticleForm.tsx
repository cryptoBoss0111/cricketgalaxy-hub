import { useState, useEffect, useRef } from 'react';
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
import { Info, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { bypassRLSArticleSave } from '@/utils/adminAuth';

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200, "Excerpt must be less than 200 characters"),
  meta_description: z.string().max(160, "Meta description must be less than 160 characters").optional(),
  category: z.string().min(1, "Please select a category"),
  published: z.boolean().default(false),
  image_url: z.string().min(1, "Article image is required for published articles").optional(),
  tags: z.string().optional()
}).refine((data) => {
  if (data.published) {
    return !!data.image_url && !!data.excerpt;
  }
  return true;
}, {
  message: "Article image and excerpt are required for published articles",
  path: ["published"]
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const { isAdmin, verifyAdmin, refreshAdminSession } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      meta_description: '',
      category: '',
      published: false,
      image_url: '',
      tags: ''
    },
    mode: 'onChange'
  });

  const watchPublished = form.watch("published");
  const watchImageUrl = form.watch("image_url");
  const watchExcerpt = form.watch("excerpt");

  useEffect(() => {
    const warnings: string[] = [];
    
    if (watchPublished) {
      if (!watchImageUrl) {
        warnings.push("Article image is required for published articles");
      }
      if (!watchExcerpt || watchExcerpt.length < 10) {
        warnings.push("A descriptive excerpt (min 10 characters) is required for published articles");
      }
    }
    
    setValidationWarnings(warnings);
  }, [watchPublished, watchImageUrl, watchExcerpt]);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        await refreshAdminSession();
        
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
        
        const { data: sessionData } = await supabase.auth.getSession();
        let userId = sessionData.session?.user?.id;
        
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
      if (isAuth && isMounted) {
        fetchCategories();
        if (id) {
          fetchArticle(id);
        }
      }
    });
    
    return () => {
      isMounted = false;
    };
  }, [id, navigate, toast, verifyAdmin, refreshAdminSession]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      const uniqueCategories = Array.from(new Set(data?.map(item => item.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
        const imageUrl = data.cover_image || data.featured_image || '';
        
        form.reset({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt || '',
          meta_description: data.meta_description || '',
          category: data.category,
          published: data.published || false,
          image_url: imageUrl,
          tags: data.tags ? data.tags.join(', ') : ''
        });

        if (data.content_blocks && Array.isArray(data.content_blocks)) {
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

  const validateForm = (values: ArticleFormValues): boolean => {
    if (values.published) {
      if (!values.image_url) {
        form.setError("image_url", {
          type: "manual",
          message: "Article image is required for published articles"
        });
        setActiveTab('seo');
        return false;
      }
      
      if (!values.excerpt || values.excerpt.length < 10) {
        form.setError("excerpt", {
          type: "manual",
          message: "A descriptive excerpt is required for published articles"
        });
        setActiveTab('content');
        return false;
      }
    }
    
    return true;
  };

  const onSubmit = async (values: ArticleFormValues) => {
    if (!validateForm(values)) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before publishing",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setSaveError(null);
    
    try {
      if (!adminId || !isAdmin) {
        console.log("Verifying admin status before saving...");
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
      
      console.log("Refreshing session before saving article...");
      const sessionRefreshed = await refreshAdminSession();
      
      if (!sessionRefreshed) {
        console.log("Session refresh failed, trying local admin ID as fallback");
        if (!adminId) {
          toast({
            title: "Session Expired",
            description: "Your session has expired and couldn't be refreshed. Please log in again.",
            variant: "destructive",
          });
          navigate('/admin/login');
          return;
        }
        console.log("Using cached admin ID:", adminId);
      } else {
        console.log("Session refreshed successfully");
      }
      
      const effectiveAdminId = adminId;
      if (!effectiveAdminId) {
        toast({
          title: "Authentication Error",
          description: "Could not determine your admin identity. Please log in again.",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }
      
      const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()) : [];
      
      const articleData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt || null,
        meta_description: values.meta_description || null,
        category: values.category,
        published: values.published,
        cover_image: values.image_url || null,
        featured_image: values.image_url || null,
        content_blocks: contentBlocks,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_at: new Date().toISOString(),
        published_at: values.published ? new Date().toISOString() : null,
        author_id: effectiveAdminId
      };
      
      console.log("Saving article with data:", { ...articleData, content: "[content truncated]" });
      
      let result;
      
      try {
        if (id) {
          const { data } = await bypassRLSArticleSave(articleData, true, id);
          result = data;
          console.log("Article updated via RLS bypass:", result);
        } else {
          const { data } = await bypassRLSArticleSave(articleData);
          result = data;
          console.log("Article created via RLS bypass:", result);
        }
      } catch (bypassError: any) {
        console.error("RLS bypass failed, trying direct method:", bypassError);
        setSaveError(`RLS bypass error: ${bypassError.message || 'Unknown error'}`);
        
        if (id) {
          const { data, error } = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', id)
            .select();
          
          if (error) {
            console.error("Error updating article:", error);
            throw error;
          }
          
          result = data;
        } else {
          const { data, error } = await supabase
            .from('articles')
            .insert({
              ...articleData,
              author_id: effectiveAdminId
            })
            .select();
          
          if (error) {
            console.error("Error creating article:", error);
            throw error;
          }
          
          result = data;
        }
      }
      
      const actionText = id ? "updated" : "created";
      toast({
        title: `Article ${actionText}`,
        description: `The article has been successfully ${actionText}. Add it to Top Stories in the admin menu if you want it to appear on the homepage.`,
        duration: 6000,
      });
      
      console.log("Save successful, result:", result);
      
      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      
      let errorMessage = "Failed to save article";
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }
      
      setSaveError(errorMessage);
      
      toast({
        title: "Error Saving Article",
        description: errorMessage,
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
        
        {validationWarnings.length > 0 && watchPublished && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700">Validation Warnings</AlertTitle>
            <AlertDescription className="text-amber-600">
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
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
                      <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
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
              
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
                <TabsTrigger value="seo">SEO & Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <Card className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Excerpt {watchPublished && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter a short excerpt (shows in article previews)" 
                            className="h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          {watchPublished ? 
                            "Required for published articles. Appears in article previews and search results." :
                            "Appears in article previews and search results."}
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main Content <span className="text-red-500">*</span></FormLabel>
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
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Article Image {watchPublished && <span className="text-red-500">*</span>}
                    </h3>
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploader
                              existingImageUrl={field.value}
                              onImageUploaded={(url) => form.setValue('image_url', url)}
                              label={`Article Image ${watchPublished ? '(Required)' : ''}`}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500 mt-2">
                            This image will be used as both the article cover image and featured image.
                          </p>
                        </FormItem>
                      )}
                    />
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
                  {watchPublished && 
                   " Published articles require a title, category, content, excerpt, cover image, and featured image."}
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
                          {field.value && 
                           " Make sure all required fields are filled before publishing."}
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
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ArticleForm;
