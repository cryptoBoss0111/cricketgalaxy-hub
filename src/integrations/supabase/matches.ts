
import { supabase } from './client-core';

// Get upcoming matches
export const getUpcomingMatches = async () => {
  try {
    const { data, error } = await supabase
      .from('upcoming_matches')
      .select('*')
      .order('match_time', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw error;
  }
};

export const getMatchById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('upcoming_matches')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};

export const upsertMatch = async (match: any) => {
  try {
    const { data, error } = await supabase
      .from('upcoming_matches')
      .upsert(match)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting match:', error);
    throw error;
  }
};

export const deleteMatch = async (id: string) => {
  try {
    const { error } = await supabase
      .from('upcoming_matches')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};
