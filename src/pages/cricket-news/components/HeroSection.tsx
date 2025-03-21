
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  selectedCategory: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const HeroSection = ({ 
  selectedCategory, 
  searchQuery, 
  setSearchQuery, 
  handleSearch 
}: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-cricket-dark to-cricket-accent/90 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {selectedCategory !== 'All Categories' ? selectedCategory : 'Cricket News'}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Stay updated with the latest {selectedCategory !== 'All Categories' ? selectedCategory.toLowerCase() : 'cricket news'}, team updates, and trending stories
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
  );
};

export default HeroSection;
