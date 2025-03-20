import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart2, TrendingUp, FileText, Users, Calendar, Award, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
}

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (articlesError) throw articlesError;
      
      const formattedArticles: Article[] = articlesData ? articlesData.map(article => ({
        id: article.id,
        title: article.title,
        category: article.category,
        date: new Date(article.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        status: article.published ? 'published' : 'draft' as 'published' | 'draft'
      })) : [];
      
      const sampleArticles: Article[] = [
        {
          id: '1',
          title: 'IPL: Bumrah\'s early absence \'a challenge\', says Jayawardene',
          category: 'IPL 2025',
          date: 'Mar 19, 2025',
          status: 'published'
        },
        {
          id: '2',
          title: 'India\'s white-ball wizards need a new cheat code for sustained excellence',
          category: 'Analysis',
          date: 'Mar 19, 2025',
          status: 'published'
        },
        {
          id: '3',
          title: 'IPL: SKY to lead MI in opener with Hardik suspended',
          category: 'IPL 2025',
          date: 'Mar 19, 2025',
          status: 'published'
        },
        {
          id: '4',
          title: 'Complete tactical breakdown of CSK vs MI opening match',
          category: 'Match Preview',
          date: 'Mar 18, 2025',
          status: 'draft'
        },
        {
          id: '5',
          title: 'Women\'s T20 World Cup: Team-by-team guide',
          category: 'Women\'s Cricket',
          date: 'Mar 18, 2025',
          status: 'draft'
        }
      ];

      setRecentArticles(formattedArticles.length > 0 ? formattedArticles : sampleArticles);

      setStats([
        {
          label: 'Total Articles',
          value: articlesData ? articlesData.length.toString() : '5',
          icon: <FileText className="h-8 w-8 text-cricket-accent" />,
          change: '+12%',
          isPositive: true
        },
        {
          label: 'Monthly Views',
          value: '1.2M',
          icon: <Eye className="h-8 w-8 text-green-500" />,
          change: '+8%',
          isPositive: true
        },
        {
          label: 'Active Users',
          value: '48.7K',
          icon: <Users className="h-8 w-8 text-blue-500" />,
          change: '+5%',
          isPositive: true
        },
        {
          label: 'Top Category',
          value: 'IPL 2025',
          icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
          change: '42% of traffic',
          isPositive: true
        }
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      if (id.length === 36) {
        const { error } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted",
        duration: 3000,
      });
      
      setRecentArticles(recentArticles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const handleCreateArticle = () => {
    navigate('/admin/articles/new');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
          <Button onClick={() => fetchDashboardData()}>
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-sm mt-2 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className="p-2 rounded-full bg-gray-50">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="text-cricket-accent h-5 w-5" />
                <h2 className="text-xl font-heading font-semibold">Recent Articles</h2>
              </div>
              <Button size="sm" onClick={handleCreateArticle}>
                <Plus className="h-4 w-4 mr-2" /> New Article
              </Button>
            </div>

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
                  {recentArticles.map((article, index) => (
                    <tr 
                      key={article.id} 
                      className="border-b last:border-0 hover:bg-gray-50 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <td className="py-4 pr-4">
                        <p className="font-medium text-gray-900 truncate max-w-[250px]">
                          {article.title}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-gray-500 text-sm">
                        {article.date}
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {article.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(article.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(article.id)}
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

            <div className="mt-4 text-center">
              <Link to="/admin/articles">
                <Button variant="outline" size="sm">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="text-cricket-accent h-5 w-5" />
              <h2 className="text-xl font-heading font-semibold">Upcoming Matches</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">IPL 2025</span>
                  <span className="text-xs text-gray-500">Mar 25, 2025</span>
                </div>
                <p className="font-medium">Chennai Super Kings vs Mumbai Indians</p>
                <p className="text-sm text-gray-500 mt-1">7:30 PM IST • M.A. Chidambaram Stadium</p>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">ODI</span>
                  <span className="text-xs text-gray-500">Mar 28, 2025</span>
                </div>
                <p className="font-medium">India vs Australia</p>
                <p className="text-sm text-gray-500 mt-1">1:30 PM IST • Sydney Cricket Ground</p>
              </div>

              <div className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Test</span>
                  <span className="text-xs text-gray-500">Apr 2, 2025</span>
                </div>
                <p className="font-medium">England vs West Indies</p>
                <p className="text-sm text-gray-500 mt-1">3:30 PM IST • Lord's, London</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link to="/admin/matches">
                <Button variant="outline" size="sm">
                  Manage Match Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="text-cricket-accent h-5 w-5" />
            <h2 className="text-xl font-heading font-semibold">Website Performance</h2>
          </div>

          <div className="flex items-center justify-center p-8 h-64 bg-gray-50 rounded-lg mb-4">
            <p className="text-gray-500 text-center">
              Charts and analytics would be displayed here in a real application.
              <br />
              <span className="text-sm block mt-2">Traffic, engagement, and content performance metrics</span>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
