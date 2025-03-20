
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  timeToRead?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'horizontal';
}

export const ArticleCard = ({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  date,
  timeToRead,
  className,
  variant = 'default'
}: ArticleCardProps) => {
  // Use a default image if none is provided
  const displayImage = imageUrl || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop';
  
  return (
    <Link
      to={`/article/${id}`}
      className={cn(
        "group block overflow-hidden transition-all duration-300",
        variant === 'featured' ? 'article-card h-full' : 'article-card',
        variant === 'horizontal' ? 'flex flex-col md:flex-row' : '',
        className
      )}
    >
      <div 
        className={cn(
          "relative overflow-hidden",
          variant === 'horizontal' ? 'md:w-1/3 h-48 md:h-auto' : 'h-48 md:h-56',
          variant === 'featured' ? 'h-56 md:h-64' : ''
        )}
      >
        <img 
          src={displayImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge 
          className="absolute top-3 left-3 bg-cricket-accent hover:bg-cricket-accent/90 text-xs font-medium"
        >
          {category}
        </Badge>
      </div>
      
      <div 
        className={cn(
          "p-5",
          variant === 'horizontal' ? 'md:w-2/3' : '',
          variant === 'featured' ? 'p-6' : ''
        )}
      >
        <h3 
          className={cn(
            "font-heading font-semibold text-gray-900 transition-colors group-hover:text-cricket-accent line-clamp-2 mb-2",
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
          )}
        >
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {excerpt}
        </p>
        
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-3">{author}</span>
          <span className="mr-3">•</span>
          <span className="mr-3">{date}</span>
          {timeToRead && (
            <>
              <span className="mr-3">•</span>
              <span>{timeToRead}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
