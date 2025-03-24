import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Users, Image, Settings, LogOut, Menu, ChevronLeft, ChevronRight, Home, BarChart2, Navigation, TrendingUp, Award, Layers, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { checkAdminStatus, signOutAdmin } from '@/utils/adminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  username: string;
  role: string;
  id?: string;
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const AdminLayout = ({
  children
}: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const authCheckComplete = useRef(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const verifyAdmin = async () => {
      if (!isMounted || authCheckComplete.current) return;
      try {
        const adminToken = localStorage.getItem('adminToken');
        const userString = localStorage.getItem('adminUser');
        if (!adminToken) {
          console.log("No admin token found, redirecting to login");
          if (isMounted) {
            navigate('/admin/login');
          }
          return;
        }
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (isMounted) {
              setAdminUser(user);
            }
          } catch (error) {
            console.error("Error parsing admin user data:", error);
            if (isMounted) {
              navigate('/admin/login');
            }
            return;
          }
        }
        const {
          isAdmin
        } = await checkAdminStatus();
        if (!isAdmin && isMounted) {
          console.log("Admin status check failed, redirecting to login");
          navigate('/admin/login');
          return;
        }
        if (isMounted) {
          authCheckComplete.current = true;
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    if (!authCheckComplete.current) {
      verifyAdmin();
    }
    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const {
        success
      } = await signOutAdmin();
      if (success) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
          duration: 3000
        });
        navigate('/admin/login');
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  if (isVerifying) {
    return <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-cricket-accent border-t-transparent rounded-full"></div>
        <span className="ml-3">Verifying admin access...</span>
      </div>;
  }

  const sidebarItems: SidebarItem[] = [{
    icon: <LayoutDashboard size={20} className="text-gray-700" />,
    label: 'Dashboard',
    href: '/admin/dashboard',
    active: location.pathname === '/admin/dashboard'
  }, {
    icon: <FileText size={20} className="text-gray-700" />,
    label: 'Articles',
    href: '/admin/articles',
    active: location.pathname.includes('/admin/articles')
  }, {
    icon: <Layers size={20} className="text-zinc-500" />,
    label: 'Hero Slider',
    href: '/admin/hero-slider',
    active: location.pathname === '/admin/hero-slider'
  }, {
    icon: <TrendingUp size={20} className="text-gray-700" />,
    label: 'Top Stories',
    href: '/admin/top-stories',
    active: location.pathname === '/admin/top-stories'
  }, {
    icon: <PieChart size={20} className="text-gray-700" />,
    label: 'Fan Polls',
    href: '/admin/fan-polls',
    active: location.pathname === '/admin/fan-polls'
  }, {
    icon: <Navigation size={20} className="text-gray-700" />,
    label: 'Navigation',
    href: '/admin/navigation',
    active: location.pathname === '/admin/navigation'
  }, {
    icon: <Award size={20} className="text-gray-700" />,
    label: 'Fantasy Picks',
    href: '/admin/fantasy-picks',
    active: location.pathname === '/admin/fantasy-picks'
  }, {
    icon: <Calendar size={20} className="text-gray-700" />,
    label: 'Match Schedule',
    href: '/admin/matches',
    active: location.pathname === '/admin/matches'
  }, {
    icon: <Users size={20} className="text-gray-700" />,
    label: 'Player Profiles',
    href: '/admin/players',
    active: location.pathname === '/admin/players'
  }, {
    icon: <Image size={20} />,
    label: 'Media Library',
    href: '/admin/media',
    active: location.pathname === '/admin/media'
  }, {
    icon: <BarChart2 size={20} />,
    label: 'Analytics',
    href: '/admin/analytics',
    active: location.pathname === '/admin/analytics'
  }, {
    icon: <Settings size={20} />,
    label: 'Settings',
    href: '/admin/settings',
    active: location.pathname === '/admin/settings'
  }];

  return <div className={cn("min-h-screen bg-white", isCollapsed && !isMobile ? "admin-collapsed" : "")}>
      {isMobile && <div className="fixed top-0 left-0 right-0 h-16 bg-white z-50 border-b flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </Button>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-cricket-accent to-cricket-secondary bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          
          <div className="flex items-center">
            {adminUser && <Avatar className="h-8 w-8 bg-cricket-accent text-white">
                <span className="text-sm font-semibold">{adminUser.username?.substring(0, 2).toUpperCase() || 'AD'}</span>
              </Avatar>}
          </div>
        </div>}
      
      {isMobile && isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />}
      
      <aside className={cn("fixed inset-y-0 left-0 z-40 bg-white text-black border-r transition-all", 
        isMobile ? "transition-transform" : "", 
        isMobile && !isMobileMenuOpen ? "-translate-x-full" : "", 
        isCollapsed && !isMobile ? "w-20" : "w-64")}>
        <div className="p-4 flex items-center justify-between border-b">
          {!isCollapsed && <Link to="/admin/dashboard">
              <span className="text-xl font-heading font-bold text-black">
                Admin Panel
              </span>
            </Link>}
          
          {!isMobile && <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="hover:bg-gray-100 text-black">
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>}
        </div>
        
        <div className="mt-6 px-4">
          <TooltipProvider>
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={item.href} className={cn(
                      "flex items-center py-3 px-3 rounded-md text-sm font-medium transition-colors", 
                      item.active ? "bg-gray-200 text-black" : "text-gray-700 hover:bg-gray-100", 
                      isCollapsed ? "justify-center" : ""
                    )}>
                      <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                      {!isCollapsed && <span className="text-black">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>}
                </Tooltip>)}
            </nav>
          </TooltipProvider>
        </div>
        
        <div className="mt-auto p-4 border-t">
          <Separator className="mb-4 bg-gray-300" />
          
          <TooltipProvider>
            <div className="flex items-center">
              {!isCollapsed && adminUser && <Avatar className="h-10 w-10 mr-3 bg-gray-200 text-black">
                  <span className="text-sm font-semibold">{adminUser.username?.substring(0, 2).toUpperCase() || 'AD'}</span>
                </Avatar>}
              
              <div className={cn("flex-1", isCollapsed ? "hidden" : "")}>
                {adminUser && <div>
                    <p className="text-sm font-medium text-black">{adminUser.username || 'Admin'}</p>
                    <p className="text-xs text-gray-600">Administrator</p>
                  </div>}
              </div>
              
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-black hover:bg-gray-100">
                    <LogOut size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link to="/" className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 mt-4 transition-colors", 
                isCollapsed ? "justify-center" : ""
              )}>
                <Home size={20} className={isCollapsed ? "" : "mr-3"} />
                {!isCollapsed && <span className="text-black">Back to Website</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Back to Website</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
      
      <main className={cn("transition-all duration-200", 
        isMobile ? "ml-0 pt-16" : "", 
        isCollapsed && !isMobile ? "ml-20" : isMobile ? "ml-0" : "ml-64")}>
        {children}
        
        <footer className="mt-12 py-6 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CricketExpress Admin Panel
        </footer>
      </main>
    </div>;
};

export default AdminLayout;
