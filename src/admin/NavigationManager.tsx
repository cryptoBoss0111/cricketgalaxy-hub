
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Save, Edit, Trash2, Plus, Link, Eye, EyeOff } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getNavigationItems, updateNavigationOrder, supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  order_index: number;
  visible: boolean;
}

const navigationItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Navigation label is required'),
  path: z.string().min(1, 'Path is required'),
  visible: z.boolean().default(true)
});

type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;

const NavigationManager = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<NavigationItemFormValues>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      label: '',
      path: '',
      visible: true
    }
  });
  
  // Fetch navigation items
  useEffect(() => {
    const fetchNavItems = async () => {
      setIsLoading(true);
      try {
        const data = await getNavigationItems();
        setNavItems(data);
      } catch (error) {
        console.error('Error fetching navigation items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load navigation items',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNavItems();
  }, []);
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(navItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order index
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index + 1
    }));
    
    setNavItems(updatedItems);
  };
  
  // Toggle visibility of a navigation item
  const toggleVisibility = async (id: string) => {
    try {
      const item = navItems.find(item => item.id === id);
      if (!item) return;
      
      const { error } = await supabase
        .from('navigation_items')
        .update({ visible: !item.visible })
        .eq('id', id);
      
      if (error) throw error;
      
      setNavItems(navItems.map(item => 
        item.id === id ? { ...item, visible: !item.visible } : item
      ));
      
      toast({
        title: 'Success',
        description: `Item ${item.visible ? 'hidden' : 'shown'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item visibility',
        variant: 'destructive'
      });
    }
  };
  
  // Save navigation order
  const saveNavigationOrder = async () => {
    setIsSaving(true);
    try {
      await updateNavigationOrder(navItems);
      
      toast({
        title: 'Success',
        description: 'Navigation order updated successfully',
      });
    } catch (error) {
      console.error('Error saving navigation order:', error);
      toast({
        title: 'Error',
        description: 'Failed to save navigation order',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Open form to edit or create navigation item
  const openForm = (item?: NavigationItem) => {
    if (item) {
      setSelectedItem(item);
      form.reset({
        id: item.id,
        label: item.label,
        path: item.path,
        visible: item.visible
      });
    } else {
      setSelectedItem(null);
      form.reset({
        label: '',
        path: '',
        visible: true
      });
    }
    setIsFormOpen(true);
  };
  
  // Open delete confirmation dialog
  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete navigation item
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', itemToDelete);
      
      if (error) throw error;
      
      setNavItems(navItems.filter(item => item.id !== itemToDelete));
      
      toast({
        title: 'Success',
        description: 'Navigation item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete navigation item',
        variant: 'destructive'
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  
  // Save navigation item
  const onSubmit = async (values: NavigationItemFormValues) => {
    try {
      if (values.id) {
        // Update existing item
        const { error } = await supabase
          .from('navigation_items')
          .update({
            label: values.label,
            path: values.path,
            visible: values.visible
          })
          .eq('id', values.id);
        
        if (error) throw error;
        
        setNavItems(navItems.map(item => 
          item.id === values.id ? { ...item, label: values.label, path: values.path, visible: values.visible } : item
        ));
        
        toast({
          title: 'Success',
          description: 'Navigation item updated successfully',
        });
      } else {
        // Create new item
        const { data, error } = await supabase
          .from('navigation_items')
          .insert({
            label: values.label,
            path: values.path,
            visible: values.visible,
            order_index: navItems.length + 1
          })
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setNavItems([...navItems, data[0]]);
        }
        
        toast({
          title: 'Success',
          description: 'Navigation item created successfully',
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving navigation item:', error);
      toast({
        title: 'Error',
        description: `Failed to ${values.id ? 'update' : 'create'} navigation item`,
        variant: 'destructive'
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Navigation Manager</h1>
            <p className="text-gray-500 mt-1">Organize and customize website navigation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
            <Button onClick={saveNavigationOrder} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Order'}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Website Navigation Items</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
              </div>
            ) : navItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <h3 className="text-xl font-medium text-gray-500">No navigation items found</h3>
                <p className="text-gray-400 mt-2 mb-6">Add navigation items to display in the website header</p>
                <Button onClick={() => openForm()}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Navigation Item
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop to reorder navigation items. Items at the top will appear first in the navigation menu.
                </p>
                
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="navigationItems">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {navItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center p-3 border rounded-lg ${
                                  item.visible ? 'bg-white' : 'bg-gray-50'
                                } hover:shadow-sm`}
                              >
                                <div {...provided.dragHandleProps} className="pr-3 cursor-grab">
                                  <GripVertical className="h-5 w-5 text-gray-400" />
                                </div>
                                
                                <div className="flex-1 min-w-0 flex items-center">
                                  <div>
                                    <h4 className={`font-medium ${!item.visible && 'text-gray-400'}`}>
                                      {item.label}
                                    </h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Link className="h-3 w-3 mr-1" />
                                      <span className="truncate">{item.path}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 ml-4">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => toggleVisibility(item.id)}
                                    title={item.visible ? 'Hide item' : 'Show item'}
                                    className={item.visible ? 'text-green-500' : 'text-gray-400'}
                                  >
                                    {item.visible ? (
                                      <Eye className="h-4 w-4" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openForm(item)}
                                    title="Edit item"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => confirmDelete(item.id)}
                                    title="Delete item"
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation Item Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem 
                ? 'Update the navigation item details below' 
                : 'Fill in the details to add a new navigation item'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Navigation Label</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Home, About, Contact" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Path</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. /, /about, /contact" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visibility</FormLabel>
                      <FormDescription>
                        Show this item in navigation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedItem ? 'Update Item' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this navigation item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NavigationManager;
