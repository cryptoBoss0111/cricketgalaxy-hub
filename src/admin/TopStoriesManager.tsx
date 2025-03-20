
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Star, StarOff, Save, Search, Plus, Info } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { getPublishedArticles, getTopStories, updateTopStories } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt?: string;
  featured_image?: string;
  published_at: string;
}

interface TopStory {
  id: string;
  article_id: string;
  order_index: number;
  featured: boolean;
  articles: Article;
}

interface AvailableArticle extends Article {
  isSelected: boolean;
}

const TopStoriesManager = () => {
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  const [availableArticles, setAvailableArticles] = useState<AvailableArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Fetch top stories and available articles
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get all published articles for selection first
        const articlesData = await getPublishedArticles(undefined, 100);
        console.log("Fetched articles data:", articlesData);
        
        // Then get top stories
        const topStoriesData = await getTopStories();
        console.log("Fetched top stories data:", topStoriesData);
        setTopStories(topStoriesData);
        
        // Mark articles that are already in top stories
        const topStoryArticleIds = topStoriesData.map(story => story.article_id);
        const availableArticlesData = articlesData.map(article => ({
          ...article,
          isSelected: topStoryArticleIds.includes(article.id)
        }));
        
        setAvailableArticles(availableArticlesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load top stories',
          variant: 'destructive'
        });
        
        // Set empty arrays to ensure UI doesn't break
        setTopStories([]);
        setAvailableArticles([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(topStories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order index
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index + 1
    }));
    
    setTopStories(updatedItems);
  };
  
  // Toggle featured status for a story
  const toggleFeatured = (id: string) => {
    setTopStories(topStories.map(story => 
      story.id === id ? { ...story, featured: !story.featured } : story
    ));
  };
  
  // Save top stories order and featured status
  const saveTopStories = async () => {
    setIsSaving(true);
    try {
      // Format data for update
      const storiesForUpdate = topStories.map(story => ({
        article_id: story.article_id,
        order_index: story.order_index,
        featured: story.featured
      }));
      
      await updateTopStories(storiesForUpdate);
      
      toast({
        title: 'Success',
        description: 'Top stories updated successfully',
      });
    } catch (error) {
      console.error('Error saving top stories:', error);
      toast({
        title: 'Error',
        description: 'Failed to save top stories',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Remove a story from the top stories list
  const removeFromTopStories = (articleId: string) => {
    setTopStories(topStories.filter(story => story.article_id !== articleId));
    
    // Update the available articles list to mark this as available
    setAvailableArticles(availableArticles.map(article => 
      article.id === articleId ? { ...article, isSelected: false } : article
    ));
  };
  
  // Add selected articles to top stories
  const addSelectedArticlesToTopStories = () => {
    const selectedArticles = availableArticles.filter(article => 
      article.isSelected && !topStories.some(story => story.article_id === article.id)
    );
    
    if (selectedArticles.length === 0) {
      toast({
        title: 'No Articles Selected',
        description: 'Please select at least one article to add',
        variant: 'destructive'
      });
      return;
    }
    
    // Create new top story entries
    const newTopStories = selectedArticles.map((article, index) => ({
      id: `temp-${article.id}`,
      article_id: article.id,
      order_index: topStories.length + index + 1,
      featured: false,
      articles: article
    }));
    
    setTopStories([...topStories, ...newTopStories]);
    setIsAddDialogOpen(false);
  };
  
  // Toggle article selection in the add dialog
  const toggleArticleSelection = (articleId: string) => {
    setAvailableArticles(availableArticles.map(article => 
      article.id === articleId ? { ...article, isSelected: !article.isSelected } : article
    ));
  };
  
  // Filter available articles based on search query
  const filteredArticles = availableArticles.filter(article => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(query))
    );
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Get count of featured stories (which appear in the carousel)
  const featuredStoriesCount = topStories.filter(story => story.featured).length;
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Top Stories Manager</h1>
            <p className="text-gray-500 mt-1">Configure featured stories on the homepage</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Stories
            </Button>
            <Button onClick={saveTopStories} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            <div className="text-blue-700">
              <p><strong>How to manage the homepage carousel:</strong></p>
              <ul className="list-disc ml-5 mt-1 text-sm">
                <li>Articles marked with a <span className="text-amber-500">★</span> will appear in the homepage carousel</li>
                <li>Up to 3 featured articles will be displayed in the carousel</li>
                <li>Drag and drop to reorder the stories - this order will apply to both the top stories list and the carousel</li>
                <li>Click the star icon to toggle whether a story appears in the carousel</li>
                <li>Don't forget to click "Save Changes" when you're done</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Top Stories</CardTitle>
                <CardDescription className="mt-1">
                  {featuredStoriesCount > 0 ? (
                    <span>Currently displaying <strong>{featuredStoriesCount}</strong> story/stories in the homepage carousel</span>
                  ) : (
                    <span className="text-amber-600">No stories currently featured in the homepage carousel</span>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
              </div>
            ) : topStories.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <h3 className="text-xl font-medium text-gray-500">No top stories configured</h3>
                <p className="text-gray-400 mt-2 mb-6">Add articles to display as featured stories on the homepage</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Story
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop to reorder stories. Stories at the top will appear first on the homepage.
                </p>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="topStories">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {topStories.map((story, index) => (
                          <Draggable key={story.id} draggableId={story.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center p-3 border rounded-lg hover:shadow-sm ${
                                  story.featured ? 'bg-amber-50 border-amber-200' : 'bg-white'
                                }`}
                              >
                                <div {...provided.dragHandleProps} className="pr-3 cursor-grab">
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3">
                                    {story.articles.featured_image && (
                                      <img 
                                        src={story.articles.featured_image} 
                                        alt={story.articles.title}
                                        className="h-12 w-16 object-cover rounded"
                                      />
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm truncate">{story.articles.title}</h4>
                                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">{story.articles.category}</span>
                                        <span>|</span>
                                        <span>{formatDate(story.articles.published_at)}</span>
                                      </div>
                                      {story.featured && (
                                        <div className="text-xs text-amber-600 mt-1 font-medium">
                                          Shown in homepage carousel
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          onClick={() => toggleFeatured(story.id)}
                                          className={story.featured ? "text-amber-500" : "text-gray-400"}
                                        >
                                          {story.featured ? (
                                            <Star className="h-4 w-4" />
                                          ) : (
                                            <StarOff className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {story.featured 
                                          ? 'Remove from homepage carousel' 
                                          : 'Add to homepage carousel'
                                        }
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeFromTopStories(story.article_id)}
                                    title="Remove from top stories"
                                  >
                                    &times;
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Articles Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Articles to Top Stories</DialogTitle>
            <DialogDescription>
              Select articles to add to your homepage top stories section
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative my-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles by title, category, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto border rounded-md p-1">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No articles match your search</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {filteredArticles.map((article) => {
                  const isInTopStories = topStories.some(story => story.article_id === article.id);
                  
                  return (
                    <div 
                      key={article.id} 
                      className={`flex items-center p-3 border rounded-lg ${
                        isInTopStories ? 'bg-gray-50 border-gray-300' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Checkbox 
                        id={article.id}
                        checked={article.isSelected}
                        onCheckedChange={() => !isInTopStories && toggleArticleSelection(article.id)}
                        disabled={isInTopStories}
                        className="mr-3"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          {article.featured_image && (
                            <img 
                              src={article.featured_image} 
                              alt={article.title}
                              className="h-12 w-16 object-cover rounded"
                            />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{article.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span className="bg-gray-100 px-2 py-0.5 rounded">{article.category}</span>
                              <span>|</span>
                              <span>{formatDate(article.published_at)}</span>
                            </div>
                            {isInTopStories && (
                              <div className="text-xs text-cricket-accent mt-1">
                                Already in top stories
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSelectedArticlesToTopStories}>
              Add Selected Articles
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TopStoriesManager;
