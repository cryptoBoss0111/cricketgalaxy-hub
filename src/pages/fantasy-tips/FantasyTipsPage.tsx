
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Filter, Calendar, Cricket } from 'lucide-react';
import { formatDistance } from 'date-fns';
import FantasyPickCard, { FantasyPick } from '@/components/fantasy-picks/FantasyPickCard';

const FantasyTipsPage = () => {
  const [searchParams] = useSearchParams();
  const matchFilter = searchParams.get('match');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(matchFilter);
  const navigate = useNavigate();

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['upcomingMatches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upcoming_matches')
        .select('*')
        .order('match_time', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: picks = [], isLoading: picksLoading } = useQuery({
    queryKey: ['fantasyPicks', selectedMatch],
    queryFn: async () => {
      let query = supabase
        .from('fantasy_picks')
        .select('*')
        .order('points_prediction', { ascending: false });
      
      if (selectedMatch) {
        query = query.eq('match_id', selectedMatch);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data for the component
      return data.map((pick: any) => ({
        id: pick.id,
        player_name: pick.player_name,
        team: pick.team,
        role: pick.role,
        form: pick.form,
        image_url: pick.image_url || '',
        stats: pick.stats || 'Recent stats not available',
        points_prediction: pick.points_prediction,
        match_details: pick.match,
        selection_reason: pick.reason,
        created_at: pick.created_at
      })) as FantasyPick[];
    },
    enabled: !picksLoading
  });

  // Update the URL when match selection changes
  useEffect(() => {
    if (selectedMatch) {
      navigate(`/fantasy-tips?match=${selectedMatch}`, { replace: true });
    } else {
      navigate('/fantasy-tips', { replace: true });
    }
  }, [selectedMatch, navigate]);

  // Set the initial tab based on the match filter
  useEffect(() => {
    if (matchFilter) {
      setActiveTab('match');
      setSelectedMatch(matchFilter);
    }
  }, [matchFilter]);

  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId);
    setActiveTab('match');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setSelectedMatch(null);
    }
  };

  // Group picks by role for the 'byRole' tab
  const picksGroupedByRole = picks.reduce<Record<string, FantasyPick[]>>((acc, pick) => {
    if (!acc[pick.role]) {
      acc[pick.role] = [];
    }
    acc[pick.role].push(pick);
    return acc;
  }, {});

  // Group by match for 'byMatch' tab
  const picksGroupedByMatch = picks.reduce<Record<string, FantasyPick[]>>((acc, pick) => {
    if (!acc[pick.match_details]) {
      acc[pick.match_details] = [];
    }
    acc[pick.match_details].push(pick);
    return acc;
  }, {});

  const isLoading = matchesLoading || picksLoading;

  return (
    <>
      <Helmet>
        <title>Fantasy Cricket Tips | Expert Picks & Analysis</title>
        <meta 
          name="description" 
          content="Get expert fantasy cricket tips and player recommendations for upcoming matches. Maximize your fantasy team's performance with our data-driven analysis."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-cricket-accent/5 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-cricket-accent mb-2">
                Fantasy Cricket Tips
              </h1>
              <p className="text-gray-600 md:text-lg max-w-2xl">
                Expert picks and analysis to help you build the perfect fantasy cricket team for upcoming matches
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Select value={selectedMatch || ''} onValueChange={handleMatchSelect}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Filter by match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Matches</SelectItem>
                  {matches.map((match: any) => (
                    <SelectItem key={match.id} value={match.id}>
                      {match.team1} vs {match.team2}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" /> All Picks
              </TabsTrigger>
              <TabsTrigger value="byRole" className="flex items-center gap-2">
                <Cricket className="h-4 w-4" /> By Role
              </TabsTrigger>
              <TabsTrigger value="byMatch" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> By Match
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
                </div>
              ) : picks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Fantasy Picks Available</h3>
                    <p className="text-gray-500 text-center max-w-md mb-4">
                      {selectedMatch ? 
                        "No picks available for the selected match. Try selecting a different match." : 
                        "Check back soon for fantasy tips and player recommendations."}
                    </p>
                    {selectedMatch && (
                      <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                        View All Matches
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {picks.map((pick, index) => (
                    <FantasyPickCard key={pick.id} pick={pick} index={index % 4} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="byRole" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
                </div>
              ) : Object.keys(picksGroupedByRole).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Cricket className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Fantasy Picks Available</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Check back soon for role-based fantasy tips and recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {Object.entries(picksGroupedByRole).map(([role, rolePicks]) => (
                    <div key={role} className="space-y-4">
                      <h2 className="text-xl font-semibold border-b pb-2">{role}s</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rolePicks.map((pick, index) => (
                          <FantasyPickCard key={pick.id} pick={pick} index={index % 4} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="byMatch" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cricket-accent"></div>
                </div>
              ) : Object.keys(picksGroupedByMatch).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Match-Based Picks Available</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      Check back soon for match-specific fantasy tips and player recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {Object.entries(picksGroupedByMatch).map(([matchName, matchPicks]) => (
                    <div key={matchName} className="space-y-4">
                      <h2 className="text-xl font-semibold border-b pb-2">{matchName}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {matchPicks.map((pick, index) => (
                          <FantasyPickCard key={pick.id} pick={pick} index={index % 4} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <Separator className="my-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Fantasy Scoring Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Pick players with consistent performance history</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Consider pitch conditions and player matchups</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                    <span>Balance your team with high-risk and safe picks</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Player Selection Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                    <span>Always include at least one differential pick</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                    <span>Choose captain and vice-captain carefully</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">!</span>
                    <span>Monitor player injuries and team news</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expert Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Our expert analyses are updated daily with fresh insights and stats for upcoming matches.
                </p>
                <div className="text-xs text-gray-500">
                  Last updated: {formatDistance(new Date(), new Date(), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FantasyTipsPage;
