
import { Link } from 'react-router-dom';
import { BarChart2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { quickStats } from '../data/homeData';

export const QuickStatsSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart2 className="text-cricket-accent h-6 w-6" />
        <h2 className="text-xl font-heading font-bold">Quick Stats</h2>
      </div>
      
      <div className="space-y-4">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            className={cn(
              "p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors animate-fade-in",
              index === 0 ? "animate-delay-100" : "",
              index === 1 ? "animate-delay-200" : "",
              index === 2 ? "animate-delay-300" : "",
              index === 3 ? "animate-delay-400" : ""
            )}
          >
            <div className="text-gray-500 text-xs mb-1">{stat.label}</div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{stat.value}</span>
              <span className="text-cricket-accent text-sm">{stat.detail}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Link 
          to="/stats" 
          className="text-cricket-accent hover:text-cricket-accent/80 text-sm font-medium flex items-center justify-center"
        >
          View All Statistics <ExternalLink size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};
