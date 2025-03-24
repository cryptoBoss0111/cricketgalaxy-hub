
import { useState, useEffect } from 'react';
import { useFantasyPicks, FantasyPick } from './useFantasyPicks';

interface FeaturedMatchResult {
  featuredMatch: string | null;
  filteredPicks: FantasyPick[];
  isLoading: boolean;
}

export const useFeaturedMatch = (): FeaturedMatchResult => {
  const { fantasyPicks, isLoading: isLoadingPicks } = useFantasyPicks();
  const [featuredMatch, setFeaturedMatch] = useState<string | null>(null);
  const [filteredPicks, setFilteredPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const identifyFeaturedMatch = () => {
      try {
        // Attempt to get the most recent match with at least 2 fantasy picks
        if (fantasyPicks.length > 0) {
          // Group picks by match
          const matchGroups: Record<string, FantasyPick[]> = {};
          
          // Populate matchGroups
          for (const pick of fantasyPicks) {
            if (!pick.match_details) continue;
            
            if (!matchGroups[pick.match_details]) {
              matchGroups[pick.match_details] = [];
            }
            matchGroups[pick.match_details].push(pick);
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
            setFeaturedMatch(matchName);
            setFilteredPicks(matchPicks.slice(0, 4)); // Limit to 4 picks max
          } else if (fantasyPicks.length >= 2) {
            // Fallback: if no match has 2+ picks but we have at least 2 picks total
            setFeaturedMatch('Featured Picks');
            setFilteredPicks(fantasyPicks.slice(0, 4));
          } else {
            setFeaturedMatch(null);
            setFilteredPicks([]);
          }
        } else {
          setFeaturedMatch(null);
          setFilteredPicks([]);
        }
      } catch (error) {
        console.error('Error identifying featured match:', error);
        setFeaturedMatch(null);
        setFilteredPicks([]);
      } finally {
        setIsLoading(isLoadingPicks);
      }
    };

    identifyFeaturedMatch();
  }, [fantasyPicks, isLoadingPicks]);

  return { featuredMatch, filteredPicks, isLoading };
};
