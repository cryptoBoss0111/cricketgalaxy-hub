
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
    // Prioritizing the new articles (RCB vs DC, GT vs MI, CSK vs RCB, RR vs CSK) in the hero slider
    const prioritizedArticles = mockNewsArticles
      .filter(article => article.id === "rcb-vs-dc" || article.id === "gt-vs-mi" || article.id === "csk-vs-rcb" || article.id === "rr-vs-csk" || article.id === "dc-vs-srh")
      .sort((a, b) => {
        // Specific ordering for the hero slider
        const orderPriority: Record<string, number> = {
          "rcb-vs-dc": 1, // Making the new RCB vs DC article the first in the slider
          "rr-vs-csk": 2,
          "gt-vs-mi": 3,
          "csk-vs-rcb": 4,
          "dc-vs-srh": 5
        };
        return (orderPriority[a.id] || 99) - (orderPriority[b.id] || 99);
      });
    
    return prioritizedArticles.map(article => ({
      id: String(article.id), // Convert id to string to match HeroArticle type
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
    id: 'rcb-vs-dc',
    title: "Royal Challengers Bengaluru vs. Delhi Capitals – RCB's Bengaluru Bash Tonight!",
    excerpt: "What's good, bro? Today, April 10, 2025, IPL 2025's top story is Match 24—Royal Challengers Bengaluru (RCB) vs. Delhi Capitals (DC) at M Chinnaswamy Stadium, kicking off at 7:30 PM IST.",
    category: 'IPL 2025',
    imageUrl: "/lovable-uploads/8ec5d63f-24a2-4a4d-a9f6-6cf819b80504.png",
    date: 'April 10, 2025',
    isFeaturedPick: true
  },
  {
    id: 'rr-vs-csk',
    title: "Rajasthan Royals vs. Chennai Super Kings – Guwahati's Double-Header Heat!",
    excerpt: "Yo, squad! March 30, 2025, was a double-header day, and the evening top story—Match 11—saw Rajasthan Royals (RR) vs. Chennai Super Kings (CSK) in Guwahati. Barsapara Stadium was electric, and this clash was pure vibes.",
    category: 'IPL 2025',
    imageUrl: "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png",
    date: 'March 30, 2025',
    isFeaturedPick: true
  },
  {
    id: 'gt-vs-mi',
    title: "Gujarat Titans vs. Mumbai Indians – MI's Redemption Smackdown!",
    excerpt: "Yo, cricket fam! It's March 29, 2025, and the IPL 2025 top story rewind takes us to Ahmedabad, where Gujarat Titans (GT) and Mumbai Indians (MI) threw down at Narendra Modi Stadium. This Match 9 clash was MI's shot at redemption after a rough start.",
    category: 'IPL 2025',
    imageUrl: "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png",
    date: 'March 29, 2025',
    isFeaturedPick: true
  }
];
