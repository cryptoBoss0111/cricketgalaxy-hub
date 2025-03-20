
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, isAdminUser, refreshSession } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = async () => {
      setIsCheckingAuth(true);
      try {
        console.log("Checking admin session status...");
        
        // First refresh the session if possible
        await refreshSession();
        
        const { data } = await supabase.auth.getSession();
        console.log("Current session:", data.session ? "Active" : "None");
        
        if (data.session) {
          console.log("Session found, expires at:", new Date(data.session.expires_at * 1000).toLocaleString());
        }
        
        const isAdmin = await isAdminUser();
        console.log("Admin status check:", isAdmin);
        setIsLoggedIn(isAdmin);
        
        if (!isAdmin && data.session) {
          // User is logged in but not an admin
          console.log("User is logged in but not an admin, signing out");
          await supabase.auth.signOut();
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          toast({
            title: "Not an Admin",
            description: "Your account does not have admin privileges",
            variant: "destructive",
          });
        }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
      if (event === 'SIGNED_IN') {
        console.log("User signed in, checking if admin");
        // Force an immediate check
        checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing admin status");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsLoggedIn(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed, checking admin status");
        // Force an immediate check with the fresh token
        checkAdminStatus();
      } else if (event === 'USER_UPDATED') {
        console.log("User updated, checking admin status");
        checkAdminStatus();
      }
    });
    
    // Set up window event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'adminToken' || event.key === 'adminUser' || event.key?.includes('supabase.auth')) {
        console.log("Storage change detected:", event.key, "checking admin status");
        checkAdminStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up periodic session check every 5 minutes
    const intervalId = setInterval(() => {
      console.log("Periodic admin status check");
      checkAdminStatus();
    }, 300000); // 5 minutes
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [toast]);

  const handleAdminAction = async () => {
    if (isLoggedIn) {
      // Refresh the session before navigating to admin dashboard
      await refreshSession();
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  };
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      console.log("Logging out admin user");
      setIsCheckingAuth(true);
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear admin data from local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsLoggedIn(false);
      
      // Redirect to home
      navigate("/");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    } finally {
      setIsCheckingAuth(false);
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
