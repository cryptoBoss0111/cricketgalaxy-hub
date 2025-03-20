
import { useState, useEffect } from 'react';
import { BarChart, Eye, Users, Newspaper, ListFilter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    articles: 0,
    views: 0,
    categories: 0,
    publishedArticles: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Get articles count
        const { count: articlesCount, error: articlesError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });
          
        // Get published articles count  
        const { count: publishedCount, error: publishedError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);
          
        // Get unique categories count
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('articles')
          .select('category');
          
        if (articlesError || publishedError || categoriesError) {
          console.error("Error fetching stats:", articlesError || publishedError || categoriesError);
          return;
        }
        
        // Calculate unique categories
        const uniqueCategories = categoriesData 
          ? Array.from(new Set(categoriesData.map(item => item.category))).length 
          : 0;
        
        // Set stats with mock views for now
        setStats({
          articles: articlesCount || 0,
          views: 12483, // Mock data for page views
          categories: uniqueCategories,
          publishedArticles: publishedCount || 0
        });
      } catch (error) {
        console.error("Error in fetchStats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // List of content management sections
  const managementSections = [
    { 
      title: "Articles Management",
      description: "Create, edit, and manage all articles",
      icon: <Newspaper />,
      route: "/admin/articles",
      color: "bg-blue-50 text-blue-700",
      buttonText: "Manage Articles"
    },
    { 
      title: "Navigation Manager",
      description: "Control website navigation items",
      icon: <ListFilter />,
      route: "/admin/navigation",
      color: "bg-purple-50 text-purple-700",
      buttonText: "Manage Navigation"
    },
    { 
      title: "Top Stories",
      description: "Feature important stories on homepage",
      icon: <BarChart />,
      route: "/admin/top-stories",
      color: "bg-amber-50 text-amber-700",
      buttonText: "Manage Top Stories"
    },
    { 
      title: "User Activity",
      description: "View website visitor statistics",
      icon: <Users />,
      route: "/admin/analytics",
      color: "bg-emerald-50 text-emerald-700",
      buttonText: "View Details"
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Analytics Dashboard</h1>
          <Button onClick={() => navigate('/admin/articles/new')}>Create New Article</Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-4 w-12 animate-pulse bg-muted rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.articles}</div>
              )}
              <p className="text-xs text-muted-foreground">
                {stats.publishedArticles} published
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-4 w-12 animate-pulse bg-muted rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
              )}
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <ListFilter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-4 w-12 animate-pulse bg-muted rounded"></div>
              ) : (
                <div className="text-2xl font-bold">{stats.categories}</div>
              )}
              <p className="text-xs text-muted-foreground">Active content sections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Activity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-4 w-12 animate-pulse bg-muted rounded"></div>
              ) : (
                <div className="text-2xl font-bold">842</div>
              )}
              <p className="text-xs text-muted-foreground">Active daily users</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Management Sections */}
        <div>
          <h2 className="text-2xl font-medium mb-4">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementSections.map((section, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all">
                <div className="flex items-start p-6">
                  <div className={`p-3 rounded-full ${section.color} mr-4`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium">{section.title}</h3>
                    <p className="text-gray-500 mt-1">{section.description}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => navigate(section.route)}
                    >
                      {section.buttonText}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
