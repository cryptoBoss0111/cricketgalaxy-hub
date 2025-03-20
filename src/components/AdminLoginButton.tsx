
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, isAdminUser } from "@/integrations/supabase/client";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = async () => {
      setIsCheckingAuth(true);
      try {
        const isAdmin = await isAdminUser();
        console.log("Admin status check:", isAdmin);
        setIsLoggedIn(isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    // Check initially
    checkAdminStatus();
    
    // Set up supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed:", event);
      await checkAdminStatus();
    });
    
    // Set up window event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'adminToken' || event.key === 'adminUser' || event.key === 'supabase.auth.token') {
        console.log("Storage change detected, checking admin status");
        checkAdminStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleAdminAction = () => {
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log("Logging out admin user");
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear admin data from local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsLoggedIn(false);
      
      // Redirect to home
      navigate("/");
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="relative group">
      <Button 
        variant={isLoggedIn ? "default" : "outline"} 
        size="sm" 
        className={`flex items-center gap-1 ${isLoggedIn ? 'bg-cricket-accent hover:bg-cricket-accent/90' : 'text-gray-600 hover:text-cricket-accent'} transition-colors`}
        onClick={handleAdminAction}
        aria-label={isLoggedIn ? "Admin Dashboard" : "Admin Login"}
        disabled={isCheckingAuth}
      >
        {isCheckingAuth ? (
          <span className="flex items-center">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent mr-1"></span>
            <span className="hidden md:inline">Checking...</span>
          </span>
        ) : isLoggedIn ? (
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
