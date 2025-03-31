
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Search, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useChatbot } from '@/contexts/ChatbotContext';
import AdminLoginButton from "./AdminLoginButton";

interface NavLinkItem {
  label: string;
  path: string;
}

const navLinks: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Cricket News', path: '/cricket-news' },
  { label: 'Match Previews', path: '/match-previews' },
  { label: 'Match Reviews', path: '/match-reviews' },
  { label: 'Fantasy Tips', path: '/fantasy-tips' },
  { label: 'Live Scores', path: '/live-scores' },
  { label: 'IPL 2025', path: '/ipl-2025' },
  { label: 'IPL Teams', path: '/ipl-teams' }
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { toggleChatbot } = useChatbot();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
        duration: 3000,
      });
      setSearchQuery('');
    }
  };

  return (
    <header className={cn(
      "sticky top-12 left-0 right-0 z-40 bg-cricket-dark text-white transition-all duration-300",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-center">
              <div className="text-xs text-cricket-accent font-medium mb-0.5">
                Namaste 🙏🏻
              </div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
                CricketExpress
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1 mx-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "nav-link",
                    isActive ? "nav-link-active" : ""
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] rounded-full bg-muted pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full rounded-full"
              >
                <Search size={18} />
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <AdminLoginButton />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChatbot}
                className="relative"
              >
                <MessageSquare size={20} />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-cricket-accent rounded-full animate-pulse-subtle"></span>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <div className="text-xs text-cricket-accent font-medium mb-0.5">
                        Namaste 🙏🏻
                      </div>
                      <span className="text-xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
                        CricketExpress
                      </span>
                    </div>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X size={18} />
                      </Button>
                    </SheetTrigger>
                  </div>
                  
                  <form onSubmit={handleSearch} className="flex items-center relative mb-6">
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-full bg-muted pr-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-0 top-0 h-full rounded-full"
                    >
                      <Search size={18} />
                    </Button>
                  </form>
                  
                  <nav className="flex flex-col space-y-1">
                    {navLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            "px-4 py-2 rounded-md transition-colors",
                            isActive 
                              ? "bg-cricket-accent text-white"
                              : "hover:bg-muted"
                          )
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
