
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  Image, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  username: string;
  role: string;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is authenticated
    const adminToken = localStorage.getItem('adminToken');
    const userString = localStorage.getItem('adminUser');
    
    if (!adminToken) {
      navigate('/admin/login');
    } else if (userString) {
      try {
        const user = JSON.parse(userString);
        setAdminUser(user);
      } catch (error) {
        // Invalid user data, redirect to login
        navigate('/admin/login');
      }
    }
    
    // Handle responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      duration: 3000,
    });
    
    navigate('/admin/login');
  };
  
  const sidebarItems: SidebarItem[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      href: '/admin/dashboard',
      active: true
    },
    {
      icon: <FileText size={20} />,
      label: 'Articles',
      href: '/admin/articles'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Match Schedule',
      href: '/admin/matches'
    },
    {
      icon: <Users size={20} />,
      label: 'Player Profiles',
      href: '/admin/players'
    },
    {
      icon: <Image size={20} />,
      label: 'Media Library',
      href: '/admin/media'
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Analytics',
      href: '/admin/analytics'
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      href: '/admin/settings'
    }
  ];
  
  return (
    <div className={cn("min-h-screen bg-gray-50", isCollapsed && !isMobile ? "admin-collapsed" : "")}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </Button>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          
          <div className="flex items-center">
            {adminUser && (
              <Avatar className="h-8 w-8 bg-cricket-accent text-white">
                <span className="text-sm font-semibold">{adminUser.username.substring(0, 2).toUpperCase()}</span>
              </Avatar>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "admin-sidebar",
          isMobile ? "transition-transform" : "",
          isMobile && !isMobileMenuOpen ? "-translate-x-full" : "",
          isCollapsed && !isMobile ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <Link to="/admin/dashboard">
              <span className="text-xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
                Admin Panel
              </span>
            </Link>
          )}
          
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white hover:bg-white/10"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          )}
        </div>
        
        <div className="mt-6 px-4">
          <TooltipProvider>
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-3 px-3 rounded-md text-sm font-medium transition-colors",
                        item.active 
                          ? "bg-white/10 text-white" 
                          : "text-gray-300 hover:text-white hover:bg-white/5",
                        isCollapsed ? "justify-center" : ""
                      )}
                    >
                      <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
        </div>
        
        <div className="mt-auto p-4">
          <Separator className="mb-4 bg-white/10" />
          
          <TooltipProvider>
            <div className="flex items-center">
              {!isCollapsed && adminUser && (
                <Avatar className="h-10 w-10 mr-3 bg-white/10 text-white">
                  <span className="text-sm font-semibold">{adminUser.username.substring(0, 2).toUpperCase()}</span>
                </Avatar>
              )}
              
              <div className={cn("flex-1", isCollapsed ? "hidden" : "")}>
                {adminUser && (
                  <div>
                    <p className="text-sm font-medium text-white">{adminUser.username}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                )}
              </div>
              
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    <LogOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 mt-4 transition-colors",
                  isCollapsed ? "justify-center" : ""
                )}
              >
                <Home size={20} className={isCollapsed ? "" : "mr-3"} />
                {!isCollapsed && <span>Back to Website</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">Back to Website</TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
      
      {/* Main Content */}
      <main 
        className={cn(
          "admin-content transition-all", 
          isMobile ? "ml-0 pt-16" : "",
          isCollapsed && !isMobile ? "ml-20" : isMobile ? "ml-0" : "ml-64"
        )}
      >
        {children}
        
        <footer className="mt-12 py-6 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CricketExpress Admin Panel
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
