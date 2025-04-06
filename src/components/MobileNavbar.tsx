
import { NavLink } from 'react-router-dom';
import { Home, FileText, Trophy, UsersRound } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/"
    },
    {
      label: "Matches",
      icon: Trophy,
      path: "/live-scores"
    },
    {
      label: "Series",
      icon: FileText,
      path: "/ipl-2025"
    },
    {
      label: "News",
      icon: FileText,
      path: "/cricket-news"
    },
    {
      label: "Teams",
      icon: UsersRound,
      path: "/ipl-teams"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-cricket-dark border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center py-2 px-1 w-full",
                isActive 
                  ? "text-blue-500 border-t-2 border-blue-500" 
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              )
            }
          >
            <item.icon size={16} />
            <span className="text-xs mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Indicator line at bottom of screen */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-500 w-full opacity-75"></div>
    </div>
  );
};

export default MobileNavbar;
