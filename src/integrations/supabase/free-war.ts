
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
    
    // Add a short delay to ensure any recent submissions have propagated
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { data, error } = await supabase
      .from('free_war_teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    // Log the full response for debugging
    console.log('Free War teams data response:', data);
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
    
    // First, check if a team with this email already exists
    const { data: existingTeam } = await supabase
      .from('free_war_teams')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    let result;
    
    if (existingTeam) {
      // Update the existing team
      console.log('Updating existing team for email:', email);
      result = await supabase
        .from('free_war_teams')
        .update({ 
          players, 
          team_name: teamName || null 
        })
        .eq('email', email);
    } else {
      // Insert a new team
      console.log('Creating new team for email:', email);
      result = await supabase
        .from('free_war_teams')
        .insert([{ 
          email, 
          players, 
          team_name: teamName || null 
        }]);
    }
    
    if (result.error) {
      console.error('Supabase error during submission:', result.error);
      
      // Try direct insertion as a fallback for any RLS issues
      console.log('Attempting alternative direct insertion...');
      const fallbackResult = await supabase
        .from('free_war_teams')
        .insert([{ 
          email, 
          players, 
          team_name: teamName || null 
        }]);
        
      if (fallbackResult.error) {
        console.error('Fallback submission also failed:', fallbackResult.error);
        return { 
          success: false, 
          error: 'Unable to submit team. Please try again later.' 
        };
      }
      
      console.log('Fallback submission successful');
      return { success: true };
    }
    
    console.log('Submission successful');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting free war team:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to submit team. Please try again.' 
    };
  }
};
