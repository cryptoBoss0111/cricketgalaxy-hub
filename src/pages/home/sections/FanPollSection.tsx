
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface FanPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

export const FanPollSection = () => {
  const [poll, setPoll] = useState<FanPoll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivePoll();

    // Check if user has already voted
    const votedPolls = localStorage.getItem('voted_polls');
    if (votedPolls) {
      const pollsArray = JSON.parse(votedPolls);
      if (poll && pollsArray.includes(poll.id)) {
        setHasVoted(true);
      }
    }
  }, [poll?.id]);

  const fetchActivePoll = async () => {
    setIsLoading(true);
    try {
      // Get the active poll
      const { data: pollData, error: pollError } = await supabase
        .from('fan_polls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (pollError) {
        console.error('Error fetching poll:', pollError);
        setIsLoading(false);
        return;
      }

      if (!pollData) {
        // No active poll found
        setIsLoading(false);
        return;
      }

      // Get vote counts for this poll
      const { data: voteData, error: voteError } = await supabase
        .from('poll_votes')
        .select('option_id, count')
        .eq('poll_id', pollData.id)
        .select();

      if (voteError) {
        console.error('Error fetching votes:', voteError);
      }

      // Count votes per option and calculate percentages
      const voteCounts: Record<string, number> = {};
      voteData?.forEach((vote) => {
        voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
      });

      const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0) || 0;

      // Process the options
      const processedOptions = pollData.options.map((option: any) => {
        const votes = voteCounts[option.id] || 0;
        return {
          id: option.id,
          text: option.text,
          votes,
          percentage: totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
        };
      });

      setPoll({
        id: pollData.id,
        question: pollData.question,
        options: processedOptions,
        totalVotes
      });
    } catch (error) {
      console.error('Error in fetchActivePoll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !poll || hasVoted) return;

    setIsSubmitting(true);
    try {
      // Record the vote
      const { error } = await supabase.from('poll_votes').insert({
        poll_id: poll.id,
        option_id: selectedOption,
        ip_address: '0.0.0.0' // In a real app, you'd use the user's IP
      });

      if (error) {
        throw error;
      }

      // Save to localStorage that the user has voted
      const votedPolls = localStorage.getItem('voted_polls') ? 
        JSON.parse(localStorage.getItem('voted_polls')!) : [];
      
      if (!votedPolls.includes(poll.id)) {
        votedPolls.push(poll.id);
        localStorage.setItem('voted_polls', JSON.stringify(votedPolls));
      }

      setHasVoted(true);
      toast({
        title: 'Vote Recorded',
        description: 'Thank you for participating in our poll!',
      });

      // Refresh the poll data
      fetchActivePoll();
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading or no poll found
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-cricket-dark/80 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white dark:bg-cricket-dark/80 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-heading font-bold mb-4 dark:text-white">Fan Poll</h2>
        <p className="text-gray-500 dark:text-gray-400">No active polls at the moment. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-cricket-dark/80 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-gray-800 animate-fade-in animate-delay-300">
      <h2 className="text-xl font-heading font-bold mb-4 dark:text-white">Fan Poll</h2>
      <div className="mb-4">
        <p className="font-medium dark:text-gray-200">{poll.question}</p>
      </div>
      
      <div className="space-y-3">
        {poll.options.map((option) => (
          <div 
            key={option.id} 
            className={cn(
              "relative cursor-pointer transition-colors",
              hasVoted ? "cursor-default" : "",
              selectedOption === option.id && !hasVoted ? "ring-2 ring-cricket-accent" : ""
            )}
            onClick={() => !hasVoted && setSelectedOption(option.id)}
          >
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md h-10 overflow-hidden">
              <div 
                className="bg-cricket-accent h-full rounded-md transition-all duration-500"
                style={{ width: `${option.percentage}%` }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="font-medium text-sm dark:text-white">{option.text}</span>
              <span className="font-medium text-sm dark:text-white">{option.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        {!hasVoted ? (
          <Button 
            variant="accent" 
            className="w-full" 
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Cast Your Vote'}
          </Button>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thanks for voting! Results updated in real-time.
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'} so far
        </p>
      </div>
    </div>
  );
};
