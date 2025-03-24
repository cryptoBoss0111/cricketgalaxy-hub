
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUp, ArrowDown, Trash2, ImageIcon } from 'lucide-react';
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
}

interface SliderItem {
  id: string;
  article_id: string;
  order_index: number;
  is_active: boolean;
  article?: Article;
}

const HeroSliderManager = () => {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [availableArticles, setAvailableArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSliderItems();
    fetchAvailableArticles();
  }, []);

  const fetchSliderItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_slider')
        .select(`
          id,
          article_id,
          order_index,
          is_active,
          articles:article_id (
            id,
            title,
            featured_image,
            cover_image,
            category
          )
        `)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      const formattedItems: SliderItem[] = (data || []).map(item => ({
        id: item.id,
        article_id: item.article_id,
        order_index: item.order_index,
        is_active: item.is_active,
        article: item.articles as Article
      }));
      
      setSliderItems(formattedItems);
    } catch (error) {
      console.error('Error fetching slider items:', error);
      toast({
        title: "Error",
        description: "Failed to load hero slider items",
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
        .select('id, title, featured_image, cover_image, category')
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

  const handleAddSliderItem = () => {
    setSelectedArticle('');
    setDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('hero_slider')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) throw error;
      
      setSliderItems(sliderItems.filter(item => item.id !== itemToDelete));
      
      toast({
        title: "Item deleted",
        description: "The slider item has been successfully removed",
      });
    } catch (error) {
      console.error('Error deleting slider item:', error);
      toast({
        title: "Error",
        description: "Failed to delete slider item",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedArticle) {
      toast({
        title: "No article selected",
        description: "Please select an article to add to the slider",
        variant: "destructive",
      });
      return;
    }

    // Check if article is already in slider
    if (sliderItems.some(item => item.article_id === selectedArticle)) {
      toast({
        title: "Article already in slider",
        description: "This article is already part of the hero slider",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the new item with the next order index
      const nextOrderIndex = sliderItems.length > 0 
        ? Math.max(...sliderItems.map(item => item.order_index)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('hero_slider')
        .insert({
          article_id: selectedArticle,
          order_index: nextOrderIndex,
          is_active: true
        })
        .select(`
          id,
          article_id,
          order_index,
          is_active,
          articles:article_id (
            id,
            title,
            featured_image,
            cover_image,
            category
          )
        `)
        .single();
      
      if (error) throw error;
      
      const newItem: SliderItem = {
        id: data.id,
        article_id: data.article_id,
        order_index: data.order_index,
        is_active: data.is_active,
        article: data.articles as Article
      };
      
      setSliderItems([...sliderItems, newItem]);
      
      toast({
        title: "Item added",
        description: "The article has been added to the hero slider",
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding slider item:', error);
      toast({
        title: "Error",
        description: "Failed to add article to slider",
        variant: "destructive",
      });
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sliderItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Check bounds
    if (newIndex < 0 || newIndex >= sliderItems.length) return;
    
    const targetItem = sliderItems[newIndex];
    
    try {
      // Swap order indices in database
      const updates = [
        { id: id, order_index: targetItem.order_index },
        { id: targetItem.id, order_index: sliderItems[currentIndex].order_index }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from('hero_slider')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      // Update local state
      const newSliderItems = [...sliderItems];
      [newSliderItems[currentIndex], newSliderItems[newIndex]] = [newSliderItems[newIndex], newSliderItems[currentIndex]];
      
      // Fix order indices in state
      newSliderItems.forEach((item, index) => {
        item.order_index = index;
      });
      
      setSliderItems(newSliderItems);
    } catch (error) {
      console.error('Error reordering slider items:', error);
      toast({
        title: "Error",
        description: "Failed to reorder slider items",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string) => {
    const item = sliderItems.find(item => item.id === id);
    if (!item) return;
    
    try {
      const { error } = await supabase
        .from('hero_slider')
        .update({ is_active: !item.is_active })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSliderItems(sliderItems.map(item => 
        item.id === id ? { ...item, is_active: !item.is_active } : item
      ));
      
      toast({
        title: item.is_active ? "Item hidden" : "Item visible",
        description: item.is_active 
          ? "The slider item will no longer appear in the hero section" 
          : "The slider item will now appear in the hero section",
      });
    } catch (error) {
      console.error('Error toggling slider item status:', error);
      toast({
        title: "Error",
        description: "Failed to update slider item status",
        variant: "destructive",
      });
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
          <h1 className="text-3xl font-heading font-bold">Hero Slider</h1>
          <Button onClick={handleAddSliderItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Article to Slider
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="mb-4">
            <p className="text-gray-500">
              Manage the articles that appear in the hero slider at the top of your website. 
              You can add, remove, reorder, and toggle visibility for each slider item.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
            </div>
          ) : sliderItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">No slider items found</h3>
              <p className="text-gray-400 mt-2">Start by adding articles to your hero slider.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddSliderItem}>
                <Plus className="mr-2 h-4 w-4" /> Add Slider Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sliderItems.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {getArticleImage(item.article) ? (
                        <img 
                          src={getArticleImage(item.article)!} 
                          alt={item.article?.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium truncate" title={item.article?.title}>
                        {item.article?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.article?.category}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.is_active ? 'Visible' : 'Hidden'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Order: {item.order_index + 1}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={index === sliderItems.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={item.is_active}
                          onCheckedChange={() => toggleActive(item.id)}
                        />
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(item.id)}
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
      
      {/* Add Article Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Article to Slider</DialogTitle>
            <DialogDescription>
              Select an article to add to the hero slider on your homepage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add to Slider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Slider</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this article from the hero slider?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default HeroSliderManager;
