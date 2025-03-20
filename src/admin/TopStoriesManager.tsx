
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';
import { Bookmark, ChevronDown, ChevronUp, Plus, RefreshCw, Save, Search, Star, Trash2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  created_at: string;
  published: boolean;
  featured_image: string | null;
  cover_image: string | null;
}

interface TopStory {
  id: string;
  articleId: string;
  order: number;
  title?: string;
  category?: string;
  image?: string;
  featured: boolean;
}

const TopStoriesManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch published articles
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (articlesError) throw articlesError;
        
        setArticles(articlesData || []);
        
        // For now, create mock top stories data (would be fetched from DB)
        // In a real implementation, you would have a top_stories table
        
        // Use the first 5 articles as mock top stories
        const mockTopStories: TopStory[] = (articlesData || [])
          .slice(0, 5)
          .map((article, index) => ({
            id: `ts-${Date.now()}-${index}`,
            articleId: article.id,
            order: index + 1,
            title: article.title,
            category: article.category,
            image: article.featured_image || article.cover_image || '',
            featured: index === 0 // First one is featured
          }));
        
        setTopStories(mockTopStories);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load content",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleMoveStory = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === topStories.length - 1)
    ) {
      return;
    }

    const newTopStories = [...topStories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newTopStories[index], newTopStories[targetIndex]] = [newTopStories[targetIndex], newTopStories[index]];
    
    // Update order values
    newTopStories.forEach((story, i) => {
      story.order = i + 1;
    });
    
    setTopStories(newTopStories);
    setIsEditing(true);
  };

  const handleRemoveStory = (id: string) => {
    const newTopStories = topStories.filter(story => story.id !== id);
    
    // Update order values
    newTopStories.forEach((story, i) => {
      story.order = i + 1;
    });
    
    setTopStories(newTopStories);
    setIsEditing(true);
  };

  const handleSetFeatured = (id: string) => {
    const newTopStories = topStories.map(story => ({
      ...story,
      featured: story.id === id
    }));
    
    setTopStories(newTopStories);
    setIsEditing(true);
  };
  
  const handleAddStory = () => {
    setSelectedArticleId(null);
    setDialogOpen(true);
  };
  
  const handleAddSelectedArticle = () => {
    if (!selectedArticleId) {
      toast({
        title: "Error",
        description: "Please select an article",
        variant: "destructive",
      });
      return;
    }
    
    const article = articles.find(a => a.id === selectedArticleId);
    if (!article) return;
    
    const newStory: TopStory = {
      id: `ts-${Date.now()}`,
      articleId: article.id,
      order: topStories.length + 1,
      title: article.title,
      category: article.category,
      image: article.featured_image || article.cover_image || '',
      featured: topStories.length === 0 // If first one, make it featured
    };
    
    setTopStories([...topStories, newStory]);
    setDialogOpen(false);
    setIsEditing(true);
  };
  
  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Here we'd update the database
      // Example:
      // const { error } = await supabase
      //   .from('top_stories')
      //   .upsert(topStories);
      
      // if (error) throw error;
      
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Top stories saved successfully",
      });
    } catch (error) {
      console.error('Error saving top stories:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Top Stories Manager</h1>
          <div className="flex gap-2">
            <Button onClick={handleAddStory} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
            {isEditing && (
              <Button onClick={handleSaveChanges} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
        
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Current Top Stories</h2>
            <p className="text-sm text-gray-500">
              Arrange the top stories in the order they should appear on the homepage. 
              Set one story as featured to display it prominently.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-cricket-accent border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {topStories.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500">No top stories yet</h3>
                  <p className="text-gray-400 mt-2">Add stories to feature them on the homepage</p>
                  <Button className="mt-4" onClick={handleAddStory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Story
                  </Button>
                </div>
              ) : (
                topStories.map((story, index) => (
                  <div 
                    key={story.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      story.featured ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      {story.image ? (
                        <img 
                          src={story.image} 
                          alt={story.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <Bookmark className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        {story.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Star className="h-3 w-3 mr-1" /> Featured
                          </span>
                        )}
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                          {story.category}
                        </span>
                      </div>
                      <h3 className="font-medium mt-1">{story.title}</h3>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMoveStory(index, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMoveStory(index, 'down')}
                        disabled={index === topStories.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-1">
                      {!story.featured && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSetFeatured(story.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveStory(story.id)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Add Story to Top Stories</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="border rounded-md h-[300px] overflow-y-auto">
              {filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500">No articles found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredArticles.map((article) => (
                    <div 
                      key={article.id}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer ${
                        selectedArticleId === article.id ? 'bg-primary-50 border-l-4 border-primary' : ''
                      }`}
                      onClick={() => setSelectedArticleId(article.id)}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        {article.featured_image || article.cover_image ? (
                          <img 
                            src={article.featured_image || article.cover_image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <Bookmark className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                          {article.category}
                        </span>
                        <h3 className="font-medium text-sm mt-1">{article.title}</h3>
                      </div>
                      
                      <Checkbox
                        checked={selectedArticleId === article.id}
                        onCheckedChange={() => setSelectedArticleId(article.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddSelectedArticle}
              disabled={!selectedArticleId}
            >
              Add to Top Stories
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TopStoriesManager;
