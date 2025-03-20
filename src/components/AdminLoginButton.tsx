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
  const mountedRef = useRef(true);
  
  useEffect(() => {
    mountedRef.current = true;
    
    const checkAdminStatus = async () => {
      if (checkingRef.current || localStorage.getItem('validating_admin') === 'true') {
        return;
      }
      
      checkingRef.current = true;
      setIsCheckingAuth(true);
      
      try {
        console.log("Checking admin session status...");
        
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Current session:", sessionData.session ? "Active" : "None");
        
        if (sessionData.session) {
          console.log("Session found, expires at:", new Date(sessionData.session.expires_at * 1000).toLocaleString());
          
          const expiresAt = sessionData.session.expires_at * 1000;
          const now = Date.now();
          const timeToExpiry = expiresAt - now;
          
          if (timeToExpiry < 300000) {
            console.log("Token close to expiry, refreshing session...");
            await refreshSession();
          }
          
          const isAdmin = await isAdminUser();
          console.log("Admin status check:", isAdmin);
          
          if (!mountedRef.current) return;
          
          setIsLoggedIn(isAdmin);
          
          if (!isAdmin) {
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
          
          if (localStorage.getItem('adminToken') === 'authenticated' && 
              localStorage.getItem('validating_admin') !== 'true') {
            
            localStorage.setItem('validating_admin', 'true');
            console.log("Legacy admin token found, validating once...");
            
            try {
              const adminUserStr = localStorage.getItem('adminUser');
              if (!adminUserStr) {
                console.log("No admin user data found, clearing token");
                localStorage.removeItem('adminToken');
                if (mountedRef.current) setIsLoggedIn(false);
              } else {
                const adminUser = JSON.parse(adminUserStr);
                if (!adminUser.id) {
                  console.log("Invalid admin user data, clearing token");
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  if (mountedRef.current) setIsLoggedIn(false);
                } else {
                  const { data: adminCheck } = await supabase
                    .from('admins')
                    .select('id')
                    .eq('id', adminUser.id)
                    .maybeSingle();
                  
                  if (!mountedRef.current) return;
                  
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
              if (mountedRef.current) setIsLoggedIn(false);
            } finally {
              localStorage.removeItem('validating_admin');
            }
          } else {
            if (mountedRef.current) setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (mountedRef.current) setIsLoggedIn(false);
      } finally {
        if (mountedRef.current) setIsCheckingAuth(false);
        checkingRef.current = false;
        localStorage.removeItem('validating_admin');
      }
    };
    
    checkAdminStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
      if (event === 'SIGNED_IN') {
        console.log("User signed in, checking if admin");
        if (!checkingRef.current) checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing admin status");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        if (mountedRef.current) setIsLoggedIn(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed, checking admin status");
        if (!checkingRef.current) checkAdminStatus();
      } else if (event === 'USER_UPDATED') {
        console.log("User updated, checking admin status");
        if (!checkingRef.current) checkAdminStatus();
      }
    });
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'adminToken' || event.key === 'adminUser' || event.key?.includes('supabase.auth')) {
        console.log("Storage change detected:", event.key, "checking admin status");
        if (!checkingRef.current) checkAdminStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    localStorage.removeItem('validating_admin');
    
    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      localStorage.removeItem('validating_admin');
    };
  }, [toast]);

  const handleAdminAction = async () => {
    if (isLoggedIn) {
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
      
      await supabase.auth.signOut();
      
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsLoggedIn(false);
      
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
