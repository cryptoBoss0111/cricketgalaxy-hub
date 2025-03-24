
import { useState, useEffect, useMemo } from 'react';
import { useFantasyPicks, FantasyPick } from './useFantasyPicks';

interface FeaturedMatchResult {
  featuredMatch: string | null;
  filteredPicks: FantasyPick[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFeaturedMatch(): FeaturedMatchResult {
  // Fetch all fantasy picks using the hook
  const { fantasyPicks, isLoading, error, refetch } = useFantasyPicks();
  
  // Derive featured match and filtered picks from the fetched data
  const { featuredMatch, filteredPicks } = useMemo(() => {
    if (fantasyPicks.length === 0) {
      return { featuredMatch: null, filteredPicks: [] };
    }
    
    // Group picks by match
    const matchGroups: Record<string, FantasyPick[]> = {};
    
    // Populate match groups
    for (const pick of fantasyPicks) {
      const matchKey = pick.match_details || 'Unknown Match';
      
      if (!matchGroups[matchKey]) {
        matchGroups[matchKey] = [];
      }
      matchGroups[matchKey].push(pick);
    }
    
    // Convert to array of entries for sorting
    const matchEntries = Object.entries(matchGroups);
    
    // Find matches with at least 2 picks
    const validMatches = matchEntries
      .filter(([_, picks]) => picks.length >= 2)
      .sort((a, b) => {
        // Sort by most recent created_at date in each match group
        const latestA = Math.max(...a[1].map(p => new Date(p.created_at).getTime()));
        const latestB = Math.max(...b[1].map(p => new Date(p.created_at).getTime()));
        return latestB - latestA;
      });
      
    // Use the most recent valid match
    if (validMatches.length > 0) {
      const [matchName, matchPicks] = validMatches[0];
      
      // Sort picks by points prediction in descending order
      const sortedPicks = [...matchPicks].sort(
        (a, b) => b.points_prediction - a.points_prediction
      );
      
      return { 
        featuredMatch: matchName, 
        filteredPicks: sortedPicks.slice(0, 4) // Limit to 4 picks max
      };
    } 
    
    // Fallback: if no match has 2+ picks but we have at least 2 picks total
    if (fantasyPicks.length >= 2) {
      const sortedPicks = [...fantasyPicks].sort(
        (a, b) => b.points_prediction - a.points_prediction
      );
      
      return { 
        featuredMatch: 'Featured Picks', 
        filteredPicks: sortedPicks.slice(0, 4)
      };
    }
    
    return { featuredMatch: null, filteredPicks: [] };
  }, [fantasyPicks]);
  
  return { 
    featuredMatch, 
    filteredPicks, 
    isLoading, 
    error,
    refetch 
  };
}
