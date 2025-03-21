
import { HeroArticle } from './types';

// Convert category to URL-friendly format
export const getCategoryUrl = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'IPL 2025': 'ipl-2025',
    'Series': 'cricket-news',
    'Match Previews': 'match-previews',
    'Match Reviews': 'match-reviews',
    'Fantasy Tips': 'fantasy-tips',
    'Player Profiles': 'player-profiles',
    'Women\'s Cricket': 'womens-cricket',
    'World Cup': 'world-cup'
  };
  
  return categoryMap[category] || 'cricket-news';
};

// Mock data for fallback when no featured stories are found
export const getMockHeroArticles = (): HeroArticle[] => [
  {
    id: '1',
    title: 'India Dominates in Historic Cricket Series Win Against Australia',
    excerpt: 'Team India secures a remarkable series victory on Australian soil with stellar performances from both senior and emerging players.',
    category: 'Series',
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop',
    date: 'Mar 15, 2025',
    isFeaturedPick: true
  },
  {
    id: '2',
    title: 'IPL 2025: Complete Guide to Teams, Players, and Key Matches',
    excerpt: 'Everything you need to know about the upcoming Indian Premier League season with analysis of all ten franchises.',
    category: 'IPL 2025',
    imageUrl: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?q=80&w=1200&auto=format&fit=crop',
    date: 'Mar 14, 2025'
  },
  {
    id: '3',
    title: 'Rising Stars: The Next Generation of Cricket Superstars',
    excerpt: 'Meet the talented young cricketers who are making waves internationally and are poised to become the next cricket legends.',
    category: 'Player Profiles',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
    date: 'Mar 13, 2025',
    isFeaturedPick: true
  }
];
