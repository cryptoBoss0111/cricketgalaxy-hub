
import { supabase } from './client-core';

// Get navigation items
export const getNavigationItems = async () => {
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error("Error fetching navigation items:", error);
    throw error;
  }
  
  return data || [];
};

// Update navigation item order
export const updateNavigationOrder = async (items: any[]) => {
  // Update each item with its new order index
  for (let i = 0; i < items.length; i++) {
    const { error } = await supabase
      .from('navigation_items')
      .update({ order_index: i + 1 })
      .eq('id', items[i].id);
    
    if (error) {
      console.error(`Error updating item ${items[i].id}:`, error);
      throw error;
    }
  }
  
  return true;
};
