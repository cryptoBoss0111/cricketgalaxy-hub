
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  created_at: string;
  published: boolean;
  author_id: string | null;
}

const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const adminToken = localStorage.getItem('adminToken');
      
      if (!data.session && adminToken !== 'authenticated') {
        navigate('/admin/login');
      } else {
        fetchArticles();
      }
    };
    
    checkAuth();
  }, [navigate]);

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

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters if they exist
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      if (statusFilter) {
        query = query.eq('published', statusFilter === 'published');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by search query if it exists
      let filteredData = data || [];
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filteredData = filteredData.filter(article => 
          article.title.toLowerCase().includes(searchLower) || 
          (article.excerpt && article.excerpt.toLowerCase().includes(searchLower))
        );
      }
      
      setArticles(filteredData);
      
      // Fetch categories for the filter dropdown
      await fetchCategories();
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateArticle = () => {
    navigate('/admin/articles/new');
  };

  const handleEditArticle = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const confirmDelete = (id: string) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleToDelete);
      
      if (error) throw error;
      
      setArticles(articles.filter(article => article.id !== articleToDelete));
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const applyFilters = () => {
    fetchArticles();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    fetchArticles();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-heading font-bold">Articles</h1>
          <Button onClick={handleCreateArticle}>
            <Plus className="h-4 w-4 mr-2" /> New Article
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={applyFilters}>
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500">No articles found</h3>
              <p className="text-gray-400 mt-2">Try changing your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[300px]">
                            {article.title}
                          </p>
                          {article.excerpt && (
                            <p className="text-sm text-gray-500 truncate max-w-[300px] mt-1">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-gray-500 text-sm">
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditArticle(article.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmDelete(article.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ArticlesList;
