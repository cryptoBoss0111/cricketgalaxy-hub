
import { supabase } from './client-core';

// Get player profiles
export const getPlayerProfiles = async (searchQuery?: string, teamFilter?: string, roleFilter?: string) => {
  let query = supabase
    .from('player_profiles')
    .select('*')
    .order('name');
  
  if (teamFilter) {
    query = query.eq('team', teamFilter);
  }
  
  if (roleFilter) {
    query = query.eq('role', roleFilter);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching player profiles:", error);
    throw error;
  }
  
  // Apply search query filtering in-memory if provided
  let filteredData = data || [];
  if (searchQuery && searchQuery.trim() !== '') {
    const searchLower = searchQuery.toLowerCase();
    filteredData = filteredData.filter(player => 
      player.name.toLowerCase().includes(searchLower) ||
      player.team.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredData;
};

// Create or update player profile
export const upsertPlayerProfile = async (playerData: any) => {
  const { id, ...otherData } = playerData;
  const method = id ? 'update' : 'insert';
  
  if (method === 'update') {
    const { data, error } = await supabase
      .from('player_profiles')
      .update({
        ...otherData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('player_profiles')
      .insert({
        ...otherData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Delete player profile
export const deletePlayerProfile = async (id: string) => {
  const { error } = await supabase
    .from('player_profiles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
