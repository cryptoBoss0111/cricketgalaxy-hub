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
import { Trophy, Filter, Calendar, User } from 'lucide-react';
import { formatDistance } from 'date-fns';
import FantasyPickCard from '@/components/fantasy-picks/FantasyPickCard';
import { FantasyPick } from '@/components/fantasy-picks/hooks/useFantasyPicks';

const FantasyTipsPage = () => {
  const [searchParams] = useSearchParams();
  const matchFilter = searchParams.get('match');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(matchFilter);
  const navigate = useNavigate();

  const miVsKkrPicks: FantasyPick[] = [
    {
      id: "pick-1",
      player_name: "Suryakumar Yadav",
      team: "Mumbai Indians",
      role: "Batsman",
      form: "Good",
      image_url: "/lovable-uploads/611356be-0c40-46ec-9995-1e3b95eab3e4.png",
      stats: "65(31), 43(29), 72(37)",
      points_prediction: 95,
      match_details: "MI vs KKR",
      selection_reason: "Suryakumar is MI's middle-order linchpin and thrives at Wankhede. He's in good form and has a strong record against KKR with 303 runs in 17 IPL matches at a strike rate of ~140.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-2",
      player_name: "Andre Russell",
      team: "Kolkata Knight Riders",
      role: "All-Rounder",
      form: "Excellent",
      image_url: "/lovable-uploads/5f09742b-2608-4ef2-b57b-7cabaab57f6a.png",
      stats: "42(19), 2/26, 38(16), 3/31",
      points_prediction: 90,
      match_details: "MI vs KKR",
      selection_reason: "Russell is a game-changer with bat and ball. He has a stellar record against MI with 311 runs at a strike rate of ~190 in 17 IPL matches, plus 17 wickets.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-3",
      player_name: "Trent Boult",
      team: "Mumbai Indians",
      role: "Bowler",
      form: "Good",
      image_url: "/lovable-uploads/df73abd6-8fc7-4ccd-8357-07d5db3d6520.png",
      stats: "3/27, 2/31, 1/26",
      points_prediction: 85,
      match_details: "MI vs KKR",
      selection_reason: "Boult's swing in the powerplay is lethal, and Wankhede's bounce suits his style. He's taken 11 wickets in 10 IPL matches against KKR, often striking early.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-4",
      player_name: "Quinton de Kock",
      team: "Kolkata Knight Riders",
      role: "Wicketkeeper",
      form: "Excellent",
      image_url: "/lovable-uploads/50e4858d-9918-404c-b823-b3552013fd2b.png",
      stats: "97*, 45(32), 63(41)",
      points_prediction: 88,
      match_details: "MI vs KKR",
      selection_reason: "De Kock is in form after a match-winning 97* against RR earlier this season. He's got 290 runs in 11 IPL matches against MI at a strike rate of ~130.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-5",
      player_name: "Rohit Sharma",
      team: "Mumbai Indians",
      role: "Batsman",
      form: "Average",
      image_url: "/lovable-uploads/7dbad874-c8be-4912-a6b8-876c69ddd3f2.png",
      stats: "34(28), 21(19), 45(30)",
      points_prediction: 75,
      match_details: "MI vs KKR",
      selection_reason: "MI's opener has struggled early in IPL 2025 but has a history of big scores at Wankhede with 669 runs in 16 IPL matches here. Against KKR, he's scored 944 runs in 33 IPL games.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-6",
      player_name: "Hardik Pandya",
      team: "Mumbai Indians",
      role: "All-Rounder",
      form: "Average",
      image_url: "",
      stats: "23(15), 1/32, 31(22), 0/29",
      points_prediction: 78,
      match_details: "MI vs KKR",
      selection_reason: "MI's captain offers batting firepower and bowling utility. He's scored 258 runs and taken 10 wickets in 17 IPL matches against KKR.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-7",
      player_name: "Sunil Narine",
      team: "Kolkata Knight Riders",
      role: "All-Rounder",
      form: "Good",
      image_url: "",
      stats: "28(14), 2/24, 19(11), 1/32",
      points_prediction: 82,
      match_details: "MI vs KKR",
      selection_reason: "Narine's mystery spin and explosive batting are invaluable. He's taken 25 wickets in 19 IPL matches against MI and often chips in with quick runs.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-8",
      player_name: "Varun Chakravarthy",
      team: "Kolkata Knight Riders",
      role: "Bowler",
      form: "Good",
      image_url: "",
      stats: "2/26, 1/30, 3/22",
      points_prediction: 76,
      match_details: "MI vs KKR",
      selection_reason: "KKR's lead spinner excels against MI's right-handers with 11 wickets in 9 IPL matches. Wankhede's bounce aids his variations.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-9",
      player_name: "Tilak Varma",
      team: "Mumbai Indians",
      role: "Batsman",
      form: "Good",
      image_url: "",
      stats: "41(27), 56(38), 37(22)",
      points_prediction: 80,
      match_details: "MI vs KKR",
      selection_reason: "The young left-hander has been consistent with 312 runs in 9 matches last season. Against KKR, he's shown promise, and Wankhede suits his attacking style.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-10",
      player_name: "Venkatesh Iyer",
      team: "Kolkata Knight Riders",
      role: "Batsman",
      form: "Average",
      image_url: "",
      stats: "31(28), 47(31), 22(19)",
      points_prediction: 72,
      match_details: "MI vs KKR",
      selection_reason: "Iyer's aggressive approach at the top has worked against MI with 154 fantasy points in a 2023 match. He's a differential pick with a chance to capitalize on MI's bowling.",
      created_at: new Date().toISOString(),
    },
    {
      id: "pick-11",
      player_name: "Shubman Gill",
      team: "Gujarat Titans",
      role: "Batsman",
      form: "Excellent",
      image_url: "/lovable-uploads/3a3641a5-0c32-4ac8-8867-0a4cb144760d.png",
      stats: "92(58), 57(42), 104(63)",
      points_prediction: 98,
      match_details: "GT vs RCB",
      selection_reason: "Gill has been in tremendous form, scoring centuries and consistently delivering high scores. He's the key batsman for Gujarat Titans.",
      created_at: new Date().toISOString(),
    }
  ];

  const matches = [
    {
      id: "match-12",
      team1: "Mumbai Indians",
      team2: "Kolkata Knight Riders",
      match_time: "2025-03-31T14:00:00Z",
      venue: "Wankhede Stadium, Mumbai",
      match_type: "IPL 2025",
      competition: "Indian Premier League"
    },
    {
      id: "match-13",
      team1: "Lucknow Super Giants",
      team2: "Punjab Kings",
      match_time: "2025-04-01T14:00:00Z",
      venue: "BRSABV Ekana Stadium, Lucknow",
      match_type: "IPL 2025",
      competition: "Indian Premier League"
    },
    {
      id: "match-14",
      team1: "Royal Challengers Bengaluru",
      team2: "Gujarat Titans",
      match_time: "2025-04-02T14:00:00Z",
      venue: "M. Chinnaswamy Stadium, Bengaluru",
      match_type: "IPL 2025",
      competition: "Indian Premier League"
    }
  ];

  const picks = selectedMatch 
    ? miVsKkrPicks.filter(pick => 
        selectedMatch === "match-12" ? pick.match_details === "MI vs KKR" :
        selectedMatch === "match-14" ? pick.match_details === "GT vs RCB" : true)
    : miVsKkrPicks;

  useEffect(() => {
    if (selectedMatch) {
      navigate(`/fantasy-tips?match=${selectedMatch}`, { replace: true });
    } else {
      navigate('/fantasy-tips', { replace: true });
    }
  }, [selectedMatch, navigate]);

  useEffect(() => {
    if (matchFilter) {
      setActiveTab('match');
      setSelectedMatch(matchFilter);
    }
  }, [matchFilter]);

  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId === "all" ? null : matchId);
    setActiveTab('match');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setSelectedMatch(null);
    }
  };

  const picksGroupedByRole = picks.reduce<Record<string, FantasyPick[]>>((acc, pick) => {
    if (!acc[pick.role]) {
      acc[pick.role] = [];
    }
    acc[pick.role].push(pick);
    return acc;
  }, {});

  const picksGroupedByMatch = picks.reduce<Record<string, FantasyPick[]>>((acc, pick) => {
    if (!acc[pick.match_details]) {
      acc[pick.match_details] = [];
    }
    acc[pick.match_details].push(pick);
    return acc;
  }, {});

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
      
      <main className="min-h-screen bg-gradient-to-b from-cricket-accent/5 to-white pt-20">
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
              <Select value={selectedMatch || 'all'} onValueChange={handleMatchSelect}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Filter by match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Matches</SelectItem>
                  {matches.map((match) => (
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
                <User className="h-4 w-4" /> By Role
              </TabsTrigger>
              <TabsTrigger value="byMatch" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> By Match
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {picks.length === 0 ? (
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
              {Object.keys(picksGroupedByRole).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-16 w-16 text-gray-300 mb-4" />
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
              {Object.keys(picksGroupedByMatch).length === 0 ? (
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
                <CardTitle>MI vs KKR Match Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Pitch:</strong> Wankhede is a high-scoring ground (avg. 1st innings score ~170). Expect dew in the second innings, favoring chasers.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Captain/Vice-Captain:</strong> Suryakumar Yadav (Captain) and Andre Russell (Vice-Captain) are safe bets for max points.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Strategy:</strong> Prioritize all-rounders (Russell, Pandya, Narine) and top-order batsmen due to the batting-friendly conditions.
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
