
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import { useFantasyPicks } from '@/components/fantasy-picks/hooks/useFantasyPicks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FantasyPickCard, { FantasyPick } from '@/components/fantasy-picks/FantasyPickCard';

const FantasyTipsPage: React.FC = () => {
  const { fantasyPicks, isLoading } = useFantasyPicks();
  const [selectedMatch, setSelectedMatch] = useState<string>('all');
  const [filteredPicks, setFilteredPicks] = useState<FantasyPick[]>([]);
  const [availableMatches, setAvailableMatches] = useState<string[]>([]);
  
  // Effect to manage available matches and filter picks
  useEffect(() => {
    if (!isLoading && fantasyPicks.length > 0) {
      // Extract unique matches
      const matches = Array.from(new Set(fantasyPicks.map(pick => pick.match_details)));
      setAvailableMatches(matches);
      
      // Filter picks based on selected match
      if (selectedMatch === 'all') {
        setFilteredPicks(fantasyPicks);
      } else {
        setFilteredPicks(fantasyPicks.filter(pick => pick.match_details === selectedMatch));
      }
    }
  }, [fantasyPicks, isLoading, selectedMatch]);
  
  // Handle match selection
  const handleMatchChange = (match: string) => {
    setSelectedMatch(match);
  };
  
  return (
    <>
      <LiveMatchesBar />
      <Navbar />
      
      <main className="pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-cricket-accent to-cricket-secondary py-16 text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Fantasy Cricket Tips</h1>
            <p className="text-xl opacity-90 max-w-3xl">
              Expert picks and strategies to help you build winning fantasy cricket teams
            </p>
          </div>
        </section>
        
        {/* Filter Section */}
        <section className="py-8 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2 dark:text-white">
                  Top Fantasy Picks
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Recommended players for upcoming T20 matches
                </p>
              </div>
              
              <div className="w-full md:w-64">
                <Select 
                  value={selectedMatch} 
                  onValueChange={handleMatchChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Matches</SelectItem>
                    {availableMatches.map(match => (
                      <SelectItem key={match} value={match}>
                        {match}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Fantasy Picks Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="shadow-md animate-pulse h-64 rounded-lg bg-gray-100 dark:bg-gray-800/50"></div>
                ))}
              </div>
            ) : filteredPicks.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No Picks Available</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  No fantasy picks available for the selected match. Try selecting a different match.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPicks.map((pick, index) => (
                  <FantasyPickCard 
                    key={pick.id} 
                    pick={pick} 
                    index={index % 4} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Fantasy Strategy Tips */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold mb-8 dark:text-white">
              Fantasy Cricket Strategy Tips
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Balance Your Team</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Aim for a balanced mix of batsmen, bowlers, all-rounders, and wicket-keepers. 
                  Don't overload your team with just one type of player.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Track Player Form</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Always check the recent performance stats of players before adding them to your team.
                  Form is a key indicator of potential points.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Consider Pitch Conditions</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Some players perform better on specific pitches. Research the venue and historical 
                  performance of players at that ground.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Pick Value Players</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Don't just choose star players. Look for in-form, less expensive players who can 
                  deliver high points, allowing you to balance your budget.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default FantasyTipsPage;
