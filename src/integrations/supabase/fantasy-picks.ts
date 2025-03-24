
import { supabase } from './client-core';

// Define a specific type for fantasy picks returned from the database
export interface FantasyPickDB {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  image_url?: string;
  stats?: string;
  points_prediction: number;
  match: string;
  match_id?: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

// Define a separate input type for upsert operations
export interface FantasyPickUpsertInput {
  id?: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  match: string;
  match_id?: string;
  reason: string;
  points_prediction: number;
  image_url?: string;
  stats?: string;
  created_at?: string;
  updated_at?: string;
}

// Get fantasy picks with additional filtering options
export const getFantasyPicks = async (): Promise<FantasyPickDB[]> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return (data || []) as FantasyPickDB[];
  } catch (error) {
    console.error('Error fetching fantasy picks:', error);
    return [];
  }
};

export const getFantasyPicksByMatch = async (matchId: string): Promise<FantasyPickDB[]> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .eq('match_id', matchId)
      .order('points_prediction', { ascending: false });
      
    if (error) throw error;
    return (data || []) as FantasyPickDB[];
  } catch (error) {
    console.error('Error fetching fantasy picks for match:', error);
    return [];
  }
};

export const getFantasyPickById = async (id: string): Promise<FantasyPickDB | null> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as FantasyPickDB;
  } catch (error) {
    console.error('Error fetching fantasy pick:', error);
    return null;
  }
};

export const upsertFantasyPick = async (pick: FantasyPickUpsertInput): Promise<FantasyPickDB | null> => {
  try {
    // If id exists, update; otherwise insert
    const { data, error } = await supabase
      .from('fantasy_picks')
      .upsert(pick)
      .select()
      .single();
      
    if (error) throw error;
    return data as FantasyPickDB;
  } catch (error) {
    console.error('Error upserting fantasy pick:', error);
    return null;
  }
};

export const deleteFantasyPick = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('fantasy_picks')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting fantasy pick:', error);
    return false;
  }
};
