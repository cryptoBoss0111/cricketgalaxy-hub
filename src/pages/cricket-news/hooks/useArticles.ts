
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Article } from '../types';
import { mockNewsArticles } from '../data/mockNewsArticles';

export const useArticles = (selectedCategory: string, searchQuery: string, sortBy: string) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isLoading, setIsLoading] = useState(true);

  // Load mock articles
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        setTimeout(() => {
          console.log('Using mock news articles');
          setArticles(mockNewsArticles);
          
          const uniqueCategories = [...new Set(mockNewsArticles.map(article => article.category))];
          setCategories(['All Categories', ...uniqueCategories]);
          
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error in fetching articles:', err);
        setArticles(mockNewsArticles);
        setIsLoading(false);
        
        toast({
          title: 'Note',
          description: 'Using mock data - no database connection',
          variant: 'default'
        });
      }
    };
    
    fetchArticles();
  }, [toast]);
  
  // Filter and sort articles based on criteria
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
