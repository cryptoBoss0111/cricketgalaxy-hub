
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleImageProps {
  id: string | number;
  title: string;
  imageUrl?: string;
  category: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  id,
  title,
  imageUrl,
  category
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  
  // Use a reliable fallback image 
  const fallbackImage = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop";
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video bg-gray-100">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={error ? fallbackImage : imageUrl || fallbackImage}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-500 hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
