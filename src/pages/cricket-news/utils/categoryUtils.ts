
export const getCategoryFromPath = (pathCategory: string | undefined): string => {
  if (!pathCategory) return 'All Categories';
  
  const categoryMap: Record<string, string> = {
    'cricket-news': 'All Categories',
    'match-previews': 'Match Previews',
    'match-reviews': 'Match Reviews',
    'fantasy-tips': 'Fantasy Tips',
    'player-profiles': 'Player Profiles',
    'ipl-2025': 'IPL 2025',
    'womens-cricket': 'Women\'s Cricket',
    'world-cup': 'World Cup'
  };
  
  return categoryMap[pathCategory] || 'All Categories';
};
