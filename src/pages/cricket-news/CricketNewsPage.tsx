
import React, { useState } from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ArticleCard from '@/components/article-card';
import HeroSection from './components/HeroSection';
import NewsletterSection from './components/NewsletterSection';
import Navbar from '@/components/Navbar';
import { useArticles } from './hooks/useArticles';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const CricketNewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const { articles, filteredArticles, categories, isLoading } = useArticles(selectedCategory, searchQuery, sortBy);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useArticles hook
  };

  // Filter for only IPL 2025 articles for the special section
  const iplArticles = articles.filter(article => article.category === 'IPL 2025');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cricket-dark">
      <Navbar />
      
      <main>
        <HeroSection 
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        
        <div className="container mx-auto px-4 py-12">
          {/* IPL 2025 Section */}
          {iplArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8 border-b-2 border-cricket-accent pb-2">IPL 2025 Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {iplArticles.map((article) => (
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
                    className="h-full"
                  />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button asChild variant="outline">
                  <a href="/ipl-2025">View All IPL 2025 Coverage</a>
                </Button>
              </div>
            </div>
          )}
          
          {/* All Articles Section */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 border-b-2 border-cricket-accent pb-2">
                  {selectedCategory !== 'All Categories' ? selectedCategory : 'All Cricket News'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} 
                  {selectedCategory !== 'All Categories' ? ` in ${selectedCategory}` : ''}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-500 dark:text-gray-400 h-4 w-4" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="text-gray-500 dark:text-gray-400 h-4 w-4" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-xl"></div>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No articles found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters or search query</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory('All Categories');
                      setSearchQuery('');
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
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
                      className="h-full"
                    />
                  ))}
                </div>
              )}
            </div>
            
            {!isLoading && filteredArticles.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <NewsletterSection />
      </main>
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default CricketNewsPage;
