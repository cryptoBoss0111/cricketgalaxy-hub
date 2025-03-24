
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define a type that matches what's returned by the getFantasyPicks function
type FantasyPickFromDB = {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  points_prediction: number;
  reason: string;
  match: string;
  match_id?: string;
  image_url?: string;
  stats?: string;
  created_at: string;
  updated_at: string;
};

// Define our component's internal type that extends what we get from DB
export type FantasyPick = {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: 'Excellent' | 'Good' | 'Average' | 'Poor';
  image_url: string;
  stats: string;
  points_prediction: number;
  match_details: string;
  selection_reason: string;
  created_at: string;
};

export const useFantasyPicks = () => {
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFantasyPicks = async () => {
      try {
        const { data, error } = await supabase
          .from('fantasy_picks')
          .select('*')
          .order('points_prediction', { ascending: false });
          
        if (error) {
          console.error('Error fetching fantasy picks:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform the DB data to our component's expected format
          const transformedData: FantasyPick[] = data.map((dbPick: FantasyPickFromDB) => ({
            id: dbPick.id,
            player_name: dbPick.player_name,
            team: dbPick.team,
            role: dbPick.role,
            form: (dbPick.form as 'Excellent' | 'Good' | 'Average' | 'Poor'),
            image_url: dbPick.image_url || 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
            stats: dbPick.stats || 'Recent stats not available',
            points_prediction: dbPick.points_prediction,
            match_details: dbPick.match,
            selection_reason: dbPick.reason,
            created_at: dbPick.created_at
          }));
          
          setFantasyPicks(transformedData);
        } else {
          // Fallback data if no fantasy picks are available
          setFantasyPicks([
            {
              id: '1',
              player_name: 'Virat Kohli',
              team: 'Royal Challengers Bangalore',
              role: 'Batsman',
              form: 'Excellent',
              image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
              stats: '92(48), 77(49), 104(63)',
              points_prediction: 95,
              match_details: 'RCB vs KKR',
              selection_reason: 'Kohli has a phenomenal record at Eden Gardens and against KKR, with nearly 1,000 runs in IPL history against them.',
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              player_name: 'Sunil Narine',
              team: 'Kolkata Knight Riders',
              role: 'All-Rounder',
              form: 'Good',
              image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
              stats: '3/24, 2/18, 4/29',
              points_prediction: 88,
              match_details: 'RCB vs KKR',
              selection_reason: 'Narine thrives on Eden Gardens\' pitch, taking 21 wickets in IPL 2024, and his batting adds extra points.',
              created_at: new Date().toISOString()
            },
            {
              id: '3',
              player_name: 'Phil Salt',
              team: 'Royal Challengers Bangalore',
              role: 'WK-Batsman',
              form: 'Excellent',
              image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
              stats: '68(42), 45(32), 72(39)',
              points_prediction: 90,
              match_details: 'RCB vs KKR',
              selection_reason: 'Salt\'s aggressive opening style makes him a top pick, especially with potential dew aiding batsmen in the second innings.',
              created_at: new Date().toISOString()
            },
            {
              id: '4',
              player_name: 'Varun Chakaravarthy',
              team: 'Kolkata Knight Riders',
              role: 'Bowler',
              form: 'Good',
              image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
              stats: '2/26, 1/30, 3/22',
              points_prediction: 82,
              match_details: 'RCB vs KKR',
              selection_reason: 'Chakaravarthy\'s mystery spin could trouble RCB\'s middle order, especially on a pitch that might assist spinners.',
              created_at: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch fantasy picks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFantasyPicks();
  }, []);
  
  return { fantasyPicks, isLoading };
};
