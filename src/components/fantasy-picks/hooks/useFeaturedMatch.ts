
import { useState, useEffect } from 'react';
import { useFantasyPicks } from './useFantasyPicks';
import { FantasyPick } from '@/components/fantasy-picks/FantasyPickCard';

export const useFeaturedMatch = () => {
  const { fantasyPicks, isLoading } = useFantasyPicks();
  const [featuredMatch, setFeaturedMatch] = useState<string | null>(null);
  const [filteredPicks, setFilteredPicks] = useState<FantasyPick[]>([]);
  
  useEffect(() => {
    if (!isLoading && fantasyPicks.length > 0) {
      // Group fantasy picks by match
      const matchGroups = fantasyPicks.reduce((acc, pick) => {
        const match = pick.match_details;
        if (!acc[match]) {
          acc[match] = [];
        }
        acc[match].push(pick);
        return acc;
      }, {} as Record<string, FantasyPick[]>);
      
      // Find the match with the most picks (with a maximum of 4)
      let maxPickCount = 0;
      let featuredMatchName = null;
      
      for (const [match, picks] of Object.entries(matchGroups)) {
        if (picks.length > maxPickCount && picks.length <= 4) {
          maxPickCount = picks.length;
          featuredMatchName = match;
        }
      }
      
      // If we found a featured match, set it
      if (featuredMatchName) {
        setFeaturedMatch(featuredMatchName);
        setFilteredPicks(matchGroups[featuredMatchName]);
      } else {
        // If no match has exactly 4 picks, just use the first match
        const firstMatch = Object.keys(matchGroups)[0];
        setFeaturedMatch(firstMatch);
        setFilteredPicks(matchGroups[firstMatch].slice(0, 4));
      }
    }
  }, [fantasyPicks, isLoading]);
  
  const changeActiveMatch = (matchName: string) => {
    setFeaturedMatch(matchName);
  };
  
  return {
    featuredMatch,
    filteredPicks,
    isLoading,
    allPicks: fantasyPicks,
    changeActiveMatch,
  };
};
