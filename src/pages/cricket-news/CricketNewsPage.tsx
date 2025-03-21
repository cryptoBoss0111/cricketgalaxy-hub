
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import HeroSection from './components/HeroSection';
import NewsContent from './components/NewsContent';
import NewsletterSection from './components/NewsletterSection';
import { Article } from './types';

const CricketNewsPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const pathCategory = location.pathname.split('/').pop();
    
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
    
    if (pathCategory && categoryMap[pathCategory]) {
      setSelectedCategory(categoryMap[pathCategory]);
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching articles from Supabase');
        const { data: articlesData, error } = await supabase
          .from('articles')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching articles:', error);
          toast({
            title: 'Error fetching articles',
            description: error.message,
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Fetched articles:', articlesData);
        
        if (articlesData && articlesData.length > 0) {
          const uniqueCategories = [...new Set(articlesData.map(article => article.category))];
          setCategories(['All Categories', ...uniqueCategories]);
          
          const transformedArticles: Article[] = articlesData.map((article: Tables<'articles'>) => {
            console.log('Article image data:', {
              featured_image: article.featured_image,
              cover_image: article.cover_image
            });
            
            return {
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || article.meta_description || 'Read this exciting story...',
              imageUrl: article.featured_image || article.cover_image || 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
              category: article.category,
              author: 'CricketExpress Staff',
              date: new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              timeToRead: `${Math.ceil(article.content.length / 1000)} min read`
            };
          });
          
          console.log('Transformed articles:', transformedArticles);
          setArticles(transformedArticles);
        } else {
          console.log('No articles found, using mock data');
          setArticles(mockNewsArticles);
          
          const uniqueCategories = [...new Set(mockNewsArticles.map(article => article.category))];
          setCategories(['All Categories', ...uniqueCategories]);
        }
      } catch (err) {
        console.error('Error in fetching articles:', err);
        setArticles(mockNewsArticles);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, [toast]);
  
  useEffect(() => {
    let results = [...articles];
    
    if (searchQuery) {
      results = results.filter(
        article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All Categories') {
      results = results.filter(article => article.category === selectedCategory);
    }
    
    if (sortBy === 'latest') {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'oldest') {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    setFilteredArticles(results);
  }, [searchQuery, selectedCategory, sortBy, articles]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <>
      <LiveMatchesBar />
      <Navbar />
      <main>
        <HeroSection 
          selectedCategory={selectedCategory} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <NewsContent 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isLoading={isLoading}
          filteredArticles={filteredArticles}
          searchQuery={searchQuery}
        />
        <NewsletterSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

// Export mock news articles for fallback
const mockNewsArticles = [
  {
    id: '1',
    title: 'IPL: Bumrah\'s early absence \'a challenge\', says Jayawardene',
    excerpt: 'Mumbai Indians head coach discusses the impact of missing their star bowler for the initial matches.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Vishal Dikshit',
    date: 'Mar 19, 2025',
    timeToRead: '5 min read'
  },
  {
    id: '2',
    title: 'Is cricket ready for a Saudi-backed Grand Slam circuit?',
    excerpt: 'Exploring the possibilities and implications of Saudi investment in creating a new cricket tournament structure.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'Global Cricket',
    author: 'Osman Samiuddin',
    date: 'Mar 18, 2025',
    timeToRead: '8 min read'
  },
  {
    id: '3',
    title: 'IPL: SKY to lead MI in opener with Hardik suspended',
    excerpt: 'Suryakumar Yadav will captain Mumbai Indians in their opening match of IPL 2025 after Hardik Pandya received a one-match suspension.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Vishal Dikshit',
    date: 'Mar 19, 2025',
    timeToRead: '4 min read'
  },
  {
    id: '4',
    title: 'Tension between Khawaja and Queensland ahead of Shield final',
    excerpt: 'Star batsman at odds with state team ahead of crucial domestic fixture, with selection controversy brewing.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'Domestic',
    author: 'Alex Malcolm',
    date: 'Mar 18, 2025',
    timeToRead: '6 min read'
  },
  {
    id: '5',
    title: 'Refreshed Devine sets sights on World Cup double',
    excerpt: 'New Zealand captain targeting success in both T20 and ODI World Cups after taking a mental health break.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'Women\'s Cricket',
    author: 'Valkerie Baynes',
    date: 'Mar 17, 2025',
    timeToRead: '5 min read'
  },
  {
    id: '6',
    title: 'IPL 2025, a season soaked in soap-opera intrigue',
    excerpt: 'The upcoming IPL season promises more drama and unexpected twists with captaincy changes and team reshuffles.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Alagappan Muthu',
    date: 'Mar 18, 2025',
    timeToRead: '7 min read'
  },
  {
    id: '7',
    title: 'India\'s white-ball wizards need a new cheat code for sustained excellence',
    excerpt: 'After the T20 World Cup triumph, the team faces new challenges in maintaining their dominance.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'Analysis',
    author: 'Vishal Dikshit',
    date: 'Mar 19, 2025',
    timeToRead: '6 min read'
  },
  {
    id: '8',
    title: 'Kohli\'s U-19 World Cup team-mate Srivastava returns to IPL as umpire',
    excerpt: 'Former player completes remarkable career transition to become an official in the tournament.',
    imageUrl: 'https://images.unsplash.com/photo-1624971497044-3b338527dc4c?q=80&w=600&auto=format&fit=crop',
    category: 'IPL 2025',
    author: 'Sidharth Monga',
    date: 'Mar 16, 2025',
    timeToRead: '4 min read'
  }
];

export default CricketNewsPage;
