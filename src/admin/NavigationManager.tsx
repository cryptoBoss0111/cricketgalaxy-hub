
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { GripVertical, Plus, Trash2, Edit, Undo2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

interface NavItem {
  id: string;
  label: string;
  path: string;
  order_index: number;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

const NavigationManager = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [originalNavItems, setOriginalNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<NavItem | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNavItems = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('navigation_items')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        
        setNavItems(data || []);
        setOriginalNavItems(JSON.parse(JSON.stringify(data || []))); // Deep copy
      } catch (error) {
        console.error('Error fetching navigation items:', error);
        toast({
          title: "Error",
          description: "Failed to load navigation items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNavItems();
  }, [toast]);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(navItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index + 1
    }));
    
    setNavItems(updatedItems);
    setIsEditing(true);
  };
  
  const handleItemVisibilityChange = (id: string, checked: boolean) => {
    const updatedItems = navItems.map(item => 
      item.id === id ? { ...item, visible: checked } : item
    );
    setNavItems(updatedItems);
    setIsEditing(true);
  };
  
  const handleEdit = (item: NavItem) => {
    setCurrentItem(item);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setCurrentItem({
      id: `new-${Date.now()}`,
      label: '',
      path: '',
      order_index: navItems.length + 1,
      visible: true
    });
    setDialogOpen(true);
  };
  
  const handleSaveItem = () => {
    if (!currentItem) return;
    
    if (!currentItem.label.trim() || !currentItem.path.trim()) {
      toast({
        title: "Validation Error",
        description: "Label and path are required",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure path starts with /
    const path = currentItem.path.startsWith('/') ? currentItem.path : `/${currentItem.path}`;
    
    let updatedItems;
    if (currentItem.id.startsWith('new-')) {
      // New item
      const newItem = {
        ...currentItem,
        id: currentItem.id.replace('new-', ''),
        path
      };
      updatedItems = [...navItems, newItem];
    } else {
      // Existing item
      updatedItems = navItems.map(item => 
        item.id === currentItem.id ? { ...currentItem, path } : item
      );
    }
    
    setNavItems(updatedItems);
    setDialogOpen(false);
    setIsEditing(true);
  };
  
  const handleDeleteItem = (id: string) => {
    const updatedItems = navItems.filter(item => item.id !== id);
    setNavItems(updatedItems);
    setIsEditing(true);
  };
  
  const discardChanges = () => {
    setNavItems(JSON.parse(JSON.stringify(originalNavItems))); // Deep copy
    setIsEditing(false);
  };
  
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      // Prepare data for upsert
      const itemsToUpsert = navItems.map(({ id, label, path, order_index, visible }) => ({
        id: id.startsWith('new-') ? undefined : id, // Let Supabase generate IDs for new items
        label,
        path,
        order_index,
        visible
      }));
      
      // First, delete removed items
      const originalIds = originalNavItems.map(item => item.id);
      const currentIds = navItems.map(item => item.id.startsWith('new-') ? '' : item.id).filter(Boolean);
      const deletedIds = originalIds.filter(id => !currentIds.includes(id));
      
      if (deletedIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('navigation_items')
          .delete()
          .in('id', deletedIds);
          
        if (deleteError) throw deleteError;
      }
      
      // Then, upsert the current items
      const { data, error } = await supabase
        .from('navigation_items')
        .upsert(itemsToUpsert)
        .select();
      
      if (error) throw error;
      
      // Update state with the returned data
      if (data) {
        setNavItems(data);
        setOriginalNavItems(JSON.parse(JSON.stringify(data))); // Deep copy
      }
      
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Navigation items saved successfully",
      });
    } catch (error) {
      console.error('Error saving navigation items:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-heading font-bold">Navigation Manager</h1>
          <div className="flex gap-2">
            {isEditing && (
              <Button variant="outline" onClick={discardChanges} disabled={isLoading}>
                <Undo2 className="h-4 w-4 mr-2" />
                Discard
              </Button>
            )}
            <Button onClick={handleAddNew} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            {isEditing && (
              <Button onClick={saveChanges} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
        
        <Card className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-cricket-accent border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="navigation-items">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-500 mb-4 px-2">
                      <div className="col-span-1"></div>
                      <div className="col-span-3">Label</div>
                      <div className="col-span-4">Path</div>
                      <div className="col-span-1 text-center">Order</div>
                      <div className="col-span-1 text-center">Visible</div>
                      <div className="col-span-2 text-center">Actions</div>
                    </div>
                    
                    {navItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="grid grid-cols-12 gap-4 items-center bg-white p-3 rounded-md border border-gray-100 hover:border-gray-300 transition-colors"
                          >
                            <div className="col-span-1 flex justify-center">
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                            <div className="col-span-3 font-medium">{item.label}</div>
                            <div className="col-span-4 text-sm text-gray-600">{item.path}</div>
                            <div className="col-span-1 text-center">{item.order_index}</div>
                            <div className="col-span-1 flex justify-center">
                              <Checkbox 
                                checked={item.visible} 
                                onCheckedChange={(checked) => handleItemVisibilityChange(item.id, checked as boolean)}
                              />
                            </div>
                            <div className="col-span-2 flex justify-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
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
          )}
        </Card>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentItem && currentItem.id.startsWith('new-') 
                ? 'Add Navigation Item' 
                : 'Edit Navigation Item'}
            </DialogTitle>
            <DialogDescription>
              Configure the navigation item details below.
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="nav-label" className="text-sm font-medium">Label</label>
                <Input 
                  id="nav-label"
                  value={currentItem.label} 
                  onChange={(e) => setCurrentItem({...currentItem, label: e.target.value})}
                  placeholder="e.g. Cricket News"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nav-path" className="text-sm font-medium">Path</label>
                <Input 
                  id="nav-path"
                  value={currentItem.path} 
                  onChange={(e) => setCurrentItem({...currentItem, path: e.target.value})}
                  placeholder="e.g. /cricket-news"
                />
                <p className="text-xs text-gray-500">The URL path for this navigation item (must start with /)</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="nav-visible"
                  checked={currentItem.visible} 
                  onCheckedChange={(checked) => setCurrentItem({...currentItem, visible: checked as boolean})}
                />
                <label htmlFor="nav-visible" className="text-sm font-medium">
                  Visible in navigation
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NavigationManager;
