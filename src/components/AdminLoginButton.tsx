
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsLoggedIn(adminToken === 'authenticated');
    };
    
    // Check initially
    checkAdminStatus();
    
    // Set up window event listener for storage changes
    window.addEventListener('storage', checkAdminStatus);
    
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);

  const handleAdminAction = () => {
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };
  
  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Clear admin data from local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    
    // Redirect to home
    navigate("/");
  };

  return (
    <div className="relative group">
      <Button 
        variant={isLoggedIn ? "default" : "outline"} 
        size="sm" 
        className={`flex items-center gap-1 ${isLoggedIn ? 'bg-cricket-accent hover:bg-cricket-accent/90' : 'text-gray-600 hover:text-cricket-accent'} transition-colors`}
        onClick={handleAdminAction}
        aria-label={isLoggedIn ? "Admin Dashboard" : "Admin Login"}
      >
        {isLoggedIn ? (
          <>
            <LockKeyhole className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Admin Login</span>
          </>
        )}
      </Button>
      
      {isLoggedIn && (
        <div className="absolute right-0 z-50 mt-1 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminLoginButton;
