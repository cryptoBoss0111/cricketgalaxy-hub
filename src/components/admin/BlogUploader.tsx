
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUploader from '@/admin/components/ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schema for form validation
const blogSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  content: z.string().min(20, { message: "Content must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  imageUrl: z.string().min(1, { message: "Cover image is required" }),
  addToFeatured: z.boolean().default(false),
  addToTopStories: z.boolean().default(false),
  addToHeroSlider: z.boolean().default(false),
  tags: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface PrefilledData {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  tags?: string;
}

const BlogUploader: React.FC<{ prefilledData?: PrefilledData }> = ({ prefilledData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: prefilledData?.title || '',
      excerpt: prefilledData?.excerpt || '',
      content: prefilledData?.content || '',
      category: prefilledData?.category || '',
      imageUrl: prefilledData?.imageUrl || '',
      tags: prefilledData?.tags || '',
      addToFeatured: false,
      addToTopStories: false,
      addToHeroSlider: false,
    },
  });
  
  useEffect(() => {
    if (prefilledData) {
      Object.entries(prefilledData).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof BlogFormValues, value);
        }
      });
    }
  }, [prefilledData, form]);
  
  const onSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Extract tags
      const tagsArray = values.tags 
        ? values.tags.split(',').map(tag => tag.trim()) 
        : [];
      
      // First, save the article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .insert({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          category: values.category,
          cover_image: values.imageUrl,
          featured_image: values.imageUrl,
          published: true,
          published_at: new Date().toISOString(),
          tags: tagsArray.length > 0 ? tagsArray : undefined,
        })
        .select()
        .single();
      
      if (articleError) throw articleError;
      
      // If user selected to add to top stories
      if (values.addToTopStories && articleData) {
        const { error: topStoryError } = await supabase
          .from('top_stories')
          .insert({
            article_id: articleData.id,
            order_index: 1, // Will be displayed first
            featured: values.addToFeatured,
          });
        
        if (topStoryError) {
          console.error("Error adding to top stories:", topStoryError);
        }
      }
      
      // If user selected to add to hero slider
      if (values.addToHeroSlider && articleData) {
        const { error: heroSliderError } = await supabase
          .from('hero_slider')
          .insert({
            article_id: articleData.id,
            order_index: 1, // Will be displayed first
            is_active: true,
          });
        
        if (heroSliderError) {
          console.error("Error adding to hero slider:", heroSliderError);
        }
      }
      
      toast({
        title: "Blog post created!",
        description: `"${values.title}" has been successfully added to ${values.category}.`,
      });
      
      form.reset();
      
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setError(error.message || "Failed to save blog post");
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Blog Post</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="ipl, match, team names, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter a short excerpt for this blog post..." 
                    {...field} 
                    className="h-20"
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
                    placeholder="Enter the full blog post content..." 
                    {...field} 
                    className="h-48"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    existingImageUrl={field.value}
                    onImageUploaded={(url) => form.setValue('imageUrl', url)}
                    label="Upload Cover Image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-medium">Placement Options</h3>
            
            <FormField
              control={form.control}
              name="addToTopStories"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Add to Top Stories</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="addToFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Mark as Featured</FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="addToHeroSlider"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Add to Hero Slider</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-cricket-accent hover:bg-cricket-accent/90"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default BlogUploader;
