import { supabase } from './client-core';

// Get published articles for the public site
export const getPublishedArticles = async (category?: string, limit = 10) => {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching published articles:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No articles found, returning mock data");
      // Return mock data when no data is found
      return [
        {
          id: 'mock-article-1',
          title: 'India vs Australia: 3rd Test Preview',
          excerpt: 'Preview of the upcoming test match between India and Australia',
          cover_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'Match Previews',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-2',
          title: 'Top 10 Players to Watch in IPL 2025',
          excerpt: 'The rising stars to keep an eye on in this IPL season',
          cover_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
          category: 'IPL',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-3',
          title: 'Women\'s World Cup Final Recap',
          excerpt: 'Highlights from the thrilling Women\'s World Cup final',
          cover_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'Women\'s Cricket',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-4',
          title: 'England\'s Tour of India: What to Expect',
          excerpt: 'Preview of the upcoming England tour of India',
          cover_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
          category: 'Match Previews',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-article-5',
          title: 'IPL 2025 Auction Analysis',
          excerpt: 'Breaking down the results of the IPL 2025 auction',
          cover_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
          category: 'IPL',
          content: 'Full content of the article goes here',
          published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    // Return mock data on error
    return [
      {
        id: 'mock-error-article-1',
        title: 'India vs Australia: 3rd Test Preview',
        excerpt: 'Preview of the upcoming test match between India and Australia',
        cover_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop',
        category: 'Match Previews',
        content: 'Full content of the article goes here',
        published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-error-article-2',
        title: 'Top 10 Players to Watch in IPL 2025',
        excerpt: 'The rising stars to keep an eye on in this IPL season',
        cover_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop',
        category: 'IPL',
        content: 'Full content of the article goes here',
        published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
};

// Get a specific article by ID (for public viewing)
export const getArticleById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching article:", error);
      throw error;
    }
    
    if (!data) {
      console.error("No article found with ID:", id);
      return null;
    }
    
    // Process any data transformations needed
    return {
      ...data,
      // Format dates or other fields if needed
      published_at: data.published_at || data.created_at,
      // Use cover_image as the primary image source
      featured_image: data.cover_image || data.featured_image,
      // Default excerpt if none is provided
      excerpt: data.excerpt || data.meta_description || 'Read this exciting cricket article...'
    };
  } catch (error) {
    console.error("Error in getArticleById:", error);
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (category: string) => {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true);
    
    if (category && category !== 'All Categories') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getArticlesByCategory:', error);
    return [];
  }
};

// Get top stories
export const getTopStories = async () => {
  try {
    const { data, error } = await supabase
      .from('top_stories')
      .select('id, article_id, order_index, featured, articles(id, title, excerpt, featured_image, category, published_at)')
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Error fetching top stories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getTopStories:', error);
    return [];
  }
};

// Update top stories
export const updateTopStories = async (items: any[]) => {
  // First delete all existing top stories
  const { error: deleteError } = await supabase
    .from('top_stories')
    .delete()
    .neq('id', 'placeholder'); // Delete all rows
  
  if (deleteError) {
    console.error("Error deleting existing top stories:", deleteError);
    throw deleteError;
  }
  
  // Then insert the new order
  if (items.length > 0) {
    const itemsToInsert = items.map((item, index) => ({
      article_id: item.article_id,
      order_index: index + 1,
      featured: item.featured || false
    }));
    
    const { error: insertError } = await supabase
      .from('top_stories')
      .insert(itemsToInsert);
    
    if (insertError) {
      console.error("Error inserting top stories:", insertError);
      throw insertError;
    }
  }
  
  return true;
};
