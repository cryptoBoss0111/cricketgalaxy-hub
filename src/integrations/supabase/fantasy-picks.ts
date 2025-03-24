
import { supabase } from './client-core';

/**
 * Fantasy Pick DB Model - represents how data is stored in the database
 */
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

/**
 * Fantasy Pick Input - used for creating or updating picks
 */
export interface FantasyPickInput {
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
}

/**
 * Get all fantasy picks
 */
export async function getAllFantasyPicks(): Promise<FantasyPickDB[]> {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as FantasyPickDB[] || [];
  } catch (error) {
    console.error('Error fetching fantasy picks:', error);
    return [];
  }
}

/**
 * Get fantasy picks for a specific match
 */
export async function getFantasyPicksByMatch(matchId: string): Promise<FantasyPickDB[]> {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .eq('match_id', matchId)
      .order('points_prediction', { ascending: false });
      
    if (error) throw error;
    return data as FantasyPickDB[] || [];
  } catch (error) {
    console.error('Error fetching fantasy picks for match:', error);
    return [];
  }
}

/**
 * Get a single fantasy pick by ID
 */
export async function getFantasyPickById(id: string): Promise<FantasyPickDB | null> {
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
}

/**
 * Create or update a fantasy pick
 */
export async function saveFantasyPick(pick: FantasyPickInput): Promise<FantasyPickDB | null> {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .upsert(pick)
      .select()
      .single();
      
    if (error) throw error;
    return data as FantasyPickDB;
  } catch (error) {
    console.error('Error saving fantasy pick:', error);
    return null;
  }
}

/**
 * Delete a fantasy pick
 */
export async function deleteFantasyPick(id: string): Promise<boolean> {
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
}

/**
 * Get top fantasy picks - limited to a specific number
 */
export async function getTopFantasyPicks(limit: number = 4): Promise<FantasyPickDB[]> {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .order('points_prediction', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data as FantasyPickDB[] || [];
  } catch (error) {
    console.error('Error fetching top fantasy picks:', error);
    return [];
  }
}

/**
 * Get recent fantasy picks - ordered by creation date
 */
export async function getRecentFantasyPicks(limit: number = 10): Promise<FantasyPickDB[]> {
  try {
    const { data, error } = await supabase
      .from('fantasy_picks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data as FantasyPickDB[] || [];
  } catch (error) {
    console.error('Error fetching recent fantasy picks:', error);
    return [];
  }
}
