
import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  FileText,
  FileEdit,
  Star,
  Settings,
  BarChart4,
  Calendar,
  LineChart,
  UserRound,
  Trophy,
  Image,
  Layout,
  LogOut,
  Swords
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useTheme } from '@/components/ThemeProvider';

interface AdminNavLinkProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
}

const AdminNavLink: React.FC<AdminNavLinkProps> = ({ to, icon: Icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            isActive
              ? 'bg-gray-100 dark:bg-gray-800 text-cricket-accent'
              : 'text-gray-700 dark:text-gray-300'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cricket-dark text-gray-900 dark:text-gray-50">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 pt-6">
          <SheetHeader className="px-4 pb-4">
            <SheetTitle>Admin Panel</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 px-2">
            <AdminNavLink to="/admin/dashboard" icon={Home} label="Dashboard" />
            <AdminNavLink to="/admin/articles" icon={FileText} label="Articles" />
            <AdminNavLink to="/admin/quick-blog" icon={FileEdit} label="Quick Blog" />
            <AdminNavLink to="/admin/top-stories" icon={Star} label="Top Stories" />
            <AdminNavLink to="/admin/hero-slider" icon={Layout} label="Hero Slider" />
            <AdminNavLink to="/admin/media" icon={Image} label="Media Library" />
            <AdminNavLink to="/admin/fantasy-picks" icon={Trophy} label="Fantasy Picks" />
            <AdminNavLink to="/admin/matches" icon={Calendar} label="Matches" />
            <AdminNavLink to="/admin/player-profiles" icon={UserRound} label="Players" />
            <AdminNavLink to="/admin/fan-polls" icon={BarChart4} label="Fan Polls" />
            <AdminNavLink to="/admin/free-war" icon={Swords} label="Free War Contest" />
            <AdminNavLink to="/admin/navigation" icon={Menu} label="Navigation" />
            <AdminNavLink to="/admin/analytics" icon={LineChart} label="Analytics" />
            <AdminNavLink to="/admin/settings" icon={Settings} label="Settings" />
          </nav>
          <div className="absolute bottom-4 left-4 w-full px-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex h-full">
        {/* Sidebar (Hidden on small screens) */}
        <aside className="w-64 hidden md:block flex-shrink-0 border-r dark:border-gray-800 h-screen sticky top-0">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="font-bold text-lg">
              Admin Panel
            </Link>
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>

          <nav className="mt-6 px-2">
            <AdminNavLink to="/admin/dashboard" icon={Home} label="Dashboard" />
            <AdminNavLink to="/admin/articles" icon={FileText} label="Articles" />
            <AdminNavLink to="/admin/quick-blog" icon={FileEdit} label="Quick Blog" />
            <AdminNavLink to="/admin/top-stories" icon={Star} label="Top Stories" />
            <AdminNavLink to="/admin/hero-slider" icon={Layout} label="Hero Slider" />
            <AdminNavLink to="/admin/media" icon={Image} label="Media Library" />
            <AdminNavLink to="/admin/fantasy-picks" icon={Trophy} label="Fantasy Picks" />
            <AdminNavLink to="/admin/matches" icon={Calendar} label="Matches" />
            <AdminNavLink to="/admin/player-profiles" icon={UserRound} label="Players" />
            <AdminNavLink to="/admin/fan-polls" icon={BarChart4} label="Fan Polls" />
            <AdminNavLink to="/admin/free-war" icon={Swords} label="Free War Contest" />
            <AdminNavLink to="/admin/navigation" icon={Menu} label="Navigation" />
            <AdminNavLink to="/admin/analytics" icon={LineChart} label="Analytics" />
            <AdminNavLink to="/admin/settings" icon={Settings} label="Settings" />
          </nav>

          <div className="absolute bottom-4 left-4 w-full">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
