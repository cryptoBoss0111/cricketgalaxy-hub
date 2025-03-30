
import { HeroArticle } from './types';
import { supabase } from '@/integrations/supabase/client';
import { mockNewsArticles } from '@/pages/cricket-news/data/mockNewsArticles';

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

// Fetch hero slider items from Supabase
export const fetchHeroSliderArticles = async (): Promise<HeroArticle[]> => {
  try {
    // Use mock news articles as the source for hero slider
    return mockNewsArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      imageUrl: article.imageUrl,
      date: article.date,
      isFeaturedPick: true
    }));
    
    // Original Supabase code kept for reference but not used
    /*
    const { data, error } = await supabase
      .from('hero_slider')
      .select(`
        id,
        article_id,
        order_index,
        is_active,
        articles:article_id (
          id,
          title,
          excerpt,
          featured_image,
          cover_image,
          category,
          published_at
        )
      `)
      .eq('is_active', true)
      .order('order_index', { ascending: true });
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return getMockHeroArticles();
    }
    
    return data.map(item => {
      const article = item.articles as any;
      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || 'Read this exciting story...',
        category: article.category,
        imageUrl: article.featured_image || article.cover_image || null,
        date: new Date(article.published_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        isFeaturedPick: false
      };
    });
    */
  } catch (error) {
    console.error('Error fetching hero slider articles:', error);
    return getMockHeroArticles();
  }
};

// Mock data for fallback when no hero articles are found
export const getMockHeroArticles = (): HeroArticle[] => [
  {
    id: 'dc-vs-srh',
    title: "Today's IPL Banger: Delhi Capitals vs. Sunrisers Hyderabad – DC Owned the Night!",
    excerpt: "Yo, cricket fam! It's March 30, 2025, and the IPL 2025 just dropped a straight-up banger in Visakhapatnam. Delhi Capitals (DC) rolled up against Sunrisers Hyderabad (SRH) and turned the pitch into their playground.",
    category: 'IPL 2025',
    imageUrl: "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png",
    date: 'March 30, 2025',
    isFeaturedPick: true
  },
  {
    id: 'mi-vs-kkr',
    title: "Tomorrow's IPL Double-Header: Mumbai Indians vs. Kolkata Knight Riders – Full Hype Breakdown!",
    excerpt: "Yo, cricket fam! It's March 30, 2025, 11:01 PM IST, and tomorrow—Monday, March 31, 2025—is about to hit us with an IPL 2025 banger! The schedule's locked in, and we've got Mumbai Indians (MI) vs. Kolkata Knight Riders (KKR) lighting up the Wankhede Stadium.",
    category: 'IPL 2025',
    imageUrl: "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png",
    date: 'March 30, 2025',
    isFeaturedPick: true
  }
];
