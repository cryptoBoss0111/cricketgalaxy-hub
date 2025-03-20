
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn, LockKeyhole } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase, isAdminUser, refreshSession } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLoginButton = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  const checkingRef = useRef(false);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminStatus = async () => {
      // Prevent concurrent checks
      if (checkingRef.current) return;
      
      checkingRef.current = true;
      setIsCheckingAuth(true);
      
      try {
        console.log("Checking admin session status...");
        
        // First check if we have an active session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Current session:", sessionData.session ? "Active" : "None");
        
        if (sessionData.session) {
          console.log("Session found, expires at:", new Date(sessionData.session.expires_at * 1000).toLocaleString());
          
          // If session is about to expire, refresh it first
          const expiresAt = sessionData.session.expires_at * 1000;
          const now = Date.now();
          const timeToExpiry = expiresAt - now;
          
          if (timeToExpiry < 300000) { // less than 5 minutes
            console.log("Token close to expiry, refreshing session...");
            await refreshSession();
          }
          
          const isAdmin = await isAdminUser();
          console.log("Admin status check:", isAdmin);
          setIsLoggedIn(isAdmin);
          
          if (!isAdmin) {
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
        } else {
          console.log("No active session found");
          
          // Only check legacy token if not already validating (prevent infinite loop)
          if (localStorage.getItem('adminToken') === 'authenticated' && 
              localStorage.getItem('validating_admin') !== 'true') {
            
            localStorage.setItem('validating_admin', 'true');
            console.log("Found legacy admin token, validating...");
            
            try {
              const adminUserStr = localStorage.getItem('adminUser');
              if (!adminUserStr) {
                console.log("No admin user data found, clearing token");
                localStorage.removeItem('adminToken');
                setIsLoggedIn(false);
              } else {
                const adminUser = JSON.parse(adminUserStr);
                if (!adminUser.id) {
                  console.log("Invalid admin user data, clearing token");
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  setIsLoggedIn(false);
                } else {
                  // Validate once against the database
                  const { data: adminCheck } = await supabase
                    .from('admins')
                    .select('id')
                    .eq('id', adminUser.id)
                    .maybeSingle();
                    
                  setIsLoggedIn(!!adminCheck);
                  
                  if (!adminCheck) {
                    console.log("Admin validation failed, clearing token");
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                  } else {
                    console.log("Legacy admin token validated successfully");
                  }
                }
              }
            } catch (error) {
              console.error("Error validating legacy admin token:", error);
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              setIsLoggedIn(false);
            } finally {
              localStorage.removeItem('validating_admin');
            }
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
        checkingRef.current = false;
        localStorage.removeItem('validating_admin');
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
    
    // Set up periodic session check (less frequent to avoid loops)
    const intervalId = setInterval(() => {
      console.log("Periodic admin status check");
      // Only run if not already checking
      if (!checkingRef.current) {
        checkAdminStatus();
      }
    }, 600000); // 10 minutes instead of 5
    
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
