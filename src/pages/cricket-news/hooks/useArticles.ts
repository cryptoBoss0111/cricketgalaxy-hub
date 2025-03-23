import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '../types';
import { mockNewsArticles } from '../data/mockNewsArticles';
import { Tables } from '@/integrations/supabase/types';
import { getFullImageUrl } from '@/components/article-card/imageUtils';

export const useArticles = (selectedCategory: string, searchQuery: string, sortBy: string) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching articles from Supabase');
        const { data: articlesData, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching articles:', error);
          toast({
            title: 'Error fetching articles',
            description: error.message,
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Fetched articles:', articlesData);
        
        if (articlesData && articlesData.length > 0) {
          const uniqueCategories = [...new Set(articlesData.map(article => article.category))];
          setCategories(['All Categories', ...uniqueCategories]);
          
          const transformedArticles: Article[] = articlesData.map((article: Tables<'articles'>) => {
            const featured_image = article.featured_image || null;
            const cover_image = article.cover_image || null;
            
            console.log('Article image data:', {
              id: article.id,
              title: article.title,
              featured_image,
              cover_image,
            });
            
            return {
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || article.meta_description || 'Read this exciting story...',
              imageUrl: featured_image || cover_image || null,
              cover_image: cover_image,
              featured_image: featured_image,
              category: article.category,
              author: article.author_id ? `Author ${article.author_id.slice(0, 8)}` : 'CricketExpress Staff',
              author_id: article.author_id || undefined,
              date: new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              timeToRead: `${Math.ceil((article.content?.length || 0) / 1000)} min read`,
              content: article.content
            };
          });
          
          console.log('Transformed articles:', transformedArticles);
          setArticles(transformedArticles);
        } else {
          console.log('No articles found, using mock data');
          setArticles(mockNewsArticles);
          
          const uniqueCategories = [...new Set(mockNewsArticles.map(article => article.category))];
          setCategories(['All Categories', ...uniqueCategories]);
        }
      } catch (err) {
        console.error('Error in fetching articles:', err);
        setArticles(mockNewsArticles);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [toast]);
  
  useEffect(() => {
    let results = [...articles];
    
    if (searchQuery) {
      results = results.filter(
        article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All Categories') {
      results = results.filter(article => article.category === selectedCategory);
    }
    
    if (sortBy === 'latest') {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    console.log(`Filtered articles: ${results.length} articles remain after filtering`);
    setFilteredArticles(results);
  }, [searchQuery, selectedCategory, sortBy, articles]);

  return {
    articles,
    filteredArticles,
    categories,
    isLoading
  };
};
