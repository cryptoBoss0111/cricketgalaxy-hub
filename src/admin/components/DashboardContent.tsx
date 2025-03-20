
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  created_at: string;
  published: boolean;
  category: string;
}

// Mock data to use when API fails
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "India vs Australia: 3rd Test Preview",
    created_at: new Date().toISOString(),
    published: true,
    category: "Match Preview"
  },
  {
    id: "2",
    title: "IPL 2025 Auction Analysis - Who got the best deals?",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    published: false,
    category: "IPL"
  },
  {
    id: "3",
    title: "Top 10 Players to Watch in the World Cup",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    published: true,
    category: "World Cup"
  },
  {
    id: "4",
    title: "England's Tour of India: What to Expect",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    published: true,
    category: "Series Preview"
  },
  {
    id: "5",
    title: "Women's World Cup Final Recap",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    published: true,
    category: "Women's Cricket"
  }
];

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
  });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch article statistics
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, published');
      
      if (articlesError) throw articlesError;

      // Calculate statistics
      const totalArticles = articlesData?.length || 0;
      const publishedArticles = articlesData?.filter(a => a.published)?.length || 0;
      const draftArticles = totalArticles - publishedArticles;
      
      setStats({
        totalArticles,
        publishedArticles,
        draftArticles,
      });

      // Fetch recent articles
      const { data: recentArticlesData, error: recentError } = await supabase
        .from('articles')
        .select('id, title, created_at, published, category')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (recentError) throw recentError;
      
      // If we got data back, use it, otherwise use mock data
      if (recentArticlesData && recentArticlesData.length > 0) {
        setRecentArticles(recentArticlesData);
      } else {
        console.log("No articles found, using mock data");
        setRecentArticles(MOCK_ARTICLES);
        
        // Also update stats with mock data
        if (totalArticles === 0) {
          setStats({
            totalArticles: MOCK_ARTICLES.length,
            publishedArticles: MOCK_ARTICLES.filter(a => a.published).length,
            draftArticles: MOCK_ARTICLES.filter(a => !a.published).length,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Use mock data when API fails
      console.log("API error, using mock data");
      setRecentArticles(MOCK_ARTICLES);
      setStats({
        totalArticles: MOCK_ARTICLES.length,
        publishedArticles: MOCK_ARTICLES.filter(a => a.published).length,
        draftArticles: MOCK_ARTICLES.filter(a => !a.published).length,
      });
      
      toast({
        title: 'Note',
        description: 'Showing mock data - could not connect to database',
        variant: 'default',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handler for creating new article with programmatic navigation
  const handleCreateArticle = () => {
    navigate('/admin/articles/new');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        {/* Use the handler instead of Link component for better navigation */}
        <Button onClick={handleCreateArticle}>
          <Plus className="mr-2 h-4 w-4" /> Create New Article
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400">Total Articles</h3>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400">Published</h3>
              <p className="text-3xl font-bold">{stats.publishedArticles}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-400">Drafts</h3>
              <p className="text-3xl font-bold">{stats.draftArticles}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
        <h2 className="text-xl font-medium mb-6">Recent Articles</h2>
        
        {recentArticles.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500">No articles yet</h3>
            <p className="text-gray-400 mt-2">Start creating your first article</p>
            <Button variant="outline" className="mt-4" onClick={handleCreateArticle}>
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-gray-900 truncate max-w-[300px]">
                        {article.title}
                      </p>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-gray-500 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {formatDate(article.created_at)}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.published
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {recentArticles.length > 0 && (
          <div className="mt-4 text-right">
            <Button variant="outline" onClick={() => navigate('/admin/articles')}>
              View All Articles
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardContent;
