
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
    console.log('Fetching Free War team selections...');
    const { data, error } = await supabase
      .from('free_war_teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Retrieved team selections:', data?.length || 0);
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
    console.log('Submitting Free War team:', { email, players, teamName });
    
    if (!email || !players || players.length !== 11) {
      console.error('Invalid submission data:', { email, playerCount: players?.length });
      return { 
        success: false, 
        error: 'Invalid submission data. Please check email and player selections.' 
      };
    }
    
    const { error, data } = await supabase
      .from('free_war_teams')
      .insert([
        { 
          email, 
          players, 
          team_name: teamName
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error during submission:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to submit team. Please try again.' 
      };
    }
    
    console.log('Submission successful, new record:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting free war team:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit team. Please try again.' 
    };
  }
};
