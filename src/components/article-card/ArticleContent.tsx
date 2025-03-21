
import React from 'react';
import { Link } from 'react-router-dom';

interface ArticleContentProps {
  id: string | number;
  title: string;
  excerpt?: string;
  author: string;
  date: string;
  timeToRead?: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  id,
  title,
  excerpt,
  author,
  date,
  timeToRead
}) => {
  return (
    <div className="flex flex-col flex-grow p-4">
      <div className="flex-grow">
        <Link to={`/article/${id}`} className="block mb-2">
          <h3 className="text-lg font-heading font-semibold leading-tight hover:text-cricket-accent dark:text-white dark:hover:text-cricket-accent">
            {title}
          </h3>
        </Link>
        
        {excerpt && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {date}
        </span>
        <div className="flex items-center">
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            By {author}
          </span>
          {timeToRead && (
            <span className="text-gray-500 dark:text-gray-400 text-xs ml-2">
              • {timeToRead}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
