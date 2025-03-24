
import React from 'react';
import { cn } from '@/lib/utils';
import { ArticleImage } from './ArticleImage';
import { ArticleContent } from './ArticleContent';

interface ArticleCardProps {
  id: string | number;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category: string;
  author: string;
  date: string;
  timeToRead?: string;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  date,
  timeToRead,
  className,
}) => {
  return (
    <article className={cn(
      "article-card flex flex-col h-full bg-white dark:bg-cricket-dark/80 border border-gray-100 dark:border-gray-800 shadow-soft hover:shadow-lg transition-all duration-300",
      className
    )}>
      <ArticleImage 
        id={id}
        title={title}
        imageUrl={imageUrl}
        category={category}
      />
      
      <ArticleContent
        id={id}
        title={title}
        excerpt={excerpt}
        author={author}
        date={date}
        timeToRead={timeToRead}
      />
    </article>
  );
};

export default ArticleCard;
