
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

// Create site config
const siteConfig = {
  name: "CricketExpress"
};

// Create Icons component
const Icons = {
  logo: ({ className, ...props }: React.ComponentProps<"svg">) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
      {...props}
    >
      <path d="M5.13778 17C5.28376 17 5.43059 17.0194 5.57827 17.0583C5.72595 17.0971 5.86583 17.1553 5.99789 17.2329C6.12996 17.3105 6.24368 17.4074 6.33905 17.5238C6.43441 17.6401 6.5 17.7758 6.5 17.9307C6.5 18.0856 6.43441 18.2213 6.30323 18.3376C6.17206 18.454 6.02259 18.5509 5.8548 18.6285C5.68702 18.7061 5.50421 18.7838 5.30639 18.8421C5.10856 18.9004 4.91074 18.9587 4.71291 19.017L5.6898 21H4.43531L3.67329 19.3042H2.66142V21H1.5V17H5.13778ZM2.66142 18.307H3.60587C3.70835 18.307 3.81998 18.2971 3.93076 18.2776C4.04153 18.2582 4.14402 18.2252 4.2382 18.1786C4.33239 18.1319 4.40828 18.0739 4.46588 18.0045C4.52347 17.935 4.55227 17.8517 4.55227 17.7545C4.55227 17.6671 4.52347 17.5935 4.46588 17.5336C4.40828 17.4737 4.33239 17.4254 4.2382 17.3886C4.14402 17.3519 4.04153 17.3249 3.93076 17.3078C3.81998 17.2907 3.70835 17.2822 3.60587 17.2822H2.66142V18.307Z" />
      <path d="M10.2979 18.9392V21H7.5V17H10.2268C10.4423 17 10.6519 17.0331 10.8557 17.0993C11.0594 17.1655 11.2393 17.2639 11.3952 17.3944C11.5511 17.525 11.6773 17.6853 11.7737 17.8754C11.8701 18.0654 11.9183 18.2852 11.9183 18.5348C11.9183 18.6752 11.8968 18.8123 11.8539 18.9459C11.8109 19.0795 11.7515 19.2031 11.6755 19.3166C11.5994 19.4301 11.511 19.5302 11.4102 19.6168C11.3094 19.7035 11.2006 19.7712 11.0838 19.8201L12 21H10.6577L9.86592 19.8938H9.13625V18.9392H10.2979ZM9.13625 18.657H10.0651C10.1641 18.657 10.2541 18.6354 10.3351 18.5921C10.4161 18.5488 10.4809 18.4905 10.5295 18.4173C10.5781 18.344 10.6024 18.2607 10.6024 18.1675C10.6024 18.0743 10.5781 17.9919 10.5295 17.9203C10.4809 17.8487 10.4161 17.792 10.3351 17.7502C10.2541 17.7085 10.1641 17.6877 10.0651 17.6877H9.13625V18.657Z" />
      <path d="M12.5 17H15C15.4975 17 15.915 17.1317 16.2525 17.3952C16.59 17.6587 16.7587 18.0317 16.7587 18.5143C16.7587 18.9968 16.59 19.3698 16.2525 19.6333C15.915 19.8968 15.4975 20.0286 15 20.0286H13.6606V21H12.5V17ZM13.6606 17.6877V19.3408H15C15.1887 19.3408 15.3375 19.2857 15.4462 19.1755C15.555 19.0652 15.6094 18.9151 15.6094 18.7249C15.6094 18.5348 15.555 18.3846 15.4462 18.2744C15.3375 18.1642 15.1887 18.109 15 18.109H13.6606V17.6877Z" />
    </svg>
  )
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/news' },
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
