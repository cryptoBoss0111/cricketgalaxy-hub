import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import LoginButton from "./LoginButton";
import UserProfile from "./UserProfile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/cricket-news' },
    { name: 'Players', href: '/players' },
    { name: 'Matches', href: '/matches' },
    { name: 'Fantasy Picks', href: '/fantasy-picks' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
          
      <div className="container px-4 mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center font-semibold">
          <Icons.logo className="mr-2 h-6 w-6" />
          <span className="hidden sm:inline-block">{siteConfig.name}</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <LoginButton />
          <UserProfile />
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-3/4 md:w-2/5">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore the CricketExpress
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "justify-start",
                        location.pathname === item.href ? "font-semibold" : "font-normal"
                      )}
                      asChild
                    >
                      <Link to={item.href}>{item.name}</Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    location.pathname === item.href ? "font-semibold" : "font-normal"
                  )}
                  asChild
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      
    </nav>
  );
}

export default Navbar;
