
import { Filter, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ArticleCard from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { Article } from '../types';

interface NewsContentProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading: boolean;
  filteredArticles: Article[];
  searchQuery: string;
}

const NewsContent = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  isLoading,
  filteredArticles,
  searchQuery
}: NewsContentProps) => {
  return (
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
          <LoadingArticles />
        ) : filteredArticles.length > 0 ? (
          <ArticleGrid articles={filteredArticles} />
        ) : (
          <NoResults setSelectedCategory={setSelectedCategory} />
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
  );
};

const LoadingArticles = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((_, index) => (
      <div key={index} className="article-card animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
        <div className="p-5 space-y-3 bg-white dark:bg-cricket-dark/80">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const ArticleGrid = ({ articles }: { articles: Article[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          id={article.id}
          title={article.title}
          excerpt={article.excerpt || ''}
          imageUrl={article.imageUrl}
          cover_image={article.cover_image}
          featured_image={article.featured_image}
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
  );
};

const NoResults = ({ setSelectedCategory }: { setSelectedCategory: (category: string) => void }) => (
  <div className="text-center py-16">
    <div className="bg-gray-100 dark:bg-gray-800 inline-flex rounded-full p-6 mb-4">
      <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-xl font-semibold mb-2 dark:text-white">No results found</h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
      We couldn't find any articles matching your search criteria. Try different keywords or filters.
    </p>
    <Button 
      variant="outline" 
      onClick={() => {
        setSelectedCategory('All Categories');
      }}
    >
      Clear Filters
    </Button>
  </div>
);

export default NewsContent;
