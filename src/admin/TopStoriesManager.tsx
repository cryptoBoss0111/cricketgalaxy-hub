
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUp, ArrowDown, Trash2, Star, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import AdminLayout from './AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { getFullImageUrl } from '@/components/article-card/imageUtils';

interface Article {
  id: string;
  title: string;
  featured_image?: string;
  cover_image?: string;
  category: string;
  excerpt?: string;
}

interface TopStory {
  id: string;
  article_id: string;
  order_index: number;
  featured: boolean;
  article?: Article;
}

const TopStoriesManager = () => {
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [availableArticles, setAvailableArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string>('');
  const [featured, setFeatured] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopStories();
    fetchAvailableArticles();
  }, []);

  const fetchTopStories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('top_stories')
        .select(`
          id,
          article_id,
          order_index,
          featured,
          articles:article_id (
            id,
            title,
            featured_image,
            cover_image,
            category,
            excerpt
          )
        `)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      const formattedStories: TopStory[] = (data || []).map(story => ({
        id: story.id,
        article_id: story.article_id,
        order_index: story.order_index,
        featured: story.featured,
        article: story.articles as Article
      }));
      
      setTopStories(formattedStories);
    } catch (error) {
      console.error('Error fetching top stories:', error);
      toast({
        title: "Error",
        description: "Failed to load top stories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, featured_image, cover_image, category, excerpt')
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      setAvailableArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load available articles",
        variant: "destructive",
      });
    }
  };

  const handleAddTopStory = () => {
    setSelectedArticle('');
    setFeatured(false);
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setStoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    
    try {
      const { error } = await supabase
        .from('top_stories')
        .delete()
        .eq('id', storyToDelete);
      
      if (error) throw error;
      
      setTopStories(topStories.filter(story => story.id !== storyToDelete));
      
      toast({
        title: "Story removed",
        description: "The article has been removed from top stories",
      });
    } catch (error) {
      console.error('Error deleting top story:', error);
      toast({
        title: "Error",
        description: "Failed to remove story",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedArticle) {
      toast({
        title: "No article selected",
        description: "Please select an article to add to top stories",
        variant: "destructive",
      });
      return;
    }

    // Check if article is already in top stories
    if (topStories.some(story => story.article_id === selectedArticle)) {
      toast({
        title: "Already in top stories",
        description: "This article is already a top story",
        variant: "destructive",
      });
      return;
    }

    // Limit to 4 top stories
    if (topStories.length >= 4) {
      toast({
        title: "Maximum reached",
        description: "You can only have up to 4 top stories. Remove one first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the new story with the next order index
      const nextOrderIndex = topStories.length > 0 
        ? Math.max(...topStories.map(story => story.order_index)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('top_stories')
        .insert({
          article_id: selectedArticle,
          order_index: nextOrderIndex,
          featured: featured
        })
        .select(`
          id,
          article_id,
          order_index,
          featured,
          articles:article_id (
            id,
            title,
            featured_image,
            cover_image,
            category,
            excerpt
          )
        `)
        .single();
      
      if (error) throw error;
      
      const newStory: TopStory = {
        id: data.id,
        article_id: data.article_id,
        order_index: data.order_index,
        featured: data.featured,
        article: data.articles as Article
      };
      
      setTopStories([...topStories, newStory]);
      
      toast({
        title: "Story added",
        description: "The article has been added to top stories",
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding top story:', error);
      toast({
        title: "Error",
        description: "Failed to add story",
        variant: "destructive",
      });
    }
  };

  const moveStory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = topStories.findIndex(story => story.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= topStories.length) return;
    
    const targetStory = topStories[newIndex];
    
    try {
      // Swap order indices in database
      const updates = [
        { id: id, order_index: targetStory.order_index },
        { id: targetStory.id, order_index: topStories[currentIndex].order_index }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from('top_stories')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      // Update local state
      const newTopStories = [...topStories];
      [newTopStories[currentIndex], newTopStories[newIndex]] = [newTopStories[newIndex], newTopStories[currentIndex]];
      
      // Fix order indices in state
      newTopStories.forEach((story, index) => {
        story.order_index = index;
      });
      
      setTopStories(newTopStories);
    } catch (error) {
      console.error('Error reordering top stories:', error);
      toast({
        title: "Error",
        description: "Failed to reorder stories",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (id: string) => {
    const story = topStories.find(story => story.id === id);
    if (!story) return;
    
    try {
      const { error } = await supabase
        .from('top_stories')
        .update({ featured: !story.featured })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTopStories(topStories.map(story => 
        story.id === id ? { ...story, featured: !story.featured } : story
      ));
      
      toast({
        title: story.featured ? "Feature removed" : "Story featured",
        description: story.featured 
          ? "The story is no longer featured" 
          : "The story is now featured",
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // First, create an array of simplified story objects to save
      const storiesToSave = topStories.map((story, index) => ({
        article_id: story.article_id,
        order_index: index,
        featured: story.featured
      }));
      
      // Call the RPC function we created
      const { error } = await supabase.rpc(
        'update_top_stories',
        { stories_data: storiesToSave }
      );
      
      if (error) {
        console.error("Error using RPC:", error);
        
        // Fallback approach: manual delete and insert
        // Delete existing top stories one by one
        for (const story of topStories) {
          if (story.id) {
            const { error: deleteError } = await supabase
              .from('top_stories')
              .delete()
              .eq('id', story.id);
            
            if (deleteError) {
              console.error("Error deleting story:", deleteError);
            }
          }
        }
        
        // Now insert the new stories
        const { error: insertError } = await supabase
          .from('top_stories')
          .insert(storiesToSave);
        
        if (insertError) {
          throw insertError;
        }
      }
      
      toast({
        title: "Changes saved",
        description: "The top stories have been updated successfully",
      });
      
      // Refresh the stories list
      fetchTopStories();
      
    } catch (error) {
      console.error('Error saving top stories:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getArticleImage = (article?: Article) => {
    if (!article) return null;
    
    if (article.featured_image) {
      return getFullImageUrl(article.featured_image);
    } else if (article.cover_image) {
      return getFullImageUrl(article.cover_image);
    } else {
      return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-heading font-bold">Top Stories</h1>
          <div className="flex gap-3">
            <Button 
              onClick={handleAddTopStory}
              disabled={topStories.length >= 4 || isSaving}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Top Story
            </Button>
            <Button 
              variant="default"
              onClick={saveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⊝</span> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="mb-4">
            <p className="text-gray-500">
              Manage the top stories section on your homepage. You can add up to 4 stories, 
              reorder them, and mark certain stories as featured.
            </p>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded text-sm">
              <h3 className="font-medium text-blue-800 mb-2">How to manage the homepage carousel:</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                <li>Articles marked with a ⭐ will appear in the homepage carousel</li>
                <li>Up to 3 featured articles will be displayed in the carousel</li>
                <li>Drag and drop to reorder the stories - this order will apply to both the top stories list and the carousel</li>
                <li>Click the star icon to toggle whether a story appears in the carousel</li>
                <li>Don't forget to click "Save Changes" when you're done</li>
              </ul>
            </div>

            {topStories.length >= 4 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
                Maximum of 4 top stories reached. Remove one to add another.
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
            </div>
          ) : topStories.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">No top stories found</h3>
              <p className="text-gray-400 mt-2">Start by adding articles to your top stories section.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddTopStory}>
                <Plus className="mr-2 h-4 w-4" /> Add Top Story
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {topStories.map((story, index) => (
                <Card key={story.id} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {getArticleImage(story.article) ? (
                        <img 
                          src={getArticleImage(story.article)!} 
                          alt={story.article?.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium truncate" title={story.article?.title}>
                          {story.article?.title}
                        </h3>
                        {story.featured && (
                          <div className="ml-2 flex items-center">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {story.article?.category}
                      </p>
                      {story.article?.excerpt && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {story.article.excerpt}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveStory(story.id, 'up')}
                          disabled={index === 0 || isSaving}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveStory(story.id, 'down')}
                          disabled={index === topStories.length - 1 || isSaving}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFeatured(story.id)}
                        disabled={isSaving}
                      >
                        <Star className={`h-4 w-4 mr-1 ${story.featured ? 'text-amber-500 fill-amber-500' : ''}`} />
                        {story.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(story.id)}
                        disabled={isSaving}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Story Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Top Story</DialogTitle>
            <DialogDescription>
              Select an article to add to the top stories section on your homepage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Select value={selectedArticle} onValueChange={setSelectedArticle}>
              <SelectTrigger>
                <SelectValue placeholder="Select an article" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {availableArticles.map(article => (
                  <SelectItem key={article.id} value={article.id}>
                    {article.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <label 
                htmlFor="featured" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Feature this story
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Top Story</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this article from top stories?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TopStoriesManager;
