
import { useState, useEffect } from 'react';
import { useFantasyPicks, FantasyPick } from './useFantasyPicks';

export const useFeaturedMatch = () => {
  const { fantasyPicks, isLoading: isLoadingPicks } = useFantasyPicks();
  const [featuredMatch, setFeaturedMatch] = useState<string | null>(null);
  const [filteredPicks, setFilteredPicks] = useState<FantasyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMatch = () => {
      try {
        // Attempt to get the most recent match with at least 2 fantasy picks
        if (fantasyPicks.length > 0) {
          // Group picks by match
          const matchGroups = fantasyPicks.reduce<Record<string, FantasyPick[]>>((acc, pick) => {
            if (!pick.match_details) return acc;
            
            if (!acc[pick.match_details]) {
              acc[pick.match_details] = [];
            }
            acc[pick.match_details].push(pick);
            return acc;
          }, {});
          
          // Find matches with at least 2 picks
          const validMatches = Object.entries(matchGroups)
            .filter(([_, picks]) => picks.length >= 2)
            .sort((a, b) => {
              // Sort by most recent created_at date in each match group
              const latestA = new Date(Math.max(...a[1].map(p => new Date(p.created_at).getTime())));
              const latestB = new Date(Math.max(...b[1].map(p => new Date(p.created_at).getTime())));
              return latestB.getTime() - latestA.getTime();
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
        console.error('Error fetching featured match:', error);
        setFeaturedMatch(null);
        setFilteredPicks([]);
      } finally {
        setIsLoading(isLoadingPicks);
      }
    };

    fetchFeaturedMatch();
  }, [fantasyPicks, isLoadingPicks]);

  return { featuredMatch, filteredPicks, isLoading };
};
