
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
  
  // Use direct paths for our known images to avoid loading issues
  const getOptimizedImageUrl = () => {
    if (!imageUrl) return null;
    
    // Map specific article IDs to their known images
    if (id === 'kkr-vs-rcb') {
      return "/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png";
    }
    
    if (id === 'srh-vs-lsg') {
      return "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png";
    }
    
    if (id === 'gt-vs-mi') {
      return "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png";
    }
    
    if (id === 'csk-vs-rcb') {
      return "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png";
    }
    
    if (id === 'rr-vs-csk') {
      return "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png";
    }
    
    // Check if the image URL contains specific identifiers
    if (imageUrl.includes('19133248-8247-4e8c-8615-f3c5b00d9287')) {
      return "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png";
    }
    
    if (imageUrl.includes('412c16d3-2e56-4ea0-b086-deed0e90d189')) {
      return "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png";
    }
    
    if (imageUrl.includes('6c575f57-57f9-4811-804e-0a850a01ef6d')) {
      return "/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png";
    }
    
    if (imageUrl.includes('95f7655d-a0d9-48a3-a64c-a8f362d04b31')) {
      return "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png";
    }
    
    if (imageUrl.includes('e61767b2-868d-47bc-8eb7-911d51239eb1')) {
      return "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png";
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
