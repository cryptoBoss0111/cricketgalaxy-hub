
import { supabase } from './client-core';

export interface TeamSelection {
  id: string;
  email: string;
  created_at: string;
  players: string[];
  team_name?: string;
}

export const getFreeWarTeamSelections = async (): Promise<TeamSelection[]> => {
  try {
    const { data, error } = await supabase
      .from('free_war_teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data as TeamSelection[];
  } catch (error) {
    console.error('Error fetching free war teams:', error);
    throw error;
  }
};

export const submitFreeWarTeam = async (
  email: string, 
  players: string[], 
  teamName?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('free_war_teams')
      .insert([
        { 
          email, 
          players, 
          team_name: teamName
        }
      ]);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting free war team:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit team. Please try again.' 
    };
  }
};
