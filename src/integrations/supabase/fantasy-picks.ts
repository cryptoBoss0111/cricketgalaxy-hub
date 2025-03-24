
import { supabase } from './client-core';

// Type definitions
export interface FantasyPickDB {
  id: string;
  player_name: string;
  team: string;
  points_prediction: number;
  role: string;
  form: string;
  reason: string;
  match: string;
  match_id?: string; // Added match_id property
  created_at: string;
  updated_at: string;
  image_url?: string;
  stats?: string;
}

// Get all fantasy picks
export const getAllFantasyPicks = async (): Promise<FantasyPickDB[]> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fantasy picks:', error);
      throw error;
    }
    
    // Safely cast the data
    return (data || []) as FantasyPickDB[];
  } catch (error) {
    console.error('Error in getAllFantasyPicks:', error);
    return [];
  }
};

// Get a single fantasy pick by ID
export const getFantasyPickById = async (id: string): Promise<FantasyPickDB | null> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching fantasy pick:', error);
      throw error;
    }
    
    return data as FantasyPickDB;
  } catch (error) {
    console.error('Error in getFantasyPickById:', error);
    return null;
  }
};

// Define a more specific type for upsert operation that ensures required fields are present
type UpsertFantasyPick = {
  id?: string;
  player_name: string;
  team: string;
  points_prediction: number;
  role: string;
  form: string;
  reason: string;
  match: string;
  match_id?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  stats?: string;
};

// Save or update a fantasy pick
export const saveFantasyPick = async (pick: Partial<FantasyPickDB>): Promise<FantasyPickDB | null> => {
  try {
    // Determine if this is an insert or update
    const isUpdate = Boolean(pick.id);
    
    // Validate required fields for new entries
    if (!isUpdate) {
      // Check that all required fields are present for new picks
      const requiredFields = ['player_name', 'team', 'role', 'form', 'match', 'reason', 'points_prediction'];
      for (const field of requiredFields) {
        if (!(field in pick) || pick[field as keyof typeof pick] === undefined) {
          throw new Error(`Required field '${field}' is missing`);
        }
      }
    }
    
    // Type assertion to ensure the object meets the required format for upsert
    const upsertData = pick as UpsertFantasyPick;
    
    // Fix: Add onConflict parameter and ensure proper type casting
    const { data, error } = await supabase
      .from('fantasy_picks')
      .upsert(upsertData, { onConflict: 'id' })
      .select()
      .single();
    
    if (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'creating'} fantasy pick:`, error);
      throw error;
    }
    
    return data as FantasyPickDB;
  } catch (error) {
    console.error('Error in saveFantasyPick:', error);
    return null;
  }
};

// Delete a fantasy pick
export const deleteFantasyPick = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('fantasy_picks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting fantasy pick:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFantasyPick:', error);
    return false;
  }
};

// Get fantasy picks for a specific match
export const getFantasyPicksByMatch = async (match: string): Promise<FantasyPickDB[]> => {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .eq('match', match)
      .order('points_prediction', { ascending: false });
    
    if (error) {
      console.error('Error fetching fantasy picks by match:', error);
      throw error;
    }
    
    return (data || []) as FantasyPickDB[];
  } catch (error) {
    console.error('Error in getFantasyPicksByMatch:', error);
    return [];
  }
};
