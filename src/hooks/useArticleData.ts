
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ContentBlock } from '@/admin/components/ContentBlockManager';
import { ArticleFormValues } from './useArticleSubmit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { articleSchema } from './useArticleSubmit';

export const useArticleData = (articleId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const fetchArticle = async (id: string) => {
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
          meta_description: data.meta_description || '',
          category: data.category,
          published: data.published || false,
          cover_image: data.cover_image || '',
          featured_image: data.featured_image || '',
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

  useEffect(() => {
    const checkAdminId = async () => {
      // Get admin ID from session or localStorage
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
      
      setAdminId(userId);
    };
    
    checkAdminId();
    fetchCategories();
    if (articleId) {
      fetchArticle(articleId);
    }
  }, [articleId, navigate, toast]);

  return {
    form,
    isLoading,
    categories,
    contentBlocks,
    setContentBlocks,
    adminId
  };
};
