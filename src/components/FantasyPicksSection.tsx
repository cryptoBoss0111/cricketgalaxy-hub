
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronRight, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type FantasyPick = {
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

const FantasyPicksSection = () => {
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFantasyPicks = async () => {
      try {
        const { data, error } = await supabase
          .from('fantasy_picks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Error fetching fantasy picks:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setFantasyPicks(data as FantasyPick[]);
        } else {
          // Fallback data if no fantasy picks are available
          setFantasyPicks([
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
              selection_reason: 'Consistently taking wickets in the powerplay',
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
  
  return (
    <section className="py-16 bg-gradient-to-br from-cricket-accent/10 to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-3">
            <Trophy className="text-cricket-accent h-7 w-7" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold">Fantasy Hot Picks</h2>
          </div>
          <Link to="/fantasy-tips" className="flex items-center text-sm font-medium text-cricket-accent hover:underline">
            View All Picks <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-md animate-pulse">
                <CardContent className="p-6 h-64"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fantasyPicks.map((pick, index) => (
                <Card 
                  key={pick.id} 
                  className={cn(
                    "overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-t-4 relative animate-fade-in",
                    index === 0 ? "border-t-yellow-500 animate-delay-100" : 
                    index === 1 ? "border-t-blue-500 animate-delay-200" : 
                    "border-t-green-500 animate-delay-300"
                  )}
                >
                  <Badge 
                    className={cn(
                      "absolute top-2 right-2 font-medium",
                      index === 0 ? "bg-yellow-500" : 
                      index === 1 ? "bg-blue-500" : 
                      "bg-green-500"
                    )}
                  >
                    {index === 0 ? "Top Pick" : index === 1 ? "Value Pick" : "Differential Pick"}
                  </Badge>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={pick.image_url} 
                        alt={pick.player_name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{pick.player_name}</h3>
                        <p className="text-gray-500 text-sm">{pick.team} • {pick.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Form:</span>
                        <span className={cn(
                          "text-sm font-medium",
                          pick.form === 'Excellent' ? "text-green-600" :
                          pick.form === 'Good' ? "text-blue-600" : 
                          pick.form === 'Average' ? "text-yellow-600" : 
                          "text-red-600"
                        )}>
                          {pick.form}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Predicted Points:</span>
                        <span className="text-sm font-bold text-cricket-accent">{pick.points_prediction} pts</span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Match:</span>
                        <span className="text-sm">{pick.match_details}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                      <strong>Why Pick:</strong> {pick.selection_reason}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
                <Link to="/fantasy-tips" className="flex items-center">
                  Build Your Fantasy Team <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500 mt-3">Updated daily with fresh picks from our cricket experts</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FantasyPicksSection;
