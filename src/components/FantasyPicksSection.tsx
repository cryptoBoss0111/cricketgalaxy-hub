
import { useState, useEffect } from 'react';
import { Trophy, TrendingUp, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFantasyPicks } from '@/integrations/supabase/client';

interface FantasyPlayer {
  id: string;
  player_name: string;
  team: string;
  role: string;
  form: string;
  points_prediction: number;
  reason: string;
  match: string;
}

const FantasyPicksSection = () => {
  const [fantasyPicks, setFantasyPicks] = useState<FantasyPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFantasyPicks = async () => {
      try {
        setIsLoading(true);
        const data = await getFantasyPicks();
        // Limit to top 3 picks
        setFantasyPicks(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching fantasy picks:', error);
        // Fallback data in case of error
        setFantasyPicks([
          {
            id: '1',
            player_name: 'Virat Kohli',
            team: 'Royal Challengers Bangalore',
            role: 'Batsman',
            form: 'Excellent',
            points_prediction: 125,
            reason: 'Coming off a century in the last match and has an excellent record at this venue.',
            match: 'RCB vs CSK'
          },
          {
            id: '2',
            player_name: 'Jasprit Bumrah',
            team: 'Mumbai Indians',
            role: 'Bowler',
            form: 'Good',
            points_prediction: 90,
            reason: 'The pitch favors fast bowlers and he's been in great form throughout the tournament.',
            match: 'MI vs KKR'
          },
          {
            id: '3',
            player_name: 'Ravindra Jadeja',
            team: 'Chennai Super Kings',
            role: 'All-rounder',
            form: 'Excellent',
            points_prediction: 110,
            reason: 'Can contribute with both bat and ball, especially effective against RCB.',
            match: 'CSK vs RCB'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFantasyPicks();
  }, []);

  // Helper to get role color based on player type
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'batsman':
        return 'bg-blue-100 text-blue-800';
      case 'bowler':
        return 'bg-green-100 text-green-800';
      case 'all-rounder':
        return 'bg-purple-100 text-purple-800';
      case 'wicket-keeper':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get form color based on value
  const getFormColor = (form: string) => {
    switch (form.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-green-50 text-green-700';
      case 'average':
        return 'bg-blue-50 text-blue-700';
      case 'poor':
        return 'bg-amber-50 text-amber-700';
      case 'bad':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Function to create gradients based on prediction points
  const getPointsGradient = (points: number) => {
    if (points >= 120) return 'from-amber-400 to-yellow-500';
    if (points >= 100) return 'from-emerald-400 to-teal-500';
    if (points >= 80) return 'from-blue-400 to-indigo-500';
    return 'from-gray-400 to-slate-500';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="text-cricket-accent h-6 w-6" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold">Fantasy Hot Picks</h2>
          </div>
          <Link to="/fantasy-tips" className="flex items-center text-sm font-medium text-cricket-accent hover:underline">
            View All Picks <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fantasyPicks.map((player, index) => (
            <Card 
              key={player.id} 
              className={cn(
                "overflow-hidden border-gray-200 hover:shadow-md transition-all duration-300 animate-fade-in",
                index === 0 ? "animate-delay-100" : "",
                index === 1 ? "animate-delay-200" : "",
                index === 2 ? "animate-delay-300" : ""
              )}
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cricket-accent to-cricket-accent/70 flex items-center justify-center text-white font-bold">
                    {player.player_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{player.player_name}</h3>
                    <div className="text-gray-500 text-sm">{player.team}</div>
                  </div>
                </div>
                <Badge className={getRoleColor(player.role)}>
                  {player.role}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Match</div>
                  <div className="text-gray-900 font-medium">{player.match}</div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Current Form</div>
                    <Badge className={getFormColor(player.form)}>
                      {player.form}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-gray-500 text-sm mb-1 text-center">Prediction</div>
                    <div className={`bg-gradient-to-r ${getPointsGradient(player.points_prediction)} text-white rounded-full px-4 py-1 font-bold`}>
                      {player.points_prediction} pts
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Why Pick?</div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{player.reason}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <Star className="h-4 w-4 mr-1 fill-current opacity-40" />
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild className="text-cricket-accent hover:text-cricket-accent/90 p-0">
                    <Link to={`/player-profiles/${player.player_name.toLowerCase().replace(' ', '-')}`} className="flex items-center text-sm">
                      Player Profile <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="mb-4 text-gray-600">
            Join fantasy cricket and compete with friends and cricket fans worldwide!
          </div>
          <Button asChild className="bg-cricket-accent hover:bg-cricket-accent/90">
            <Link to="/fantasy-tips">
              Get More Fantasy Tips
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FantasyPicksSection;
