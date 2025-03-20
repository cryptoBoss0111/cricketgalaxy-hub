
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your cricket assistant. Ask me anything about cricket matches, players, or statistics!',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
    
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [isOpen, isMinimized, messages]);
  
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // In a real implementation, we would call the Gemini API here
      // For now, we'll simulate a response
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a cricket-related response
      let response = "I'm sorry, I don't have information about that specific cricket topic.";
      
      if (message.toLowerCase().includes("score") || message.toLowerCase().includes("match")) {
        response = "The latest match between India and Australia ended with India winning by 5 wickets. Virat Kohli scored 82 runs and was named player of the match.";
      } else if (message.toLowerCase().includes("ipl") || message.toLowerCase().includes("2025")) {
        response = "IPL 2025 is scheduled to start in March 2025. The defending champions are Chennai Super Kings who defeated Rajasthan Royals in the 2024 final.";
      } else if (message.toLowerCase().includes("player") || message.toLowerCase().includes("batsman") || message.toLowerCase().includes("bowler")) {
        response = "The current ICC rankings have Joe Root as the top Test batsman, with Jasprit Bumrah leading the bowling rankings. In T20Is, Suryakumar Yadav is the top-ranked batsman.";
      } else if (message.toLowerCase().includes("world cup")) {
        response = "The next ICC Cricket World Cup will be held in 2027 and will be co-hosted by South Africa, Zimbabwe and Namibia. The last World Cup was won by Australia in 2023.";
      } else if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
        response = "Hello! I'm your cricket assistant. How can I help you today with cricket information?";
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) {
    return (
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-cricket-accent hover:bg-cricket-accent/90 shadow-lg z-50"
      >
        <MessageSquare className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse-subtle"></span>
      </Button>
    );
  }
  
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 w-[380px] rounded-2xl bg-white shadow-xl z-50 overflow-hidden transition-all duration-300 border border-gray-200",
        isMinimized ? "h-16" : "h-[500px]"
      )}
    >
      <div className="flex items-center justify-between bg-cricket-accent text-white p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-white/20">
            <MessageSquare className="h-4 w-4" />
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">Cricket Assistant</h3>
            <p className="text-xs text-white/70">Ask me about matches & stats</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-7 w-7 text-white hover:bg-white/20">
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleChatbot} className="h-7 w-7 text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <ScrollArea className="h-[390px] p-4" ref={scrollAreaRef}>
            <div className="flex flex-col space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex max-w-[85%] animate-enter",
                    msg.role === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 bg-cricket-accent text-white">
                      <MessageSquare className="h-4 w-4" />
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-xl p-3 text-sm",
                      msg.role === 'user'
                        ? "bg-cricket-accent text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    )}
                  >
                    {msg.content}
                    <div
                      className={cn(
                        "text-[10px] mt-1 text-right",
                        msg.role === 'user' ? "text-white/70" : "text-gray-500"
                      )}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {msg.role === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 bg-gray-200">
                      <div className="text-xs font-medium">You</div>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex max-w-[85%] mr-auto animate-enter">
                  <Avatar className="h-8 w-8 mr-2 mt-1 bg-cricket-accent text-white">
                    <MessageSquare className="h-4 w-4" />
                  </Avatar>
                  <div className="rounded-xl p-3 text-sm bg-gray-100 text-gray-800 rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-cricket-accent" />
                      <span className="text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about cricket..."
                className="flex-1 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-cricket-accent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-cricket-accent hover:bg-cricket-accent/90"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot;
