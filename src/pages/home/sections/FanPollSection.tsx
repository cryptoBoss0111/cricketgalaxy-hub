
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const FanPollSection = () => {
  return (
    <div className="bg-white dark:bg-cricket-dark/80 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-800 animate-fade-in animate-delay-300">
      <h2 className="text-xl font-heading font-bold mb-4 dark:text-white">Fan Poll</h2>
      <div className="mb-4">
        <p className="font-medium dark:text-gray-200">Who will win IPL 2025?</p>
      </div>
      
      <div className="space-y-3">
        {['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals'].map((team, i) => (
          <div key={i} className="relative">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md h-10 overflow-hidden">
              <div 
                className="bg-cricket-accent h-full rounded-md"
                style={{ width: `${[38, 32, 15, 15][i]}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="font-medium text-sm dark:text-white">{team}</span>
              <span className="font-medium text-sm dark:text-white">{[38, 32, 15, 15][i]}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button variant="accent" className="w-full text-white">
          Cast Your Vote
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">12,845 votes so far</p>
      </div>
    </div>
  );
};
