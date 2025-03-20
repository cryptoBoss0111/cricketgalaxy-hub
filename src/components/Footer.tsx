
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export const Footer = () => {
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = new FormData(form).get('email') as string;
    
    if (email) {
      toast({
        title: "Subscription successful!",
        description: "You've been added to our newsletter.",
        duration: 3000,
      });
      form.reset();
    }
  };

  return (
    <footer className="bg-cricket-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
                CricketExpress
              </span>
            </Link>
            <p className="text-gray-300 mb-6">
              Your premier destination for cricket news, match updates, and in-depth analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-cricket-accent transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cricket-news" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Cricket News
                </Link>
              </li>
              <li>
                <Link to="/match-reviews" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Match Reviews
                </Link>
              </li>
              <li>
                <Link to="/fantasy-tips" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Fantasy Tips
                </Link>
              </li>
              <li>
                <Link to="/ipl-2025" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  IPL 2025
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">More Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/player-profiles" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Player Profiles
                </Link>
              </li>
              <li>
                <Link to="/womens-cricket" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Women's Cricket
                </Link>
              </li>
              <li>
                <Link to="/world-cup" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  World Cup & ICC
                </Link>
              </li>
              <li>
                <Link to="/match-previews" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Match Previews
                </Link>
              </li>
              <li>
                <a href="/admin" className="text-gray-300 hover:text-white transition-colors hover:pl-1 duration-200 flex items-center">
                  <ArrowRight size={14} className="mr-2 text-cricket-accent" />
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Get the latest cricket updates directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <Input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button type="submit" className="bg-cricket-accent hover:bg-cricket-accent/90">
                Subscribe <Mail size={16} className="ml-2" />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CricketExpress. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white mb-2 md:mb-0">Terms of Service</a>
            <a href="#" className="hover:text-white mb-2 md:mb-0">Privacy Policy</a>
            <a href="#" className="hover:text-white mb-2 md:mb-0">Cookie Policy</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
