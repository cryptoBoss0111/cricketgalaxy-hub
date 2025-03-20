
import { useState, useEffect } from 'react';
import { BarChart, CalendarDays, Flag, ListChecks, Newspaper, LayoutGrid, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        
        // Set stats with mock views for now (would need a views tracking table in real implementation)
        setStats({
          articles: articlesCount || 0,
          views: 12483, // Mock data for page views - would need a real analytics integration
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

  const contentSections = [
    { 
      name: "Articles", 
      description: "Manage all articles across the site",
      icon: <Newspaper className="h-8 w-8 text-cricket-accent" />,
      action: () => navigate('/admin/articles')
    },
    { 
      name: "Navigation", 
      description: "Control website navigation bar items",
      icon: <LayoutGrid className="h-8 w-8 text-indigo-500" />,
      action: () => navigate('/admin/navigation')
    },
    { 
      name: "Top Stories", 
      description: "Feature important stories on homepage",
      icon: <Flag className="h-8 w-8 text-amber-500" />,
      action: () => navigate('/admin/top-stories')
    },
    { 
      name: "Fantasy Picks", 
      description: "Manage fantasy cricket recommendations",
      icon: <ListChecks className="h-8 w-8 text-green-500" />,
      action: () => navigate('/admin/fantasy-picks')
    },
    { 
      name: "Upcoming Matches", 
      description: "Update match schedules and details",
      icon: <CalendarDays className="h-8 w-8 text-blue-500" />,
      action: () => navigate('/admin/matches')
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Analytics & Content Management</h1>
          <Button onClick={() => navigate('/admin/articles/new')}>Create New Article</Button>
        </div>
        
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
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
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
        
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="content">Content Sections</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentSections.map((section, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={section.action}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {section.icon}
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        section.action();
                      }}>
                        Manage
                      </Button>
                    </div>
                    <CardTitle className="mt-4">{section.name}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Click to manage {section.name.toLowerCase()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Website Performance</CardTitle>
                <CardDescription>
                  Analytics and statistics for your website's performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <BarChart className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Detailed analytics dashboard coming soon</p>
                    <Button variant="outline">Request Feature</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
