
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import Chatbot from '@/components/Chatbot';
import { cn } from '@/lib/utils';

// Sample data
const newsArticles = [
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

const categories = [
  'All Categories',
  'IPL 2025',
  'International',
  'Domestic',
  'Women\'s Cricket',
  'Analysis',
  'Global Cricket'
];

const CricketNewsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  const [filteredArticles, setFilteredArticles] = useState(newsArticles);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter articles based on search query and selected category
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...newsArticles];
      
      // Filter by search query
      if (searchQuery) {
        results = results.filter(
          article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by category
      if (selectedCategory !== 'All Categories') {
        results = results.filter(article => article.category === selectedCategory);
      }
      
      // Sort articles
      if (sortBy === 'latest') {
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (sortBy === 'oldest') {
        results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      
      setFilteredArticles(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };
  
  return (
    <>
      <LiveMatchesBar />
      <Navbar />
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-cricket-dark to-cricket-accent/90 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Cricket News</h1>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                Stay updated with the latest cricket news, team updates, and trending stories
              </p>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Search news articles..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="h-12 px-8 bg-white text-cricket-accent hover:bg-white/90">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>
        
        {/* Filters and Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-1">
                <Filter className="text-cricket-accent h-5 w-5" />
                <span className="font-semibold">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedCategory === category 
                        ? "bg-cricket-accent hover:bg-cricket-accent/90" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort:</span>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="mb-8" />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="article-card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    imageUrl={article.imageUrl}
                    category={article.category}
                    author={article.author}
                    date={article.date}
                    timeToRead={article.timeToRead}
                    className={cn(
                      "animate-fade-in",
                      index % 3 === 0 ? "animate-delay-100" : "",
                      index % 3 === 1 ? "animate-delay-200" : "",
                      index % 3 === 2 ? "animate-delay-300" : ""
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-100 inline-flex rounded-full p-6 mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any articles matching your search criteria. Try different keywords or filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {filteredArticles.length > 0 && !isLoading && (
              <div className="mt-12 text-center">
                <Button variant="outline" className="border-cricket-accent text-cricket-accent hover:bg-cricket-accent/10">
                  Load More Articles <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-16 bg-cricket-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Never Miss A Story</h2>
              <p className="text-gray-300 mb-8">
                Subscribe to our newsletter to receive daily cricket news updates directly in your inbox.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button className="bg-cricket-accent hover:bg-cricket-accent/90">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default CricketNewsPage;
