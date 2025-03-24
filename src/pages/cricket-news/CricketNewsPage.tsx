
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LiveMatchesBar from '@/components/LiveMatchesBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import HeroSection from './components/HeroSection';
import NewsContent from './components/NewsContent';
import NewsletterSection from './components/NewsletterSection';
import { useArticles } from './hooks/useArticles';
import { getCategoryFromPath } from './utils/categoryUtils';

const CricketNewsPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('latest');
  
  // Set the category based on the current route
  useEffect(() => {
    const pathCategory = location.pathname.split('/').pop();
    const category = getCategoryFromPath(pathCategory);
    setSelectedCategory(category);
  }, [location.pathname]);
  
  // Use our custom hook to fetch and filter articles
  const { filteredArticles, categories, isLoading } = useArticles(
    selectedCategory,
    searchQuery,
    sortBy
  );
  
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
          filteredArticles={filteredArticles}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
        />
        <NewsletterSection />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

export default CricketNewsPage;
