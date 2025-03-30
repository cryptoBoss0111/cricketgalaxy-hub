
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
  
  // Use direct local paths for better performance
  // Avoid API calls for these specific images
  const getOptimizedImageUrl = () => {
    if (!imageUrl) return null;
    
    // Use direct paths for our known uploaded images
    if (imageUrl.includes('19133248-8247-4e8c-8615-f3c5b00d9287')) {
      return "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png";
    }
    
    if (imageUrl.includes('412c16d3-2e56-4ea0-b086-deed0e90d189')) {
      return "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png";
    }
    
    return imageUrl;
  };
  
  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
    console.error(`Failed to load image for: ${title}`);
  };

  const optimizedImageUrl = getOptimizedImageUrl();

  return (
    <Link to={`/article/${id}`} className="block relative overflow-hidden aspect-video bg-gray-100">
      {/* Show skeleton while loading */}
      {isLoading && (
        <Skeleton className="w-full h-48 object-cover" />
      )}
      
      {/* Display the image with error handling */}
      <img 
        src={error ? "/placeholder.svg" : optimizedImageUrl || "/placeholder.svg"}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-300 hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Load images immediately for these important articles
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
