
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { bypassRLSArticleSave } from '@/utils/admin/articles';
import { z } from 'zod';
import { ContentBlock } from '@/admin/components/ContentBlockManager';

export const articleSchema = z.object({
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

export type ArticleFormValues = z.infer<typeof articleSchema>;

export const useArticleSubmit = (contentBlocks: ContentBlock[], articleId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { isAdmin, verifyAdmin, refreshAdminSession } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (values: ArticleFormValues) => {
    setIsSubmitting(true);
    setSaveError(null);
    
    try {
      if (!isAdmin) {
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
      
      // Get admin ID
      let adminId = null;
      
      // Try getting from session
      const { data: sessionData } = await supabase.auth.getSession();
      adminId = sessionData.session?.user?.id;
      
      // If not in session, try localStorage
      if (!adminId) {
        const adminUserStr = localStorage.getItem('adminUser');
        if (adminUserStr) {
          try {
            const adminUser = JSON.parse(adminUserStr);
            adminId = adminUser.id;
            console.log("Using admin ID from localStorage:", adminId);
          } catch (error) {
            console.error("Error parsing admin user data:", error);
          }
        }
      }
      
      if (!adminId) {
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
        cover_image: values.cover_image || null,
        featured_image: values.featured_image || null,
        content_blocks: contentBlocks,
        tags: tagsArray.length > 0 ? tagsArray : null,
        updated_at: new Date().toISOString(),
        published_at: values.published ? new Date().toISOString() : null,
        author_id: adminId
      };
      
      console.log("Saving article with data:", { ...articleData, content: "[content truncated]" });
      
      let result;
      
      try {
        if (articleId) {
          const { data } = await bypassRLSArticleSave(articleData, true, articleId);
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
        
        if (articleId) {
          const { data, error } = await supabase
            .from('articles')
            .update(articleData)
            .eq('id', articleId)
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
              author_id: adminId
            })
            .select();
          
          if (error) {
            console.error("Error creating article:", error);
            throw error;
          }
          
          result = data;
        }
      }
      
      const actionText = articleId ? "updated" : "created";
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
  
  return {
    handleSubmit,
    isSubmitting,
    saveError,
    setSaveError
  };
};
