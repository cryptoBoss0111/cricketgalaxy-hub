
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
  
  // Optimize image loading by using a more efficient mapping system
  const getOptimizedImageUrl = () => {
    if (!imageUrl) return '/placeholder.svg';
    
    // Direct mapping using object lookup for better performance
    const imageMap: Record<string, string> = {
      'kkr-vs-rcb': "/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png",
      'srh-vs-lsg': "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png",
      'gt-vs-mi': "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png", 
      'csk-vs-rcb': "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png",
      'rr-vs-csk': "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png"
    };
    
    // Check if we have a direct mapping for this article ID
    if (typeof id === 'string' && imageMap[id]) {
      return imageMap[id];
    }
    
    // Check for image URL identifiers
    const patterns = [
      { pattern: '19133248-8247-4e8c-8615-f3c5b00d9287', url: "/lovable-uploads/19133248-8247-4e8c-8615-f3c5b00d9287.png" },
      { pattern: '412c16d3-2e56-4ea0-b086-deed0e90d189', url: "/lovable-uploads/412c16d3-2e56-4ea0-b086-deed0e90d189.png" },
      { pattern: '6c575f57-57f9-4811-804e-0a850a01ef6d', url: "/lovable-uploads/6c575f57-57f9-4811-804e-0a850a01ef6d.png" },
      { pattern: '95f7655d-a0d9-48a3-a64c-a8f362d04b31', url: "/lovable-uploads/95f7655d-a0d9-48a3-a64c-a8f362d04b31.png" },
      { pattern: 'e61767b2-868d-47bc-8eb7-911d51239eb1', url: "/lovable-uploads/e61767b2-868d-47bc-8eb7-911d51239eb1.png" },
      { pattern: 'ba068302-d7ba-4cdd-9735-cc9aac148031', url: "/lovable-uploads/ba068302-d7ba-4cdd-9735-cc9aac148031.png" },
      { pattern: '8dca24c4-f648-4d13-b9d7-5227f02fc2ff', url: "/lovable-uploads/8dca24c4-f648-4d13-b9d7-5227f02fc2ff.png" }
    ];
    
    // Check if the URL matches any of our known patterns
    for (const { pattern, url } of patterns) {
      if (imageUrl.includes(pattern)) {
        return url;
      }
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
        src={error ? "/placeholder.svg" : optimizedImageUrl}
        alt={title}
        className={cn(
          "w-full h-48 object-cover transition-transform duration-300 hover:scale-105",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Load images immediately for better user experience
        fetchPriority="high" // Higher priority for article images
      />
      
      <div className="absolute top-3 left-3">
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded">
          {category}
        </span>
      </div>
    </Link>
  );
};
