
import { useState, useEffect } from 'react';

// Define our component's internal type
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

// Mock data to use instead of Supabase
const MOCK_FANTASY_PICKS: FantasyPick[] = [
  {
    id: '1',
    player_name: 'Rishabh Pant',
    team: 'Delhi Capitals',
    role: 'WK-Batsman',
    form: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 68(42), 45(32), 72(39)',
    points_prediction: 95,
    match_details: 'DC vs RCB, Apr 5, 2025',
    selection_reason: 'In exceptional form since his return from injury',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    player_name: 'Jasprit Bumrah',
    team: 'Mumbai Indians',
    role: 'Bowler',
    form: 'Good',
    image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 3/24, 2/18, 4/29',
    points_prediction: 88,
    match_details: 'MI vs KKR, Apr 6, 2025',
    selection_reason: 'The pitch favors fast bowlers and he has been in great form throughout the tournament',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    player_name: 'Shubman Gill',
    team: 'Gujarat Titans',
    role: 'Batsman',
    form: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=120&auto=format&fit=crop',
    stats: 'Recent: 92(58), 57(42), 104(63)',
    points_prediction: 90,
    match_details: 'GT vs LSG, Apr 7, 2025',
    selection_reason: 'In great touch and scoring consistently',
    created_at: new Date().toISOString()
  }
];

export const useFantasyPicks = () => {
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFantasyPicks(MOCK_FANTASY_PICKS);
      setIsLoading(false);
    }, 500);
  }, []);
  
  return { fantasyPicks, isLoading };
};
